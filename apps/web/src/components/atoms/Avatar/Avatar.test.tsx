import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renderiza imagem quando src é fornecido", () => {
    render(<Avatar src="https://example.com/avatar.png" alt="Foto do usuário" />);
    const img = screen.getByRole("img", { name: "Foto do usuário" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("renderiza iniciais como fallback quando não há src", () => {
    render(<Avatar alt="Maicon Batista" initials="MB" />);
    const avatar = screen.getByRole("img", { name: "Maicon Batista" });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent("MB");
  });

  it("trunca iniciais para no máximo 2 caracteres", () => {
    render(<Avatar alt="Test User" initials="ABCD" />);
    const avatar = screen.getByRole("img", { name: "Test User" });
    expect(avatar).toHaveTextContent("AB");
  });

  it("exibe '?' quando não há src nem initials", () => {
    render(<Avatar alt="Usuário desconhecido" />);
    const avatar = screen.getByRole("img", { name: "Usuário desconhecido" });
    expect(avatar).toHaveTextContent("?");
  });

  it("aplica tamanho md por padrão", () => {
    render(<Avatar alt="Test" initials="T" />);
    const avatar = screen.getByRole("img");
    expect(avatar.className).toContain("w-10");
    expect(avatar.className).toContain("h-10");
  });

  it("aplica tamanho sm quando size='sm'", () => {
    render(<Avatar alt="Test" initials="T" size="sm" />);
    const avatar = screen.getByRole("img");
    expect(avatar.className).toContain("w-8");
    expect(avatar.className).toContain("h-8");
  });

  it("aplica tamanho lg quando size='lg'", () => {
    render(<Avatar alt="Test" initials="T" size="lg" />);
    const avatar = screen.getByRole("img");
    expect(avatar.className).toContain("w-14");
    expect(avatar.className).toContain("h-14");
  });
});
