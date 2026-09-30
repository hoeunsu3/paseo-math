import { katex, MarkdownIt, texmath } from "./generated/vendor";

// Raw HTML stays disabled: the output is injected with innerHTML.
const md = new MarkdownIt({ html: false, linkify: true, breaks: true, typographer: false }).use(
  texmath,
  {
    engine: katex,
    delimiters: ["dollars", "brackets"],
    katexOptions: { throwOnError: false, strict: "ignore", output: "htmlAndMathml" },
  },
);

// Links open outside the app; see web.ts.
const defaultLinkOpen =
  md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("data-pm-link", "1");
  return defaultLinkOpen(tokens, idx, options, env, self);
};

export function renderMarkdownWithMath(text: string): string {
  try {
    return md.render(text);
  } catch {
    return `<pre>${text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)}</pre>`;
  }
}
