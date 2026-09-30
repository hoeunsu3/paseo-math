import type { PluginClientContext } from "@getpaseo/plugin/client";
import { Platform } from "react-native";
import { hasMath } from "./client/detect";
import { MathMessage, mathMessageSchema } from "./client/math-message";

export default function contribute(client: PluginClientContext) {
  // KaTeX needs a DOM, so iOS and Android keep Paseo's native renderer.
  if (Platform.OS !== "web") return () => {};

  const removeTransformer = client.addTimelineTransformer({
    id: "math-message",
    query: { itemType: "assistant_message" },
    transform: ({ item, phase }) =>
      hasMath(item.text)
        ? { items: [{ type: "plugin", kind: "math-message", version: 1, data: { text: item.text, phase } }] }
        : undefined,
  });
  const removeRenderer = client.addTimelineRenderer({
    kind: "math-message",
    version: 1,
    schema: mathMessageSchema,
    Component: MathMessage,
  });
  return () => {
    removeTransformer();
    removeRenderer();
  };
}
