import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { checkA11y } from "../a11y-helper";

import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { Checkbox } from "../../components/atoms/Checkbox/Checkbox";
import { Link } from "../../components/atoms/Link/Link";
import { Divider } from "../../components/atoms/Divider/Divider";
import { SocialButton } from "../../components/atoms/SocialButton/SocialButton";

describe("Accessibility (WCAG AA) - Atoms", () => {
  describe("Button", () => {
    it("should have no accessibility violations (default)", async () => {
      const { container } = render(<Button>Clique aqui</Button>);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (variants)", async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Principal</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Excluir</Button>
          <Button disabled>Desabilitado</Button>
          <Button isLoading>Carregando</Button>
        </div>
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Input", () => {
    it("should have no accessibility violations when wrapped with accessible label", async () => {
      const { container } = render(
        <label htmlFor="test-input">
          Nome de Usuário
          <Input id="test-input" placeholder="Digite seu usuário" />
        </label>
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with aria-label", async () => {
      const { container } = render(
        <Input aria-label="E-mail do usuário" placeholder="exemplo@dominio.com" />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should evaluate standalone Input with no aria or label", async () => {
      const { container } = render(<Input placeholder="Sem label explícito" />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Checkbox", () => {
    it("should have no accessibility violations with label", async () => {
      const { container } = render(
        <Checkbox id="terms" label="Concordo com os termos e condições" />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations when checked/disabled", async () => {
      const { container } = render(
        <div>
          <Checkbox id="check-1" label="Marcado" checked readOnly />
          <Checkbox id="check-2" label="Desabilitado" disabled />
        </div>
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Link", () => {
    it("should have no accessibility violations (default)", async () => {
      const { container } = render(<Link href="/recuperar-senha">Esqueci minha senha</Link>);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with icons and variants", async () => {
      const { container } = render(
        <div>
          <Link href="#login" variant="muted">Link secundário</Link>
          <Link href="#cadastro" variant="highlight">Criar nova conta</Link>
        </div>
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Divider", () => {
    it("should have no accessibility violations with text", async () => {
      const { container } = render(<Divider text="ou continue com" />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations without text", async () => {
      const { container } = render(<Divider />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("SocialButton", () => {
    it("should have no accessibility violations with icon and label", async () => {
      const { container } = render(
        <SocialButton
          iconSrc="/Github.svg"
          iconAlt="Ícone do GitHub"
          label="GitHub"
        />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });
});
