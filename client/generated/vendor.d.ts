import type katexModule from "katex";
import type MarkdownItClass from "markdown-it";
import type { PluginWithOptions } from "markdown-it";

export declare const katex: typeof katexModule;
export declare const MarkdownIt: typeof MarkdownItClass;
export declare const texmath: PluginWithOptions<{
  engine?: unknown;
  delimiters?: string | string[];
  outerSpace?: boolean;
  katexOptions?: Record<string, unknown>;
}>;
