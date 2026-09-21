import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { checkA11y } from "../a11y-helper";

import { FormField } from "../../components/molecules/FormField/FormField";
import { SocialLoginGroup } from "../../components/molecules/SocialLoginGroup/SocialLoginGroup";

describe("Accessibility (WCAG AA) - Molecules", () => {
  describe("FormField", () => {
    it("should have no accessibility violations (default state)", async () => {
      const { container } = render(
        <FormField
          id="email-field"
          label="E-mail corporativo"
          placeholder="nome@empresa.com"
        />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with error message and helper text", async () => {
      const { container } = render(
        <FormField
          id="password-field"
          label="Senha"
          type="password"
          error="A senha é obrigatória e deve ter 8 dígitos"
        />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("SocialLoginGroup", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<SocialLoginGroup />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });
});
