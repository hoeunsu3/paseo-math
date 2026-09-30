// Self-contained types for vendor.js. Plugins installed from Git or npm get no devDependencies,
// and Paseo's compiler rejects type imports it cannot resolve, so nothing here imports a package.

export interface MarkdownToken {
  attrSet(name: string, value: string): void;
}

export interface MarkdownRenderer {
  rules: Record<string, MarkdownRenderRule | undefined>;
  renderToken(tokens: MarkdownToken[], idx: number, options: unknown): string;
}

export type MarkdownRenderRule = (
  tokens: MarkdownToken[],
  idx: number,
  options: unknown,
  env: unknown,
  self: MarkdownRenderer,
) => string;

export interface MarkdownItInstance {
  use(plugin: unknown, options?: unknown): MarkdownItInstance;
  render(src: string): string;
  renderer: MarkdownRenderer;
}

export declare const MarkdownIt: new (options?: {
  html?: boolean;
  linkify?: boolean;
  breaks?: boolean;
  typographer?: boolean;
}) => MarkdownItInstance;

export declare const katex: {
  renderToString(tex: string, options?: unknown): string;
};
export declare const texmath: unknown;
