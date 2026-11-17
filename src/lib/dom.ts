const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** Marks a string as already-safe HTML so the `html` tag does not escape it. */
export class SafeHtml {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

type Interpolation = SafeHtml | string | number | boolean | null | undefined | Interpolation[];

function render(value: Interpolation): string {
  if (value === null || value === undefined || value === false) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (value instanceof SafeHtml) return value.value;
  return escapeHtml(value);
}

/** Tagged template: interpolated values are HTML-escaped unless wrapped in SafeHtml (or nested `html`). */
export function html(strings: TemplateStringsArray, ...values: Interpolation[]): SafeHtml {
  let out = strings[0] ?? '';
  values.forEach((v, i) => {
    out += render(v) + (strings[i + 1] ?? '');
  });
  return new SafeHtml(out);
}

export const raw = (value: string): SafeHtml => new SafeHtml(value);

/** Only allow http(s), mailto, and relative URLs into href/src attributes. */
export function safeUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:|mailto:|\/|\.\/|[\w-]+\/)/i.test(trimmed) && !/^javascript:/i.test(trimmed)) return trimmed;
  return '';
}

export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

export function $$<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export const pad = (n: number, size = 2): string => String(n).padStart(size, '0');

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => window.matchMedia('(pointer: fine)').matches;
