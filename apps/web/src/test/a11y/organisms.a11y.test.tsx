import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { checkA11y } from "../a11y-helper";

import { LoginForm } from "../../components/organisms/LoginForm/LoginForm";
import { RegisterForm } from "../../components/organisms/RegisterForm/RegisterForm";
import { AuthBanner } from "../../components/organisms/AuthBanner/AuthBanner";

describe("Accessibility (WCAG AA) - Organisms", () => {
  describe("LoginForm", () => {
    it("should have no accessibility violations in initial state", async () => {
      const { container } = render(<LoginForm />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations in loading state", async () => {
      const { container } = render(<LoginForm isLoading />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("RegisterForm", () => {
    it("should have no accessibility violations in initial state", async () => {
      const { container } = render(<RegisterForm />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations in loading state", async () => {
      const { container } = render(<RegisterForm isLoading />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("AuthBanner", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <AuthBanner
          imageSrc="/IMG_1 - Desktop.png"
          imageAlt="Desenvolvedora interagindo com código na tela"
        />
      );
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });
});
