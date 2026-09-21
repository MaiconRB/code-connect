import { configureAxe } from 'vitest-axe';
import type AxeCore from 'axe-core';

/**
 * Tags correspondentes ao Nível A e AA da WCAG (WCAG 2.0, 2.1 e 2.2).
 */
export const WCAG_AA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
];

/**
 * Instância configurada do axe com regras estritas para WCAG Nível AA.
 */
export const axeWcagAA = configureAxe({
  runOnly: {
    type: 'tag',
    values: WCAG_AA_TAGS,
  },
});

/**
 * Função utilitária para rodar a auditoria de acessibilidade WCAG AA em um elemento HTML ou container.
 *
 * @param html Elemento DOM (ex.: renderResult.container) ou string HTML
 * @param options Opções adicionais de execução do axe-core
 */
export async function checkA11y(
  html: Element | string,
  options?: AxeCore.RunOptions
): Promise<AxeCore.AxeResults> {
  return axeWcagAA(html, options);
}
