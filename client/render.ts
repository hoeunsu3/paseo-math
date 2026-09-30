import { katex, MarkdownIt, texmath } from "./generated/vendor";

// \dotx, \ddotx, \dddotx, \ddddotx: an accent glued to a single letter is an undefined control
// sequence in LaTeX too, but it is an easy slip, so read it as \dddot{x}. "s" is excluded because
// \dots and \ddots are real commands.
const GLUED_DOT_ACCENT = /\\(d{1,4})ot([A-Za-rt-z])(?![A-Za-z])/g;

export function normalizeTex(tex: string): string {
  return tex.replace(GLUED_DOT_ACCENT, "\\$1ot{$2}");
}

const engine = {
  renderToString: (tex: string, options: unknown) => katex.renderToString(normalizeTex(tex), options),
};

// Raw HTML stays disabled: the output is injected with innerHTML.
const md = new MarkdownIt({ html: false, linkify: true, breaks: true, typographer: false }).use(
  texmath,
  {
    engine,
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
