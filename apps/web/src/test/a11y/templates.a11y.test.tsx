import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { checkA11y } from "../a11y-helper";

import { AuthLayout } from "../../components/templates/AuthLayout/AuthLayout";
import { AuthBanner } from "../../components/organisms/AuthBanner/AuthBanner";

describe("Accessibility (WCAG AA) - Templates", () => {
  describe("AuthLayout", () => {
    it("should have no accessibility violations with children and banner", async () => {
      const { container } = render(
        <AuthLayout
          title="Título da Página"
          subtitle="Subtítulo descritivo da ação"
          banner={
            <AuthBanner
              imageSrc="/IMG_1 - Desktop.png"
              imageAlt="Banner de autenticação"
            />
          }
        >
          <div>
            <p>Conteúdo do formulário de autenticação</p>
          </div>
        </AuthLayout>
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });
});
