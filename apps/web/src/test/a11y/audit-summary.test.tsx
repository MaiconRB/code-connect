import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as fs from "node:fs";
import * as path from "node:path";
import { axeWcagAA } from "../a11y-helper";

import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { Checkbox } from "../../components/atoms/Checkbox/Checkbox";
import { Link } from "../../components/atoms/Link/Link";
import { Divider } from "../../components/atoms/Divider/Divider";
import { SocialButton } from "../../components/atoms/SocialButton/SocialButton";
import { FormField } from "../../components/molecules/FormField/FormField";
import { SocialLoginGroup } from "../../components/molecules/SocialLoginGroup/SocialLoginGroup";
import { LoginForm } from "../../components/organisms/LoginForm/LoginForm";
import { RegisterForm } from "../../components/organisms/RegisterForm/RegisterForm";
import { AuthBanner } from "../../components/organisms/AuthBanner/AuthBanner";
import { AuthLayout } from "../../components/templates/AuthLayout/AuthLayout";
import { LoginPage } from "../../pages/LoginPage/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage/RegisterPage";
import App from "../../App";

interface AuditResultItem {
  component: string;
  scenario: string;
  violationsCount: number;
  violations: Array<{
    id: string;
    impact?: string | null;
    description: string;
    helpUrl: string;
    nodes: Array<{ html: string; failureSummary?: string }>;
  }>;
}

describe("WCAG 2.x Level AA - Diagnostic Audit Suite", () => {
  it("executes automated WCAG AA audit across all components and compiles diagnostic report", async () => {
    const auditItems: AuditResultItem[] = [];

    const scenarios = [
      {
        name: "Atom: Button (default)",
        ui: <Button>Entrar</Button>,
      },
      {
        name: "Atom: Button (isLoading)",
        ui: <Button isLoading>Entrar</Button>,
      },
      {
        name: "Atom: Button (disabled)",
        ui: <Button disabled>Entrar</Button>,
      },
      {
        name: "Atom: Input (inside label)",
        ui: (
          <label htmlFor="audit-input">
            Email
            <Input id="audit-input" placeholder="seu@email.com" />
          </label>
        ),
      },
      {
        name: "Atom: Input (aria-label)",
        ui: <Input aria-label="Email" placeholder="seu@email.com" />,
      },
      {
        name: "Atom: Checkbox",
        ui: <Checkbox id="audit-check" label="Lembrar-me" />,
      },
      {
        name: "Atom: Link",
        ui: <Link href="#recuperar">Esqueci a senha</Link>,
      },
      {
        name: "Atom: Divider",
        ui: <Divider text="ou continue com" />,
      },
      {
        name: "Atom: SocialButton",
        ui: <SocialButton iconSrc="/Github.svg" iconAlt="GitHub" label="GitHub" />,
      },
      {
        name: "Molecule: FormField (default)",
        ui: <FormField id="f-email" label="Email" placeholder="user@email.com" />,
      },
      {
        name: "Molecule: FormField (with error)",
        ui: <FormField id="f-pass" label="Senha" error="Campo obrigatório" />,
      },
      {
        name: "Molecule: SocialLoginGroup",
        ui: <SocialLoginGroup />,
      },
      {
        name: "Organism: LoginForm (idle)",
        ui: <LoginForm />,
      },
      {
        name: "Organism: LoginForm (isLoading)",
        ui: <LoginForm isLoading />,
      },
      {
        name: "Organism: RegisterForm (idle)",
        ui: <RegisterForm />,
      },
      {
        name: "Organism: RegisterForm (isLoading)",
        ui: <RegisterForm isLoading />,
      },
      {
        name: "Organism: AuthBanner",
        ui: <AuthBanner imageSrc="/IMG_1 - Desktop.png" imageAlt="Banner descritivo" />,
      },
      {
        name: "Template: AuthLayout",
        ui: (
          <AuthLayout
            title="Login"
            subtitle="Boas-vindas"
            banner={<AuthBanner imageSrc="/IMG_1 - Desktop.png" imageAlt="Banner" />}
          >
            <div>Form</div>
          </AuthLayout>
        ),
      },
      {
        name: "Page: LoginPage",
        ui: <LoginPage />,
      },
      {
        name: "Page: RegisterPage",
        ui: <RegisterPage />,
      },
      {
        name: "Root: App",
        ui: <App />,
      },
    ];

    for (const scenario of scenarios) {
      const { container } = render(scenario.ui);
      const results = await axeWcagAA(container);
      auditItems.push({
        component: scenario.name.split(":")[0],
        scenario: scenario.name,
        violationsCount: results.violations.length,
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map((n) => ({
            html: n.html,
            failureSummary: n.failureSummary,
          })),
        })),
      });
    }

    const totalScenarios = auditItems.length;
    const passingScenarios = auditItems.filter((i) => i.violationsCount === 0).length;
    const failingScenarios = auditItems.filter((i) => i.violationsCount > 0).length;

    console.log("\n=======================================================");
    console.log("📊 RELATÓRIO DE AUDITORIA DE ACESSIBILIDADE (WCAG 2.x AA)");
    console.log("=======================================================");
    console.log(`Total de Cenários Auditados: ${totalScenarios}`);
    console.log(`✅ Cenários em Conformidade: ${passingScenarios}`);
    console.log(`❌ Cenários com Violações:   ${failingScenarios}`);
    console.log("-------------------------------------------------------");

    auditItems.forEach((item) => {
      if (item.violationsCount === 0) {
        console.log(`[PASS] ${item.scenario}`);
      } else {
        console.log(`[FAIL] ${item.scenario} (${item.violationsCount} violação(ões)):`);
        item.violations.forEach((v) => {
          console.log(`       - Regra: ${v.id} [Impacto: ${v.impact}]`);
          console.log(`         Descrição: ${v.description}`);
          console.log(`         Help URL: ${v.helpUrl}`);
          v.nodes.forEach((n) => {
            console.log(`         HTML: ${n.html}`);
            if (n.failureSummary) {
              console.log(`         Detalhe: ${n.failureSummary.replace(/\n/g, " ")}`);
            }
          });
        });
      }
    });
    console.log("=======================================================\n");

    const reportPath = path.resolve(process.cwd(), 'a11y-audit-results.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          standards: ["WCAG 2.0 AA", "WCAG 2.1 AA", "WCAG 2.2 AA"],
          totalScenarios,
          passingScenarios,
          failingScenarios,
          results: auditItems,
        },
        null,
        2
      ),
      'utf-8'
    );

    expect(totalScenarios).toBeGreaterThan(0);
  }, 30000);
});
