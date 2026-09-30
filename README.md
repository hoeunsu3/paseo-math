# paseo-math

A [Paseo](https://paseo.sh) plugin that renders LaTeX math in assistant messages with KaTeX.

- Renders `$…$`, `$$…$$`, `\(…\)`, and `\[…\]` in the desktop app and web (app.paseo.sh). A `$` inside code blocks or inline code is ignored.
- Only assistant messages that contain math are drawn by the plugin. All other messages keep Paseo's native renderer.
- New agents get a system-prompt note asking them to write math in LaTeX (`agent.create` hook). Claude and Codex both get it.
- The iOS/Android apps have no DOM, so they keep the native renderer and show LaTeX source.

## Installation (once per computer)

Plugins are installed **per Paseo daemon**. Install once on every computer that runs its own daemon. Apps that connect to an already-installed host pick it up automatically.

Requirements: Paseo 0.9.1 or later, with `git` installed on that computer.

### Option A: from the app (no terminal needed)

1. Open Paseo **Settings → Plugins**.
2. Turn on **Enable plugins**.
3. Paste `github:hoeunsu3/paseo-math` into the add-plugin field and install.
4. Check that `paseo-math` shows **running**.

### Option B: from the terminal

```sh
paseo plugin install github:hoeunsu3/paseo-math
paseo plugin ls   # check that paseo-math is running
```

If the plugin shows `disabled`, the global switch is off. Turn on **Enable plugins** in Settings → Plugins, or set `"pluginsEnabled": true` in `~/.paseo/config.json` (Windows: `%USERPROFILE%\.paseo\config.json`) and then run `paseo reload`.

### Verify

In a new chat, ask for something like "write the quadratic formula". If it shows up as a formula, the plugin works. Chats that were already open need their app window reloaded once.

## Updating and removing

```sh
paseo plugin update paseo-math    # fetch the latest version from GitHub
paseo plugin disable paseo-math   # turn it off for a while
paseo plugin remove paseo-math    # uninstall
```

## Development

```sh
npm install
npm run build       # regenerate client/generated/ (KaTeX CSS + prebundled libraries)
npm run typecheck
paseo plugin reload paseo-math
```

- `client/generated/` is committed, so installing from GitHub needs no build step. Paseo compiles plugin clients with esbuild `platform: "neutral"`, which cannot resolve npm packages that only declare `main`. That's why katex, markdown-it, and markdown-it-texmath are prebundled.
- The math root sets the `data-pmono` attribute. Without it, Paseo's global UI-font rule overrides KaTeX's math fonts.
- KaTeX, markdown-it, and markdown-it-texmath are MIT licensed. KaTeX fonts are under the SIL OFL, and their license notices are preserved in `client/generated/vendor.js`.
