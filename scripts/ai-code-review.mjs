import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import * as github from "@actions/github";
import * as core from "@actions/core";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function run() {
  try {
    if (!GEMINI_API_KEY) {
      core.setFailed("GEMINI_API_KEY environment variable is not set.");
      return;
    }

    if (!GITHUB_TOKEN) {
      core.setFailed("GITHUB_TOKEN environment variable is not set.");
      return;
    }

    const context = github.context;
    const pullRequest = context.payload.pull_request;

    if (!pullRequest) {
      core.info("This event is not a pull_request. Skipping AI review.");
      return;
    }

    const prNumber = pullRequest.number;
    const repoOwner = context.repo.owner;
    const repoName = context.repo.repo;

    core.info(`Starting Gemini PR Review for #${prNumber} in ${repoOwner}/${repoName}...`);

    const octokit = github.getOctokit(GITHUB_TOKEN);

    // 1. Obter o diff do PR
    const { data: diffData } = await octokit.rest.pulls.get({
      owner: repoOwner,
      repo: repoName,
      pull_number: prNumber,
      mediaType: {
        format: "diff",
      },
    });

    const diffString = String(diffData);
    if (!diffString || diffString.trim().length === 0) {
      core.info("Empty diff. Nothing to review.");
      return;
    }

    // Limitar o diff para evitar estourar limites se for gigantesco
    const maxDiffLength = 50000;
    const truncatedDiff =
      diffString.length > maxDiffLength
        ? diffString.slice(0, maxDiffLength) + "\n\n...[Diff truncated due to size limit]..."
        : diffString;

    // 2. Carregar o AGENTS.md (Regras do projeto)
    let agentsRules = "";
    const agentsPath = path.resolve(process.cwd(), "AGENTS.md");
    if (fs.existsSync(agentsPath)) {
      agentsRules = fs.readFileSync(agentsPath, "utf-8");
    }

    // 3. Inicializar o Gemini SDK
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemInstruction = `
Você é um Senior Tech Lead e Code Reviewer automatizado do projeto Code-Connect.
Sua missão é realizar um Code Review minucioso e construtivo no diff de Pull Request fornecido, checando a qualidade de código, segurança, padrões arquiteturais e RIGOROSAMENTE as regras do projeto estabelecidas no documento AGENTS.md.

Regras e Diretrizes do Projeto (AGENTS.md):
"""
${agentsRules}
"""

Instruções para o seu Review:
1. **Regras Obrigatórias de Frontend (apps/web)**:
   - Todo novo componente React DEVE ter seu arquivo de teste unitário correspondente (*.test.tsx) na mesma pasta cobrindo seu uso essencial. Se um componente foi criado/alterado sem testes, aponte isso como violação.
   - Proibição estrita de cores hexadecimais arbitrárias nas classes Tailwind (ex.: bg-[#81FE88], text-[#BCBFC2]). Deve-se usar exclusivamente os tokens definidos em @theme (ex.: bg-brand-green, text-brand-muted, etc.).
   - Proibição de tamanhos de fonte arbitrários (ex.: text-[15px]). Usar text-xs, text-sm, text-base, text-lg, etc.
   - Respeito à taxonomia do Atomic Design (atoms, molecules, organisms, templates, pages).

2. **Regras Obrigatórias de Backend (apps/api)**:
   - Conformidade REST: endpoints no plural (/api/v1/posts, /api/v1/users), sem verbos na rota.
   - Métodos HTTP semânticos (GET, POST, PUT, PATCH, DELETE) com status codes adequados.
   - Uso de DTOs tipados e validadores (class-validator).
   - Não manter estado em memória (Statelessness).

3. **Geral & Boas Práticas**:
   - Proibido uso arbitrário de 'any' em TypeScript.
   - Conventional Commits e clareza de código.
   - Possíveis vulnerabilidades de segurança, SQL Injection, vazamento de credenciais ou bugs lógicos.

Formato do seu comentário no Pull Request:
Utilize Markdown profissional, limpo e organizado em português:
- 📋 **Resumo das Alterações**: Uma síntese executiva do que foi modificado.
- 🎯 **Conformidade com o AGENTS.md**:
  - ✅ Lista de itens conformes.
  - ⚠️ Violações de regras ou alertas (se houver).
- 💡 **Sugestões e Melhorias**: Pontos de otimização, legibilidade ou refatorações pontuais.
- 🏁 **Veredito**: Aprovado com ressalvas / Aprovado / Necessita ajustes antes do merge.
Se o código estiver exemplar e seguir todas as regras, elogie o autor! Seja amigável, objetivo e técnico.
`;

    const userPrompt = `
Por favor, analise as seguintes informações do Pull Request:
Título: ${pullRequest.title}
Descrição: ${pullRequest.body || "Sem descrição"}
Autor: ${pullRequest.user?.login}
Base Branch: ${pullRequest.base?.ref}
Head Branch: ${pullRequest.head?.ref}

Diff das mudanças:
\`\`\`diff
${truncatedDiff}
\`\`\`
`;

    core.info("Calling Gemini API (gemini-2.5-flash)...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemInstruction + "\n\n" + userPrompt,
            },
          ],
        },
      ],
    });

    const reviewComment = response.text;

    if (!reviewComment) {
      core.warning("Gemini did not return any feedback.");
      return;
    }

    const commentBody = `## 🤖 Gemini AI Code Review\n\n${reviewComment}\n\n---\n*Revisão automatizada gerada via Google Gemini & GitHub Actions.*`;

    // 4. Publicar comentário no PR
    core.info("Posting review comment on GitHub PR...");
    await octokit.rest.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: prNumber,
      body: commentBody,
    });

    core.info("Review comment published successfully!");
  } catch (error) {
    core.setFailed(`AI Code Review failed: ${error.message || error}`);
  }
}

run();
