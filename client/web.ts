// The only module that touches the DOM. Every export is a no-op outside the web runtime
// (Electron desktop app and browser), where React Native Web renders a View as an element.
import { openExternalUrl } from "@getpaseo/plugin/client";
import { Platform } from "react-native";
import { katexCss } from "./generated/katex-css";

interface DomElement {
  innerHTML: string;
  id: string;
  textContent: string | null;
  style: { setProperty(name: string, value: string): void };
  classList: { add(name: string): void };
  appendChild(child: DomElement): void;
  addEventListener(type: "click", listener: (event: DomClickEvent) => void): void;
  closest(selector: string): DomElement | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
}
interface DomClickEvent {
  target: DomElement | null;
  preventDefault(): void;
}
declare const document: {
  head: DomElement;
  getElementById(id: string): DomElement | null;
  createElement(tag: string): DomElement;
};

export interface MathColors {
  foreground: string;
  foregroundMuted: string;
  border: string;
  surface1: string;
  surface2: string;
  accent: string;
}

const isWeb = Platform.OS === "web";
const STYLE_ID = "paseo-math-styles";
const wired = new WeakSet<object>();

const MARKDOWN_CSS = `
.pm-root{color:var(--pm-fg);font-family:var(--paseo-ui-font,system-ui,-apple-system,sans-serif);font-size:15px;line-height:21px;width:100%;min-width:0;
  overflow-wrap:anywhere;user-select:text;-webkit-user-select:text;cursor:text}
.pm-root>:first-child{margin-top:0!important}
.pm-root>:last-child{margin-bottom:0!important}
.pm-root p{margin:0 0 12px}
.pm-root h1,.pm-root h2{font-weight:bold;margin:24px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--pm-border)}
.pm-root h1{font-size:28px;line-height:36px}
.pm-root h2{font-size:24px;line-height:31px}
.pm-root h3{font-size:21px;line-height:27px;font-weight:600;margin:16px 0 8px}
.pm-root h4{font-size:19px;line-height:25px;font-weight:600;margin:16px 0 8px}
.pm-root h5,.pm-root h6{font-size:17px;line-height:22px;font-weight:600;margin:12px 0 4px}
.pm-root h6{color:var(--pm-muted);text-transform:uppercase;letter-spacing:.5px}
.pm-root strong{font-weight:600}
.pm-root del{color:var(--pm-muted)}
.pm-root a{color:var(--pm-accent);text-decoration:none;cursor:pointer}
.pm-root a:hover{text-decoration:underline}
.pm-root code{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:12px;
  background:var(--pm-s2);padding:2px 4px;border-radius:6px}
.pm-root pre{background:var(--pm-s2);border:1px solid var(--pm-border);border-radius:6px;padding:12px;margin:12px 0;
  overflow-x:auto;line-height:18px}
.pm-root pre code{background:none;padding:0;border-radius:0;white-space:pre;overflow-wrap:normal}
.pm-root ul,.pm-root ol{margin:0 0 12px;padding-left:22px}
.pm-root li{margin-bottom:4px}
.pm-root li>p{margin-bottom:4px}
.pm-root li::marker{color:var(--pm-muted)}
.pm-root blockquote{background:var(--pm-s1);border-left:4px solid var(--pm-s2);border-radius:0 6px 6px 0;
  margin:12px 0;padding:12px 16px 0;overflow:hidden}
.pm-root blockquote>:last-child{margin-bottom:12px!important}
.pm-root hr{border:none;height:1px;background:var(--pm-border);margin:10px 0}
.pm-root table{display:block;width:max-content;max-width:100%;overflow-x:auto;border-collapse:separate;border-spacing:0;
  border:1px solid var(--pm-border);border-radius:6px;margin:12px 0}
.pm-root th,.pm-root td{padding:8px;border-right:1px solid var(--pm-border);border-bottom:1px solid var(--pm-border);
  text-align:left;vertical-align:top;overflow-wrap:normal}
.pm-root th{background:var(--pm-s2);font-weight:600}
.pm-root tr>:last-child{border-right:none}
.pm-root tbody tr:last-child>*{border-bottom:none}
.pm-root .katex{font-size:1.1em}
.pm-root eqn{display:block;overflow-x:auto;overflow-y:hidden;margin:4px 0 12px;padding:2px 0}
.pm-root eqn .katex-display{margin:0}
.pm-root section.eqno{display:flex;align-items:center;gap:12px}
.pm-root section.eqno>eqn{flex:1}
.pm-root .katex-error{color:var(--pm-muted)!important;font-family:SFMono-Regular,Menlo,monospace;font-size:12px}
`;

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = katexCss + MARKDOWN_CSS;
  document.head.appendChild(style);
}

function openLinksExternally(root: DomElement): void {
  if (wired.has(root)) return;
  wired.add(root);
  root.addEventListener("click", (event) => {
    const link = event.target?.closest("a[data-pm-link]");
    const href = link?.getAttribute("href");
    if (!link || !href) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(href)) void openExternalUrl(href);
  });
}

/** Puts rendered HTML into the element behind a React Native Web View. */
export function mountHtml(node: unknown, html: string, colors: MathColors): void {
  if (!isWeb || !node) return;
  const root = node as DomElement;
  ensureStyles();
  root.classList.add("pm-root");
  // Paseo forces its UI font on every element except [data-pmono] subtrees, which would
  // override KaTeX's math fonts. The prose font is restored in MARKDOWN_CSS.
  root.setAttribute("data-pmono", "");
  root.style.setProperty("--pm-fg", colors.foreground);
  root.style.setProperty("--pm-muted", colors.foregroundMuted);
  root.style.setProperty("--pm-border", colors.border);
  root.style.setProperty("--pm-s1", colors.surface1);
  root.style.setProperty("--pm-s2", colors.surface2);
  root.style.setProperty("--pm-accent", colors.accent);
  openLinksExternally(root);
  if (root.innerHTML !== html) root.innerHTML = html;
}
