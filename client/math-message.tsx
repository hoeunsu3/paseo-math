import type { PluginTimelineItemProps } from "@getpaseo/plugin/client";
import { copyText, Icon, useRevealedText, useToast } from "@getpaseo/plugin/client/react-native";
import { useDeferredValue, useLayoutEffect, useMemo, useRef } from "react";
import { Pressable, View } from "react-native";
import { z } from "zod";
import { renderMarkdownWithMath } from "./render";
import { mountHtml, type MathColors } from "./web";

export const mathMessageSchema = z.object({
  text: z.string(),
  phase: z.enum(["streaming", "complete"]),
});

type MathMessageData = z.output<typeof mathMessageSchema>;

export function MathMessage({ item, theme }: PluginTimelineItemProps<MathMessageData>) {
  const revealed = useRevealedText(item.data.text, item.data.phase);
  // KaTeX re-renders the whole message; let React drop intermediate streaming frames.
  const text = useDeferredValue(revealed);
  const html = useMemo(() => renderMarkdownWithMath(text), [text]);
  const ref = useRef<View>(null);
  const toast = useToast();
  const { colors } = theme;
  const mathColors = useMemo<MathColors>(
    () => ({
      foreground: colors.foreground,
      foregroundMuted: colors.foregroundMuted,
      border: colors.border,
      surface1: colors.surface1,
      surface2: colors.surface2,
      accent: colors.accent,
    }),
    [colors],
  );

  useLayoutEffect(() => {
    mountHtml(ref.current, html, mathColors);
  }, [html, mathColors]);

  const copy = () => {
    copyText(item.data.text).then(
      () => toast.show("복사됨", { variant: "success", durationMs: 1200 }),
      () => toast.error("복사하지 못했습니다"),
    );
  };

  return (
    <View style={{ width: "100%", minWidth: 0 }}>
      <View ref={ref} style={{ width: "100%", minWidth: 0 }} />
      {item.data.phase === "complete" ? (
        <Pressable
          onPress={copy}
          accessibilityRole="button"
          accessibilityLabel="원문 복사"
          hitSlop={6}
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            marginTop: 6,
            padding: 3,
            borderRadius: 4,
            opacity: pressed ? 1 : 0.55,
          })}
        >
          <Icon name="Copy" size={13} color={colors.foregroundMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
