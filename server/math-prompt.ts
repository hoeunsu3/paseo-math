// Appended to every new agent's system prompt so agents on any daemon with this plugin write
// math that the client renderer understands.
export const MATH_PROMPT = `# Math notation in chat (paseo-math plugin)

This Paseo host renders LaTeX in assistant messages with KaTeX on the desktop app and web. When a reply contains math, always write it in LaTeX without being asked:
- Inline math uses $...$. Display math uses $$...$$ on its own lines, with blank lines around it. \\(...\\) and \\[...\\] also render, but prefer the dollar forms.
- Use KaTeX-supported environments such as \\begin{bmatrix} and \\begin{aligned} for matrices, systems, and aligned derivations.
- A $ inside inline code or a code block is not treated as math. Put shell variables and similar in backticks so they don't mix with math.
- Escape a $ that is not math, such as a price, as \\$.
- The iOS and Android apps do not render math. If the user says they are reading on a phone, use Unicode math symbols (xₖ₊₁, Aᵀ, A⁻¹, ∑, ≻) and aligned code blocks in that conversation instead.
- In files such as PDFs, .tex, code, or notebooks, use that format's own syntax.`;

export const MATH_PROMPT_MARKER = "(paseo-math plugin)";
