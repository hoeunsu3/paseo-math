import type { PluginServerContext } from "@getpaseo/plugin/server";
import { MATH_PROMPT, MATH_PROMPT_MARKER } from "./server/math-prompt";

export default function contribute(server: PluginServerContext) {
  const removeHook = server.before("agent.create", ({ request }) => {
    const current = request.config.systemPrompt ?? "";
    if (current.includes(MATH_PROMPT_MARKER)) return request;
    return {
      ...request,
      config: {
        ...request.config,
        systemPrompt: current ? `${current}\n\n${MATH_PROMPT}` : MATH_PROMPT,
      },
    };
  });
  return () => removeHook();
}
