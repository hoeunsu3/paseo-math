// Decides whether an assistant message needs math rendering. Code spans and fences are ignored
// so shell snippets such as `echo $HOME` do not take a message away from the native renderer.

const FENCE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^ {0,3}\1[ \t]*$|(?![\s\S]))/gm;
const CODE_SPAN = /(`+)[\s\S]*?\1/g;

const DISPLAY_DOLLARS = /\$\$[\s\S]+?\$\$/;
const DISPLAY_BRACKETS = /\\\[[\s\S]+?\\\]/;
const INLINE_PARENS = /\\\([\s\S]+?\\\)/;
// $x$ with no space just inside the delimiters and no digit right after the closing one,
// which rules out prices like "$5 and $10".
const INLINE_DOLLARS = /(?:^|[^\\$])\$(?=[^\s$])[^$\n]*?[^\s\\$]\$(?!\d)|(?:^|[^\\$])\$[^\s$\\]\$(?!\d)/m;

export function hasMath(text: string): boolean {
  if (!text.includes("$") && !text.includes("\\")) return false;
  const prose = text.replace(FENCE, "").replace(CODE_SPAN, "");
  return (
    DISPLAY_DOLLARS.test(prose) ||
    DISPLAY_BRACKETS.test(prose) ||
    INLINE_PARENS.test(prose) ||
    INLINE_DOLLARS.test(prose)
  );
}
