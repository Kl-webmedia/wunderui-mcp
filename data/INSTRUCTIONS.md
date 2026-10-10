# WunderUI — instructions for your coding agent

Paste this into CLAUDE.md, AGENTS.md or .cursor/rules. It is the short, always-on version;
the full context is https://wunderui.com/DESIGN.md and the MCP server answers everything else
(`claude mcp add wunderui -- npx -y wunderui-mcp`).

## Always
- Never hardcode colours.
- Theme by overriding tokens, not by restyling components.
- Dark mode is a `.dark` class on `<html>`.
- The package is client code.
- Import from the package root, never from `dist/` or `src/` paths.
- `cn` is not re-exported — import it from the `cn` package directly.
- Prefer a composite over rebuilding one.
- Charts take a `loading` prop; do not build your own skeleton.
- A KPI chart ends on the trend line.
- Motion comes from tokens too.
- Agent UI has its own components.
- Before writing UI by hand, look up the component: the Task → component table in DESIGN.md, or the MCP tool `list_components`.

## Motion
- Duration and easing are class names, not numbers.
- Only `transform` and `opacity`.
- Entrances decelerate, exits accelerate.
- Never fade in the LCP element.
- Restrain the travel.
- One overshoot per screen.
- Reduced motion is opt-in, not a kill switch.
- Never `transition-all`.
- Loading keeps its height.
- A looping ambient animation is the one place `ease-in-out` belongs.
- Animate by frequency.
- Anchored surfaces grow from their trigger.
- Toggles stay interruptible.
- Hover only where hover exists.
- Reduced motion keeps the fade.

## Copy
- Buttons say what happens.
- Sentence case everywhere in the product.
- Errors say what happened and what to do.
- Empty states explain and offer one action.
- Labels are nouns, hints are sentences.
- Numbers carry their unit.
- No filler.
- Confirmations name the object.

## Before you finish
- Run the free skills `wunderui-token-check` (no raw colours) and, with Pro, `wunderui-motion-audit` and `wunderui-a11y` on the files you changed.
- Check light, dark and 390 px.

https://wunderui.com/DESIGN.md · https://wunderui.com/skills · https://wunderui.com/llms-full.txt
