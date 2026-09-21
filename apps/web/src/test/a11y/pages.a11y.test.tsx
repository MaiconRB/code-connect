import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { checkA11y } from "../a11y-helper";

import { LoginPage } from "../../pages/LoginPage/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage/RegisterPage";
import App from "../../App";

describe("Accessibility (WCAG AA) - Pages", () => {
  describe("LoginPage", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<LoginPage />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("RegisterPage", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<RegisterPage />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("App Root", () => {
    it("should have no accessibility violations on default render", async () => {
      const { container } = render(<App />);
      const results = await checkA11y(container);
      expect(results).toHaveNoViolations();
    });
  });
});
