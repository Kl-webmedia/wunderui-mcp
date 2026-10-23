# WunderUI — DESIGN.md

> Design context for AI coding agents. Paste this into your prompt, or let your
> agent pull it from https://wunderui.com/DESIGN.md.
> Generated from the WunderUI source on 2026-10-23 · @wunderui/react@0.3.0

WunderUI is a React component library and design system: 222
documented components in 6 groups, built on Base UI
primitives and Tailwind CSS v4. It covers the parts most kits skip — data grid,
kanban, charts, an application shell and a full AI chat set.

## Install

Core and Pro licence holders: the full library from the private GitHub repository wunder-ui/wunderui-core (Polar invites your GitHub account after the purchase). The npm package of the same name is WunderUI Free (free components only).

Accept the GitHub invitation, `git clone https://github.com/wunder-ui/wunderui-core`, run `npm install && npm run build` in it once, then in your project: `mkdir .wunderui`, `npm pack <wunderui-core>/packages/react --pack-destination .wunderui` and `npm install ./.wunderui/<the .tgz>`. The wunderui-setup agent skill does all of it.

`npm install @wunderui/react` installs WunderUI Free from npm: the free components only (no charts, data tables, AI or agent components). Core and Pro need the full library from the private wunderui-core repository — never install the npm package for them. Free plan: the 83 free components are MIT source at https://github.com/wunder-ui/wunderui — add them with `npx wunderui-cli add <name>` (files, dependencies and styles), install the Free package with `npm install @wunderui/react`, or copy components/, lib/ and styles/wunderui.css (each free component in design.json has a sourceRaw URL). Core and Pro components come with a plan (https://wunderui.com/#pricing).

Then wire up the styles and import:

```css
/* your Tailwind entry point */
@import "tailwindcss";
@import "@wunderui/react/styles.css";
@source "../node_modules/@wunderui/react/dist";
```

```tsx
import { Button, Card } from "@wunderui/react"
```

## Rules for agents

1. **Never hardcode colours.** Every value is a CSS variable. Use the Tailwind utility that maps to it (`bg-card`, `text-text-secondary`, `border-border`), not a hex.
2. **Theme by overriding tokens**, not by restyling components. Setting `--primary` on any wrapper re-themes everything inside it.
3. **Dark mode is a `.dark` class on `<html>`.** `ThemeProvider` (next-themes) handles it. Never write your own dark colours.
4. **The package is client code.** It ships with a `"use client"` banner, so you can import it inside React Server Components, but its own components run on the client.
5. **Import from the package root**, never from `dist/` or `src/` paths.
6. `cn` is not re-exported — import it from the `cn` package directly.
7. **Prefer a composite over rebuilding one.** Before writing a table, a board, a stat row or a chat bubble by hand, check the task table and the inventory below — it probably exists.
8. **Charts take a `loading` prop**; do not build your own skeleton.
9. **A KPI chart ends on the trend line.** In a metric card, a sparkline or mini chart beside the value sits on the same horizontal line as the bottom of the trend chip — `MetricCard` does this by default for `MetricSparkline`. Never centre it vertically or let it float above the chip.
10. **Motion comes from tokens too.** Duration is `duration-instant|fast|base|slow|deliberate|ambient`, easing is `ease-entrance|exit|move|overshoot|spring`. Never write a raw `duration-300` and never write `ease-in-out` — both are the default every generator reaches for, and both read as mechanical.
11. **Agent UI has its own components.** A run's state, its steps, an approval gate, its spend and its failure each have one — `AgentStatus`, `RunTimeline`, `ApprovalCard`, `CostMeter`, `RunError`. Do not assemble these from badges and divs.

## Do and don't

The mistakes that cost the most time, each as a pair.

**Don't**

```tsx
<table className="w-full border">
  <thead>…</thead>
</table>
```

**Do**

```tsx
<DataGrid columns={columns} data={rows} searchable selectable />
```

Sorting, search, selection and pagination already exist. A hand-written table has none of them.

---

**Don't**

```tsx
<div style={{ color: "#555CF3" }}>
```

**Do**

```tsx
<div className="text-primary">
```

A hex value survives no theme change and breaks in dark mode.

---

**Don't**

```tsx
<div className="bg-white dark:bg-zinc-900">
```

**Do**

```tsx
<div className="bg-card">
```

The tokens already carry their dark value. Writing `dark:` variants duplicates — and eventually contradicts — the system.

---

**Don't**

```tsx
import { Button } from "@wunderui/react/dist/index.js"
```

**Do**

```tsx
import { Button } from "@wunderui/react"
```

Deep imports break on every release and skip the package's exports map.

---

**Don't**

```tsx
if (window.confirm("Delete this?")) remove()
```

**Do**

```tsx
<AlertDialog>…</AlertDialog>
```

A native confirm cannot be styled, cannot be tested, and looks like 1998.

---

**Don't**

```tsx
<div onClick={save} className="cursor-pointer rounded px-3 py-2">Save</div>
```

**Do**

```tsx
<Button onClick={save}>Save</Button>
```

A div is not focusable, has no role, and ignores the keyboard.

---

**Don't**

```tsx
{isLoading ? <Spinner /> : <Table>…</Table>}
```

**Do**

```tsx
{isLoading ? <Skeleton className="h-60" /> : <Table>…</Table>}
```

A skeleton in the content's height keeps the layout still while the data loads; a lone spinner collapses it.

---

**Don't**

```tsx
transition-all duration-300 ease-in-out
```

**Do**

```tsx
transition-[opacity,transform] duration-base ease-entrance
```

300ms with a symmetric curve is the generated default. 250ms on a decelerating curve is what a considered interface feels like — and `transition-all` animates properties you did not mean to animate.

---

**Don't**

```tsx
<div className="transition-[height] h-0 data-[open]:h-auto">
```

**Do**

```tsx
<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-base ease-move data-open:grid-rows-[1fr]"><div className="min-h-0 overflow-hidden">…</div></div>
```

`height: auto` is not animatable anywhere outside Chromium, and animating height forces layout on every frame. The 0fr → 1fr grid trick works in every browser and stays on the compositor.

---

**Don't**

```tsx
data-closed:duration-slow
```

**Do**

```tsx
data-closed:duration-fast
```

An exit is faster than an entrance. The user already decided; making them watch the decision play out is the single most common motion mistake.

---

**Don't**

```tsx
{rows.length === 0 && <p className="text-sm text-gray-500">No results</p>}
```

**Do**

```tsx
<EmptyState title="No invoices yet" description="They appear here as soon as the first one is sent." action={<Button size="sm">New invoice</Button>} />
```

An empty state should say why it is empty and what to do next.

## Task → component

Look here first. Most requests map to something that already exists.

| I need … | Use |
| --- | --- |
| Sortable, searchable table with row selection | `DataGrid` |
| Plain table markup, no behaviour | `Table` and its parts |
| Editable cells inside a table | `CellSelect`, `CellSwitch`, `CellSlider`, `CellColorPicker` |
| Formatted table cells | `UserCell`, `BadgeCell`, `CurrencyCell`, `ProgressCell`, `TagCell`, `RatingCell` |
| Bulk actions for a selection | `ActionBar` |
| Drag-and-drop board of columns and cards | `Kanban` |
| A single metric with a trend | `StatCard`, grouped in `KPIGroup` |
| A percentage change as a small pill | `TrendChip` |
| Values over time | `AreaChart` or `LineChart` |
| Categories compared | `BarChart` |
| Parts of a whole | `PieChart` (donut mode) or `RadialChart` |
| Application shell with sidebar and top bar | `AppLayout` + `Sidebar` + `Navbar` |
| Detail panel sliding in from the edge | `Sheet` |
| Modal for a focused task | `Dialog` |
| Confirmation with consequences | `AlertDialog` |
| Menu on a button / on right-click | `DropdownMenu` / `ContextMenu` |
| Text input that suggests while typing | `Combobox` or `Autocomplete` |
| Pick a date | `DatePicker`, or `Calendar` for an inline month |
| Form with labels and validation | `Form` + `Field` + `Fieldset` |
| Settings row with a toggle | `SelectorItem` + `Switch`, grouped in `SelectorItemGroup` |
| Multi-step flow | `Stepper` |
| Switch between views, compactly | `Segment`; `Tabs` when the views are panels |
| File upload | `DropZone` |
| Chat with an assistant | `ChatConversation` + `ChatMessage` + `PromptInput` |
| Show what a run is doing right now | `AgentStatus` |
| Ask a human to approve an action before it runs | `ApprovalCard` |
| The steps of a run, in order, with timings | `RunTimeline` |
| Spend against a budget | `CostMeter` |
| A run that failed, with retry | `RunError` |
| Every agent you own, and its state | `AgentGrid` |
| Show the model's reasoning, a tool call, a source | `ChainOfThought`, `ChatTool`, `ChatSource` |
| List of past conversations | `ChatListView` |
| Nothing to show yet | `EmptyState` |
| Something is loading | `Skeleton`; charts take `loading` |
| Transient notification | `useToast` with `Toaster`; `Alert` when it should stay |
| Search across everything (⌘K) | `Command` |
| Chronological events | `Timeline`; `Agenda` for scheduled ones |
| Folder and file tree | `FileTree` |
| Two panes with a draggable divider | `Resizable` |
| Time an interaction | `duration-fast` hover/press and every exit · `duration-base` menus · `duration-slow` dialogs · `duration-deliberate` sheets · `duration-ambient` data bars |
| Ease an interaction | `ease-entrance` arriving · `ease-exit` leaving · `ease-move` repositioning · `ease-overshoot` once per screen at most |
| Animate something open or closed | `data-open` / `data-closed` variants; height via `grid-rows-[0fr]` → `[1fr]` |

## Tokens

Light is `:root`, dark is `.dark`. Same names in both themes.

| Token | Light | Dark |
| --- | --- | --- |
| `--background` | `#FFFFFF` | `#17181A` |
| `--bg-page` | `#F9FBFC` | `#17181A` |
| `--foreground` | `#000000` | `#FFFFFF` |
| `--card` | `#FFFFFF` | `#1C1D20` |
| `--card-foreground` | `#000000` | `#FFFFFF` |
| `--popover` | `#FFFFFF` | `#1C1D20` |
| `--popover-foreground` | `#000000` | `#FFFFFF` |
| `--primary` | `var(--brand-600)` | `var(--brand-600)` |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--brand-primary` | `var(--brand-600)` | `var(--brand-600)` |
| `--brand-primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--brand-secondary` | `#12AFF0` | `#12AFF0` |
| `--brand-secondary-foreground` | `#25272A` | `#25272A` |
| `--brand-tertiary` | `#F47690` | `#F47690` |
| `--brand-tertiary-foreground` | `#25272A` | `#25272A` |
| `--brand-quaternary` | `#FACA4A` | `#FACA4A` |
| `--brand-quaternary-foreground` | `#25272A` | `#25272A` |
| `--secondary` | `#FFFFFF` | `#1C1D20` |
| `--secondary-foreground` | `#000000` | `#FFFFFF` |
| `--muted` | `#F1F5F7` | `#323438` |
| `--muted-foreground` | `#5A7383` | `#949EAD` |
| `--accent` | `#F1F5F7` | `#323438` |
| `--accent-foreground` | `#000000` | `#FFFFFF` |
| `--destructive` | `#D42A2D` | `#D42A2D` |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--border` | `#F1F5F7` | `#323438` |
| `--input` | `var(--border-control)` | `#6E6E70` |
| `--code-border` | `var(--light-300)` | `color-mix(in srgb, var(--foreground) 14%, var(--muted))` |
| `--border-control` | `var(--light-300)` | `#323438` |
| `--ring` | `var(--brand-600)` | `var(--brand-400)` |
| `--text-secondary` | `#454648` | `#D1D1D1` |
| `--text-tertiary` | `#6E6E70` | `#A2A3A3` |
| `--success` | `#1AD598` | `#1AD598` |
| `--success-foreground` | `#17181A` | `#17181A` |
| `--chart-1` | `var(--brand-600)` | `var(--brand-600)` |
| `--chart-2` | `#12AFF0` | `#3CC2F5` |
| `--chart-3` | `#A584F3` | `#B79CF6` |
| `--chart-4` | `#1AD598` | `#3DDBA6` |
| `--chart-5` | `#A2A3A3` | `#6E7078` |
| `--sidebar` | `#F9FBFC` | `#17181A` |
| `--sidebar-foreground` | `#000000` | `#FFFFFF` |
| `--sidebar-primary` | `var(--brand-600)` | `var(--brand-600)` |
| `--sidebar-primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--sidebar-accent` | `#F1F5F7` | `#323438` |
| `--sidebar-accent-foreground` | `#000000` | `#FFFFFF` |
| `--sidebar-border` | `#F1F5F7` | `#323438` |
| `--sidebar-ring` | `var(--brand-600)` | `var(--brand-400)` |
| `--text-link` | `var(--brand-600)` | `var(--brand-400)` |
| `--text-success` | `#0C7E5A` | `#76E6C1` |
| `--text-error` | `#D42A2D` | `#F8ADBC` |
| `--text-warning` | `#64511E` | `#FCDF92` |
| `--inverse` | `#000000` | `#FFFFFF` |
| `--text-error-inverse` | `#F8ADBC` | `#D42A2D` |
| `--text-inverse` | `#FFFFFF` | `#000000` |
| `--subtle` | `#F1F5F7` | `#25272A` |
| `--tint-indigo` | `var(--brand-50)` | `var(--brand-900)` |
| `--tint-blue` | `#E7F7FE` | `#074660` |
| `--tint-purple` | `#F6F3FE` | `#423561` |
| `--tint-pink` | `#FFF0F8` | `#662B4A` |
| `--tint-red` | `#FEF1F4` | `#622F3A` |
| `--tint-orange` | `#FEF0ED` | `#61281E` |
| `--tint-yellow` | `#FFFAED` | `#64511E` |
| `--tint-green` | `#E8FBF5` | `#0A553D` |
| `--tint-alternative` | `#F1F0F3` | `#2C2C36` |
| `--tint-text-indigo` | `var(--brand-800)` | `var(--brand-300)` |
| `--tint-text-blue` | `#0B6990` | `#A0DFF9` |
| `--tint-text-purple` | `#634F92` | `#DBCEFA` |
| `--tint-text-pink` | `#984070` | `#FFC4E3` |
| `--tint-text-red` | `#924756` | `#FBC8D3` |
| `--tint-text-orange` | `#923D2C` | `#FAC1B7` |
| `--tint-text-yellow` | `#64511E` | `#FDEAB7` |
| `--tint-text-green` | `#10805B` | `#A3EED6` |
| `--tint-text-alternative` | `#424150` | `#C5C5CF` |
| `--brand-quinary` | `#A584F3` | `#A584F3` |
| `--brand-senary` | `#FE6BBA` | `#FE6BBA` |
| `--brand-septenary` | `#F3654A` | `#F3654A` |
| `--brand-octonary` | `#6E6D86` | `#6E6D86` |
| `--effect-shadow` | `rgb(0 0 0 / 0.08)` | `rgb(0 0 0 / 0.08)` |
| `--effect-shadow-2` | `rgb(16 24 40 / 0.05)` | `rgb(16 24 40 / 0.05)` |
| `--effect-shadow-3` | `rgb(0 0 0 / 0.05)` | `rgb(0 0 0 / 0.05)` |
| `--gradient-start` | `#494F60` | `#494F60` |
| `--gradient-end` | `#0B0C33` | `#0B0C33` |
| `--gradient-start-2` | `#777FA1` | `#777FA1` |
| `--gradient-end-2` | `#1F2059` | `#1F2059` |
| `--gradient-start-3` | `#6F74F5` | `#6F74F5` |
| `--brand-50` | `#F4F5FF` | `#F4F5FF` |
| `--brand-100` | `var(--indigo-100)` | `var(--indigo-100)` |
| `--brand-200` | `var(--indigo-200)` | `var(--indigo-200)` |
| `--brand-300` | `var(--indigo-300)` | `var(--indigo-300)` |
| `--brand-400` | `var(--indigo-400)` | `var(--indigo-400)` |
| `--brand-500` | `var(--indigo-500)` | `var(--indigo-500)` |
| `--brand-600` | `var(--indigo-600)` | `var(--indigo-600)` |
| `--brand-700` | `var(--indigo-700)` | `var(--indigo-700)` |
| `--brand-800` | `var(--indigo-800)` | `var(--indigo-800)` |
| `--brand-900` | `var(--indigo-900)` | `var(--indigo-900)` |
| `--brand-1000` | `var(--indigo-1000)` | `var(--indigo-1000)` |

Figma names are also available as classes: `bg-bg-page`, `bg-bg-surface`, `bg-bg-subtle`,
`bg-bg-inverse`, `text-text-primary`, `text-text-muted`, `bg-error`.

### Tints

One mode-aware pair per hue (indigo, blue, purple, pink, red, orange, yellow, green,
alternative): `bg-tint-<hue>` is the soft surface, `text-tint-text-<hue>` the AA text
colour on it. Solid badges use `var(--tint-<hue>)` as text colour on the 600 fill.

### Palette (primitives)

Mode-independent hue scales from the Figma Primitives collection, exposed as
`bg-<hue>-<step>` / `text-<hue>-<step>` (they replace Tailwind's palette for these names).

| Token | Value |
| --- | --- |
| `--dark-100` | `#E8E8E8` |
| `--dark-200` | `#D1D1D1` |
| `--dark-300` | `#A2A3A3` |
| `--dark-400` | `#6E6E70` |
| `--dark-500` | `#454648` |
| `--dark-600` | `#17181A` |
| `--dark-700` | `#121315` |
| `--dark-800` | `#0E0E10` |
| `--dark-900` | `#090A0A` |
| `--dark-1000` | `#050505` |
| `--light-100` | `#FFFFFF` |
| `--light-200` | `#F1F5F7` |
| `--light-300` | `#D9E1E7` |
| `--light-400` | `#B3C5D4` |
| `--light-500` | `#99B2C6` |
| `--light-600` | `#809FB8` |
| `--light-700` | `#5A7383` |
| `--light-800` | `#4D5F6E` |
| `--light-900` | `#33404A` |
| `--light-1000` | `#1A2025` |
| `--blue-100` | `#E7F7FE` |
| `--blue-200` | `#D0EFFC` |
| `--blue-300` | `#A0DFF9` |
| `--blue-400` | `#71CFF6` |
| `--blue-500` | `#41BFF3` |
| `--blue-600` | `#12AFF0` |
| `--blue-700` | `#0E8CC0` |
| `--blue-800` | `#0B6990` |
| `--blue-900` | `#074660` |
| `--blue-1000` | `#042330` |
| `--indigo-100` | `#EEEFFE` |
| `--indigo-200` | `#DDDEFD` |
| `--indigo-300` | `#BBBEFA` |
| `--indigo-400` | `#999DF8` |
| `--indigo-500` | `#777DF5` |
| `--indigo-600` | `#555CF3` |
| `--indigo-700` | `#444AC2` |
| `--indigo-800` | `#333792` |
| `--indigo-900` | `#222561` |
| `--indigo-1000` | `#111231` |
| `--purple-100` | `#F6F3FE` |
| `--purple-200` | `#EDE6FD` |
| `--purple-300` | `#DBCEFA` |
| `--purple-400` | `#C9B5F8` |
| `--purple-500` | `#B79DF5` |
| `--purple-600` | `#A584F3` |
| `--purple-700` | `#846AC2` |
| `--purple-800` | `#634F92` |
| `--purple-900` | `#423561` |
| `--purple-1000` | `#211A31` |
| `--pink-100` | `#FFF0F8` |
| `--pink-200` | `#FFE1F1` |
| `--pink-300` | `#FFC4E3` |
| `--pink-400` | `#FEA6D6` |
| `--pink-500` | `#FE89C8` |
| `--pink-600` | `#FE6BBA` |
| `--pink-700` | `#CB5695` |
| `--pink-800` | `#984070` |
| `--pink-900` | `#662B4A` |
| `--pink-1000` | `#331525` |
| `--red-100` | `#FEF1F4` |
| `--red-200` | `#FDE4E9` |
| `--red-300` | `#FBC8D3` |
| `--red-400` | `#F8ADBC` |
| `--red-500` | `#F691A6` |
| `--red-600` | `#F47690` |
| `--red-700` | `#C35E73` |
| `--red-800` | `#924756` |
| `--red-900` | `#622F3A` |
| `--red-1000` | `#31181D` |
| `--orange-100` | `#FEF0ED` |
| `--orange-200` | `#FDE0DB` |
| `--orange-300` | `#FAC1B7` |
| `--orange-400` | `#F8A392` |
| `--orange-500` | `#F5846E` |
| `--orange-600` | `#F3654A` |
| `--orange-700` | `#C2513B` |
| `--orange-800` | `#923D2C` |
| `--orange-900` | `#61281E` |
| `--orange-1000` | `#31140F` |
| `--yellow-100` | `#FFFAED` |
| `--yellow-200` | `#FEF4DB` |
| `--yellow-300` | `#FDEAB7` |
| `--yellow-400` | `#FCDF92` |
| `--yellow-500` | `#FBD56E` |
| `--yellow-600` | `#FACA4A` |
| `--yellow-700` | `#C8A23B` |
| `--yellow-800` | `#96792C` |
| `--yellow-900` | `#64511E` |
| `--yellow-1000` | `#32280F` |
| `--green-100` | `#E8FBF5` |
| `--green-200` | `#D1F7EA` |
| `--green-300` | `#A3EED6` |
| `--green-400` | `#76E6C1` |
| `--green-500` | `#48DDAD` |
| `--green-600` | `#1AD598` |
| `--green-700` | `#15AA7A` |
| `--green-800` | `#10805B` |
| `--green-900` | `#0A553D` |
| `--green-1000` | `#052B1E` |
| `--alternative-100` | `#F1F0F3` |
| `--alternative-200` | `#E2E2E7` |
| `--alternative-300` | `#C5C5CF` |
| `--alternative-400` | `#A8A7B6` |
| `--alternative-500` | `#8B8A9E` |
| `--alternative-600` | `#6E6D86` |
| `--alternative-700` | `#58576B` |
| `--alternative-800` | `#424150` |
| `--alternative-900` | `#2C2C36` |
| `--alternative-1000` | `#16161B` |
| `--neutral-black` | `#000000` |
| `--neutral-white` | `#FFFFFF` |
| `--neutral-dark-secondary` | `#1C1D20` |
| `--neutral-dark-content` | `#25272A` |
| `--neutral-dark-borders` | `#323438` |
| `--neutral-dark-grey` | `#384455` |
| `--neutral-light-background` | `#F9FBFC` |
| `--neutral-alternative-secondary` | `#ACB3C7` |
| `--neutral-error-base` | `#D42A2D` |
| `--neutral-dark-muted` | `#949EAD` |

### Gradients

Figma `Gradient/<Hue>` paint styles as `bg-gradient-<hue>` (blue, yellow, red, indigo, purple,
pink, orange, green, alternative), plus `bg-gradient-dark` (gradient/start → end),
`bg-gradient-slate` (start-2 → end-2) and `bg-gradient-primary` (start-3 → brand-primary).

### Effects

Figma Shadow styles on the Tailwind scale: `shadow-xs` Small (0 1 2 / 5%), `shadow-sm` Regular
(0 2 4 / 8%), `shadow-md` Medium (0 4 8 / 10%), `shadow-lg` Large (0 8 16 / 12%), `shadow-xl`
XLarge (0 16 32 -4 / 16%). Shadow colours: `--effect-shadow`, `--effect-shadow-2`, `--effect-shadow-3`.

### Radius

| Token | Value |
| --- | --- |
| `--radius` | `0.75rem` |

### Typography

Font family comes from the host app through `--font-sans`; WunderUI maps
`--font-heading` to the same stack. The documentation site uses Inter.

### Density

Compact is the default: controls are 32, 36, 40, 44 and 48 px (`sm` to `2xl`), one scale for
buttons and fields, text stays 14 px. `data-density="comfortable"` on `<html>` or any ancestor
restores the roomier sizes (36 to 56 px); it nests in both directions. In code: `<Density value>`,
`DensityProvider` and `useDensity()`. Do not hard-code control heights (`h-9`, `h-11`) — use
the component sizes so density keeps working. Portals (menus, dialogs) read the page's density.

## Motion

Motion is tokenised like everything else. Duration and easing are never written
as raw values — a hand-typed `300ms` with `ease-in-out` is the default every
generator produces, and it is why generated interfaces feel generic.

### Duration

Tailwind v4 has no `--duration-*` theme namespace, so WunderUI ships the scale
as named utilities defined with `@utility`. Each one sets `--tw-duration` as
well, which is what `tw-animate-css` reads — so `data-open:duration-base` works
on an `animate-in` the same way it works on a `transition`.

| Token | Value | Reach for it when |
| --- | --- | --- |
| `duration-instant` | `80ms` | Tooltip dismiss, press release. Barely reads as motion. |
| `duration-fast` | `150ms` | The default exit. Hover, focus ring, checkbox, switch track. |
| `duration-base` | `250ms` | Dropdown, popover, context menu, backdrop, collapse. |
| `duration-slow` | `350ms` | Dialog, toast, switch thumb — a surface arriving. |
| `duration-deliberate` | `450ms` | Sheet and full-width panel. Rare. |
| `duration-ambient` | `700ms` | Progress and meter fills. Data moving, not chrome. |

### Easing

`ease-*` is a Tailwind v4 namespace, so these are utilities: `ease-entrance`,
`ease-exit`, `ease-move`, `ease-overshoot`.

| Utility | Curve | Reach for it when |
| --- | --- | --- |
| `ease-entrance` | `cubic-bezier(0.22, 1, 0.36, 1)` | Anything arriving. Fast start, long settle. The house curve. |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Anything leaving. Accelerates away. |
| `ease-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | Anything repositioning while staying on screen. |
| `ease-overshoot` | `cubic-bezier(0.34, 1.35, 0.64, 1)` | Dialog, popover, switch. At most one per screen. |
| `ease-spring` | `linear(0, 0.35 9%, 0.78 19%, 1.04 27%, 1.1 32%, 1.03 41%, 0.98 50%, 1.01 62%, 1)` | A sampled spring: one soft overshoot, then it settles. Something physical landing — a thumb, an arrow, a released sheet. Never on a data value. |

### Travel

| Token | Value | Reach for it when |
| --- | --- | --- |
| `--travel-xs` | `2px` | Tooltip — stays glued to its anchor. |
| `--travel-sm` | `4px` | Popover, dropdown, context menu. |
| `--travel-md` | `8px` | Dialog, toast, inline panel. |
| `--travel-lg` | `16px` | Section reveal on scroll. |
| `--scale-press` | `0.97` | Pressed button. |
| `--scale-enter` | `0.96` | Dialog arriving. |

### Rules

1. **Duration and easing are class names, not numbers.** `duration-base`, `ease-entrance`. Tailwind has no `--duration-*` theme namespace, so WunderUI ships these as `@utility` rules that also set `--tw-duration` — which means they work on `animate-in` / `animate-out` too.
2. **Only `transform` and `opacity`.** Everything else goes through layout or paint. Height animates via `grid-template-rows: 0fr → 1fr`, never via `height`.
3. **Entrances decelerate, exits accelerate.** `ease-entrance` in, `ease-exit` out — and the exit is one step shorter on the duration scale, never the entrance duration reversed.
4. **Never fade in the LCP element.** An element at `opacity: 0` is not an LCP candidate, so a 600ms hero fade adds 600ms to your LCP. Render headline copy at full opacity; animate `transform` only.
5. **Restrain the travel.** Anything anchored to a trigger moves `--travel-xs` or `--travel-sm`. A menu that slides 20px looks like it fell in.
6. **One overshoot per screen.** `ease-overshoot` is punctuation. Two of them on one view and the interface reads as a toy. Never on a data value: a bar, gauge or bubble that swings past its number shows a wrong number for a moment.
7. **Reduced motion is opt-in, not a kill switch.** Wrap the animation in `@media (prefers-reduced-motion: no-preference)` so the still state is the default and you cannot forget a selector. Reduced means calmer, not nothing: drop transforms and travel, keep opacity and colour changes (rule 15).
8. **Never `transition-all`.** Name the properties — `transition-[opacity,transform]` — or use bare `transition`, which covers colour, shadow, transform and opacity but no layout property. `transition-all` animates things you did not mean to animate, including on first paint.
9. **Loading keeps its height.** A skeleton occupies the same box as the content it stands in for, and crossfades — it never collapses and reflows.
10. **A looping ambient animation is the one place `ease-in-out` belongs.** A shimmer that runs forever has no entrance and no exit, so symmetry is correct there and nowhere else.
11. **Animate by frequency.** Keyboard-driven and 100+/day actions (command palette, shortcuts, moving between tooltips) get no motion; tens a day get a short fade; rare moments may delight. Tooltips skip their entrance when another one was just open (`data-open:data-instant:animate-none`).
12. **Anchored surfaces grow from their trigger.** Popover, dropdown, tooltip, hover card and select use `origin-(--transform-origin)`. Never start from `scale(0)` — start at 0.92–0.97 with opacity. Centred dialogs are exempt.
13. **Toggles stay interruptible.** Animate switches, checkboxes, tabs and other repeated state changes with transitions — they retarget from wherever they are — never with keyframes bound to the state, which restart from zero. An overshoot transition (`transition-transform duration-base ease-overshoot`) still swings past the end.
14. **Hover only where hover exists.** Tailwind v4's `hover:` is already gated to `(hover: hover)`; hand-written `:hover` in CSS goes inside `@media (hover: hover) and (pointer: fine)`, so a tap on a phone does not leave a hover state stuck.
15. **Reduced motion keeps the fade.** WunderUI's global rule zeroes the scale, slide, spin and blur of every `animate-in` / `animate-out` and every transform transition, and keeps opacity and colour — so do not add `motion-reduce:transition-none` or `motion-reduce:animate-none` to a fade.

### Motion recipes

#### Overlay enter and exit

```tsx
/* Dialog, sheet, popover, dropdown, context menu — one pattern for all of them.
   Base UI exposes data-open / data-closed; tw-animate-css turns them into keyframes. */
<Dialog.Popup className="
  data-open:animate-in   data-open:fade-in-0   data-open:zoom-in-92
  data-open:slide-in-from-bottom-2
  data-open:duration-slow  data-open:ease-overshoot
  data-closed:animate-out  data-closed:fade-out-0 data-closed:zoom-out-96
  data-closed:duration-fast data-closed:ease-exit
" />
```

#### Collapse without a fixed height

```tsx
<div className="grid grid-rows-[0fr] transition-[grid-template-rows]
                duration-base ease-entrance
                data-open:grid-rows-[1fr]">
  <div className="min-h-0 overflow-hidden">{children}</div>
</div>
```

#### Press feedback

```tsx
<Button className="transition duration-fast ease-entrance
                   active:scale-[var(--scale-press)]" />
```

#### A bar that carries data

```tsx
/* Progress, meter, cost bar — the pace says "this is a value", not "this is chrome". */
<div className="h-full bg-primary transition-[width] duration-ambient ease-entrance"
     style={{ width: `${percent}%` }} />
```

#### Reduced motion, done as opt-in

```tsx
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: rise var(--duration-slow) var(--ease-entrance) both;
    animation-timeline: view();
  }
}
/* Firefox has no scroll-driven animations yet — without this the element
   stays invisible there. */
@supports not (animation-timeline: view()) {
  .reveal { animation: none; }
}
```

## Copy

Rules for the words inside the product — buttons, labels, errors and empty states.

1. **Buttons say what happens.** A verb and, where it helps, the object: `Save changes`, `Invite member`, `Delete project` — never `OK`, `Submit` or `Yes`. The destructive button repeats the action, the other one is `Cancel`.
2. **Sentence case everywhere in the product.** Buttons, menu items, headings, labels and tabs start with one capital: `Billing history`, not `Billing History`.
3. **Errors say what happened and what to do.** `The card was declined. Try another card or contact your bank.` — no `Oops`, no `Something went wrong` on its own, no blame, no error codes without words.
4. **Empty states explain and offer one action.** What will appear here, why it is empty, and the one button that fills it: `No invoices yet — your first one appears after the first payment.`
5. **Labels are nouns, hints are sentences.** A field label names the thing (`Work email`); help text under it explains a rule in a full sentence.
6. **Numbers carry their unit.** Money with the ISO currency or symbol and two decimals (`$299.00`, `EUR 41.80`), percentages with `%`, durations and sizes with units (`12 GB`, `3 min`). Use tabular numbers in tables.
7. **No filler.** No `please`, `simply`, `just` or `easily`; no exclamation marks in the interface; no `Lorem ipsum`. Sample people are invented (`Alina Lorenz`, `Felix Brandt`).
8. **Confirmations name the object.** `Delete “Q4 report”?` with what is lost, not `Are you sure?`.

## Skills

Agent skills that build and check with these rules (https://wunderui.com/skills):

- **wunderui-screen** (Free) — Builds a complete React screen with WunderUI from a one-sentence request, within the user's plan (Free uses only the free components) — picks the components and a matching block layout, fills props from design.json, adds the empty, loading and error states that generated screens usually forget, uses motion tokens instead of raw milliseconds, and finishes with a typecheck and a build.
- **wunderui-setup** (Free) — Sets up WunderUI in a React project from scratch to the first rendered screen — detects the framework, Tailwind version and existing tokens, puts DESIGN.md and design.json into the project, registers the WunderUI MCP server, wires styles.css and the @source path, renders a probe component and writes a setup report.
- **wunderui-theme** (Free) — Generates a complete WunderUI brand theme from one brand colour (hex) — optionally an accent colour, a radius preference and a font — the eleven-step brand scale (--brand-50 … --brand-1000), the brand tokens derived from it (primary, primary-foreground, text-link, ring, tint and tint text, chart 1) for light and dark, a WCAG AA check of every key pair with shades moved automatically until they pass, and one CSS file to import after @wunderui/react/styles.css (globally or for one subtree), plus a report.
- **wunderui-token-check** (Free) — Finds hard-coded colours, spacing and radii that bypass the WunderUI design tokens, maps each literal to the nearest token with a measured distance (ΔE for colour, px for spacing and radius), separates safe swaps from values too far from any token, replaces the safe ones and reports how much the look changed.
- **wunderui-a11y** (Pro) — Accessibility check per component or screen in a WunderUI project — renders every variant, walks the focus order and checks that focus is visible, measures WCAG AA contrast of every text in light and dark, verifies the reduced-motion fallback, and delivers each finding with a patch instead of just a report.
- **wunderui-agent-ui** (Pro) — Builds the interface of an AI agent with WunderUI's agent components — describes the run (steps, tools, costs, approvals), picks RunTimeline, ApprovalCard, CostMeter, AgentStatus, RunError and their relatives, plays through every state including failure and abort, applies the agent motion tokens and checks the approval moment separately.
- **wunderui-compose** (Pro) — Composes WunderUI blocks into a complete page — clarifies the page's goal and audience, proposes a block order that follows the visitor's questions, inserts the blocks and fills them with real content, checks the rhythm (one notable effect per section) and protects the LCP element from entrance animation.
- **wunderui-figma-screen** (Pro) — Builds a screen in Figma from the WunderUI library — real component instances instead of drawn rectangles, every fill and text bound to the theme variables and text styles, auto layout throughout, a light frame first, then the dark frame as a clone with the Dark mode and a 390 px mobile frame — and checks the result with screenshots and an audit (unbound paints, unstyled text, absolute children).
- **wunderui-figma-sync** (Pro) — Keeps Figma variables and the project's CSS tokens (styles.css) identical in both directions — reads the Figma variable collections and text styles through the Figma MCP server, diffs them against the CSS custom properties (colour per light/dark mode, spacing, radius, type, motion), lists every conflict with the measured difference, asks which side wins and writes only in that direction, then reports what changed.
- **wunderui-motion-audit** (Pro) — Audits a codebase's animations and transitions against the WunderUI motion rules — transition-all, raw millisecond durations, ease-in-out and other generic curves, scroll-driven animations without an @supports fallback, missing prefers-reduced-motion handling, layout-property animation and fades on the LCP element — justifies every finding with the rule from DESIGN.md, proposes and applies a patch with motion tokens and verifies the build.
- **wunderui-refactor** (Pro) — Migrates an existing React app to WunderUI — scans the project and detects the UI stack per file (shadcn/ui, Radix primitives, MUI, Chakra, Headless UI, Mantine, hand-built components and hard-coded Tailwind colours), maps every component to its WunderUI equivalent with prop notes, writes a migration plan with effort and order, applies the safe codemods (shadcn imports → @wunderui/react, raw colours → token utilities) and measures before → after (raw colours, foreign UI imports, WunderUI coverage) with the project's typecheck.
- **wunderui-uiux-design-auditor** (Pro) — Evidence-based UI/UX and accessibility audit of any product — live websites, landing pages, component libraries / front-end code (React, Vue, Svelte, HTML/CSS, Tailwind) and Figma files — against a 520-rule catalog (WCAG 2.2 A/AA, platform guidance, design-system rules, responsive behaviour from 320 to 1440 px).

## Component inventory

**Plans.** 83 components are **Free** (MIT, source at https://github.com/wunder-ui/wunderui); 139 are **Pro** and need WunderUI Core or Pro — charts, KPI cards, the data grid, the app layout and navigation, AI & agents. On the Free plan, build only with components marked Free and name the Pro component that would do the job better.

### Primitives

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Accordion` | Free | A vertically stacked set of collapsible panels, in card or divider style. | AccordionContent, AccordionItem, AccordionTrigger |
| `Avatar` | Free | A user or entity's profile image with a text fallback. | AvatarBadge, AvatarColor, AvatarFallback, AvatarImage |
| `AvatarGroup` | Free | A stack of overlapping avatars, with an optional overflow count. | AvatarGroupCount |
| `Badge` | Free | A small status or category label in 12 colors and 6 styles. | BadgeCell, BadgeColor, BadgeStyle |
| `Breadcrumb` | Free | Shows the user's location in a hierarchy, in the `plain`, `border` or `underline` style. | BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator |
| `Button` | Free | The main action trigger, in 10 variants, 2 shapes and 5 sizes. | ButtonCell |
| `IconButton` | Free | A square or circular button for a single icon action. | IconButtonTextCell |
| `ButtonGroup` | Free | A row of connected buttons sharing borders and outer corners, for view switchers or segmented actions. | ButtonGroupOrientation, ButtonGroupShape |
| `Card` | Free | A bordered container for grouping related content. | CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, CardVariant |
| `Checkbox` | Free | A single choice that is on or off, with an indeterminate state for “some selected”. | — |
| `Switch` | Free | A toggle control for a binary setting. | SwitchItemCell |
| `RadioGroup` | Free | A set of mutually exclusive options. | RadioGroupItem |
| `Input` | Free | A single-line text field with sm/default/lg sizes and error state. | — |
| `Textarea` | Free | A multi-line text field with sm/default/lg sizes and an optional character counter. | — |
| `Progress` | Free | A horizontal bar showing completion of a task. | ProgressCell, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue |
| `Slider` | Free | A draggable control for selecting one value or a range along a track. | SliderControl, SliderIndicator, SliderLabel, SliderThumb, SliderTrack, SliderValue |
| `Pagination` | Free | Page navigation with Prev/Next and numbered pages, or a simple "Page X of Y" mode. | PaginationSimple |
| `Separator` | Free | A thin dividing line, horizontal or vertical, solid or dashed. | — |
| `DividerWithLabel` | Free | A separator with a centered text label, e.g. for "or" between two sign-in options. | — |
| `Skeleton` | Free | A pulsing placeholder shown while content is loading. | — |
| `Tooltip` | Free | A short label shown on hover, in any of 4 directions. | TooltipContent, TooltipTrigger |
| `Dialog` | Free | A modal window for focused tasks, built on Base UI. | DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogIcon, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger |
| `AlertDialog` | Free | A dialog for confirmations and destructive actions: a click outside does not close it, only a button or Escape does. | AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogIcon, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger |
| `Collapsible` | Free | A single collapsible panel controlled by a trigger button. | CollapsibleContent, CollapsibleTrigger |
| `Toggle` | Free | A standalone two-state button that can be pressed or unpressed. | ToggleButton |
| `Meter` | Free | A graphical display of a fixed value within a range, e.g. disk usage. | MeterIndicator, MeterLabel, MeterTrack, MeterValue |
| `Kbd` | Free | Displays a keyboard key or shortcut, e.g. inside a search input. | KbdGroup |
| `Spinner` | Free | A spinning indicator for an in-progress loading state. | — |
| `Toolbar` | Free | A container for grouping a set of buttons and controls. | ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator |
| `DropdownMenu` | Pro | A menu of actions: icons, shortcuts, checkbox and radio entries, submenus, two-line entries, loading and empty states. | DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuEmpty, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuLoading, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger |
| `HoverCard` | Free | A rich preview popup shown on hovering a trigger. | HoverCardContent, HoverCardTrigger |
| `Table` | Free | Rows and columns with 23 ready-made cell types; for sorting and search use Data Grid. | ActionIconsCell, ActionItemsCell, AddressCell, CheckItemCell, CompanyCell, CTAButtonCell, CurrencyCell, DragItemCell, HeadingCell, IconTextCell, PerformanceCell, ProductCell, RadioItemCell, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TagCell, TextCell, UserAvatarCell, UserCell |
| `Tabs` | Free | Switches between related views in the same context. | TabsContent, TabsIndicator, TabsList, TabsTrigger |
| `Agenda` | Free | A time-ordered list of scheduled events. | AgendaItem |
| `ActionBar` | Free | A pill-shaped bar of bulk actions for a selection. It sits where you place it, so fix it to the bottom of the page yourself if it should float. | — |
| `Carousel` | Free | A horizontally scrollable row of items with arrow controls. | CarouselNavigationShape, CarouselProps |
| `EmptyState` | Free | Placeholder shown when a list or search has no results. | — |
| `FileTree` | Free | An indented list of folders and files: a tree with arrow-key navigation whose folders open and close, and onSelect reports the chosen file or folder. | FileTreeNode, FileTreeProps |
| `FloatingToc` | Free | A table of contents for an article, with a marker that follows the section in view. It does not stick by itself: put it in a `sticky` container to keep it on screen. | — |
| `HoloCard` | Free | A card with a mouse-tracking spotlight/gradient shine effect. | — |
| `Kanban` | Pro | A drag-and-drop board of columns and cards. | KanbanCard, KanbanCardProps, KanbanColumn, KanbanLayout |
| `ItemCard` | Free | A generic row card: icon, title, description, meta, action. | ItemCardGroup |
| `ListView` | Pro | A simple bordered list of rows with leading/trailing content. | ListViewItem |
| `Timeline` | Free | A vertical sequence of dated, dot-connected events. | TimelineItem |
| `Widget` | Free | A generic dashboard widget shell: header, body, footer. | — |
| `TimelineEvent` | Free | One entry in an activity feed or history, with an avatar or status dot and a line to the next entry. | TimelineEventProps |
| `AvatarStack` | Free | Overlapping avatars with a “+N” count for everyone past the limit. | — |
| `AgendaEvent` | Free | One event in an agenda list, with its start and end time, a color bar, details and guests. | AgendaEventProps |

### Overlays

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Popover` | Free | A floating panel anchored to a trigger element. | PopoverClose, PopoverContent, PopoverTrigger |
| `EmojiPicker` | Free | A grid of selectable emoji, typically shown inside a Popover. | — |
| `Sheet` | Free | A panel that slides in from an edge of the screen — left, right, or bottom. | SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger |

### Charts

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `LineChart` (`@wunderui/react/charts`) | Pro | Line chart for trends over time: smooth lines (straight on request) and stepped lines, comparisons, bands, forecasts and thresholds, with tooltip, keyboard navigation and a data table. | LineChartBand, LineChartProps, LineChartVariant |
| `BarChart` (`@wunderui/react/charts`) | Pro | Bar chart for comparing values: grouped, horizontal, diverging, top-k and highlighted bars, with tooltip, keyboard navigation and a data table. | BarChartProps, BarChartVariant |
| `AreaChart` (`@wunderui/react/charts`) | Pro | Area chart for volumes over time: gradients, steps, ranges, a horizon graph, differences and target lines. | AreaChartProps, AreaChartVariant |
| `ComposedChart` (`@wunderui/react/charts`) | Pro | Bars, lines and areas in one plot, with an optional second value axis. | ComposedChartProps, ComposedChartVariant |
| `StackedChart` (`@wunderui/react/charts`) | Pro | Stacked chart for the parts of a total: stacked and 100 % columns, stacked areas, diverging Likert bars, Marimekko and gapped rows. | StackedChartProps, StackedChartVariant |
| `PieChart` (`@wunderui/react/charts`) | Pro | Pie and donut charts for shares of a whole: pies, donuts, half and nested rings, rose and polar bars, labelled and exploded pies. | PieChartProps, PieChartVariant |
| `RadialChart` (`@wunderui/react/charts`) | Pro | Radial chart for progress against a goal: radial bars, a stacked ring, a progress ring and activity rings. | RadialChartProps, RadialChartVariant |
| `GaugeChart` (`@wunderui/react/charts`) | Pro | Gauge for one value on its scale: semi-circle, speedometer, ring or segmented. The arc draws to the value and the number counts up. | GaugeChartProps, GaugeChartVariant |
| `RadarChart` (`@wunderui/react/charts`) | Pro | Radar chart for comparing profiles across several measures, on a polygon or circular grid. | RadarChartProps, RadarChartVariant |
| `FunnelChart` (`@wunderui/react/charts`) | Pro | Funnel chart for conversion between steps: trapezoid funnel and pyramid, bar funnels and KPI-column funnel areas, with the step conversion in the tooltip. | FunnelChartProps, FunnelChartVariant |
| `ProgressChart` (`@wunderui/react/charts`) | Pro | Progress chart for quotas and goals: meters, a segmented bar and a waffle. | ProgressChartProps, ProgressChartVariant |
| `BulletChart` (`@wunderui/react/charts`) | Pro | Bullet chart for a measure against its target and qualitative ranges — horizontal, vertical or as a KPI list. | BulletChartProps, BulletChartVariant |
| `Sparkline` (`@wunderui/react/charts`) | Pro | Small trend charts: KPI tiles, a metric list, a column strip and a win/loss strip, plus SparklineMini for tables and tiles. | SparklineMetric, SparklineMini, SparklineMiniProps, SparklineProps, SparklineVariant |
| `CandlestickChart` (`@wunderui/react/charts`) | Pro | Candlestick chart for prices: candles, hollow candles, OHLC bars, volume, moving averages, Heikin-Ashi, an order-book depth chart and Renko, on a right-hand price axis. | CandlestickChartProps, CandlestickChartVariant |
| `BubbleChart` (`@wunderui/react/charts`) | Pro | Scatter and bubble charts for the relation between two or three values: scatter, bubbles, dot plot, dot matrix, regression, quadrants, beeswarm and a connected scatter. | BubbleChartProps, BubbleChartVariant |
| `HeatmapChart` (`@wunderui/react/charts`) | Pro | Heatmap for values across two dimensions: a weekday × hour matrix, a contribution calendar, a punch card, labelled cells and a correlation matrix. | HeatmapChartProps, HeatmapChartVariant |
| `DistributionChart` (`@wunderui/react/charts`) | Pro | Distribution chart for raw observations: histograms, box plot, violin, density, ridgeline, strip plot and error bars. | DistributionChartProps, DistributionChartVariant |
| `WaterfallChart` (`@wunderui/react/charts`) | Pro | Waterfall chart for how a total changes: the start total, the changes that move it and the end total, in one indigo scale with a +/− sign on every change. | WaterfallChartProps, WaterfallChartVariant |
| `RangeBarChart` (`@wunderui/react/charts`) | Pro | Range bar chart for a span per category — minimum to maximum, planned against actual, as dumbbells or as gradient bars. | RangeBarChartProps, RangeBarChartVariant |
| `StatusTracker` (`@wunderui/react/charts`) | Pro | Status tracker for uptime and run history, plus StatusStripMini — the small strip for tables and lists. | StatusStripMini, StatusTrackerProps, StatusTrackerVariant |
| `SankeyChart` (`@wunderui/react/charts`) | Pro | Sankey chart for flows between stages: basic and gradient flows, a vertical sankey, an alluvial and a chord diagram. | SankeyChartProps, SankeyChartVariant |
| `NetworkChart` (`@wunderui/react/charts`) | Pro | Network chart for relations: a force graph, an arc diagram, a tree and a radial tree. | NetworkChartProps, NetworkChartVariant |
| `TreemapChart` (`@wunderui/react/charts`) | Pro | Treemap for the parts of a hierarchy: squarified, nested with group headers, or as an icicle. | TreemapChartProps, TreemapChartVariant |
| `SunburstChart` (`@wunderui/react/charts`) | Pro | Sunburst for a hierarchy as rings, or as circle packing. | SunburstChartProps, SunburstChartVariant |
| `RiverChart` (`@wunderui/react/charts`) | Pro | River chart (streamgraph) for how a mix changes over time: plain, with gradient bands or offset. | RiverChartProps, RiverChartVariant |
| `SlopeChart` (`@wunderui/react/charts`) | Pro | Slope chart for change between columns: slope, rank shift, bump chart, dumbbell and parallel coordinates. | SlopeChartProps, SlopeChartVariant |
| `TimelineChart` (`@wunderui/react/charts`) | Pro | Timeline chart: a Gantt chart with milestones and a Today line, and an event timeline. | TimelineChartProps, TimelineChartVariant |
| `ChartCard` | Pro | The card around a chart: title, optional headline value and trend, a period segment and legend chips above the plot. | — |

### Data Display

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `DataGrid` | Pro | A full-featured table: sort, search, select, resize columns, paginate. | DataGridColumn |
| `FilterMenu` | Pro | A filter button that opens a checklist of options with counts, an all-row and Clear filter — for table and list filters. | FilterMenuOption, FilterMenuProps |
| `DataTable` | Pro | A data table on TanStack Table: sort on several columns, filter from the column definitions, select rows with a floating action bar, expand, pin, page and export to CSV — with controlled state for server-side data. | DataTableBulkContext, DataTableColumnDef, DataTableColumnMeta, DataTableError, DataTableExpandedState, DataTableExportContext, DataTableFilter, DataTableFilterOption, DataTableFiltersState, DataTablePaginationState, DataTablePinningState, DataTableProps, DataTableQuery, DataTableSelectionState, DataTableServerSide, DataTableSortingState, DataTableState, DataTableUrlStateOptions, DataTableVisibilityState |
| `ListItem` | Pro | One list row: an icon tile, avatar, logo, flag, checkbox or date tile on the left, title and description in the middle, a value, badge, trend, button, switch or menu on the right. Comfortable or compact, with default, hover, selected and disabled states. | CoinLogo, CoinMark, IntegrationLogo, IntegrationMark, ListFlag, ListItemData, ListItemLeading, ListItemLeadingProps, ListItemProps, ListItems, ListItemsProps, ListItemTrailing, ListItemTrailingProps |
| `ListGroup` | Pro | A 400 px card of list rows with an optional header — sixteen ready patterns: basic, icon, avatar, brand, metric, selectable, toggle, sortable, expandable, grouped, ranking, comparison, tree, action, discussion and master–detail. | ListGroupActions, ListGroupActionsProps, ListGroupDetails, ListGroupDetailsProps, ListGroupDiscussion, ListGroupDiscussionProps, ListGroupExpandable, ListGroupExpandableItem, ListGroupExpandableProps, ListGroupHeader, ListGroupHeaderProps, ListGroupMasterDetail, ListGroupMasterDetailItem, ListGroupMasterDetailProps, ListGroupProps, ListGroupSection, ListGroupSectionProps, ListGroupSelectable, ListGroupSelectableItem, ListGroupSelectableProps, ListGroupSortable, ListGroupSortableItem, ListGroupSortableProps, ListGroupToggle, ListGroupToggleItem, ListGroupToggleProps, ListGroupTree, ListGroupTreeProps |
| `ListPanel` | Pro | A dashboard card with a titled list: 31 ready panels (transactions, orders, integrations, team, activity, crypto, timelines …) with loading, empty and error states, or your own rows. | ListPanelPreset, ListPanelProps, ListPanelSkeleton, ListPanelState, ListPanelVariant |

### KPI

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `StatCard` | Pro | A single metric with its change, as a card with a dot and delta, a plain card with a caption, or an inline value. | — |
| `KPIGroup` | Pro | A row of KPIs sharing one bordered container. | — |
| `MetricCard` | Pro | One number with its trend and, per variant, a sparkline, progress, breakdown, comparison, distribution, status, action or AI insight. | MetricBreakdown, MetricComparison, MetricDistribution, MetricDonut, MetricInsight, MetricLegend, MetricProgress, MetricSparkline, MetricStatus |
| `MetricGroup` | Pro | Several Metric Cards in one frame, divided by hairlines — the KPI row at the top of a dashboard. | — |

### Navigation

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `AppLayout` | Pro | The app shell: sticky navbar and sidebar over a scrolling page, aside, banner and footer, skip link, and a drawer below 64rem. | AppLayoutAsideTrigger, AppLayoutNavigationTrigger, AppLayoutProps |
| `Sidebar` | Pro | App navigation in six modes: docked, offcanvas, icon rail, rail with flyouts, double sidebar and overlay drawer. | DoubleSidebar, SidebarCta, SidebarGroup, SidebarHeading, SidebarItem, SidebarItemProps, SidebarNotification, SidebarSearch, SidebarSection, SidebarSwitchItem, SidebarUser, SidebarWorkspace |
| `Navbar` | Pro | The top bar in four scroll modes — static, sticky, hide on scroll, transparent — with mega menu, search, overflow and a mobile drawer. | BottomTabBar, MobileNav, NavbarLink, NavbarLinkProps, NavbarMenu, NavbarMenuLink, NavbarMode, NavbarProps, NavbarSearch, NavbarSearchField, NavbarSearchProps, NotificationBell, ThemeToggle, UserMenu |
| `Segment` | Pro | A single-select toggle group, like a compact tab bar, with a pill or a rounded-corner track. | SegmentOption, SegmentShape, SegmentSize |
| `Stepper` | Pro | A horizontal multi-step progress indicator with connectors. | StepperProps, StepperStep |
| `Command` | Pro | A searchable command palette dialog with keyboard navigation (⌘K pattern). | CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator |
| `ContextMenu` | Pro | Actions that open on right-click, styled like the dropdown menu. | ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger |

### Forms

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `NativeSelect` | Free | A full-width styled select trigger and popup list. | NativeSelectContent, NativeSelectItem, NativeSelectTrigger, NativeSelectValue |
| `InlineSelect` | Free | A compact select meant to sit inline within a sentence of text. | InlineSelectContent, InlineSelectItem, InlineSelectTrigger, InlineSelectValue |
| `CheckboxButtonGroup` | Free | A multi-select group of toggle-styled buttons. | — |
| `RadioButtonGroup` | Free | A single-select group of toggle-styled buttons. | — |
| `NumberStepper` | Free | A +/- increment control for a bounded numeric value. | — |
| `DropZone` | Free | A drag-and-drop file upload target with a click-to-browse fallback. | — |
| `RichTextEditor` | Free | A Tiptap-powered WYSIWYG editor with a formatting toolbar. | RichTextEditorProps, RichTextEditorSkeleton |
| `ColorPicker` | Free | Pick a colour: saturation and brightness, hue, opacity, eyedropper, HEX/RGB/HSL values and saved colours — inline or from a trigger field. | ColorPickerProps, ColorPickerTrigger |
| `CellColorPicker` | Free | A compact color swatch picker for inline use in a Data Grid cell. | — |
| `CellSlider` | Free | A compact progress/value slider for inline use in a Data Grid cell. | — |
| `CellSelect` | Free | A compact select for inline use in a Data Grid cell. | — |
| `CellSwitch` | Free | A compact switch for inline use in a Data Grid cell. | — |
| `SelectorItem` | Free | A list row pairing a leading icon/avatar and label/description with a trailing radio, checkbox, or switch. | SelectorItemGroup |
| `Label` | Free | An accessible label for a form control. | — |
| `Field` | Free | Labelling and validation for a single form control — label, description, and error message. | FieldControl, FieldDescription, FieldError, FieldLabel |
| `Fieldset` | Free | A native fieldset with a legend, for grouping related fields. | FieldsetLegend |
| `Form` | Free | A form wrapper that simplifies validation and submission. | — |
| `InputGroup` | Free | Groups an input with leading/trailing addons — icons, buttons, or text. | InputGroupAddon |
| `NumberField` | Free | A numeric input with increment/decrement buttons. | NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput |
| `OtpField` | Free | A segmented input for one-time passwords and verification codes. | OtpFieldInput |
| `Combobox` | Free | An input combined with a filterable list of predefined items to select. | ComboboxEmpty, ComboboxGroup, ComboboxGroupLabel, ComboboxInput, ComboboxInputGroup, ComboboxItem, ComboboxItemGroup, ComboboxList, ComboboxPopup, ComboboxPortal, ComboboxProps, ComboboxTrigger |
| `Autocomplete` | Free | An input that suggests options as you type. | AutocompleteEmpty, AutocompleteInput, AutocompleteInputGroup, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompletePortal |
| `Calendar` | Free | A month grid for picking one date or a range, with keyboard navigation and optional min, max and disabled days. | CalendarProps |
| `DatePicker` | Free | A Calendar inside a Popover, with Cancel/Apply actions. | DatePickerProps |
| `TextareaField` | Free | A multi-line text input with a label and helper or error text. | TextareaFieldProps |
| `CheckboxField` | Free | A checkbox with a clickable label and an optional description below it. | CheckboxFieldProps |
| `FormActions` | Free | The row of buttons at the end of a form, aligned right, left or spread to both edges. | — |

### AI

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `ChatMessage` | Pro | A single message bubble on the indigo tint, aligned right for the user and left for the assistant. | ChatConversation |
| `ChatMessageActions` | Pro | Copy / retry / thumbs up-down actions shown under an assistant message. | — |
| `ChatLoader` | Pro | A bouncing-dots indicator shown while the assistant is composing a reply. | — |
| `ChatAttachment` | Pro | A file chip attached to a chat message, with an optional remove button. | — |
| `ChatSource` | Pro | A citation chip linking to a source referenced in an answer. | — |
| `ChatTool` | Pro | A collapsible card showing a tool/function call's name, status, and result. | — |
| `ChainOfThought` | Pro | A collapsible list of the model's intermediate reasoning steps. | — |
| `CodeBlock` | Pro | A syntax-styled code block with a language label and copy button. | — |
| `Markdown` | Pro | Prose styling wrapper for rendered markdown/HTML assistant output. | — |
| `PromptInput` | Pro | An auto-resizing chat input with attach and send buttons. | — |
| `PromptSuggestion` | Pro | A pill-shaped suggested-prompt chip shown above an empty chat input. | — |
| `TextShimmer` | Pro | A shimmering-gradient text effect for a 'thinking...' loading label. | — |
| `ChatListView` | Pro | A sidebar list of past conversations with preview and timestamp. | — |

### Agents

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `AgentStatus` | Pro | A pill showing what a run is doing right now, with a live elapsed counter. | — |
| `ApprovalCard` | Pro | The human-in-the-loop gate: what the agent wants to do, how risky it is, approve or reject. | — |
| `RunTimeline` | Pro | Every step of a run in order, with duration, tokens and expandable input/output. | — |
| `CostMeter` | Pro | Spend against budget for a run, a day or a month — amber at 80%, red when it is gone. | — |
| `RunError` | Pro | A failed run: which step threw, how many attempts are left, retry or resume. | — |
| `AgentGrid` | Pro | The fleet view — every agent, its current status and how long it has been there. | — |
| `PlanStep` | Pro | One step of an agent plan: number or status icon, title, status in words and how long it took. | PlanStepDensity, PlanStepMeta, PlanStepStatus |
| `AgentPlan` | Pro | The agent's plan as a checklist: follow it live, edit it before the run, or group it into phases. | AgentPlanDraftStep, AgentPlanGroup, AgentPlanMode, AgentPlanStep |
| `PlanSummary` | Pro | A plan on one card before it runs: goal, steps, time, cost, tools and phases. | PlanSummaryPhase, PlanSummaryStat |
| `ActivityItem` | Pro | One line in a live activity stream: status, action, tool and elapsed time. | — |
| `LogStream` | Pro | A run's log with an All or Errors filter and auto-scroll. | — |
| `AgentLane` | Pro | One parallel worker: its status, queue, throughput and the tasks it holds. | AgentLaneStatus, AgentLaneTask |
| `DurationBar` | Pro | A step's share of the run as a bar, with a tick at the estimate and red when it runs over. | DurationBarTone |
| `DiffView` | Pro | The result of an edit tool call: file, added and removed lines, and the changed code. | — |
| `TerminalOutput` | Pro | The result of a code-execution tool call: command, exit code, run time, stdout and stderr. | — |
| `SearchResultCard` | Pro | One ranked result of a web-search tool call: source, relevance, title and snippet. | — |
| `ToolPermissionRow` | Pro | Whether an agent may call a tool: Allow, Ask or Deny, with the scope it covers. | — |
| `ExpiryTimer` | Pro | Countdown until an approval or permission request lapses — amber at the end, red once expired. | — |
| `ScopeList` | Pro | What an agent asks to access, one scope per row, with a countdown until the request lapses. | — |
| `UsageMeter` | Pro | One limit as a row: what is used, what is allowed, and a warning before it runs out. | — |
| `ContextMeter` | Pro | How full the model's context window is: a ring for the prompt toolbar or a bar with a breakdown. | — |
| `SlashCommandMenu` | Pro | The popover that opens when someone types / in the prompt: commands with a short description, filtered as they type. | — |
| `MentionPicker` | Pro | The @ picker for adding context to a prompt: files, people and channels in groups. | — |
| `ContextPill` | Pro | A removable chip for what the prompt refers to: a file, a person, a channel or a link. | — |
| `PromptModeSwitch` | Pro | What the agent may do with the next prompt — answer, act or edit — with the send keys underneath. | — |
| `ModelPicker` | Pro | The model chip in a prompt box: always clickable, it opens a popover to switch models. | — |
| `ModelSelect` | Pro | Pick the model and how hard it should think, with context size and price at a glance. | — |
| `VoiceInput` | Pro | Talk instead of typing: idle, listening with a live waveform and transcript, then transcribing. | — |
| `ArtifactPanel` | Pro | The side panel for what the agent made — code or a document — with versions, copy and download. | — |
| `SourceList` | Pro | Numbered sources pinned to a chat; citations like [1] in answers point here. | — |
| `AgentAvatar` | Pro | Who is talking in a multi-agent chat: tint colour, name and role. | — |
| `HandoffDivider` | Pro | Marks the moment one agent passes the conversation to another. | — |

### Feedback

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Alert` | Free | An inline banner in 5 colors and 2 sizes, with an optional close button and action. | AlertDescription, AlertTitle |
| `Toaster` | Free | A temporary notification that appears in the corner of the screen, with success/error/warning/info types. | ToastProvider, ToastViewport |
| `PullToRefresh` | Free | Drag down from the top of any content past a threshold to trigger an async refresh, with a rotating spinner and a rubber-band release. | — |
| `Rating` | Free | An interactive star rating input. | RatingCell, RatingLabel, RatingType |
| `NumberValue` | Free | A large number with its change beside it: caret up or down, green or red. | — |
| `TrendChip` | Free | A small pill showing a change, up or down, in seven icon styles. | TrendCaret, TrendChipIcon |
| `PressableFeedback` | Free | Wraps any content with a scale-down press animation. | — |
| `EmojiReactionButton` | Free | A toggleable emoji reaction with a count, like a Slack reaction. | — |

### Layout

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Resizable` | Pro | A two-pane layout with a draggable divider between them. | — |
| `ScrollArea` | Pro | A scrollable container with custom, always-styled scrollbars. | ScrollBar |

### Block Parts

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `PageHeader` | Pro | The title row at the top of a page or section, with an optional description, buttons or a text link. | PageHeaderProps |
| `KeyboardHint` | Pro | One or more key caps with a short label, for the shortcut legend at the bottom of a command menu. | — |
| `CommandItemRow` | Pro | One row in a command menu: an icon, a label, optional context and its shortcut keys. | CommandItemRowProps |
| `SearchResult` | Pro | A search hit with an icon, a title, a short excerpt and where it lives. | SearchResultProps |
| `NotificationItem` | Pro | One entry in a notification list, with an avatar or icon, the message, optional actions and an unread dot. | NotificationItemProps |
| `ChecklistTask` | Pro | One step of an onboarding checklist that can be ticked off, with the next step to do highlighted. | — |
| `ProjectCard` | Pro | A clickable project tile with a colored cover, a name and a short line of detail. | — |
| `FileCard` | Pro | A file tile with a preview, a name and details, plus optional selection, a menu and a deleted state. | FileCardProps |
| `StatusBar` | Pro | The phone status bar with the time, for the top of a mobile screen mockup. | — |
| `TabItem` | Pro | A single underlined tab that shows a count while it is active, used inside a Tab Bar. | TabItemProps |
| `TabBar` | Pro | A horizontal row of underlined tabs on a bottom border that scrolls sideways when space runs out. | — |
| `Price` | Pro | A price with an optional billing period, a crossed-out old price and a savings badge. | PriceProps |
| `TextLinkRow` | Pro | A line of text followed by a link, like “Don't have an account? Sign up”, or a back link with an arrow. | TextLinkRowProps |
| `SocialSignInButtons` | Pro | Sign-in buttons for Google, Apple, GitHub and Microsoft, side by side or stacked. | — |
| `OptionRow` | Pro | A selectable card with a radio button or checkbox, a title and a short description. | OptionRowProps |
| `OptionRowGroup` | Pro | Wraps radio Option Rows so that exactly one of them is selected. | — |
| `UserInfo` | Pro | An avatar with a name and a second line, for account menus, sidebars and quotes. | UserInfoProps |
| `PasswordRequirement` | Pro | One password rule in a checklist that turns green once the password meets it. | — |
| `PasswordStrength` | Pro | A four-step meter with a label that shows how strong a password is. | PasswordStrengthLevel |
| `OtpCodeInput` | Pro | Large boxes for typing a 4- or 6-digit verification code. | OtpCodeInputProps |
| `BackupCode` | Pro | A recovery code that copies itself when clicked and is crossed out once it has been used. | — |
| `InviteRow` | Pro | An email field and a role picker for inviting one person, with a button to remove the row. | InviteRowProps |
| `InviteLinkRow` | Pro | A read-only invite link with a copy button that confirms when the link is copied. | — |
| `SettingsRow` | Pro | A setting's title and description with a switch, or any other control, on the right. | SettingsRowProps |
| `InlineNote` | Pro | A small line of supporting text with an icon, either neutral or as a warning. | — |
| `AuthHeading` | Pro | The title and subtitle at the top of a sign-in, sign-up or onboarding form. | — |
| `KanbanCardItem` | Pro | A task card for a Kanban board, with labels, due date, comments, checklist progress and assignees. | — |
| `ColumnHeader` | Pro | The top of a Kanban column, with a colored dot, a card count and buttons to add a card or open a menu. | ColumnHeaderProps |
| `EventChip` | Pro | A small colored event label that fits in a calendar day cell. | — |
| `ConversationItem` | Pro | One conversation in an inbox list, with sender, subject, preview, tags and an unread state. | ConversationItemProps |
| `PersonCell` | Pro | An avatar with a name and role for tables and lists, with an optional capacity bar. | PersonCellProps |
| `TaskRow` | Pro | A row in a Gantt task list: either a task with its color, assignee and dates, or a group header that folds open and closed. | TaskRowProps |
| `RecordCard` | Pro | A card that stands in for a table row on small screens: who it is, a status and a few key fields. | RecordCardProps |
| `Stars` | Pro | A small, read-only row of stars that shows a rating. | — |
| `ProductImage` | Pro | A product photo, or a colored placeholder with an icon when there is no photo yet. | — |
| `ProductCard` | Pro | A shop tile with image, name, price and rating, plus optional wishlist and add-to-cart buttons. | ProductCardProps |
| `LineItem` | Pro | One product line in a cart or order summary, with image, variant, quantity and price. | LineItemProps |
| `ProductMiniCard` | Pro | A compact product row with a quick add button, for recommendations next to a cart. | — |
| `CheckoutSteps` | Pro | The numbered steps of a checkout, where finished steps can be clicked to go back. | — |
| `HistogramBar` | Pro | One row of a rating breakdown: the star level, a filled bar and its share. | — |
| `ReviewCard` | Pro | A customer review with author, rating, text, photos, a reply from the store and a helpful button. | ReviewCardProps |
| `PaymentMethods` | Pro | A row of small labels for the payment methods a shop accepts. | — |
| `TextField` | Pro | A text input with a label, helper or error text, and optional icons or add-ons on either side. | TextFieldProps |
| `PasswordField` | Pro | A password input with a button to show or hide what was typed. | — |

## Other exports

Exports of `@wunderui/react` that are not components of their own: hooks, providers, building blocks and utilities.

### Hooks

- `useAppLayout` (Pro) — Opens the navigation drawer and the side panel of the surrounding AppLayout. `useAppLayout(): AppLayoutState | null` · https://wunderui.com/hooks/use-app-layout
- `useChartAnimation` (Pro) — Legacy: the draw-in animation props for Recharts series, used by the legacy Recharts charts the templates still use. `useChartAnimation(animate?: boolean, appear?: ChartAppearState | undefined): { isAnimationActive: boolean; animationDuration: number; animationEasing: "ease-out"; animationBegin: number; }` · https://wunderui.com/hooks/use-chart-animation
- `useDataTableUrlState` (Pro) — Keeps the page, sorting, filters and search of a DataTable in the address bar. `useDataTableUrlState(options?: DataTableUrlStateOptions & { search?: string; }): { initialState: DataTableQuery; onQueryChange: (query: DataTableQuery) => void; }` · https://wunderui.com/hooks/use-data-table-url-state
- `useDensity` (Free) — Reads and changes the density of the nearest DensityProvider. `useDensity(): DensityContextValue` · https://wunderui.com/hooks/use-density
- `useInViewAppear` (Pro) — Plays a chart's appear sequence once, when the chart scrolls into view. `useInViewAppear<T>(animate?: boolean, ready?: boolean, threshold?: number): { ref: React.Dispatch<React.SetStateAction<T | null>>; state: ChartAppearState; }` · https://wunderui.com/hooks/use-in-view-appear
- `useMenuKeys` (Pro) — Arrow keys, Enter and Escape for a menu that opens from a text field. `useMenuKeys(count: number, options: { open: boolean; onEnter: (index: number) => void; onEscape?: () => void; }): { index: number; setIndex: React.Dispatch<React.SetStateAction<number>>; onKeyDown: (e: React.KeyboardEvent) => void; }` · https://wunderui.com/hooks/use-menu-keys
- `useRouteFocus` (Pro) — Moves focus to the new page heading after a client-side route change. `useRouteFocus<T>(routeKey: unknown): React.RefObject<T | null>` · https://wunderui.com/hooks/use-route-focus
- `useScrollSpy` (Free) — Tells which section of a page or a scroll container is being read. `useScrollSpy(ids: string[], root?: React.RefObject<HTMLElement | null> | undefined, enabled?: boolean): readonly [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]` · https://wunderui.com/hooks/use-scroll-spy
- `useToast` (Free) — Shows, updates and closes toasts from anywhere below a Toaster. `useToast<Data>(): UseToastManagerReturnValue<Data>` · https://wunderui.com/hooks/use-toast
- `useAnimatedNumber` from `@wunderui/react/charts` (Pro) — A number that counts from its previous value to the new one, for chart headlines and KPI values. `useAnimatedNumber(value: number | null | undefined, token?: string): number | null` · https://wunderui.com/hooks/use-animated-number
- `useChartInteraction` from `@wunderui/react/charts` (Pro) — Pointer and keyboard behaviour of a chart: the active point, arrow keys, range selection and the live announcement. `useChartInteraction(o: ChartInteractionOptions): { active: number | null; range: ChartRange | null; announcement: string; handlers: { onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void; onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void; onPointerDown: (e: React.Poin…` · https://wunderui.com/hooks/use-chart-interaction
- `useChartLegend` from `@wunderui/react/charts` (Pro) — Keeps track of which series a chart legend has switched off. `useChartLegend(series: readonly ChartSeries[], initialHidden?: readonly string[]): { hidden: string[]; toggle: (key: string) => void; items: ChartLegendItem[]; }` · https://wunderui.com/hooks/use-chart-legend
- `useChartReload` from `@wunderui/react/charts` (Pro) — Drives the reload button of a chart card: loading skeleton, your task, then the chart draws in again. `useChartReload(): ChartReload` · https://wunderui.com/hooks/use-chart-reload
- `useChartWidth` from `@wunderui/react/charts` (Pro) — Width of a box, measured before the first paint and kept current with a ResizeObserver.
- `useGlide` from `@wunderui/react/charts` (Pro) — Lets hover marks glide from point to point and fade out in place, instead of jumping or vanishing. `useGlide(active: number | null): Glide` · https://wunderui.com/hooks/use-glide
- `useLoadPhase` from `@wunderui/react/charts` (Pro) — The phase of the surrounding load sequence (null when there is none).
- `useLoadSequence` from `@wunderui/react/charts` (Pro) — Opens every dashboard page the same way: the cards build up top to bottom, then numbers roll, charts draw in and bars fill — with skeletons first only when the data takes longer. `useLoadSequence(ref: React.RefObject<HTMLElement | null>, options?: LoadSequenceOptions): LoadPhase` · https://wunderui.com/hooks/use-load-sequence
- `usePrefersReducedMotion` from `@wunderui/react/charts` (Pro) — True when the visitor asked for reduced motion (read once on mount).

### Providers

- `Density` (Free) — Sets a density for one region: everything inside renders at that density, the rest of the page keeps its own.
- `DensityProvider` (Free) — Applies a density to the whole document (`data-density` on `<html>`), keeps it in localStorage and hands it to `useDensity()`.
- `ThemeProvider` (Free)

### Building blocks

- `AreaChart` (Pro)
- `BarChart` (Pro)
- `BubbleChart` (Pro)
- `CandlestickChart` (Pro)
- `ChartEdgeTick` (Pro) — X-axis tick for point charts (line, area).
- `ChartLegendContent` (Pro)
- `ChartResponsiveContainer` (Pro) — ResponsiveContainer that knows its size in its first frame.
- `ChartSkeleton` (Pro)
- `ChartTooltipContent` (Pro)
- `ColumnChart` (Pro)
- `ComposedChart` (Pro)
- `FunnelChart` (Pro) — Figma ❖ Charts · Funnel Chart: the stage columns with their values sit above a solid area that shows the drop-off between them — the text never covers the series; hairlines run from the columns down through the chart, the y-axis reads 0…60…
- `Gauge` (Pro) — Gauge: one value against its limit on a half circle — a muted track, the value arc, tick marks and a needle that swings in with a spring.
- `Heatmap` (Pro) — Heatmap: a grid of rounded cells whose shade says how much happened — commits per day, sign-ups per hour, load per region.
- `LineChart` (Pro)
- `ListCard` (Pro)
- `LogoLoader` (Pro)
- `PieChart` (Pro)
- `RadarChart` (Pro)
- `RadialChart` (Pro)
- `RadialGauge` (Pro) — Figma ❖ Charts · Radial Gauge (half radial chart): a half ring split into segments, open at the bottom, with the legend rows underneath.
- `Sparkline` (Pro) — Figma Sparkline: a tiny trend line without axes for table cells ("Last 7 days"), price cards and metric tiles.
- `StatusStrip` (Pro) — Status Strip: the row of day bars from a status page — one equal-width bar per day (or hour, or deploy), green when all was well, amber when degraded, red for an outage.
- `AnimatedNumber` from `@wunderui/react/charts` (Pro) — A number that counts to its new value; `format` renders it (tabular figures).
- `CartesianShell` from `@wunderui/react/charts` (Pro) — Layout, axes, states and interaction of every cartesian chart.
- `ChartAxisCategoryY` from `@wunderui/react/charts` (Pro) — Category labels left of a horizontal chart's rows, right-aligned; the hovered one in a gliding pill.
- `ChartAxisValueX` from `@wunderui/react/charts` (Pro) — Value labels under a horizontal chart's vertical grid.
- `ChartAxisX` from `@wunderui/react/charts` (Pro) — Category labels centred under their bands, thinned to every k-th one when the plot is too narrow.
- `ChartAxisY` from `@wunderui/react/charts` (Pro) — Value labels, right-aligned and vertically centred on their grid lines (owner rule).
- `ChartCard` from `@wunderui/react/charts` (Pro) — Card wrapper of the new chart system, measured from the Figma chart cards.
- `ChartDataTable` from `@wunderui/react/charts` (Pro) — The table alternative of a chart: the same rows and series as the plot.
- `ChartFrame` from `@wunderui/react/charts` (Pro) — The shell every chart renders into: a `figure` that measures its width, a focusable plot (`role="group"`, arrow keys handled by the chart) holding an SVG with `role="img"` and a generated summary, a live region for keyboard navigation, the…
- `ChartGrid` from `@wunderui/react/charts` (Pro) — Horizontal grid lines, one per value tick.
- `ChartGridVertical` from `@wunderui/react/charts` (Pro) — Vertical grid lines for horizontal (value-on-x) charts.
- `ChartLegend` from `@wunderui/react/charts` (Pro) — The legend badges of the Figma chart cards: white badge, control rim, a dot in the series colour.
- `ChartMessage` from `@wunderui/react/charts` (Pro) — Message in the middle of the plot for the empty and error states.
- `ChartShimmer` from `@wunderui/react/charts` (Pro) — The shared skeleton sweep (same as Skeleton: `animate-shimmer`, off for reduced motion) laid over the plot while it loads.
- `ChartSkeleton` from `@wunderui/react/charts` (Pro) — Loading placeholder in the shape of the chart (Figma State – Loading): a muted area for line charts, muted columns or rows for bar charts.
- `ChartTooltip` from `@wunderui/react/charts` (Pro) — The tooltip card of the Figma states (Hover): title with an optional delta chip, then one row per series — dot, label, value.
- `GlideGroup` from `@wunderui/react/charts` (Pro) — An SVG group placed by a CSS transform that glides to its new position (duration-slow, ease-entrance) and fades in and out.
- `LoadSequenceContext` from `@wunderui/react/charts` (Pro) — The phase of the load sequence around this element; null outside one.
- `NumberRoll` from `@wunderui/react/charts` (Pro) — A number that rolls in like an odometer: each digit column rolls up and settles on its value, left to right, a short blur while moving.
- `PolarShell` from `@wunderui/react/charts` (Pro) — Shell of the radial charts — the polar twin of CartesianShell: size, states (skeleton ring/pie, empty, error), 2-D hover with the gliding tooltip, keyboard walk over the slices, live region, data table and the enter sequence (marks remount…

### Utilities

- `ACTIVITY_CONFIG` (Pro)
- `AGENT_STATUS_CONFIG` (Pro)
- `BADGE_COLORS` (Free)
- `CHART_COLORS` (Pro)
- `COINS` (Pro) — Name and ticker of each coin.
- `COIN_SYMBOLS` (Pro) — The 30 most popular coins, in market order (owner list, Oct 21 2026).
- `DENSITY_STORAGE_KEY` (Free)
- `EVENT_BAR` (Pro)
- `EVENT_TINT` (Pro)
- `INTEGRATIONS` (Pro) — Name, category and one-line description of each integration (owner list, Oct 21 2026).
- `INTEGRATION_NAMES` (Pro)
- `LIST_FLAG_COUNTRIES` (Pro) — ISO 3166 codes (lower case) that ListFlag can draw.
- `LIST_PANEL_PRESETS` (Pro)
- `LIST_PANEL_VARIANTS` (Pro)
- `PLAN_STEP_CONFIG` (Pro)
- `TABLE_ACTION_ICONS` (Free) — The default icon set for ActionIconsCell — edit, delete, view.
- `TINT` (Pro)
- `TINT_BG` (Pro)
- `badgeVariants` (Free)
- `buttonVariants` (Free)
- `chartAxisTickStyle` (Pro) — Axis ticks on both axes: Figma Caption/Regular (12 px).
- `chartColor` (Pro)
- `chartCurve` (Pro)
- `chartXAxisTickStyle` (Pro) — Category / time axis labels — same Caption/Regular as the value axis.
- `compactNumber` (Pro) — 42000 → "42k", 1500000 → "1.5M"; smaller numbers stay as they are.
- `createDataTableColumnHelper` (Pro) — Typed column helper: `const column = createDataTableColumnHelper<Invoice>()`, then `column.accessor("customer", { header: "Customer", meta: { filter: { type: "text" } } })`.
- `dataTableToCsv` (Pro) — Rows joined with CRLF, as RFC 4180 asks.
- `datePickerPresets` (Free) — The quick ranges of the Figma Date Picker · Type=presets sidebar.
- `densityScript` (Free) — Inline script for the document `<head>` that applies a stored density before the first paint, so a page persisted as `comfortable` never renders compact first.
- `downloadDataTableCsv` (Pro) — Saves a CSV string as a file.
- `filterCommands` (Pro)
- `focusWithoutObscuring` (Pro) — Focus an element without letting a sticky header hide it (WCAG 2.4.11): focus without the browser's own scroll, then scroll it to the middle.
- `formatCompact` (Pro) — 420000 → "420k", 1_020_000 → "1.02M" — the short form used in the Figma meters.
- `getPasswordStrength` (Pro) — Derive a strength level from a raw password — length + character classes.
- `iconButtonVariants` (Free)
- `inputVariants` (Free)
- `moveCard` (Pro)
- `parseDataTableQuery` (Pro) — Reads the query from a query string or URLSearchParams.
- `serializeDataTableQuery` (Pro) — The query as a query string (no leading "?").
- `skeletonVariants` (Free)
- `tabsListVariants` (Free) — Two looks, both straight from the Figma Tab Bar page, horizontal or — with `orientation="vertical"` on Tabs — stacked as a side navigation next to the panel: - `default` is the "Tab Button" row — every tab is its own bordered button and th…
- `textareaVariants` (Free)
- `toggleVariants` (Free)
- `AREA_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 14 Area Chart variants of the Figma catalogue (names in kebab-case).
- `BAR_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 23 Bar Chart variants of the Figma catalogue (names in kebab-case).
- `BAR_GAP` from `@wunderui/react/charts` (Pro)
- `BAR_RADIUS` from `@wunderui/react/charts` (Pro) — One radius for every bar of the chart system (owner rule, Oct 21 2026): columns, horizontal bars, stacked and segmented parts, tracks, progress fills, bullets, waterfall and range bars, mini bars — all squared-rounded with the same radius,…
- `BUBBLE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 8 Bubble Chart variants of the Figma catalogue (names in kebab-case).
- `BULLET_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 3 Bullet Chart variants of the Figma catalogue (names in kebab-case).
- `CANDLESTICK_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 8 Candlestick Chart variants of the Figma catalogue (names in kebab-case).
- `CHART_CARD_GAP` from `@wunderui/react/charts` (Pro)
- `CHART_CARD_PADDING` from `@wunderui/react/charts` (Pro) — One inset for every chart card (owner, Oct 21 2026, measured from the Status Strip card): 20 px on all four sides at every width, 16 px between header, filter row, plot and footer.
- `CHART_PALETTE` from `@wunderui/react/charts` (Pro) — The Figma chart palette (ind, blu, pur, grn, org, pnk, yel, red, gry) mapped onto WunderUI tokens: the five chart tokens first, then the primitives the Figma cards bind for the remaining hues.
- `CHART_SERIES_ORDER` from `@wunderui/react/charts` (Pro) — Default order when a series has no colour: indigo leads, cool neighbours follow.
- `COMPOSED_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Composed Chart variants of the Figma catalogue (names in kebab-case).
- `DISTRIBUTION_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 9 Distribution Chart variants of the Figma catalogue (names in kebab-case).
- `FUNNEL_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 19 Funnel Chart variants of the Figma catalogue (names in kebab-case).
- `FUNNEL_HEADROOM` from `@wunderui/react/charts` (Pro) — Space between the highest point of a funnel area and the top of its plot (under the KPI header).
- `GAUGE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Gauge variants of the Figma catalogue (names in kebab-case).
- `HEATMAP_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 5 Heatmap variants of the Figma catalogue (names in kebab-case).
- `HOVER_TEXT` from `@wunderui/react/charts` (Pro) — Text on a hovered (two steps lighter) fill: the near-black token reads on every step in both themes.
- `LINE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 21 Line Chart variants of the Figma catalogue (names in kebab-case).
- `LOAD_SKELETON_DELAY` from `@wunderui/react/charts` (Pro) — How long the data may take before the skeletons show (ms).
- `LOAD_SKELETON_MIN` from `@wunderui/react/charts` (Pro) — Once the skeletons show, they stay at least this long (ms), so they never flash.
- `NETWORK_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Network Chart variants of the Figma catalogue (names in kebab-case).
- `PIE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 15 Pie Chart variants of the Figma catalogue (names in kebab-case).
- `PLOT` from `@wunderui/react/charts` (Pro) — Plot frame: Figma large card (1416 × 434), tightened after the owner review (Oct 21 2026) — grid 12 px from the top, x labels 22 px below it.
- `PROGRESS_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 3 Progress Chart variants of the Figma catalogue (names in kebab-case).
- `RADAR_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 5 Radar Chart variants of the Figma catalogue (names in kebab-case).
- `RADIAL_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Radial Chart variants of the Figma catalogue (names in kebab-case).
- `RANGE_BAR_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Range Bar Chart variants of the Figma catalogue (names in kebab-case).
- `RIVER_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 3 River Chart variants of the Figma catalogue (names in kebab-case).
- `SANKEY_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 5 Sankey Chart variants of the Figma catalogue (names in kebab-case).
- `SLOPE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 5 Slope Chart variants of the Figma catalogue (names in kebab-case).
- `SPARKLINE_VARIANTS` from `@wunderui/react/charts` (Pro) — The 4 Sparkline variants of the Figma catalogue (names in kebab-case).
- `STACKED_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 9 Stacked Chart variants of the Figma catalogue (names in kebab-case).
- `STATUS_TRACKER_VARIANTS` from `@wunderui/react/charts` (Pro) — The 2 Status Tracker variants of the Figma catalogue (names in kebab-case).
- `SUNBURST_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 2 Sunburst variants of the Figma catalogue (names in kebab-case).
- `TIMELINE_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 2 Timeline Chart variants of the Figma catalogue (names in kebab-case).
- `TREEMAP_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 3 Treemap variants of the Figma catalogue (names in kebab-case).
- `WATERFALL_CHART_VARIANTS` from `@wunderui/react/charts` (Pro) — The 3 Waterfall Chart variants of the Figma catalogue (names in kebab-case).
- `WATERFALL_COLORS` from `@wunderui/react/charts` (Pro) — The three roles of a waterfall (styles.css `--chart-waterfall-*`, light and dark); legends use the same tokens.
- `barPath` from `@wunderui/react/charts` (Pro) — Bar outline with BAR_RADIUS on all four corners (clamped for tiny bars).
- `barRx` from `@wunderui/react/charts` (Pro) — rx for SVG rects that are bars (tracks, cells, skeleton bars): the same BAR_RADIUS, clamped.
- `categoryScale` from `@wunderui/react/charts` (Pro) — d3 band scale without padding: the Figma cards place category `i` at x0 + (i + 0.5) · width / n, and bars are sized from the bandwidth.
- `chartLegendItems` from `@wunderui/react/charts` (Pro) — Legend items straight from a chart's series.
- `describeSeries` from `@wunderui/react/charts` (Pro) — Short, generated description of a cartesian chart for screen readers.
- `enterStyle` from `@wunderui/react/charts` (Pro) — Inline style for one element of the enter sequence: `i` staggers it (0 = first).
- `estimateTextWidth` from `@wunderui/react/charts` (Pro) — Caption/Regular (12 px Inter): an estimate good enough to keep labels apart.
- `fitText` from `@wunderui/react/charts` (Pro) — Shortens a label with an ellipsis so it fits `room` px ("" when not even one letter fits).
- `formatCompact` from `@wunderui/react/charts` (Pro) — 42000 → "42k", 1500000 → "1.5M", 0 → "0"; smaller numbers keep one decimal at most.
- `groupColors` from `@wunderui/react/charts` (Pro) — Colour per top-level group (palette order, or the group's own colour).
- `hierarchyRows` from `@wunderui/react/charts` (Pro) — Leaves (or every node) of a hierarchy as rows: label, value, top-level group.
- `hoverColor` from `@wunderui/react/charts` (Pro)
- `labelOn` from `@wunderui/react/charts` (Pro) — Text colour for a label drawn on a chart fill: white or near-black, whichever has the higher contrast (≥ 4.5:1) on that fill at that opacity over the card, in light and dark (variables `--chart-on-<token>-<opacity>` in styles.css).
- `labelStride` from `@wunderui/react/charts` (Pro) — Every k-th label so neighbouring labels keep at least `gap` px between them.
- `lineColor` from `@wunderui/react/charts` (Pro) — The colour for a line, a point or a thin stroke of a series (see LINE_COLORS); fills keep `resolveChartColor`.
- `loadDelays` from `@wunderui/react/charts` (Pro) — When each card appears, in ms after the page starts building, for the slots of `readingOrder`: strictly top to bottom — a row starts 40 ms after the last card of the row above, the cards of a row follow each other 25 ms apart — capped at 4…
- `logDomain` from `@wunderui/react/charts` (Pro) — Log axis: whole decades from the smallest positive value to the largest.
- `niceDomain` from `@wunderui/react/charts` (Pro) — The value axis of the Figma cards: a fixed number of equal intervals (default 6 → 7 grid lines), always including 0, so the grid starts at the lowest value and every bar or area stands on the bottom grid line (owner rules, Sep 25 2026).
- `prefersReducedMotion` from `@wunderui/react/charts` (Pro)
- `readDuration` from `@wunderui/react/charts` (Pro) — Reads a duration token (e.g.
- `readingOrder` from `@wunderui/react/charts` (Pro) — Reading order of a set of boxes (their top-left corners in px): rows top to bottom — a box whose top lies within `tolerance` of the row's first box joins that row — and left to right inside a row.
- `resolveChartColor` from `@wunderui/react/charts` (Pro)
- `seriesColor` from `@wunderui/react/charts` (Pro)
- `seriesLabel` from `@wunderui/react/charts` (Pro)
- `splitNumberRoll` from `@wunderui/react/charts` (Pro) — Splits a formatted value ("$48,200", "3.4h", "+12.5%", "1.2M") into the parts NumberRoll draws: digits roll (one full turn plus their value, so every column moves), everything else — signs, currency, separators, units — stays put.
- `spreadLabels` from `@wunderui/react/charts` (Pro) — Moves label positions apart so neighbours keep `gap` px (order kept, nulls skipped, clamped to [min, max]).
- `svgId` from `@wunderui/react/charts` (Pro) — SVG-safe id fragment from React.useId().
- `toNumber` from `@wunderui/react/charts` (Pro) — A finite number or null (null = gap: missing, NaN, Infinity, non-numeric).
- `valueScale` from `@wunderui/react/charts` (Pro) — d3 linear (or log) scale from the value domain onto pixel range [from → to].

## Reference

Every component with its usage example, the prop signature from the build and its props table (`*` = required).

#### Accordion

A vertically stacked set of collapsible panels, in card or divider style.

```tsx
<Accordion className="gap-0">
  <AccordionItem value="profile" variant="divider">
    <AccordionTrigger icon={<User />} iconVariant="plain" indicatorVariant="plus">
      Profile Settings
    </AccordionTrigger>
    <AccordionContent>Name, avatar and the handle other people see.</AccordionContent>
  </AccordionItem>
</Accordion>
```

```ts
function Accordion({ className, ...props }: Accordion.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `AccordionValue<Value>` | — |
| `disabled` | `boolean` | `false` |
| `hiddenUntilFound` | `boolean` | `false` |
| `keepMounted` | `boolean` | `false` |
| `loopFocus` | `boolean` | — |
| `multiple` | `boolean` | `false` |
| `onValueChange` | `((value: AccordionValue<Value>, eventDetails: AccordionRootChangeEventDetails) => void)` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'vertical'` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `AccordionValue<Value>` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Accordion` (`data-slot="accordion"`): Holds which items are open. Opening one item closes the open one unless you set `multiple`.
- `AccordionItem` (`data-slot="accordion-item"`): One section, framed as a bordered `card` (the default) or as a `divider` row with a line above and below.
- `AccordionTrigger` (`data-slot="accordion-trigger"`): The header row, a `<button>` with `aria-expanded`. It takes an optional leading `icon` and a `button`, `plus` or `chevron` indicator.
- `AccordionContent` (`data-slot="accordion-content"`): The panel under the trigger. It opens on a grid-row transition, and its text lines up with the trigger label.

Best practices:

- **When:** Use an Accordion for a list of sections people read one at a time, such as an FAQ or grouped settings. For a single show-more panel, use Collapsible; for views of one object, use Tabs.
- **Do:** Keep one `variant` per list: `card` items for a stand-alone list, `divider` items inside a surface that already has a frame.
- **Do:** Set `multiple` on `Accordion` when people compare answers. By default, opening one item closes the one that was open.
- **Do:** Write the trigger as the question or the section name in sentence case: `How do refunds work?`. It is the button's accessible name.
- **Don't:** Don't put buttons or links inside `AccordionTrigger`. The whole row is already a `<button>`, and a control nested in it is not reliably reachable by keyboard.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-secondary`, `--radius-lg`, `--radius-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-move`.

#### Avatar

A user or entity's profile image with a text fallback.

```tsx
<Avatar size="lg">
  <AvatarImage src="/avatars/03.png" alt="Alina Lorenz" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>
<Avatar size="lg" variant="primary">
  <AvatarFallback>PM</AvatarFallback>
</Avatar>
```

```ts
function Avatar({ className, size, shape, variant, color, ...props }: Avatar.Root.Props & {
    /** Figma Avatar sizes: sm = 24px (2xs), xs = 28px, default = 36px (small), lg = 40px (medium), xl = 44px (large) */
    size?: "sm" | "xs" | "default" | "lg" | "xl";
    shape?: "circle" | "square";
    variant?: "plain" | "primary";
    /** Soft tint for initials avatars; ignored when an image renders. */
    color?: AvatarColor;
}): React.JSX.Element;
type AvatarColor = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative" | "grey";
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey"` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `shape` | `"circle" \| "square"` | `"circle"` |
| `size` | `"sm" \| "xs" \| "default" \| "lg" \| "xl"` | `"default"` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `variant` | `"plain" \| "primary"` | `"plain"` |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Avatar` (`data-slot="avatar"`): The round or square frame in five sizes from `sm` to `xl`. Set `color` for tinted initials or `variant="primary"` for a filled one.
- `AvatarImage` (`data-slot="avatar-image"`) — optional: The photo. It shows once it has loaded; until then, or when the URL fails, the fallback stays in its place.
- `AvatarFallback` (`data-slot="avatar-fallback"`): Initials or an icon, shown while the image loads or when there is none. The text size follows the avatar size.
- `AvatarBadge` (`data-slot="avatar-badge"`) — optional: A status dot at the bottom corner: inside the edge of a circle, on the corner of a square. Its icon hides on the two smallest sizes.

Best practices:

- **When:** Use an Avatar to show who a person or workspace is, next to their name. For several people in little space, use Avatar Group or Avatar Stack.
- **Do:** Always add an `AvatarFallback` with initials, also when there is an image. It covers the moment before the photo loads and a broken image URL.
- **Do:** Give `AvatarImage` the person's name as `alt` when the avatar stands alone, and `alt=""` when the name is printed right beside it.
- **Do:** Use `color` for initials avatars and keep the same hue per person. The tints are theme tokens, so the initials stay readable in dark mode.
- **Don't:** Don't resize an avatar with classes like `size-12`. Pick `size` (`sm`, `xs`, `default`, `lg`, `xl`): initials, icon and badge scale with it.

Theming: reads `--background`, `--border-control`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--text-secondary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-md`.

#### AvatarGroup

A stack of overlapping avatars, with an optional overflow count.

```tsx
<AvatarGroup>
  <Avatar><AvatarImage src="/avatars/01.png" alt="Alina" /><AvatarFallback>AL</AvatarFallback></Avatar>
  <Avatar><AvatarImage src="/avatars/08.png" alt="Mira" /><AvatarFallback>MC</AvatarFallback></Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
```

```ts
function AvatarGroup({ className, children, ...props }: React.ComponentProps<"div">): React.JSX.Element;
```

Anatomy:

- `AvatarGroup` (`data-slot="avatar-group"`): Overlaps its avatars and rings each one in the surface colour. Hovering one lifts it and nudges its neighbours, except with reduced motion.
- `Avatar`: Each person, an Avatar with an image or initials. All avatars in one group share the same `size`.
- `AvatarGroupCount` (`data-slot="avatar-group-count"`) — optional: The `+N` circle at the end for everyone not shown. It takes the size of the avatars in the group.

Best practices:

- **When:** Use an Avatar Group to show who is on a project or document, composing each avatar yourself. For people passed as data with a built-in limit, use Avatar Stack.
- **Do:** Cut the list yourself and put the rest in `AvatarGroupCount` as `+12`. The group renders every child it gets; it does not count or hide anyone.
- **Do:** Place the group on a surface that sets `--surface`, such as a Card. The rings take that colour, so each avatar reads as cut out of the background.
- **Don't:** Don't mix avatar sizes in one group. The overlap and the size of the count circle assume one `size` for every avatar.

Theming: reads `--background`, `--muted`, `--text-secondary`, `--duration-slow`, `--ease-entrance`, `--ease-overshoot`.

#### Badge

A small status or category label in 12 colors and 6 styles.

```tsx
<Badge color="green" badgeStyle="light">Active</Badge>
```

```ts
function Badge({ className, shape, color, badgeStyle, style, render, ...props }: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
    color?: BadgeColor;
    badgeStyle?: BadgeStyle;
}): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
type BadgeColor = keyof typeof BADGE_COLORS;
type BadgeStyle = "plain" | "light" | "light_border" | "border_color" | "border_grey" | "ghost";
```

| Prop | Type | Default |
| --- | --- | --- |
| `badgeStyle` | `"plain" \| "light" \| "light_border" \| "border_color" \| "border_grey" \| "ghost"` | `"plain"` |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey" \| "black" \| "white"` | `"blue"` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `shape` | `"rounded" \| "pill"` | `"rounded"` |

Also accepts the React.HTMLAttributes attributes (279).

Anatomy:

- `Badge`: A short label in one of 12 `color`s and 6 `badgeStyle`s. Rendered as a `<button>` or `<a>`, it gains hover, focus and press states.
- `BadgeCell` — optional: A Badge for a table cell, made from a `label` string, with the `light_border` style by default.

Best practices:

- **When:** Use a Badge for a short status or category on a row or card: `Paid`, `Draft`, `Beta`. For a change in a number, use Trend Chip; for a message people need to read, use Alert.
- **Do:** Give each status one `color` and keep it wherever that status appears. Write the status in the label too, so colour is never the only cue.
- **Do:** Use `light` or `light_border` in tables and lists and keep the solid `plain` style for the one badge that should stand out. `BadgeCell` already uses `light_border`.
- **Do:** Pass `render={<button />}` when the badge does something, such as removing a filter. Only a `<button>` or `<a>` gets the pointer, the hover ring and the focus ring.
- **Don't:** Don't recolour a badge with classes or hex values. Every `color` and `badgeStyle` pair is measured for AA contrast in light and dark mode.

Theming: reads `--border`, `--card`, `--dark-200`, `--dark-300`, `--foreground`, `--light-300`, `--muted`, `--ring`, `--text-tertiary`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### Breadcrumb

Shows the user's location in a hierarchy, in the `plain`, `border` or `underline` style.

```tsx
import { Home } from "lucide-react"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/"><Home /></BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

```ts
function Breadcrumb({ variant, ...props }: React.ComponentProps<"nav"> & {
    variant?: BreadcrumbVariant;
}): React.JSX.Element;
type BreadcrumbVariant = "plain" | "border" | "underline";
```

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"plain" \| "border" \| "underline"` | `"plain"` |

Also accepts the React.HTMLAttributes attributes (280).

Anatomy:

- `Breadcrumb` (`data-slot="breadcrumb"`): The `<nav>` landmark named `breadcrumb`. Its `variant` sets the look of every part: `plain`, `border` or `underline`.
- `BreadcrumbList` (`data-slot="breadcrumb-list"`): The ordered list `<ol>` of items and separators. It wraps onto a second line when the trail runs out of room.
- `BreadcrumbItem` (`data-slot="breadcrumb-item"`): One step of the trail, an `<li>` holding a link or, at the end, the current page.
- `BreadcrumbLink` (`data-slot="breadcrumb-link"`) — optional: A level above the current page, as a plain `<a>` that takes `href`. It can hold an icon before the text.
- `BreadcrumbSeparator` (`data-slot="breadcrumb-separator"`): An `<li>` between two items, hidden from screen readers. It shows a chevron unless you pass your own icon as children.
- `BreadcrumbPage` (`data-slot="breadcrumb-page"`): The current page as text, not a link, marked with `aria-current="page"`.

Best practices:

- **When:** Use a Breadcrumb on nested pages, such as one project's settings, so people see where they are and can step back up. For switching between sibling views, use Tabs.
- **Do:** End the trail with `BreadcrumbPage`, not a link. It carries `aria-current="page"`, so screen readers announce where the person is.
- **Do:** Put a `BreadcrumbSeparator` between items yourself; the list does not add them. Each one sits in its own `<li>` and is hidden from assistive technology.
- **Don't:** Don't link the current page or set `aria-current` on a link by hand. `BreadcrumbPage` already marks the last step and is not clickable.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--text-tertiary`, `--radius-lg`, `--duration-fast`, `--ease-move`.

#### Button

The main action trigger, in 10 variants, 2 shapes and 5 sizes.

```tsx
import { Button } from "@wunderui/react"
import { Plus } from "lucide-react"

// Solid, WCAG AA-safe blue button — the default call to action
<Button variant="primary" size="md">
  <Plus /> Add item
</Button>
```

```ts
function Button({ className, variant, shape, size, ...props }: Button.Props & VariantProps<typeof buttonVariants>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `focusableWhenDisabled` | `boolean` | `false` |
| `nativeButton` | `boolean` | `true` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `shape` | `"rounded" \| "pill"` | `"rounded"` |
| `size` | `"sm" \| "lg" \| "xl" \| "md" \| "2xl"` | `"md"` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `variant` | `"link" \| "plain" \| "gradient" \| "outline" \| "primary" \| "destructive" \| "light" \| "ghost" \| "brand" \| "dark" \| "tint"` | `"primary"` |

Also accepts the React.ButtonHTMLAttributes attributes (285).

Anatomy:

- `Button` (`data-slot="button"`): The clickable element: a native `<button>` with the label and an optional icon before or after it.
- `ButtonCell` — optional: A small `plain` button sized for a table cell, for a secondary action in a row.

Best practices:

- **When:** Use a Button for an action on the current page: save, send, open a dialog. A move to another page is a link: pass `render={<a href=… />}` together with `nativeButton={false}`.
- **Do:** Give each view one `primary` button for its main action. Every other action is `plain` or a link.
- **Do:** Label it with a verb and its object: `Save changes`, `Invite member`. A destructive button repeats the action; the button next to it says `Cancel`.
- **Don't:** Don't use `outline` for ordinary secondary actions. In WunderUI the secondary button is `plain`; `outline` is the indigo-rimmed accent for the rare case that needs one.
- **Don't:** Don't set heights or paddings by hand (`h-9`, `px-6`). Pick a `size`: the sizes read the density tokens, so compact and comfortable both stay right.

Theming: reads `--border-control`, `--brand-primary`, `--brand-primary-foreground`, `--card`, `--dark-400`, `--destructive`, `--destructive-foreground`, `--foreground`, `--inverse`, `--light-200`, `--muted`, `--primary`, `--primary-foreground`, `--ring`, `--text-inverse`, `--text-link`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--control-2xl`, `--control-lg`, `--control-md`, `--control-px-2xl`, `--control-px-lg`, `--control-px-md`, `--control-px-sm`, `--control-px-xl`, `--control-sm`, `--control-xl`, `--duration-fast`, `--ease-entrance`.

#### IconButton

A square or circular button for a single icon action.

```tsx
<IconButton aria-label="Add" variant="primary" shape="circle">
  <Plus />
</IconButton>
```

```ts
function IconButton({ className, variant, shape, size, ...props }: Button.Props & VariantProps<typeof iconButtonVariants>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `focusableWhenDisabled` | `boolean` | `false` |
| `nativeButton` | `boolean` | `true` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `shape` | `"circle" \| "rounded"` | `"rounded"` |
| `size` | `"sm" \| "lg" \| "xl" \| "md" \| "2xl"` | `"md"` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `variant` | `"plain" \| "gradient" \| "outline" \| "primary" \| "destructive" \| "light" \| "ghost" \| "brand" \| "dark"` | `"primary"` |

Also accepts the React.ButtonHTMLAttributes attributes (285).

Anatomy:

- `IconButton` (`data-slot="icon-button"`): A native `<button>` that holds one icon. It has no visible text, so its name comes from `aria-label`.
- `IconButtonTextCell` — optional: A table cell with a small `plain` icon button beside a label. Its `label` prop becomes the button's name and falls back to `Action`.

Best practices:

- **When:** Use an IconButton for a frequent action whose icon is unmistakable: close, edit, more options. When the icon alone could be misread, use a Button with a text label.
- **Do:** Give every IconButton an `aria-label` that names the action: `Delete invoice`, not `Trash`. A tooltip is extra help, not the name.
- **Do:** Set `variant="plain"` or `ghost` for secondary icon actions. The default is `primary`, and a view has one primary action.
- **Do:** Pass `label` to IconButtonTextCell. Without it every row's button is announced as `Action`.
- **Don't:** Don't use `sm` or `md` as the only control on a touch screen. Pick `xl` or `2xl`, which reach the 44 px hit area the polish rules ask for on touch.

Theming: reads `--border-control`, `--brand-600`, `--brand-primary`, `--brand-primary-foreground`, `--card`, `--dark-400`, `--destructive`, `--destructive-foreground`, `--foreground`, `--indigo-500`, `--inverse`, `--light-1000`, `--light-600`, `--muted`, `--primary`, `--primary-foreground`, `--ring`, `--text-inverse`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### ButtonGroup

A row of connected buttons sharing borders and outer corners, for view switchers or segmented actions.

```tsx
<ButtonGroup>
  <Button variant="plain">Day</Button>
  <Button variant="plain">Week</Button>
  <Button variant="plain">Month</Button>
</ButtonGroup>
```

```ts
function ButtonGroup({ shape, orientation, className, ...props }: React.ComponentProps<"div"> & {
    shape?: ButtonGroupShape;
    /** "horizontal" puts the buttons in a row, "vertical" stacks them with shared edges. */
    orientation?: ButtonGroupOrientation;
}): React.JSX.Element;
type ButtonGroupShape = "rounded" | "pill";
type ButtonGroupOrientation = "horizontal" | "vertical";
```

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `shape` | `"rounded" \| "pill"` | `"rounded"` |

Also accepts the React.HTMLAttributes attributes (280).

Anatomy:

- `ButtonGroup` (`data-slot="button-group"`): A `role="group"` row or stack that joins its children: neighbours overlap by one border and only the two outer ends keep their corners.
- `Button`: Each direct child, usually a plain Button or Icon Button. The focused one moves on top, so its focus ring is not covered.

Best practices:

- **When:** Use a Button Group for a few related actions that belong together, such as zoom in and zoom out or previous and next. For one choice that stays selected, use a Radio Button Group.
- **Do:** Give the group an `aria-label` that names what the buttons do together, such as `Zoom`. It already has `role="group"`, but no name.
- **Do:** Use the same `variant` and `size` on every button inside. The shared borders only line up when the buttons have the same height and border.
- **Don't:** Don't wrap the buttons in extra elements. Corners and overlaps are set on direct children only, so a wrapper breaks the joined edges.
- **Don't:** Don't put a primary button into the group. A view has one primary action, and the joined edges present the buttons as equals.

Theming: reads `--radius-md`, `--radius-xl`.

#### Card

A bordered container for grouping related content.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Supporting text.</CardDescription>
  </CardHeader>
</Card>
```

```ts
function Card({ className, size, variant, ...props }: React.ComponentProps<"div"> & {
    size?: "default" | "sm";
    variant?: CardVariant;
}): React.JSX.Element;
type CardVariant = keyof typeof CARD_VARIANT;
```

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"default" \| "sm"` | `"default"` |
| `variant` | `"default" \| "elevated" \| "outlined"` | `"default"` |

Also accepts the React.HTMLAttributes attributes (280).

Anatomy:

- `Card` (`data-slot="card"`): The surface in `default`, `elevated` or `outlined` style. It has 20 px padding on every side and 16 px between its parts (12 px in the small size), and it sets `--surface` for the parts inside.
- `CardMedia` (`data-slot="card-media"`) — optional: An image area flush with the top edge. Put an `<img>` inside to fill it; empty, it shows an image placeholder.
- `CardHeader` (`data-slot="card-header"`) — optional: A grid for the title, the description and an optional action on the right.
- `CardTitle` (`data-slot="card-title"`) — optional: The card's title. It renders a `<div>`, so put a heading element inside when the card opens a section.
- `CardDescription` (`data-slot="card-description"`) — optional: Secondary text under the title.
- `CardAction` (`data-slot="card-action"`) — optional: Sits top right in the header beside the title and description, for a menu or one small button.
- `CardContent` (`data-slot="card-content"`): The body, with the card's side padding.
- `CardFooter` (`data-slot="card-footer"`) — optional: A right-aligned row of buttons with a line above it. The card drops its own bottom padding when a footer is present.

Best practices:

- **When:** Use a Card to group content about one thing, such as a project, a plan or a settings section. For a row with icon, title and meta, use Item Card; when there is nothing to show yet, use Empty State.
- **Do:** Leave the padding to the card: the default size has the same 20 px inset as the chart, stat and metric cards. Use `size="sm"` for dense grids instead of overriding `p-*` classes.
- **Do:** Put a menu or one small button in `CardAction`. It stays top right however long the title runs.
- **Do:** Use plain buttons in `CardFooter` when cards repeat in a grid. A view has one primary action, and a primary button on every card leaves none.
- **Don't:** Don't set `bg-white` or a hex background on a card. `bg-card` follows the theme and dark mode, and the parts inside read it through `--surface`.

Theming: reads `--background`, `--border`, `--card`, `--card-foreground`, `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--radius-xl`, `--shadow-md`, `--shadow-xs`, `--font-sans`.

#### Checkbox

A single choice that is on or off, with an indeterminate state for “some selected”.

```tsx
<Checkbox aria-label="Example checkbox" defaultChecked onCheckedChange={setValue} />
```

```ts
function Checkbox({ className, inputRef, ...props }: Checkbox.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | `undefined` |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultChecked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `id` | `string` | — |
| `indeterminate` | `boolean` | `false` |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `name` | `string` | `undefined` |
| `nativeButton` | `boolean` | `false` |
| `onCheckedChange` | `((checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void)` | — |
| `parent` | `boolean` | `false` |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `uncheckedValue` | `string` | — |
| `value` | `string` | — |

Also accepts the React.HTMLAttributes attributes (273).

Anatomy:

- `Checkbox` (`data-slot="checkbox"`): The box, a `role="checkbox"` with `aria-checked`. Its hit area reaches beyond the visible box, and `aria-invalid` turns the border to the destructive colour.
- `Check indicator` (`data-slot="checkbox-indicator"`) — optional: The check, or a dash when `indeterminate`. The check draws in on checking. Checkbox renders it.
- `Label`: The text that names the checkbox, from `Label` or `Field`. Without it the box has no accessible name.

Best practices:

- **When:** Use a Checkbox for an on/off choice in a form or for picking several items from a list. For a settings row that toggles, use a Switch; for one choice out of several, use a Radio Group.
- **Do:** Give every checkbox a visible label through `Label` or `Field`. Clicking the label then toggles the box, and screen readers have a name to announce.
- **Do:** Set `indeterminate` on a select-all box when only some rows are selected. Screen readers hear `mixed`, and the box shows a dash instead of the check.
- **Do:** Mark an unchecked required box with `aria-invalid` and say what to do in the error text: `Accept the terms to continue.`
- **Don't:** Don't build a checkbox from a styled `<div>`. The component already handles Space, the focus ring and the larger hit area around the small box.

Theming: reads `--border-control`, `--destructive`, `--muted`, `--primary`, `--primary-foreground`, `--ring`, `--duration-fast`, `--duration-slow`, `--ease-entrance`.

#### Switch

A toggle control for a binary setting.

```tsx
<Switch aria-label="Example switch" defaultChecked onCheckedChange={setValue} />
```

```ts
function Switch({ className, size, inputRef, ...props }: Switch.Root.Props & {
    size?: "sm" | "default";
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | — |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultChecked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `id` | `string` | — |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `name` | `string` | — |
| `nativeButton` | `boolean` | `false` |
| `onCheckedChange` | `((checked: boolean, eventDetails: SwitchRoot.ChangeEventDetails) => void)` | — |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `size` | `"sm" \| "default"` | `"default"` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `uncheckedValue` | `string` | — |
| `value` | `string` | — |

Also accepts the React.HTMLAttributes attributes (273).

Anatomy:

- `Switch` (`data-slot="switch"`): A `switch` role with a sliding thumb, in `default` or `sm` size. Its hit area reaches past the track so a near miss still toggles it.
- `SwitchItemCell` — optional: A table cell that puts a Switch and its text in one `<label>`, so the text also toggles it.
- `Thumb` (`data-slot="switch-thumb"`): The round knob. It slides over with a slight overshoot and reverses mid-way when clicked again. Switch already renders it.

Best practices:

- **When:** Use a Switch for one setting that is on or off, such as email notifications. In a list of settings, pair it with SelectorItem; to pick several items from a list, use Checkboxes.
- **Do:** Give it a label through `Label`, `Field` or a wrapping `<label>`. The switch alone has no name, and screen readers would only say on or off.
- **Do:** Name the setting, not the state: `Email notifications`, not `On`. The `switch` role already tells screen readers whether it is on.
- **Do:** Use `size="sm"` in dense rows such as table cells, and the default size in forms and settings.
- **Don't:** Don't use a Switch to choose between two named options such as Monthly and Yearly. That is a choice, not on or off; use a RadioGroup.

Theming: reads `--background`, `--dark-400`, `--destructive`, `--foreground`, `--primary`, `--primary-foreground`, `--ring`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-overshoot`.

#### RadioGroup

A set of mutually exclusive options.

```tsx
<RadioGroup defaultValue="pro">
  <SelectorItemGroup>
    <SelectorItem title="Starter" description="1 project · community support" control={<RadioGroupItem value="starter" />} />
    <SelectorItem title="Pro" description="Unlimited projects · €12 per month" control={<RadioGroupItem value="pro" />} />
    <SelectorItem title="Team" description="Shared libraries · €49 per month" control={<RadioGroupItem value="team" />} />
  </SelectorItemGroup>
</RadioGroup>
```

```ts
function RadioGroup({ className, ...props }: RadioGroup.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `Value` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `name` | `string` | — |
| `onValueChange` | `((value: Value, eventDetails: RadioGroup.ChangeEventDetails) => void)` | — |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `Value` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `RadioGroup` (`data-slot="radio-group"`): Holds the selected `value` as a `radiogroup` role. The arrow keys move between the options and select them.
- `RadioGroupItem` (`data-slot="radio-group-item"`): One round option with its own `value`. Its hit area reaches past the circle so a near miss still selects it.
- `Dot` (`data-slot="radio-group-indicator"`): The white dot shown while the option is selected. RadioGroupItem already renders it.

Best practices:

- **When:** Use a RadioGroup when people pick exactly one option from a short list they should see at once. For a long list, use a Native Select; for options shown as buttons, use a Radio Button Group.
- **Do:** Name the group with a `FieldsetLegend` or an `aria-label`, and put each item and its text in one `<label>` so the text also selects it.
- **Do:** Preselect a sensible option with `defaultValue` when one exists. Once people pick an option they cannot clear the group again, so an empty start rarely helps.
- **Do:** Use SelectorItem with a RadioGroupItem as its `control` when each option needs a description, such as plans with their limits.
- **Don't:** Don't use two radio options for on and off. A single setting that is on or off is a Switch or a Checkbox.

Theming: reads `--border-control`, `--destructive`, `--muted`, `--primary`, `--primary-foreground`, `--ring`.

#### Input

A single-line text field with sm/default/lg sizes and error state.

```tsx
<Input size="default" placeholder="Email" />
```

```ts
function Input({ className, type, size, ref, onInvalid, onInput, onBlur, ...props }: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |

Also accepts the React.InputHTMLAttributes attributes (309).

Anatomy:

- `Input` (`data-slot="input"`): The single-line text field. Its height comes from `size` and the density tokens.
- `Validation tooltip` — optional: Shows the browser's message for `required`, `type="email"` or `pattern` when the form is submitted, and clears once the user types or leaves the field.

Best practices:

- **When:** Use an Input for one line of free text: a name, an email address, a search term. Several lines go in a Textarea; a choice from a known list goes in a Native Select or a Combobox.
- **Do:** Give every Input a visible label through `Field` or `Label`. A placeholder disappears with the first keystroke and is not a name.
- **Do:** Mark a wrong value with `aria-invalid` and say in the error what to do: `Enter an email address like name@company.com`, not `Invalid input`.
- **Do:** Keep the label a noun (`Work email`) and put a rule in the help text below it as a full sentence.
- **Don't:** Don't size a field with `h-*` classes. Use `size` (`sm`, `default`, `lg`): a field and a Button of the same size line up, in both densities.

Theming: reads `--card`, `--destructive`, `--foreground`, `--input`, `--muted`, `--muted-foreground`, `--ring`, `--radius-md`, `--field-lg`, `--field-md`, `--field-sm`, `--duration-fast`, `--ease-entrance`.

#### Textarea

A multi-line text field with sm/default/lg sizes and an optional character counter.

```tsx
<Textarea placeholder="Write a message..." />
```

```ts
function Textarea({ className, size, showCount, maxLength, value, defaultValue, onChange, ...props }: Omit<React.ComponentProps<"textarea">, "size"> & VariantProps<typeof textareaVariants> & {
    /** Show a "n/maxLength" character counter in the bottom-right corner. Requires maxLength. */
    showCount?: boolean;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `showCount` | `boolean` | — |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |

Also accepts the React.TextareaHTMLAttributes attributes (294).

Anatomy:

- `Textarea` (`data-slot="textarea"`): The multi-line `<textarea>`. Its minimum height comes from `size` and the density tokens, and people can drag it taller.
- `Character counter` — optional: Shows `length/maxLength` in the bottom-right corner when `showCount` and `maxLength` are both set; the field adds room below the text for it.

Best practices:

- **When:** Use a Textarea for free text over several lines: a message, a description, feedback. One line goes in an Input; formatted text goes in a Rich Text Editor.
- **Do:** Give it a visible label through `Field` or `Label`, or use TextareaField, which brings label and help text along.
- **Do:** Set `maxLength` together with `showCount` when there is a limit. The counter appears only when both are set.
- **Don't:** Don't size it with `rows` or `h-*` classes. Pick `size` (`sm`, `default`, `lg`): the heights read the density tokens, so compact and comfortable both stay right.

Theming: reads `--card`, `--destructive`, `--input`, `--muted`, `--muted-foreground`, `--ring`, `--text-tertiary`, `--radius-md`, `--textarea-lg`, `--textarea-md`, `--textarea-sm`, `--duration-fast`, `--ease-entrance`.

#### Progress

A horizontal bar showing completion of a task.

```tsx
<Progress value={65} />
```

```ts
function Progress({ className, children, value, ...props }: Progress.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number \| null` | — |
| `aria-valuetext` | `React.AriaAttributes['aria-valuetext']` | — |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `format` | `Intl.NumberFormatOptions` | — |
| `getAriaValueText` | `((formattedValue: string, value: number \| null) => string)` | — |
| `locale` | `Intl.LocalesArgument` | — |
| `max` | `number` | `100` |
| `min` | `number` | `0` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (274).

Anatomy:

- `Progress` (`data-slot="progress"`): Holds the completion `value` as a `progressbar` role. Children such as the label render above the bar.
- `ProgressCell` — optional: A short bar with the percentage beside it for a table cell. It is drawn without the `progressbar` role and clamps the bar to 0–100.
- `ProgressIndicator` (`data-slot="progress-indicator"`) — optional: The fill. It scales to the value and glides there slowly when the value changes. Progress already renders it.
- `ProgressLabel` (`data-slot="progress-label"`) — optional: Names the task for screen readers. Without it, give Progress an `aria-label`.
- `ProgressTrack` (`data-slot="progress-track"`) — optional: The grey bar behind the fill. Progress already renders it; you only need it for a custom layout.
- `ProgressValue` (`data-slot="progress-value"`) — optional: Shows the formatted value, a percentage by default, on the right in tabular figures.

Best practices:

- **When:** Use Progress for a task that runs to completion: an upload, an import, onboarding steps. For a fixed value inside a range, such as storage used, use Meter.
- **Do:** Name the bar with `ProgressLabel` or `aria-label`, such as `Uploading report.pdf`. Screen readers then say what is progressing, not only the number.
- **Do:** Add `ProgressValue` when the number matters. It formats the value and uses tabular figures, so the text does not jump while it counts.
- **Don't:** Don't animate the width of the fill yourself. The indicator already scales with a transform on the slow data-bar timing.

Theming: reads `--muted`, `--muted-foreground`, `--primary`, `--duration-ambient`, `--ease-entrance`.

#### Slider

A draggable control for selecting one value or a range along a track.

```tsx
<Slider aria-label="Value" defaultValue={40} onValueChange={setValue} />
```

```ts
function Slider({ className, children, value, defaultValue, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: Slider.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `Value` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `format` | `Intl.NumberFormatOptions` | — |
| `largeStep` | `number` | `10` |
| `locale` | `Intl.LocalesArgument` | — |
| `max` | `number` | `100` |
| `min` | `number` | `0` |
| `minStepsBetweenValues` | `number` | `0` |
| `name` | `string` | — |
| `onValueChange` | `((value: Value extends number ? number : Value, eventDetails: SliderRoot.ChangeEventDetails) => void)` | — |
| `onValueCommitted` | `((value: Value extends number ? number : Value, eventDetails: SliderRoot.CommitEventDetails) => void)` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `step` | `number` | `1` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `thumbAlignment` | `'center' \| 'edge' \| 'edge-client-only'` | `'center'` |
| `thumbCollisionBehavior` | `'push' \| 'swap' \| 'none'` | `'push'` |
| `value` | `Value` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Slider` (`data-slot="slider"`): Holds the value and draws one thumb per value: a number gives one thumb, an array of two gives a range. Its `aria-label` moves to the thumbs.
- `SliderControl` (`data-slot="slider-control"`) — optional: The area that takes pointer input, a little taller than the track. Slider already renders it.
- `SliderIndicator` (`data-slot="slider-indicator"`) — optional: The filled part of the track up to the value, or between the two thumbs of a range.
- `SliderLabel` (`data-slot="slider-label"`) — optional: A visible name above the track, linked to the slider.
- `SliderThumb` (`data-slot="slider-thumb"`) — optional: The handle people drag or move with the arrow keys; it is the focusable element screen readers announce. Slider renders one per value.
- `SliderTrack` (`data-slot="slider-track"`) — optional: The grey bar the thumbs travel on, horizontal or vertical. Slider already renders it.
- `SliderValue` (`data-slot="slider-value"`) — optional: Shows the current value or range on the right in tabular figures.

Best practices:

- **When:** Use a Slider when the rough position matters more than the exact figure: volume, a price range, a zoom level. For an exact number, use a Number Field.
- **Do:** Name it with `aria-label` or `SliderLabel`. For a range the thumbs are announced as `Budget, minimum` and `Budget, maximum`.
- **Do:** Show the current value with `SliderValue`, and set `step` to the precision people need. Shift with an arrow key moves by `largeStep`.
- **Don't:** Don't add SliderThumb children for a range. Pass an array such as `defaultValue={[20, 80]}`; Slider draws one thumb per value.

Theming: reads `--card`, `--foreground`, `--muted`, `--muted-foreground`, `--primary`, `--ring`, `--duration-fast`, `--ease-entrance`.

#### Pagination

Page navigation with Prev/Next and numbered pages, or a simple "Page X of Y" mode.

```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

```ts
function Pagination({ page, pageCount, onPageChange, className }: PaginationProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onPageChange` * | `(page: number) => void` | — |
| `page` * | `number` | — |
| `pageCount` * | `number` | — |
| `className` | `string` | — |

Anatomy:

- `Pagination` (`data-slot="pagination"`): A `<nav>` named `Pagination` with Prev and Next and numbered page buttons. Long ranges fold into an ellipsis around the current page.
- `PaginationSimple` (`data-slot="pagination-simple"`) — optional: The compact form: Previous and Next with a `Page X of Y` label between them, for narrow spaces.

Best practices:

- **When:** Use Pagination to move through a long list or table one page at a time. Where only Previous and Next fit, use PaginationSimple.
- **Do:** Keep `page` in state and load the matching rows in `onPageChange`. Pages count from 1, and `pageCount` is the total number of pages.
- **Do:** Show the total near the pager when people need it, such as `124 invoices`. Pagination itself shows only page numbers.
- **Don't:** Don't build page buttons by hand. Pagination already disables Prev on the first page and Next on the last, and marks the current page with `aria-current`.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--text-secondary`, `--text-tertiary`, `--radius-md`, `--control-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### Separator

A thin dividing line, horizontal or vertical, solid or dashed.

```tsx
<Separator orientation="horizontal" dashed={false} />
```

```ts
function Separator({ className, orientation, dashed, ...props }: Separator.Props & {
    dashed?: boolean;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `dashed` | `boolean` | `false` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Separator` (`data-slot="separator"`): A thin line with the `separator` role, horizontal by default or vertical with `orientation`. `dashed` draws it as a dashed border.

Best practices:

- **When:** Use a Separator to divide groups inside one surface, such as two sections of a card. For a line with text like `or`, use Divider with Label; inside a toolbar, use ToolbarSeparator.
- **Do:** Place a vertical Separator inside a flex row. It stretches to the row's height, so the row needs one.
- **Do:** Use `dashed` for a lighter break inside one section, such as the line above a total, and the solid line between sections.
- **Don't:** Don't draw dividers with `border-t` or a hex colour. Separator uses the `--border` token, so it follows the theme and dark mode.

Theming: reads `--border`.

#### DividerWithLabel

A separator with a centered text label, e.g. for "or" between two sign-in options.

```tsx
<DividerWithLabel>OR</DividerWithLabel>
```

```ts
function DividerWithLabel({ children, className, }: {
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `DividerWithLabel`: A full-width row of a line, a label and a second line, separating two groups such as two ways to sign in.
- `Lines` — optional: Two separators that stretch to fill the space on either side of the label.
- `Label`: The `children`, a word or two such as `or`, centred between the lines in muted text.

Best practices:

- **When:** Use a Divider with Label between two alternative ways to do the same thing, such as social sign-in and email. For a line without text, use Separator.
- **Do:** Keep the label to one or two words that say how the groups relate: `or`, `or continue with`. Longer text squeezes the lines away.
- **Do:** Place it only between two alternatives, such as sign-in buttons above and an email form below. The label reads as a choice between what is above and what is below.
- **Don't:** Don't use it as a section heading. The label is small, muted text with no heading role; start a new section with a real heading.

Theming: reads `--text-tertiary`.

#### Skeleton

A pulsing placeholder shown while content is loading.

```tsx
<Skeleton variant="title" />
<Skeleton variant="text" />
```

```ts
function Skeleton({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"title" \| "text" \| "avatar" \| "block"` | `"block"` |

Also accepts the React.HTMLAttributes attributes (280).

Anatomy:

- `Skeleton` (`data-slot="skeleton"`): A grey placeholder with a light sweeping shimmer, in the `text`, `title`, `avatar` or `block` shape. The shimmer stops under reduced motion.

Best practices:

- **When:** Use a Skeleton while content with a known layout loads: a list, a card, a profile. For a short wait on an action, such as saving, use a Spinner.
- **Do:** Give each Skeleton the size of the content it stands for, using `variant` and a width class. The layout then keeps its height and does not jump when the content arrives.
- **Do:** Set `aria-busy="true"` on the region that is loading and remove it when the content is in. The placeholders themselves say nothing to screen readers.
- **Don't:** Don't build your own placeholder for charts. They take a `loading` prop and draw a skeleton of the right height.

Theming: reads `--foreground`, `--muted`, `--radius-md`, `--radius-sm`.

#### Tooltip

A short label shown on hover, in any of 4 directions.

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="plain" />}>Hover</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

```ts
function Tooltip({ ...props }: Tooltip.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<TooltipRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `disabled` | `boolean` | `false` |
| `disableHoverablePopup` | `boolean` | `false` |
| `handle` | `TooltipHandle<Payload>` | — |
| `onOpenChange` | `((open: boolean, eventDetails: TooltipRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `trackCursorAxis` | `'none' \| 'x' \| 'y' \| 'both'` | `'none'` |
| `triggerId` | `string \| null` | — |

Anatomy:

- `Tooltip` (`data-slot="tooltip"`): Holds the open state and links the trigger to the label. Renders nothing itself.
- `TooltipContent` (`data-slot="tooltip-content"`): The dark label in a portal, on the `top` side by default; `side` and `sideOffset` move it. Escape closes it.
- `TooltipTrigger` (`data-slot="tooltip-trigger"`): The element the tooltip describes; it opens on hover and on keyboard focus. Pass your Button or IconButton through `render`.
- `Shortcut` — optional: A key hint after the label, drawn from the `shortcut` prop, such as `⌘K`.
- `Arrow` — optional: The small point towards the trigger. It turns with the side the tooltip ends up on.

Best practices:

- **When:** Use a Tooltip for a short hint on a control: the name of an icon button, a shortcut, a truncated text in full. For content people read at length or act on, use a Popover.
- **Do:** Give the trigger its own name with `aria-label` as well. The tooltip adds information and is never the only label of a control.
- **Do:** Set `shortcut` for a key hint and `linger` for a confirmation such as `Copied to clipboard`, which then fades out slowly instead of snapping away.
- **Don't:** Don't put links or buttons in TooltipContent. It opens only on hover and focus of the trigger, so keyboard users cannot reach them.

Theming: reads `--neutral-dark-content`, `--neutral-white`, `--shadow-md`, `--font-sans`, `--duration-ambient`, `--duration-fast`, `--duration-instant`, `--ease-entrance`, `--ease-exit`, `--ease-move`.

#### Dialog

A modal window for focused tasks, built on Base UI.

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

```ts
function Dialog({ ...props }: Dialog.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<DialogRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `disablePointerDismissal` | `boolean` | `false` |
| `handle` | `DialogHandle<Payload>` | — |
| `modal` | `boolean \| 'trap-focus'` | `true` |
| `onOpenChange` | `((open: boolean, eventDetails: DialogRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `triggerId` | `string \| null` | — |

Anatomy:

- `Dialog` (`data-slot="dialog"`): Holds the open state and links the trigger to the window. Renders nothing itself.
- `DialogTrigger` (`data-slot="dialog-trigger"`) — optional: The element that opens the dialog. Focus returns to it when the dialog closes.
- `DialogContent` (`data-slot="dialog-content"`): The window. It brings its own portal and overlay, keeps focus inside while open, and shows a close button in the corner unless `showCloseButton={false}`.
- `DialogHeader` (`data-slot="dialog-header"`) — optional: Stacks the icon, the title and the description at the top.
- `DialogIcon` (`data-slot="dialog-icon"`) — optional: A round icon above the title in the `default`, `warning` or `destructive` look.
- `DialogTitle` (`data-slot="dialog-title"`): Names the dialog; screen readers announce it when the dialog opens.
- `DialogDescription` (`data-slot="dialog-description"`) — optional: One or two sentences on what the dialog is for, read out after the title.
- `DialogFooter` (`data-slot="dialog-footer"`) — optional: The row of buttons. The last button in the markup sits on the right, and on top on a phone.
- `DialogClose` (`data-slot="dialog-close"`) — optional: Closes the dialog. Wrap the `Cancel` button in it, or set `showCloseButton` on DialogFooter.
- `DialogOverlay` (`data-slot="dialog-overlay"`) — optional: The dimmed backdrop. Restyle it through `overlayClassName` on DialogContent.
- `DialogPortal` (`data-slot="dialog-portal"`) — optional: Moves the window to the end of the document. DialogContent already renders it; you only need it for a custom window.

Best practices:

- **When:** Use a Dialog for a short task that needs the user's full attention and ends with a decision: rename a project, invite a member. A long form or a detail view belongs in a Sheet.
- **Do:** Always include a `DialogTitle`, also when the design shows none. Without it the dialog has no name for screen readers.
- **Do:** Put the main action last in `DialogFooter` and name it after what it does: `Invite member`, with `Cancel` before it.
- **Don't:** Don't confirm a destructive action in a Dialog: a click outside closes it. An Alert Dialog closes only through a button or Escape.
- **Don't:** Don't use a dialog to report that something worked. A saved state is a toast; a dialog that needs one click to dismiss only adds a step.

Theming: reads `--background`, `--brand-quaternary`, `--destructive`, `--foreground`, `--muted`, `--muted-foreground`, `--popover`, `--popover-foreground`, `--text-warning`, `--radius-xl`, `--font-sans`, `--duration-base`, `--duration-fast`, `--duration-slow`, `--ease-exit`, `--ease-overshoot`.

#### AlertDialog

A dialog for confirmations and destructive actions: a click outside does not close it, only a button or Escape does.

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button />}>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete account?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

```ts
function AlertDialog({ ...props }: AlertDialog.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<AlertDialogRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `handle` | `AlertDialogHandle<Payload>` | — |
| `onOpenChange` | `((open: boolean, eventDetails: AlertDialogRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `triggerId` | `string \| null` | — |

Anatomy:

- `AlertDialog` (`data-slot="alert-dialog"`): Holds the open state. A click outside does not close it; only one of its buttons or Escape does.
- `AlertDialogTrigger` (`data-slot="alert-dialog-trigger"`) — optional: The element that opens the alert dialog, usually the destructive button. Focus returns to it on close.
- `AlertDialogContent` (`data-slot="alert-dialog-content"`): The window with its own portal and overlay. It has no close button in the corner, so the footer buttons are the way out.
- `AlertDialogHeader` (`data-slot="alert-dialog-header"`) — optional: Stacks the icon, the title and the description at the top.
- `AlertDialogIcon` (`data-slot="dialog-icon"`) — optional: A round icon above the title in the `default`, `warning` or `destructive` look; the same part as the Dialog icon.
- `AlertDialogTitle` (`data-slot="alert-dialog-title"`): Names the action and its object, such as `Delete “Q4 report”?`. It is announced as the alert dialog's name.
- `AlertDialogDescription` (`data-slot="alert-dialog-description"`): Says what will be lost or cannot be undone; read out after the title.
- `AlertDialogFooter` (`data-slot="alert-dialog-footer"`): The row of buttons. The last button in the markup sits on the right, and on top on a phone.
- `AlertDialogCancel` (`data-slot="alert-dialog-cancel"`): Closes without acting. It renders a plain Button; label it `Cancel`.
- `AlertDialogAction` (`data-slot="alert-dialog-action"`): Confirms and closes on click. It renders a Button, `primary` by default or `destructive` through `variant`.
- `AlertDialogOverlay` (`data-slot="alert-dialog-overlay"`) — optional: The dimmed, lightly blurred backdrop. AlertDialogContent already renders it.
- `AlertDialogPortal` (`data-slot="alert-dialog-portal"`) — optional: Moves the window to the end of the document. AlertDialogContent already renders it; you only need it for a custom window.

Best practices:

- **When:** Use an Alert Dialog to confirm an action with consequences, such as deleting a project or revoking access. For a task with fields, use Dialog; to report that something worked, use a toast.
- **Do:** Name the object and the loss: `Delete “Q4 report”?` as the title and what goes with it in the description, not `Are you sure?`.
- **Do:** Repeat the action on the confirm button and set `variant="destructive"` for deletions: `Delete project` after `Cancel`, so it ends up on the right.
- **Do:** Control `open` yourself when the action is slow or can fail. `AlertDialogAction` closes the dialog on click, before any request has finished.
- **Don't:** Don't confirm with `window.confirm`. It cannot be styled or tested, while an Alert Dialog keeps the product's look, its focus handling and its button labels.

Theming: reads `--brand-quaternary`, `--destructive`, `--foreground`, `--muted`, `--muted-foreground`, `--popover`, `--popover-foreground`, `--text-warning`, `--radius-xl`, `--font-sans`, `--duration-base`, `--duration-fast`, `--duration-slow`, `--ease-exit`, `--ease-overshoot`.

#### Collapsible

A single collapsible panel controlled by a trigger button.

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>Show details</CollapsibleTrigger>
  <CollapsibleContent>Order 4821 shipped on 12 October…</CollapsibleContent>
</Collapsible>
```

```ts
function Collapsible({ ...props }: Collapsible.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `onOpenChange` | `((open: boolean, eventDetails: CollapsibleRootChangeEventDetails) => void)` | — |
| `open` | `boolean` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Collapsible` (`data-slot="collapsible"`): Holds the open state of one panel and wraps its trigger and the panel.
- `CollapsibleTrigger` (`data-slot="collapsible-trigger"`): A full-width `<button>` with `aria-expanded`: the label on the left, a plus that turns into a minus on the right.
- `CollapsibleContent` (`data-slot="collapsible-content"`): The panel. It opens on a grid-row transition, so nothing is measured, and starts a small gap below the trigger.

Best practices:

- **When:** Use a Collapsible for one optional block people open on demand, such as advanced options or a long description. For a list of several such sections, use Accordion.
- **Do:** Name the trigger after what is hidden: `Advanced options`, `Show 4 more fields`. Its text is the button's accessible name.
- **Do:** Keep fields a form needs outside the closed panel. A collapsed panel is easy to skip, and an error inside it stays out of sight.
- **Don't:** Don't put buttons or links inside `CollapsibleTrigger`. It is a `<button>` itself, and the plus icon is added for you.
- **Don't:** Don't add a height transition to `CollapsibleContent`. It already opens on `grid-template-rows` with motion tokens, and a second animation fights it.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--text-secondary`, `--radius-md`, `--duration-base`, `--ease-entrance`.

#### Toggle

A standalone two-state button that can be pressed or unpressed.

```tsx
<Toggle defaultPressed aria-label="Bold">
  <Bold />
</Toggle>
```

```ts
function Toggle({ className, size, ...props }: Toggle.Props & VariantProps<typeof toggleVariants>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultPressed` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `nativeButton` | `boolean` | `true` |
| `onPressedChange` | `((pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void)` | — |
| `pressed` | `boolean` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `Value` | — |

Also accepts the React.ButtonHTMLAttributes attributes (283).

Anatomy:

- `Toggle` (`data-slot="toggle"`): A button that stays pressed or unpressed, exposed through `aria-pressed`. Pressed, it takes the accent fill.
- `ToggleButton` (`data-slot="toggle-button"`) — optional: The bordered form of a toggle, tinted indigo while pressed. It is the option inside a Checkbox Button Group or Radio Button Group.

Best practices:

- **When:** Use a Toggle for a state that is switched on the spot, often in a toolbar: bold, mute, show grid. For a saved setting use a Switch; for one choice among several, use a Radio Button Group.
- **Do:** Give an icon-only Toggle an `aria-label` such as `Bold`. The pressed state is announced by `aria-pressed`, not by the label.
- **Do:** Keep the label and icon the same in both states. The fill already shows whether it is pressed.
- **Don't:** Don't use a Toggle to run a one-off action such as `Export`. An action that does not stay on is a Button.

Theming: reads `--accent`, `--accent-foreground`, `--border-control`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-secondary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### Meter

A graphical display of a fixed value within a range, e.g. disk usage.

```tsx
<Meter value={72}>
  <MeterLabel>Storage used</MeterLabel>
  <MeterValue />
</Meter>
```

```ts
function Meter({ className, children, value, ...props }: Meter.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number` | — |
| `aria-valuetext` | `React.AriaAttributes['aria-valuetext']` | — |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `format` | `Intl.NumberFormatOptions` | — |
| `getAriaValueText` | `((formattedValue: string, value: number) => string)` | — |
| `locale` | `Intl.LocalesArgument` | — |
| `max` | `number` | `100` |
| `min` | `number` | `0` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (274).

Anatomy:

- `Meter` (`data-slot="meter"`): Holds the value and its range (`value`, `min`, `max`) as a `meter` role. Children such as the label render above the bar.
- `MeterIndicator` (`data-slot="meter-indicator"`) — optional: The fill. It scales to the value and glides there slowly when the value changes. Meter already renders it.
- `MeterLabel` (`data-slot="meter-label"`) — optional: Names the meter for screen readers. Without it, give the Meter an `aria-label`.
- `MeterTrack` (`data-slot="meter-track"`) — optional: The grey bar behind the fill. Meter already renders it; you only need it for a custom layout.
- `MeterValue` (`data-slot="meter-value"`) — optional: Shows the formatted value on the right in tabular figures; `format` on Meter sets the number style.

Best practices:

- **When:** Use a Meter for a measured value inside a known range: storage used, a score, a quota. For a task that runs to completion, use Progress.
- **Do:** Name it with `MeterLabel` or `aria-label`. Screen readers announce the value, and without a name they cannot say what it measures.
- **Do:** Set `max` to the real limit and show the unit in the text: `38 of 50 GB`, not a bare `76`.
- **Don't:** Don't animate the fill's width yourself. The fill already moves with a transform on the slow data-bar timing, which is cheaper and matches the other bars.

Theming: reads `--muted`, `--muted-foreground`, `--primary`, `--duration-ambient`, `--ease-entrance`.

#### Kbd

Displays a keyboard key or shortcut, e.g. inside a search input.

```tsx
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

```ts
function Kbd({ className, ...props }: React.ComponentProps<"kbd">): React.JSX.Element;
```

Anatomy:

- `Kbd` (`data-slot="kbd"`): One key as a native `<kbd>` element, such as `⌘`, `K` or `Esc`.
- `KbdGroup` (`data-slot="kbd-group"`) — optional: Sets several keys side by side with a small gap, for a combination like `⌘` `K`.

Best practices:

- **When:** Use Kbd to show a key or a shortcut in text, a menu or a search field. For a shortcut on a tooltip, set `shortcut` on TooltipContent instead.
- **Do:** Write a symbol shortcut in one Kbd, such as `⌘K`. For named keys, give each key its own Kbd in a KbdGroup with `+` between them: `Ctrl` + `Shift` + `P`.
- **Do:** Hide shortcut hints on small screens with `hidden sm:inline-flex`. A phone has no keyboard to press them on.
- **Don't:** Don't use Kbd as a label or status chip. It renders `<kbd>`, which tells screen readers the text is keyboard input; a label is a Badge.

Theming: reads `--border`, `--subtle`, `--text-secondary`, `--radius-sm`.

#### Spinner

A spinning indicator for an in-progress loading state.

```tsx
<Spinner />
```

```ts
function Spinner({ className, ...props }: React.ComponentProps<"svg">): React.JSX.Element;
```

Anatomy:

- `Spinner` (`data-slot="spinner"`): A spinning loader icon with the `status` role and the name `Loading`; pass `aria-label` to say what is loading.

Best practices:

- **When:** Use a Spinner for a short wait tied to an action: a button that saves, a panel that refreshes. When content with a known layout loads, use a Skeleton.
- **Do:** Pass a specific `aria-label`, such as `Saving changes`. The default `Loading` says nothing about what is happening.
- **Do:** Size it with a `size-*` class to match the icon or text beside it, such as `size-5` in a large button. It is as big as a small icon by default.
- **Don't:** Don't swap a chart or a list for a Spinner while it loads. The area collapses and the layout jumps; use the `loading` prop or a Skeleton of the same size.

Theming: reads `--muted-foreground`.

#### Toolbar

A container for grouping a set of buttons and controls.

```tsx
<Toolbar>
  <ToolbarGroup>
    <ToolbarButton aria-label="Bold"><Bold /></ToolbarButton>
    <ToolbarButton aria-label="Italic"><Italic /></ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
</Toolbar>
```

```ts
function Toolbar({ className, ...props }: Toolbar.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `disabled` | `boolean` | — |
| `loopFocus` | `boolean` | `true` |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Toolbar` (`data-slot="toolbar"`): A framed row with the `toolbar` role. It is one tab stop: the arrow keys move between its items and wrap at the ends.
- `ToolbarButton` (`data-slot="toolbar-button"`): A square icon button inside the toolbar. It shows a pressed state when used as a toggle.
- `ToolbarGroup` (`data-slot="toolbar-group"`) — optional: Keeps related buttons close together, such as the text styles.
- `ToolbarLink` (`data-slot="toolbar-link"`) — optional: A text link inside the toolbar that the arrow keys reach like the buttons.
- `ToolbarSeparator` (`data-slot="toolbar-separator"`) — optional: A short vertical line between two groups.

Best practices:

- **When:** Use a Toolbar for a set of controls that act on one thing, such as the formatting buttons of an editor. For joined buttons that switch views, use a Button Group.
- **Do:** Name the toolbar with `aria-label`, such as `Text formatting`, and every icon-only ToolbarButton with its own `aria-label`.
- **Do:** Sort the buttons into ToolbarGroups with a ToolbarSeparator between them, so related actions sit together.
- **Don't:** Don't add your own arrow-key handling or `tabIndex` to the items. The toolbar already moves focus between them, and Tab leaves it.

Theming: reads `--accent`, `--accent-foreground`, `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-secondary`, `--radius-lg`, `--radius-md`, `--radius-sm`, `--duration-fast`, `--ease-entrance`.

#### DropdownMenu

A menu of actions: icons, shortcuts, checkbox and radio entries, submenus, two-line entries, loading and empty states.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button />}>Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

```ts
function DropdownMenu({ ...props }: Menu.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<MenuRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `closeParentOnEsc` | `boolean` | `false` |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `disabled` | `boolean` | `false` |
| `handle` | `MenuHandle<Payload>` | — |
| `highlightItemOnHover` | `boolean` | `true` |
| `loopFocus` | `boolean` | `true` |
| `modal` | `boolean` | `true` |
| `onOpenChange` | `((open: boolean, eventDetails: MenuRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'vertical'` |
| `triggerId` | `string \| null` | — |

Anatomy:

- `DropdownMenu` (`data-slot="dropdown-menu"`): Holds the open state and links the trigger to the menu. Renders nothing itself.
- `DropdownMenuTrigger` (`data-slot="dropdown-menu-trigger"`): The button that opens the menu on click, Enter, Space or Arrow Down. It carries `aria-haspopup` and `aria-expanded`.
- `DropdownMenuContent` (`data-slot="dropdown-menu-content"`): The menu in its own portal, as wide as its longest entry and never taller than the room left. It hides when its trigger scrolls away.
- `DropdownMenuGroup` (`data-slot="dropdown-menu-group"`) — optional: Groups related entries. A DropdownMenuLabel inside it becomes the group's accessible name.
- `DropdownMenuLabel` (`data-slot="dropdown-menu-label"`) — optional: A small section heading. Inside a group it names the group; on its own it is plain text.
- `DropdownMenuItem` (`data-slot="dropdown-menu-item"`): One action. It takes an `icon`, a second line in `description` and `variant="destructive"`; disabled entries stay reachable with the arrow keys.
- `DropdownMenuCheckboxItem` (`data-slot="dropdown-menu-checkbox-item"`) — optional: An entry that switches something on or off, with a check on the right while `checked`.
- `Checkbox indicator` (`data-slot="dropdown-menu-checkbox-item-indicator"`) — optional: The check of a checkbox entry. DropdownMenuCheckboxItem renders it.
- `DropdownMenuRadioGroup` (`data-slot="dropdown-menu-radio-group"`) — optional: Holds the value of a set of radio entries, of which exactly one is selected.
- `DropdownMenuRadioItem` (`data-slot="dropdown-menu-radio-item"`) — optional: One choice in a radio group, with a check on the right while selected.
- `Radio indicator` (`data-slot="dropdown-menu-radio-item-indicator"`) — optional: The check of the selected radio entry. DropdownMenuRadioItem renders it.
- `DropdownMenuSeparator` (`data-slot="dropdown-menu-separator"`) — optional: A line between groups of entries.
- `DropdownMenuShortcut` (`data-slot="dropdown-menu-shortcut"`) — optional: The shortcut hint at the end of an entry, hidden from screen readers. Put the binding on the entry with `aria-keyshortcuts`.
- `DropdownMenuSub` (`data-slot="dropdown-menu-sub"`) — optional: Holds the open state of a submenu.
- `DropdownMenuSubTrigger` (`data-slot="dropdown-menu-sub-trigger"`) — optional: The entry that opens a submenu, after a short hover delay or at once with Arrow Right or Enter. It ends in a chevron.
- `DropdownMenuSubContent` (`data-slot="dropdown-menu-sub-content"`) — optional: The submenu, opened flush beside its entry so the pointer can cross over without closing it.
- `DropdownMenuLoading` (`data-slot="dropdown-menu-loading"`) — optional: A `role="status"` line with a spinner while entries load. Arrow keys never land on it.
- `DropdownMenuEmpty` (`data-slot="dropdown-menu-empty"`) — optional: The line shown when there is nothing to act on, `Nothing here yet` by default.
- `DropdownMenuPortal` (`data-slot="dropdown-menu-portal"`) — optional: Moves the menu to the end of the document. DropdownMenuContent already renders it.

Best practices:

- **When:** Use a Dropdown Menu for actions behind a button: an entry does something and the menu closes. To pick a value in a form, use Native Select or Combobox; for actions on right-click, use Context Menu.
- **Do:** Name destructive entries after the action and the object and set `variant="destructive"`: `Delete project`. The colour is a second cue, never the only one.
- **Do:** Disable an entry that does not apply right now instead of removing it. Arrow keys still reach it, so screen reader users learn that the action exists.
- **Do:** Show `DropdownMenuLoading` while entries load and `DropdownMenuEmpty` when there are none, with `aria-busy` on the content while loading. The menu never opens as an empty box.
- **Don't:** Don't put links to pages in a Dropdown Menu. It is a menu of actions; navigation belongs in the Navbar menu or in plain links.
- **Don't:** Don't write the shortcut into the label. Put it in `DropdownMenuShortcut` and `aria-keyshortcuts` on the entry, so the entry is read as `Copy`, not `Copy ⌘C`.

Theming: reads `--accent`, `--accent-foreground`, `--background`, `--border`, `--destructive`, `--foreground`, `--muted`, `--muted-foreground`, `--popover`, `--popover-foreground`, `--text-tertiary`, `--tint-indigo`, `--radius-lg`, `--radius-md`, `--menu-item-py`, `--shadow-lg`, `--shadow-md`, `--duration-base`, `--duration-fast`, `--duration-instant`, `--ease-entrance`, `--ease-exit`, `--scale-enter`, `--travel-sm`.

#### HoverCard

A rich preview popup shown on hovering a trigger.

```tsx
<HoverCard>
  <HoverCardTrigger render={<Button />}>@handle</HoverCardTrigger>
  <HoverCardContent>Profile preview</HoverCardContent>
</HoverCard>
```

```ts
function HoverCard({ ...props }: PreviewCard.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<PreviewCardRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `handle` | `PreviewCardHandle<Payload>` | — |
| `onOpenChange` | `((open: boolean, eventDetails: PreviewCardRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `triggerId` | `string \| null` | — |

Anatomy:

- `HoverCard` (`data-slot="hover-card"`): Holds the open state and links the trigger to the preview.
- `HoverCardTrigger` (`data-slot="hover-card-trigger"`): A link (`<a>`) that opens the preview on hover or keyboard focus after a short delay, and closes it shortly after the pointer leaves.
- `HoverCardContent` (`data-slot="hover-card-content"`): The preview panel in its own portal beside the trigger; `side` and `sideOffset` move it.

Best practices:

- **When:** Use a Hover Card to preview what a link points to, such as a person's profile or a linked issue. For a short label on an icon, use Tooltip; for content people click into, use Popover.
- **Do:** Give the trigger an `href` to the full page. A click, a tap and a screen reader still get there, and the preview stays an extra.
- **Do:** Keep the content to a summary that fits the card's fixed width: an avatar, a name and one or two lines.
- **Don't:** Don't put buttons or forms in a Hover Card. Touch screens cannot hover, so everything in it must also be reachable without it; use a Popover for interactive content.

Theming: reads `--border`, `--popover`, `--popover-foreground`, `--radius-md`, `--shadow-lg`, `--duration-instant`, `--ease-entrance`, `--ease-exit`.

#### Popover

A floating panel anchored to a trigger element.

```tsx
<Popover>
  <PopoverTrigger render={<Button />}>Open</PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>
```

```ts
function Popover({ ...props }: Popover.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<PopoverRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `handle` | `PopoverHandle<Payload>` | — |
| `modal` | `boolean \| 'trap-focus'` | `false` |
| `onOpenChange` | `((open: boolean, eventDetails: PopoverRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `triggerId` | `string \| null` | — |

Anatomy:

- `Popover` (`data-slot="popover"`): Holds the open state and links the trigger to the panel. Renders nothing itself.
- `PopoverClose` (`data-slot="popover-close"`) — optional: Closes the popover. Wrap a Cancel or Apply button in it, or render it as an icon button for an ×.
- `PopoverContent` (`data-slot="popover-content"`): The panel. It brings its own portal and sits `sideOffset` (default 8) from the trigger; set `side`, `align` or `anchor` to steer it.
- `PopoverTrigger` (`data-slot="popover-trigger"`): The element that opens the popover. It carries `aria-expanded`, and Escape returns focus to it.

Best practices:

- **When:** Use a Popover for a small panel tied to one control: a date picker, a filter form, a few settings. For a hover preview, use a hover card or a tooltip. For a task that needs full attention, use a Dialog.
- **Do:** Close the popover from the buttons inside it. Wrap `Apply` and `Cancel` in `PopoverClose` so the panel closes and focus returns to the trigger.
- **Do:** Give a popover that holds a form a visible title. Without a name, a screen reader announces an unnamed panel.
- **Don't:** Don't put a destructive confirmation in a popover. A click outside dismisses it without a decision; use an Alert Dialog.
- **Don't:** Don't put long content in a popover. It is a compact panel anchored to its trigger; a Sheet slides in with its own header and close button.

Theming: reads `--background`, `--border`, `--popover`, `--popover-foreground`, `--radius-lg`, `--shadow-lg`, `--duration-base`, `--duration-fast`, `--ease-exit`, `--ease-overshoot`.

#### Table

Rows and columns with 23 ready-made cell types; for sorting and search use Data Grid.

```tsx
<Table>
  <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>Jane</TableCell></TableRow></TableBody>
</Table>
```

```ts
function Table({ className, ...props }: React.ComponentProps<"table">): React.JSX.Element;
```

Anatomy:

- `Table` (`data-slot="table-container"`): A scroll box around the native table. When the table is wider than its container, the box takes focus so the arrow keys can scroll it.
- `Table element` (`data-slot="table"`): The native `<table>`; your `className` lands here.
- `TableCaption` (`data-slot="table-caption"`) — optional: A title for the table, read out first by screen readers and shown below the rows.
- `TableHeader` (`data-slot="table-header"`): The `<thead>` with the column headings.
- `TableHead` (`data-slot="table-head"`): One column heading, a `<th>`.
- `TableBody` (`data-slot="table-body"`): The `<tbody>` with the data rows.
- `TableRow` (`data-slot="table-row"`): One row, tinted on hover.
- `TableCell` (`data-slot="table-cell"`): One cell, a `<td>`. Put plain text in it or one of the ready-made cells below.
- `TableFooter` (`data-slot="table-footer"`) — optional: A `<tfoot>` for totals.
- `ActionIconsCell` — optional: A row of icon actions such as edit, view and delete.
- `ActionItemsCell` — optional: A row of text actions, with quieter ones for the less common choices.
- `AddressCell` — optional: A street over a city, on two lines.
- `CheckItemCell` — optional: A checkbox in front of the row label, for picking rows.
- `CompanyCell` — optional: A logo square, the company name and its domain.
- `CTAButtonCell` — optional: The filled call to action of a row.
- `CurrencyCell` — optional: An amount with its currency.
- `DragItemCell` — optional: A drag handle in front of the row label.
- `HeadingCell` — optional: A column label for a heading cell.
- `IconTextCell` — optional: An icon beside a label.
- `PerformanceCell` — optional: A figure with its change; the change is green when it is good news.
- `ProductCell` — optional: A thumbnail, the product name and its SKU.
- `RadioItemCell` — optional: A radio button in front of the row label, for picking one row.
- `TagCell` — optional: A label with a cross to remove it.
- `TextCell` — optional: Plain cell text in the table's text style.
- `UserAvatarCell` — optional: Like UserCell, always with an avatar image or initials.
- `UserCell` — optional: A name over an email address, with an avatar or a person icon.

Best practices:

- **When:** Use a Table for rows people read: the line items of an invoice, a short list of members. When they sort, search, select or page through the rows, use Data Grid or Data Table.
- **Do:** Name the table with a `TableCaption` or an `aria-label` on Table. When the table scrolls sideways, that name also labels the scroll region.
- **Do:** Align numbers to the right and set them in `tabular-nums`, so figures line up and do not shift when they change. Text stays left.
- **Do:** Give amounts and quantities their unit. `CurrencyCell` adds the currency; for other figures the column heading names the unit.
- **Don't:** Don't add row padding or heights by hand. The rows read `--row-py`, so the table follows the density setting.

Theming: reads `--foreground`, `--muted`, `--muted-foreground`, `--ring`, `--text-error`, `--text-link`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--radius-md`, `--control-md`, `--row-py`, `--duration-fast`, `--ease-entrance`, `--ease-move`.

#### Tabs

Switches between related views in the same context.

```tsx
<Tabs defaultValue="day">
  <TabsList>
    <TabsTrigger value="day">Day</TabsTrigger>
  </TabsList>
  <TabsContent value="day">...</TabsContent>
</Tabs>
```

```ts
function Tabs({ className, orientation, ...props }: Tabs.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `TabsTab.Value` | `0` |
| `onValueChange` | `((value: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => void)` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `TabsTab.Value` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Tabs` (`data-slot="tabs"`): Holds the selected value and the orientation, `horizontal` or `vertical`.
- `TabsList` (`data-slot="tabs-list"`): The row of tabs in the `default` look (bordered buttons) or the `line` look (an underline). It scrolls sideways when the tabs do not fit.
- `TabsTrigger` (`data-slot="tabs-trigger"`): One tab. Its `value` connects it to the panel with the same value.
- `TabsIndicator` (`data-slot="tabs-indicator"`) — optional: The underline of the `line` look that glides to the active tab. TabsList adds it for you.
- `TabsContent` (`data-slot="tabs-content"`): The panel shown while its tab is selected.

Best practices:

- **When:** Use Tabs to switch between panels of the same object, such as Overview, Activity and Settings of one project. To filter one list or change a chart's period, use Segment.
- **Do:** Write short labels in sentence case, one or two words: `Billing history`, not `Billing History`.
- **Do:** Keep the number of tabs small enough for a phone. The row scrolls sideways when it runs out of room, and a tab past the edge is easy to miss.
- **Don't:** Don't add your own key handlers to the triggers. Arrow keys already move between tabs and Tab moves into the panel.
- **Don't:** Don't set heights on the list or the triggers. Pick `size` (`sm`, `md`, `lg`): the heights follow the density tokens and match the Button sizes.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--muted-foreground`, `--primary`, `--ring`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--radius-md`, `--control-lg`, `--control-md`, `--control-sm`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-move`.

#### LineChart (@wunderui/react/charts)

Line chart for trends over time: smooth lines (straight on request) and stepped lines, comparisons, bands, forecasts and thresholds, with tooltip, keyboard navigation and a data table.

`import { LineChart } from "@wunderui/react/charts"`

```tsx
import { ChartCard, LineChart, useChartLegend, useChartReload } from "@wunderui/react/charts"

const series = [{ key: "revenue", label: "Revenue" }, { key: "expenses", label: "Expenses", color: "green" }]
const legend = useChartLegend(series)
const loader = useChartReload()              // reload → skeleton → draw-in again
const [active, setActive] = useState<number | null>(null)
const i = active ?? data.length - 1           // headline follows the hovered point

<ChartCard
  title={`Revenue · ${data[i].month}`}
  value={data[i].revenue}                     // counts to each new value
  valueFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
  onReload={() => loader.reload(fetchData)}
  periods={["12 months", "30 days", "7 days"]}
  onPeriodChange={setPeriod}                  // new data → the chart enters again
  legend={legend.items}
  hiddenSeries={legend.hidden}
  onLegendToggle={legend.toggle}
  state={loader.state}
>
  <LineChart variant="smooth-line" data={data} index="month" series={series} hiddenSeries={legend.hidden}
    state={loader.state} animationKey={loader.version} onActiveIndexChange={setActive} />
</ChartCard>
```

```ts
function LineChart({ variant, threshold, thresholdLabel, referenceBand, bands, forecastFrom, forecastLabel, projectionIndex, indicatorBand, gradientTo, strokeWidth, curve: curveProp, series: seriesProp, valueFormatter, axisFormatter, valueDomain, gridIntervals, ...rest }: LineChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `bands` | `readonly LineChartBand[]` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `curve` | `"linear" \| "smooth" \| "step"` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `forecastFrom` | `number` | — |
| `forecastLabel` | `string` | `"Today"` |
| `gradientTo` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | `"orange"` |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `indicatorBand` | `{ lower: number; upper: number }` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `projectionIndex` | `number` | — |
| `rangeSelectable` | `boolean` | — |
| `referenceBand` | `{ from: number; to: number; label?: string }` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `strokeWidth` | `number` | — |
| `threshold` | `number` | `0` |
| `thresholdLabel` | `string` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"basic-line" \| "stroke-line" \| "dashed-line" \| "basic-step" \| "stroke-step" \| "dashed-step" \| "gradient-line" \| "smooth-line" \| "comparison-line" \| "po` | `"basic-line"` |
| `width` | `number` | — |

#### BarChart (@wunderui/react/charts)

Bar chart for comparing values: grouped, horizontal, diverging, top-k and highlighted bars, with tooltip, keyboard navigation and a data table.

`import { BarChart } from "@wunderui/react/charts"`

```tsx
import { BarChart, ChartCard, useChartLegend } from "@wunderui/react/charts"

<ChartCard title="Bar Charts" legend={legend.items} hiddenSeries={legend.hidden} onLegendToggle={legend.toggle}>
  <BarChart variant="grouped-bar" data={data} index="month" series={series} hiddenSeries={legend.hidden} />
</ChartCard>
```

```ts
function BarChart({ variant, threshold, thresholdLabel, highlightIndex, highlightColor, negativeColor, topK, othersLabel, showValues, barWidth, radius, series: seriesProp, data: dataProp, index, ...rest }: BarChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `barWidth` | `number` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `highlightColor` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | `"blue"` |
| `highlightIndex` | `number` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `negativeColor` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | `"red"` |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `othersLabel` | `string` | — |
| `radius` | `number` | — |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `showValues` | `boolean` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `threshold` | `number` | — |
| `thresholdLabel` | `string` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `topK` | `number` | `6` |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"basic-bar" \| "grouped-bar" \| "stroke-bar" \| "gradient-bar" \| "dashed-bar" \| "duotone-bar" \| "stripped-bar" \| "horizontal-bar" \| "negative-bar" \| "loll` | `"basic-bar"` |
| `width` | `number` | — |

Theming: reads `--chart-5`, `--destructive`, `--destructive-foreground`, `--foreground`, `--text-tertiary`.

#### AreaChart (@wunderui/react/charts)

Area chart for volumes over time: gradients, steps, ranges, a horizon graph, differences and target lines.

`import { AreaChart } from "@wunderui/react/charts"`

```tsx
<AreaChart variant="overlap-area" data={data} index="hour" series={[{ key: "ok", label: "2xx", color: "green" }, { key: "c4", label: "4xx", color: "yellow" }, { key: "c5", label: "5xx", color: "red" }]} />
```

```ts
function AreaChart({ variant, threshold, thresholdLabel, range, horizonBands, curve, lineOnly: lineOnlyKeys, fillOnly, fillOpacity, series: seriesProp, ...rest }: AreaChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `curve` | `"linear" \| "smooth" \| "step"` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `fillOnly` | `readonly string[]` | — |
| `fillOpacity` | `number` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `horizonBands` | `number` | `2` |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `lineOnly` | `readonly string[]` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `range` | `{ lower: string; upper: string; label?: string }` | — |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `threshold` | `number` | `0` |
| `thresholdLabel` | `string` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"basic-area" \| "gradient-area" \| "gradient-reverse-area" \| "stroke-area" \| "dashed-area" \| "step-area" \| "smooth-area" \| "overlap-area" \| "positive-nega` | `"basic-area"` |
| `width` | `number` | — |

Theming: reads `--muted`, `--text-tertiary`.

#### ComposedChart (@wunderui/react/charts)

Bars, lines and areas in one plot, with an optional second value axis.

`import { ComposedChart } from "@wunderui/react/charts"`

```tsx
<ComposedChart variant="bar-line" data={data} index="week" series={[{ key: "orders", label: "Orders", type: "bar" }, { key: "rate", label: "Conversion rate", type: "line", axis: "right" }]} rightAxisFormatter={(v) => `${v}%`} />
```

```ts
function ComposedChart({ variant, series: seriesProp, rightAxisFormatter, rightAxisDomain, ...rest }: ComposedChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ComposedSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `rangeSelectable` | `boolean` | — |
| `rightAxisDomain` | `readonly number[]` | — |
| `rightAxisFormatter` | `(v: number) => string` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"bar-line" \| "bar-area" \| "area-line-dual-axis" \| "bar-line-markers"` | `"bar-line"` |
| `width` | `number` | — |

Theming: reads `--card`.

#### StackedChart (@wunderui/react/charts)

Stacked chart for the parts of a total: stacked and 100 % columns, stacked areas, diverging Likert bars, Marimekko and gapped rows.

`import { StackedChart } from "@wunderui/react/charts"`

```tsx
<StackedChart variant="stacked-bar" data={data} index="hour" series={codes} hiddenSeries={legend.hidden} />
```

```ts
function StackedChart({ variant, negativeCount, showSegmentLabels, barWidth, segmentGap, valueFormatter, axisFormatter, ...rest }: StackedChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `barWidth` | `number` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `negativeCount` | `number` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `rangeSelectable` | `boolean` | — |
| `segmentGap` | `number` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `showSegmentLabels` | `boolean` | `true` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"stacked-bar" \| "stacked-bar-100" \| "horizontal-stacked-bar" \| "stacked-area" \| "stacked-area-100" \| "stacked-gradient-bar" \| "diverging-stacked-bar" \| "` | `"stacked-bar"` |
| `width` | `number` | — |

Theming: reads `--card`, `--duration-base`, `--ease-entrance`.

#### PieChart (@wunderui/react/charts)

Pie and donut charts for shares of a whole: pies, donuts, half and nested rings, rose and polar bars, labelled and exploded pies.

`import { PieChart } from "@wunderui/react/charts"`

```ts
function PieChart({ variant, centerLabel, centerValue, nested, max, explodeIndex, innerRadius, center, ...rest }: PieChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `center` | `React.ReactNode` | — |
| `centerLabel` | `string` | — |
| `centerValue` | `number` | — |
| `className` | `string` | — |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `explodeIndex` | `number` | `0` |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `innerRadius` | `number` | — |
| `label` | `string` | — |
| `max` | `number` | `100` |
| `nested` | `readonly ChartDatum[]` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `value` | `string` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"pie" \| "donut" \| "donut-center-label" \| "half-donut" \| "pad-angle-donut" \| "nested-pie" \| "multi-ring-donut" \| "nightingale-rose" \| "labelled-pie" \| "` | `"donut"` |
| `width` | `number` | — |

Theming: reads `--border-control`, `--brand-600`, `--card`, `--chart-2`, `--chart-3`, `--chart-4`, `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--duration-base`, `--duration-slow`, `--ease-entrance`.

#### RadialChart (@wunderui/react/charts)

Radial chart for progress against a goal: radial bars, a stacked ring, a progress ring and activity rings.

`import { RadialChart } from "@wunderui/react/charts"`

```ts
function RadialChart({ variant, max, centerLabel, ...rest }: RadialChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `centerLabel` | `string` | — |
| `className` | `string` | — |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `max` | `number` | `100` |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `value` | `string` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"radial-bar" \| "radial-stacked" \| "progress-ring" \| "multi-ring-progress"` | `"radial-bar"` |
| `width` | `number` | — |

Theming: reads `--foreground`, `--muted`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### GaugeChart (@wunderui/react/charts)

Gauge for one value on its scale: semi-circle, speedometer, ring or segmented. The arc draws to the value and the number counts up.

`import { GaugeChart } from "@wunderui/react/charts"`

```ts
function GaugeChart({ variant, value, min, max, label, caption, bands, color, segments, needle, ticks, minLabel, maxLabel, valueFormatter, height, ...rest }: GaugeChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `bands` | `readonly GaugeBand[]` | — |
| `caption` | `string` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | — |
| `height` | `number` | `220` |
| `label` | `string` | `"Value"` |
| `max` | `number` | `100` |
| `maxLabel` | `string` | — |
| `min` | `number` | `0` |
| `minLabel` | `string` | — |
| `needle` | `boolean` | `false` |
| `onRetry` | `() => void` | — |
| `segments` | `number` | `10` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `ticks` | `number` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"semi-circle-gauge" \| "speedometer-gauge" \| "ring-gauge" \| "segmented-gauge"` | `"semi-circle-gauge"` |
| `width` | `number` | — |

Theming: reads `--border`, `--foreground`, `--muted`, `--text-tertiary`.

#### RadarChart (@wunderui/react/charts)

Radar chart for comparing profiles across several measures, on a polygon or circular grid.

`import { RadarChart } from "@wunderui/react/charts"`

```ts
function RadarChart({ variant, series, max: maxProp, hiddenSeries, ...rest }: RadarChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `max` | `number` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"basic-radar" \| "filled-radar" \| "multi-series-radar" \| "circular-radar" \| "radar-with-dots"` | `"filled-radar"` |
| `width` | `number` | — |

Theming: reads `--border`, `--card`, `--foreground`, `--text-tertiary`.

#### FunnelChart (@wunderui/react/charts)

Funnel chart for conversion between steps: trapezoid funnel and pyramid, bar funnels and KPI-column funnel areas, with the step conversion in the tooltip.

`import { FunnelChart } from "@wunderui/react/charts"`

```ts
function FunnelChart({ variant, mirror, previous, color, sideLabels, ...rest }: FunnelChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | `"indigo"` |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `mirror` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `previous` | `string` | — |
| `sideLabels` | `readonly [string, string]` | `["A", "B"]` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `value` | `string` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"vertical-funnel" \| "horizontal-funnel" \| "pyramid" \| "mirrored-funnel" \| "stepped-funnel" \| "funnel-area" \| "funnel-area-7-steps" \| "funnel-area-6-steps` | `"vertical-funnel"` |
| `width` | `number` | — |

Theming: reads `--border`, `--chart-5`, `--foreground`, `--muted`, `--text-link`, `--text-tertiary`, `--tint-green`, `--tint-red`, `--tint-text-green`, `--tint-text-red`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### ProgressChart (@wunderui/react/charts)

Progress chart for quotas and goals: meters, a segmented bar and a waffle.

`import { ProgressChart } from "@wunderui/react/charts"`

```ts
function ProgressChart({ variant, max, ...rest }: ProgressChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `max` | `number` | `100` |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `value` | `string` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"meter" \| "segmented-progress" \| "waffle"` | `"meter"` |
| `width` | `number` | — |

Theming: reads `--foreground`, `--muted`, `--text-secondary`.

#### BulletChart (@wunderui/react/charts)

Bullet chart for a measure against its target and qualitative ranges — horizontal, vertical or as a KPI list.

`import { BulletChart } from "@wunderui/react/charts"`

```ts
function BulletChart({ variant, target, ranges, ...rest }: BulletChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `ranges` | `readonly string[]` | `["poor", "ok", "good"]` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `target` | `string` | `"target"` |
| `tooltip` | `boolean` | — |
| `value` | `string` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"bullet" \| "vertical-bullet" \| "bullet-list"` | `"bullet"` |
| `width` | `number` | — |

Theming: reads `--alternative-200`, `--brand-600`, `--card`, `--chart-5`, `--foreground`, `--text-secondary`, `--text-tertiary`.

#### Sparkline (@wunderui/react/charts)

Small trend charts: KPI tiles, a metric list, a column strip and a win/loss strip, plus SparklineMini for tables and tiles.

`import { Sparkline } from "@wunderui/react/charts"`

```ts
function Sparkline({ variant, metrics, data, valueFormatter, height, color, highlight, state, label, animate, className }: SparklineProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `animate` | `boolean` | `true` |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | — |
| `data` | `readonly number[]` | `[]` |
| `height` | `number` | `48` |
| `highlight` | `number` | — |
| `label` | `string` | `"Sparkline"` |
| `metrics` | `readonly SparklineMetric[]` | `[]` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | `"ready"` |
| `valueFormatter` | `(v: number) => string` | `(v) => String(v)` |
| `variant` | `"kpi-tiles" \| "metric-list" \| "bar-sparkline" \| "win-loss-sparkline"` | `"kpi-tiles"` |

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--radius-xl`.

#### CandlestickChart (@wunderui/react/charts)

Candlestick chart for prices: candles, hollow candles, OHLC bars, volume, moving averages, Heikin-Ashi, an order-book depth chart and Renko, on a right-hand price axis.

`import { CandlestickChart } from "@wunderui/react/charts"`

```ts
function CandlestickChart({ variant, open, high, low, close, volume, movingAverages, brickSize, bid, ask, ...rest }: CandlestickChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `ask` | `string` | `"ask"` |
| `axisFormatter` | `ChartValueFormatter` | — |
| `bid` | `string` | `"bid"` |
| `brickSize` | `number` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `close` | `string` | `"close"` |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `high` | `string` | `"high"` |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `low` | `string` | `"low"` |
| `movingAverages` | `readonly number[]` | `[7, 21]` |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `open` | `string` | `"open"` |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"candles" \| "hollow-candles" \| "ohlc" \| "candles-volume" \| "candles-moving-average" \| "heikin-ashi" \| "depth-chart" \| "renko"` | `"candles"` |
| `volume` | `string` | `"volume"` |
| `width` | `number` | — |

Theming: reads `--card`, `--chart-5`.

#### BubbleChart (@wunderui/react/charts)

Scatter and bubble charts for the relation between two or three values: scatter, bubbles, dot plot, dot matrix, regression, quadrants, beeswarm and a connected scatter.

`import { BubbleChart } from "@wunderui/react/charts"`

```ts
function BubbleChart({ variant, x, y, size, group, groups: groupsProp, series, unit, xLabel, yLabel, xFormatter, quadrant, includeZero, valueFormatter, height, ...rest }: BubbleChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `group` | `string` | — |
| `groups` | `readonly BubbleGroup[]` | — |
| `height` | `number` | `434` |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `quadrant` | `{ x?: number; y?: number; labels?: readonly [string, string, string, string] }` | — |
| `series` | `readonly ChartSeries[]` | `[]` |
| `size` | `string` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `unit` | `number` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"scatter" \| "bubble" \| "dot-plot" \| "dot-matrix" \| "scatter-with-regression" \| "quadrant-scatter" \| "beeswarm" \| "connected-scatter"` | `"scatter"` |
| `width` | `number` | — |
| `x` | `string` | `"x"` |
| `xFormatter` | `ChartValueFormatter` | — |
| `xLabel` | `string` | — |
| `y` | `string` | `"y"` |
| `yLabel` | `string` | — |

Theming: reads `--border`, `--border-control`, `--card`, `--foreground`, `--text-secondary`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### HeatmapChart (@wunderui/react/charts)

Heatmap for values across two dimensions: a weekday × hour matrix, a contribution calendar, a punch card, labelled cells and a correlation matrix.

`import { HeatmapChart } from "@wunderui/react/charts"`

```ts
function HeatmapChart({ variant, matrix, rowLabels, columnLabels, columnTickEvery, color, caption, showLegend, valueFormatter, height, ...rest }: HeatmapChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `columnLabels` * | `readonly string[]` | — |
| `matrix` * | `readonly (readonly (number \| null)[])[]` | — |
| `rowLabels` * | `readonly string[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `caption` | `string` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "green" \| "orange" \| "pink" \| "yellow" \| "red" \| "grey"` | — |
| `columnTickEvery` | `number` | `1` |
| `defaultActiveIndex` | `number \| null` | — |
| `height` | `number` | — |
| `label` | `string` | — |
| `onRetry` | `() => void` | — |
| `showLegend` | `boolean` | `true` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"matrix-heatmap" \| "calendar-heatmap" \| "punch-card" \| "labelled-heatmap" \| "correlation-matrix"` | `"matrix-heatmap"` |
| `width` | `number` | — |

Theming: reads `--card`, `--chart-5`, `--foreground`, `--muted`, `--text-tertiary`.

#### DistributionChart (@wunderui/react/charts)

Distribution chart for raw observations: histograms, box plot, violin, density, ridgeline, strip plot and error bars.

`import { DistributionChart } from "@wunderui/react/charts"`

```ts
function DistributionChart({ variant, groups, bins, markers, valueFormatter, ...rest }: DistributionChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `groups` * | `readonly DistributionGroup[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `bins` | `number` | `24` |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `markers` | `readonly { value: number; label: string }[]` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"histogram" \| "cumulative-histogram" \| "layered-histogram" \| "boxplot" \| "violin" \| "density" \| "ridgeline" \| "strip-plot" \| "error-bars"` | `"histogram"` |
| `width` | `number` | — |

Theming: reads `--card`, `--foreground`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### WaterfallChart (@wunderui/react/charts)

Waterfall chart for how a total changes: the start total, the changes that move it and the end total, in one indigo scale with a +/− sign on every change.

`import { WaterfallChart } from "@wunderui/react/charts"`

```ts
function WaterfallChart({ variant, value, total, ...rest }: WaterfallChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `total` | `string` | — |
| `value` | `string` | `"value"` |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"basic-waterfall" \| "waterfall-with-connectors" \| "horizontal-waterfall"` | `"basic-waterfall"` |
| `width` | `number` | — |

Theming: reads `--border-control`, `--brand-300`, `--brand-500`, `--brand-700`, `--chart-5`, `--foreground`.

#### RangeBarChart (@wunderui/react/charts)

Range bar chart for a span per category — minimum to maximum, planned against actual, as dumbbells or as gradient bars.

`import { RangeBarChart } from "@wunderui/react/charts"`

```ts
function RangeBarChart({ variant, ranges, ...rest }: RangeBarChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `ranges` | `readonly RangeBarRange[]` | `[{ low: "min", high: "max", label: "Range" }]` |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"vertical-range-bar" \| "horizontal-range-bar" \| "range-bar-dots" \| "gradient-range-bar"` | `"vertical-range-bar"` |
| `width` | `number` | — |

#### StatusTracker (@wunderui/react/charts)

Status tracker for uptime and run history, plus StatusStripMini — the small strip for tables and lists.

`import { StatusTracker } from "@wunderui/react/charts"`

```ts
function StatusTracker({ variant, rows, height, ...rest }: StatusTrackerProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `rows` * | `readonly TrackerRow[]` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `height` | `number` | — |
| `label` | `string` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `variant` | `"uptime-tracker" \| "run-history"` | `"uptime-tracker"` |
| `width` | `number` | — |

Theming: reads `--brand-600`, `--chart-4`, `--chart-5`, `--destructive`, `--foreground`, `--muted`, `--text-tertiary`, `--yellow-600`, `--duration-fast`, `--ease-entrance`.

#### SankeyChart (@wunderui/react/charts)

Sankey chart for flows between stages: basic and gradient flows, a vertical sankey, an alluvial and a chord diagram.

`import { SankeyChart } from "@wunderui/react/charts"`

```ts
function SankeyChart({ variant, nodes, links, columns, groups: groupsProp, valueFormatter, height, ...rest }: SankeyChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `links` * | `readonly FlowLink[]` | — |
| `nodes` * | `readonly FlowNode[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `columns` | `readonly string[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `groups` | `readonly { key: string; label?: string; color?: ChartColor }[]` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"basic-sankey" \| "gradient-sankey" \| "vertical-sankey" \| "alluvial" \| "chord"` | `"basic-sankey"` |
| `width` | `number` | — |

Theming: reads `--foreground`, `--text-secondary`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### NetworkChart (@wunderui/react/charts)

Network chart for relations: a force graph, an arc diagram, a tree and a radial tree.

`import { NetworkChart } from "@wunderui/react/charts"`

```ts
function NetworkChart({ variant, nodes, links, tree, groups: groupsProp, height, ...rest }: NetworkChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `groups` | `readonly { key: string; label?: string; color?: ChartColor }[]` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `links` | `readonly NetworkLink[]` | `[]` |
| `nodes` | `readonly NetworkNode[]` | `[]` |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tree` | `TreeDatum` | — |
| `variant` | `"force-graph" \| "arc-diagram" \| "tree" \| "radial-tree"` | `"force-graph"` |
| `width` | `number` | — |

Theming: reads `--border-control`, `--card`, `--foreground`, `--text-secondary`, `--duration-base`, `--ease-entrance`.

#### TreemapChart (@wunderui/react/charts)

Treemap for the parts of a hierarchy: squarified, nested with group headers, or as an icicle.

`import { TreemapChart } from "@wunderui/react/charts"`

```ts
function TreemapChart({ variant, data, valueFormatter, height, ...rest }: TreemapChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `HierarchyDatum` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"basic-treemap" \| "nested-treemap" \| "icicle"` | `"basic-treemap"` |
| `width` | `number` | — |

Theming: reads `--foreground`, `--duration-base`, `--ease-entrance`.

#### SunburstChart (@wunderui/react/charts)

Sunburst for a hierarchy as rings, or as circle packing.

`import { SunburstChart } from "@wunderui/react/charts"`

```ts
function SunburstChart({ variant, data, centerLabel, valueFormatter, height, ...rest }: SunburstChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `HierarchyDatum` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `centerLabel` | `string` | `"total"` |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `height` | `number` | `360` |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"basic-sunburst" \| "circle-packing"` | `"basic-sunburst"` |
| `width` | `number` | — |

Theming: reads `--foreground`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### RiverChart (@wunderui/react/charts)

River chart (streamgraph) for how a mix changes over time: plain, with gradient bands or offset.

`import { RiverChart } from "@wunderui/react/charts"`

```ts
function RiverChart({ variant, ...rest }: RiverChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `axisFormatter` | `ChartValueFormatter` | — |
| `categoryAxis` | `boolean` | — |
| `categoryFormatter` | `(label: string) => string` | — |
| `categoryTicks` | `readonly string[]` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `defaultSelectedRange` | `ChartRange \| null` | — |
| `description` | `string` | — |
| `emptyDescription` | `string` | — |
| `emptyTitle` | `string` | — |
| `errorDescription` | `string` | — |
| `errorTitle` | `string` | — |
| `grid` | `boolean` | — |
| `gridIntervals` | `number` | — |
| `gridStyle` | `"solid" \| "dashed"` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `includeZero` | `boolean` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `onSelectedRangeChange` | `(range: ChartRange \| null) => void` | — |
| `rangeSelectable` | `boolean` | — |
| `selectedRange` | `ChartRange \| null` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `tooltip` | `boolean` | — |
| `tooltipTitle` | `(datum: ChartDatum, index: number) => React.ReactNode` | — |
| `valueAxis` | `boolean` | — |
| `valueAxisSide` | `"left" \| "right"` | — |
| `valueDomain` | `readonly [number, number]` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `valueTicks` | `readonly number[]` | — |
| `variant` | `"basic-river" \| "gradient-river" \| "offset-river"` | `"basic-river"` |
| `width` | `number` | — |

Theming: reads `--card`, `--duration-base`, `--ease-entrance`.

#### SlopeChart (@wunderui/react/charts)

Slope chart for change between columns: slope, rank shift, bump chart, dumbbell and parallel coordinates.

`import { SlopeChart } from "@wunderui/react/charts"`

```ts
function SlopeChart({ variant, data, index, series, colors, rankOrder, valueFormatter, height, ...rest }: SlopeChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `readonly ChartDatum[]` | — |
| `index` * | `string` | — |
| `series` * | `readonly ChartSeries[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `colors` | `readonly ChartColor[]` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `rankOrder` | `"desc" \| "asc"` | `"desc"` |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `valueFormatter` | `ChartValueFormatter` | — |
| `variant` | `"slope-chart" \| "rank-shift" \| "bump-chart" \| "dumbbell" \| "parallel-coordinates"` | `"slope-chart"` |
| `width` | `number` | — |

Theming: reads `--border`, `--border-control`, `--card`, `--foreground`, `--text-secondary`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### TimelineChart (@wunderui/react/charts)

Timeline chart: a Gantt chart with milestones and a Today line, and an event timeline.

`import { TimelineChart } from "@wunderui/react/charts"`

```ts
function TimelineChart({ variant, items, groups: groupsProp, timeFormatter, today, todayLabel, domain, height, ...rest }: TimelineChartProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `items` * | `readonly TimelineItem[]` | — |
| `activeIndex` | `number \| null` | — |
| `animate` | `boolean` | — |
| `animationKey` | `string \| number` | — |
| `className` | `string` | — |
| `defaultActiveIndex` | `number \| null` | — |
| `description` | `string` | — |
| `domain` | `readonly [number, number]` | — |
| `groups` | `readonly { key: string; label?: string; color?: ChartColor }[]` | — |
| `height` | `number` | — |
| `hiddenSeries` | `readonly string[]` | — |
| `label` | `string` | — |
| `onActiveIndexChange` | `(index: number \| null) => void` | — |
| `onRetry` | `() => void` | — |
| `state` | `"ready" \| "loading" \| "empty" \| "error"` | — |
| `timeFormatter` | `(v: number) => string` | — |
| `today` | `number` | — |
| `todayLabel` | `string` | `"Today"` |
| `variant` | `"gantt" \| "event-timeline"` | `"gantt"` |
| `width` | `number` | — |

Theming: reads `--border`, `--border-control`, `--card`, `--destructive`, `--foreground`, `--text-error`, `--text-secondary`, `--text-tertiary`, `--duration-base`, `--ease-entrance`.

#### ChartCard

The card around a chart: title, optional headline value and trend, a period segment and legend chips above the plot.

```tsx
import { AreaChart, ChartCard } from "@wunderui/react"

<ChartCard title="Revenue" periods={["12 months", "30 days", "7 days", "24 hours"]} legend={[{ label: "Revenue" }]}>
  <AreaChart data={data} index="month" categories={["revenue"]} height={200} />
</ChartCard>
```

```ts
function ChartCard({ title, description, value, delta, children, action, periods, period, onPeriodChange, legend, hiddenSeries, onLegendToggle, className, }: {
    title: ReactNode;
    description?: string;
    /** The headline number under the title, e.g. "$84,250" — the title then reads as its small label. */
    value?: ReactNode;
    /** Trend chip under the value: "18.2%" with an arrow; `good` decides the colour (defaults to up = good). */
    delta?: {
        value: ReactNode;
        direction?: "up" | "down";
        good?: boolean;
        caption?: ReactNode;
    };
    children: ReactNode;
    action?: ReactNode;
    /** The period segment, top right. */
    periods?: string[];
    period?: string;
    onPeriodChange?: (period: string) => void;
    /** Legend chips under the header: a dot in the series colour (token or hex) on the muted surface. `badge` is kept for compatibility and no longer used. */
    legend?: {
        label: string;
        color?: string;
        badge?: BadgeColor;
    }[];
    /** Series labels switched off. Their legend chips stay, dimmed, so they can be switched back on. */
    hiddenSeries?: string[];
    /** Makes the legend chips toggle buttons (`aria-pressed`): called with the chip label. Hide the series in the chart yourself, e.g. by dropping it from `categories`. */
    onLegendToggle?: (label: string) => void;
    className?: string;
}): React.JSX.Element;
type BadgeColor = keyof typeof BADGE_COLORS;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `title` * | `ReactNode` | — |
| `action` | `ReactNode` | — |
| `className` | `string` | — |
| `delta` | `{ value: ReactNode; direction?: "up" \| "down"; good?: boolean; caption?: ReactNode }` | — |
| `description` | `string` | — |
| `hiddenSeries` | `string[]` | — |
| `legend` | `{ label: string; color?: string; badge?: BadgeColor }[]` | — |
| `onLegendToggle` | `(label: string) => void` | — |
| `onPeriodChange` | `(period: string) => void` | — |
| `period` | `string` | — |
| `periods` | `string[]` | — |
| `value` | `ReactNode` | — |

Anatomy:

- `ChartCard` (`data-slot="chart-card"`): The card around a chart: title or small label with an optional headline `value` and trend chip, a period Segment on the right and legend chips above the plot.

Best practices:

- **When:** Use ChartCard around any chart that needs a title, headline number or period switch. For a number without a chart use MetricCard.
- **Do:** Pass `value` and `delta` for a headline: the `title` then reads as a small label above the number. Use `good` on `delta` when a fall is the good direction.
- **Do:** Give `legend` the same colours as the series, in the same order. Entries default to `--chart-1` to `--chart-5`, so a custom `colors` array needs matching `color` values.
- **Do:** Handle the period with `period` and `onPeriodChange`, and reload the chart's data in that handler. `periods` alone only keeps its own selected state.
- **Don't:** Don't add a second heading inside the chart. The card title is the heading; use `description` for the unit or range.
- **Don't:** Don't put a ChartCard inside another card. It is already a bordered, shadowed surface at least 320 px wide on larger screens.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### Agenda

A time-ordered list of scheduled events.

```tsx
<Agenda items={[{ id, time, title, description, color }]} />
```

```ts
function Agenda({ items, className, }: {
    items: AgendaItem[];
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `items` * | `AgendaItem[]` | — |
| `className` | `string` | — |

Anatomy:

- `Agenda`: The bordered list of `items`, one row each, in the order of the array. It does not sort by time.
- `Row`: One entry: its `time`, a colour bar, the `title` and an optional `description`. Rows are text only, with no click or focus state.
- `Time`: The `time` string as written, in a narrow fixed column on the left.
- `Colour bar` — optional: A thin bar in the item's `color`, set as an inline style; without one it takes the primary colour.

Best practices:

- **When:** Use an Agenda for a short, read-only list of what happens when, such as a day's meetings. For past events in order, use Timeline; for rows with guests, a menu or a click action, use Agenda Event.
- **Do:** Sort `items` by time before passing them in. The list renders them in array order.
- **Do:** Write `time` in one short format across the list, such as `09:30`. The time column is narrow and fixed, so a long range wraps onto a second line.
- **Do:** Set `color` to a CSS variable such as `var(--primary)`, not a hex. The value goes straight into an inline style, and only a token follows the theme and dark mode.
- **Don't:** Don't make the Agenda clickable by wrapping it in a link or button. Its rows have no hover or focus state; use Agenda Event with `onClick` when an entry opens something.

Theming: reads `--border`, `--brand-600`, `--card`, `--foreground`, `--text-secondary`, `--text-tertiary`, `--radius-lg`.

#### ActionBar

A pill-shaped bar of bulk actions for a selection. It sits where you place it, so fix it to the bottom of the page yourself if it should float.

```tsx
<ActionBar label="3 selected">
  <Button variant="plain" size="sm">Archive</Button>
</ActionBar>
```

```ts
function ActionBar({ label, children, className, }: {
    label?: ReactNode;
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `className` | `string` | — |
| `label` | `ReactNode` | — |

Anatomy:

- `ActionBar`: The pill-shaped bar with a shadow. It does not position itself: place it fixed or sticky near the list it acts on.
- `Label` — optional: The `label`, such as `3 selected`, followed by a vertical separator. Without a label the separator goes too.
- `Actions`: The `children`, laid out in one row with a small gap; usually small plain buttons and icon buttons.

Best practices:

- **When:** Use an Action Bar for bulk actions on rows someone has selected: export, archive, delete. For actions that are always available, use Toolbar.
- **Do:** Show the bar only while something is selected and put the count in `label`: `3 selected`. The count tells people what the buttons will act on.
- **Do:** Give icon-only buttons in the bar an `aria-label`. The bar has no role or name of its own, so each button has to carry its own name.
- **Do:** Place the bar yourself, for example fixed and centred near the bottom of the view. `ActionBar` draws the pill; it neither positions nor animates itself.
- **Don't:** Don't run a destructive bulk action straight from the bar. Confirm it in an Alert Dialog that names how many items go: `Delete 3 invoices?`.

Theming: reads `--border`, `--card`, `--foreground`, `--shadow-lg`.

#### Carousel

A horizontally scrollable row of items with arrow controls.

```tsx
<Carousel>
  {projects.map((project) => (
    <Card key={project.id} className=\"w-48\">
      <CardMedia />
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.meta}</CardDescription>
      </CardHeader>
    </Card>
  ))}
</Carousel>
```

```ts
function Carousel({ children, className, label, navigationShape, showArrows, slideSize, autoPlay, index, onIndexChange, drag, }: CarouselProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `autoPlay` | `number` | — |
| `className` | `string` | — |
| `drag` | `boolean` | `true` |
| `index` | `number` | — |
| `label` | `string` | `"Carousel"` |
| `navigationShape` | `"circle" \| "rounded"` | `"rounded"` |
| `onIndexChange` | `(index: number) => void` | — |
| `showArrows` | `boolean` | `true` |
| `slideSize` | `"auto" \| "full"` | `"auto"` |

Anatomy:

- `Carousel`: A row with a slide strip between two arrow buttons. It snaps to each slide and pauses `autoPlay` while hovered or focused.
- `Previous and next buttons` — optional: Plain icon buttons that step one slide. At either end they stay focusable but disabled; without overflow they are hidden.
- `Slide strip`: The focusable region named by `label`. It scrolls with the arrow keys, drags with a mouse or pen, and announces `Items 2–4 of 6` after a scroll.
- `Slide`: Each child, wrapped in a snap point. With `slideSize="full"` every slide is as wide as the strip.

Best practices:

- **When:** Use a Carousel for a row of similar items that people browse, such as product images or template previews. When every item matters, show them all in a grid instead.
- **Do:** Set `label` to what the row holds: `Template previews`. It names the region, and the default `Carousel` tells nobody what is inside.
- **Do:** Drive dots or thumbnails through `index` and `onIndexChange` instead of scrolling the strip yourself. The carousel springs to the slide and reports the one in view.
- **Do:** Keep `autoPlay` for images, not text. It pauses on hover, focus, a hidden tab and reduced motion, but moving slides are hard to read.
- **Don't:** Don't leave `drag` on when slides hold controls that need the mouse, such as a slider. Set `drag={false}`; touch still swipes natively.

Theming: reads `--ring`.

#### DataGrid

A full-featured table: sort, search, select, resize columns, paginate.

```tsx
<DataGrid
  columns={[{ key: "name", header: "Name", sortable: true, render: (r) => r.name }]}
  data={rows}
/>
```

```ts
function DataGrid<T extends {
    id: string | number;
}>({ columns, data, selectable, pageSize, searchable, className, }: {
    columns: DataGridColumn<T>[];
    data: T[];
    /** Row checkboxes and the "n of m selected" footer. Default true; false shows the row count instead. */
    selectable?: boolean;
    /** Rows per page. Default 5. */
    pageSize?: number;
    /** Search field above the grid (uses each column's filterValue). Default true. */
    searchable?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `columns` * | `DataGridColumn<T>[]` | — |
| `data` * | `T[]` | — |
| `className` | `string` | — |
| `pageSize` | `number` | `5` |
| `searchable` | `boolean` | `true` |
| `selectable` | `boolean` | `true` |

Anatomy:

- `DataGrid`: A complete grid: search field, sortable and resizable columns, optional row checkboxes, and a footer with the page controls. Each column is a `DataGridColumn` with a `render` function.

Best practices:

- **When:** Use a DataGrid for a compact list of records that needs search, sorting and paging in one component. If you need column filters, export or bulk actions on selected rows, use Data Table.
- **Do:** Give each `DataGridColumn` a `filterValue` that returns plain text. Search reads it, and sorting compares it with `localeCompare`, so a column without one is neither searched nor sorted by value.
- **Do:** Keep a stable `id` on every row. Selection and paging use it, and the rows are keyed by it.
- **Do:** Set `selectable={false}` for read-only lists. The footer then counts rows instead of showing `n of m selected`.
- **Don't:** Don't sort number columns through the text alone. The comparison is textual, so `10` lands before `9`; return a zero-padded string from `filterValue`.
- **Don't:** Don't expect to read the selection from outside. The grid keeps the selected rows to itself and has no callback for them.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--ring`, `--text-tertiary`, `--radius-lg`.

#### FilterMenu

A filter button that opens a checklist of options with counts, an all-row and Clear filter — for table and list filters.

```tsx
import { FilterMenu } from "@wunderui/react"

const options = [
  { value: "paid", label: "Paid", count: 18 },
  { value: "pending", label: "Pending", count: 6 },
  { value: "overdue", label: "Overdue", count: 3 },
]

const [value, setValue] = React.useState(options.map((o) => o.value))

<FilterMenu label="Status" options={options} value={value} onValueChange={setValue} />
```

```ts
function FilterMenu({ label, options, value, onValueChange, allLabel, onClear, icon, size, align, className }: FilterMenuProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: string[]) => void` | — |
| `options` * | `FilterMenuOption[]` | — |
| `value` * | `string[]` | — |
| `align` | `"start" \| "center" \| "end"` | `"end"` |
| `allLabel` | `string` | `"All"` |
| `className` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `label` | `string` | `"Filters"` |
| `onClear` | `() => void` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

Anatomy:

- `FilterMenu` (`data-slot="filter-menu"`): A multi-select filter: a trigger button and a menu of checkbox rows. `value` lists the checked options, and every option checked means no filter.
- `Trigger` (`data-slot="filter-menu-trigger"`): The plain button with the filter icon. It shows the count (`Filters · 2`) and takes the link colour while the list is filtered.
- `All row` (`data-slot="filter-menu-all"`): The first row. It checks or clears every option and shows checked, mixed or empty, depending on how many options are on.
- `Option row` (`data-slot="filter-menu-item"`) — optional: One option with a checkbox and an optional `count` on the right. Ticking it keeps the menu open.
- `Checkbox square` (`data-slot="filter-menu-box"`) — optional: The visual checkbox at the start of a row. It is decorative; the row itself carries the checked state.
- `Clear filter` (`data-slot="filter-menu-clear"`): Resets to every option checked and then calls `onClear`. It is disabled while no filter is active.

Best practices:

- **When:** Use a FilterMenu to narrow a list or table by one attribute with several values, such as status or owner. For choosing a single value, use a select.
- **Do:** Start with every option in `value`. Checked means shown, so the full list is the unfiltered state and the trigger stays in its plain look.
- **Do:** Pass `count` for each option when you have it. People see how many rows a choice leaves before they tick it.
- **Do:** Use `onClear` to reset the dependent state, such as the page number. `Clear filter` selects all options itself and then calls it.
- **Don't:** Don't hold an empty `value` as the idle state. Nothing checked reads as a filter that shows nothing, and the trigger turns active.
- **Don't:** Don't change the `label` per selection. The trigger adds the count itself, and its accessible name reads `Filters, 2 of 4 selected`.

Theming: reads `--accent`, `--accent-foreground`, `--border-control`, `--card`, `--primary`, `--primary-foreground`, `--text-link`, `--text-tertiary`, `--tint-indigo`, `--radius-md`, `--radius-sm`, `--menu-item-py`, `--duration-fast`, `--ease-entrance`.

#### DataTable

A data table on TanStack Table: sort on several columns, filter from the column definitions, select rows with a floating action bar, expand, pin, page and export to CSV — with controlled state for server-side data.

```tsx
import { createDataTableColumnHelper } from "@wunderui/react"

const column = createDataTableColumnHelper<Order>()

const columns = column.columns([
  column.accessor("customer", { header: "Customer", meta: { filter: { type: "text" } } }),
  column.accessor("status", {
    header: "Status",
    cell: (info) => <Badge color="green" badgeStyle="light">{info.getValue()}</Badge>,
    meta: { filter: { type: "multiSelect" } },
  }),
  column.accessor("plan", { header: "Plan", meta: { filter: { type: "select" } } }),
  column.accessor("amount", {
    header: "Amount",
    cell: (info) => currency.format(info.getValue()),
    meta: { numeric: true, filter: { type: "number", unit: "USD" } },
  }),
])

<DataTable
  columns={columns}
  data={orders}          // keep columns and data stable: module constants, state or useMemo
  getRowId={(row) => row.id}
  rowLabel={(row) => row.customer}
  bulkActions={({ ids, clear }) => <Button variant="plain" size="sm" onClick={() => remove(ids)}>Delete {ids.length}</Button>}
/>
```

```ts
function DataTable<TData extends RowData>({ columns, data, getRowId, "aria-label": ariaLabel, className, selectable, searchable, searchPlaceholder, columnVisibilityMenu, pinnable, exportable, exportFileName, onExport, paginated, pageSizeOptions, renderSubRow, getRowCanExpand, bulkActions, toolbarActions, rowLabel, loading, loadingRows, error, onRetry, emptyState, sorting: sortingProp, onSortingChange, columnFilters: columnFiltersProp, onColumnFiltersChange, globalFilter: globalFilterProp, onGlobalFilterChange, columnVisibility: columnVisibilityProp, onColumnVisibilityChange, rowSelection: rowSelectionProp, onRowSelectionChange, pagination: paginationProp, onPaginationChange, columnPinning: columnPinningProp, onColumnPinningChange, expanded: expandedProp, onExpandedChange, initialState, onQueryChange, serverSide, rowCount, }: DataTableProps<TData>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `columns` * | `DataTableColumnDef<TData>[]` | — |
| `data` * | `TData[]` | `EMPTY_DATA` |
| `aria-label` | `string` | — |
| `bulkActions` | `(context: DataTableBulkContext<TData>) => React.ReactNode` | — |
| `className` | `string` | — |
| `columnFilters` | `ColumnFiltersState` | — |
| `columnPinning` | `ColumnPinningState` | — |
| `columnVisibility` | `ColumnVisibilityState` | — |
| `columnVisibilityMenu` | `boolean` | `true` |
| `emptyState` | `React.ReactNode` | — |
| `error` | `boolean \| string \| DataTableError` | — |
| `expanded` | `ExpandedState` | — |
| `exportable` | `boolean` | `true` |
| `exportFileName` | `string` | `"table"` |
| `getRowCanExpand` | `(row: TData) => boolean` | — |
| `getRowId` | `(row: TData, index: number) => string` | — |
| `globalFilter` | `string` | — |
| `initialState` | `Partial<DataTableState>` | — |
| `loading` | `boolean` | `false` |
| `loadingRows` | `number` | — |
| `onColumnFiltersChange` | `(next: ColumnFiltersState) => void` | — |
| `onColumnPinningChange` | `(next: ColumnPinningState) => void` | — |
| `onColumnVisibilityChange` | `(next: ColumnVisibilityState) => void` | — |
| `onExpandedChange` | `(next: ExpandedState) => void` | — |
| `onExport` | `(context: DataTableExportContext<TData>) => void` | — |
| `onGlobalFilterChange` | `(next: string) => void` | — |
| `onPaginationChange` | `(next: PaginationState) => void` | — |
| `onQueryChange` | `(query: DataTableQuery) => void` | — |
| `onRetry` | `() => void` | — |
| `onRowSelectionChange` | `(next: RowSelectionState) => void` | — |
| `onSortingChange` | `(next: SortingState) => void` | — |
| `pageSizeOptions` | `number[]` | `DEFAULT_PAGE_SIZES` |
| `paginated` | `boolean` | `true` |
| `pagination` | `PaginationState` | — |
| `pinnable` | `boolean` | `true` |
| `renderSubRow` | `(row: TData) => React.ReactNode` | — |
| `rowCount` | `number` | — |
| `rowLabel` | `(row: TData) => string` | — |
| `rowSelection` | `RowSelectionState` | — |
| `searchable` | `boolean` | `true` |
| `searchPlaceholder` | `string` | `"Search…"` |
| `selectable` | `boolean` | `true` |
| `serverSide` | `DataTableServerSide` | — |
| `sorting` | `SortingState` | — |
| `toolbarActions` | `React.ReactNode` | — |

Anatomy:

- `DataTable` (`data-slot="data-table"`): The whole table: a toolbar, the grid, pagination, and an action bar while rows are selected.
- `Toolbar` — optional: Search, filters, the view menu, export and your `toolbarActions` in one row above the grid. Each part can be switched off.
- `Filters` (`data-slot="data-table-filter-trigger"`) — optional: Opens the filter menu for the columns that define a filter; active filters show as chips beside it.
- `View menu` (`data-slot="data-table-view-trigger"`) — optional: Shows and hides columns. Off with `columnVisibilityMenu={false}`.
- `Export` (`data-slot="data-table-export"`) — optional: Downloads the rows as CSV. Off with `exportable={false}`; `onExport` replaces the download.
- `Sort button` (`data-slot="data-table-sort"`) — optional: The sort control in a column heading. Shift-click adds the column as a further sort.
- `Column menu` (`data-slot="data-table-column-menu"`) — optional: Per-column options: sort, then-by sort, pin and hide.
- `Row details` (`data-slot="data-table-details"`) — optional: The expanded area under a row, drawn by `renderSubRow`.
- `Action bar` (`data-slot="data-table-action-bar"`) — optional: Appears while rows are selected and holds what `bulkActions` returns.
- `Pagination` — optional: Page size and page buttons under the grid. Off with `paginated={false}`.

Best practices:

- **When:** Use a Data Table when people work with the rows: sort on several columns, filter, select rows for a bulk action, or page through data that lives on a server. For a short list people only read, a Table is lighter.
- **Do:** Name the grid with `aria-label` and each row with `rowLabel`, so a checkbox reads `Select Alina Lorenz` instead of `Select row 3`.
- **Do:** Pass `loading`, `error` with `onRetry`, and an `emptyState`. The table draws the skeleton rows, the alert and the empty message itself.
- **Do:** Keep the query in the address bar with `useDataTableUrlState`, so a reload or a shared link opens the same view.
- **Don't:** Don't sort, filter or page the rows yourself before passing them in. Let the table do it, or set `serverSide` and answer `onQueryChange` with the matching page.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-secondary`, `--text-tertiary`, `--radius-2xl`, `--radius-lg`, `--radius-md`, `--control-sm`, `--field-sm`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### ListItem

One list row: an icon tile, avatar, logo, flag, checkbox or date tile on the left, title and description in the middle, a value, badge, trend, button, switch or menu on the right. Comfortable or compact, with default, hover, selected and disabled states.

```tsx
import { ListItem, ListItems } from "@wunderui/react"

<ListItems>
  <ListItem
    title="Alina Lorenz"
    description="alina@wunderui.com"
    leading={{ type: "avatar", initials: "AL", color: "purple" }}
    trailing={{ type: "value", value: "$1,240.00", sub: "Today" }}
    selected={selected}
    onSelect={() => setSelected(!selected)}
  />
</ListItems>
```

```ts
function ListItem({ title, description, meta, leading, trailing, selected, disabled, tone, onSelect, href, density: densityProp, divider: dividerProp, state, className, rowClassName, children, ...props }: ListItemProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `children` | `React.ReactNode` | — |
| `density` | `"compact" \| "comfortable"` | — |
| `description` | `React.ReactNode` | — |
| `disabled` | `boolean` | — |
| `divider` | `boolean` | — |
| `href` | `string` | — |
| `leading` | `ListLeading \| React.ReactNode` | — |
| `meta` | `React.ReactNode` | — |
| `onSelect` | `() => void` | — |
| `rowClassName` | `string` | — |
| `selected` | `boolean` | — |
| `state` | `"default" \| "hover" \| "selected" \| "disabled"` | — |
| `tone` | `"default" \| "destructive"` | `"default"` |
| `trailing` | `ListTrailing \| React.ReactNode` | — |

Also accepts the React.LiHTMLAttributes attributes (278).

Anatomy:

- `ListItem` (`data-slot="list-item"`): One row: the leading slot, the title with its description and meta line, and the trailing slot. With `onSelect` or `href` the title becomes the row's single button or link, stretched over the row.
- `IntegrationLogo` (`data-slot="integration-logo"`) — optional: A product mark (Figma, Slack, Stripe … 30 in all) at 20 px inside the plain 36 px icon-button frame. Used by the `logo` leading slot; an image, not a control.
- `IntegrationMark` (`data-slot="integration-mark"`) — optional: The bare 20 × 20 product mark, for your own buttons or chips.
- `ListFlag` (`data-slot="list-flag"`) — optional: A round country flag for the `flag` leading slot (Audience by Location).
- `ListItemLeading` (`data-slot="list-item-leading"`) — optional: The left slot, drawn from a spec: icon tile, avatar, logo, checkbox, drag handle, date tile, icon, rank, step, flag or coin. A React node passes through.
- `ListItems` (`data-slot="list-items"`) — optional: The list itself (`role="list"`). Sets density, dividers and the timeline connector for its rows, and renders `items` data.
- `ListItemTrailing` (`data-slot="list-item-trailing"`) — optional: The right slot, drawn from a spec: value, value with badge or trend, trend, progress, button, switch, icon button with menu, chevron, shortcut, badge, avatars or time with unread dot.
- `Row` (`data-slot="list-item-row"`): The 8 px rounded surface that takes the hover, selected and pressed states; 12 px padding (8 px above and below when compact).
- `Content` (`data-slot="list-item-content"`): Title (14 medium), description (12, secondary) and meta line (12, tertiary).
- `CoinLogo` (`data-slot="coin-logo"`) — optional: A round coin mark (Bitcoin, Ethereum, Solana … 30 in all) at 20 px inside the plain 36 px icon-button frame, for the `coin` leading slot. Decorative: the coin name stays in the row text.
- `CoinMark` (`data-slot="coin-mark"`) — optional: The bare round coin mark, for your own chips, tables and pickers.

Best practices:

- **When:** Use a List Item for a row people scan and act on in one place: a person, a payment, an app, a setting. To compare many columns across rows, use a Table or Data Table.
- **Do:** Give the row one primary action through `onSelect` or `href`. Buttons, switches and menus in the trailing slot stay separate tab stops.
- **Do:** Pick one leading type per list, so the titles line up and the eye can scan down one edge.
- **Do:** For crypto rows pass `leading: { type: "coin", coin: "btc" }`: the real mark is drawn and kept away from screen readers, because the coin name is already in the title.
- **Do:** Keep the trailing value short and tabular: an amount, a badge or a trend. Put the explanation in the description.
- **Don't:** Don't put two buttons in the trailing slot; move secondary actions into the icon-button menu.
- **Don't:** Don't use selected for hover or focus. It marks the chosen row, and the title turns link-coloured with it.

Theming: reads `--border`, `--brand-primary`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-error`, `--text-link`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-md`, `--duration-fast`, `--ease-entrance`, `--ease-exit`.

#### ListGroup

A 400 px card of list rows with an optional header — sixteen ready patterns: basic, icon, avatar, brand, metric, selectable, toggle, sortable, expandable, grouped, ranking, comparison, tree, action, discussion and master–detail.

```tsx
import { ListGroup } from "@wunderui/react"

<ListGroup
  title="Settings"
  items={[
    { id: "profile", title: "Profile", description: "Name, photo and bio", trailing: { type: "chevron" }, onSelect: () => open("profile") },
    { id: "security", title: "Security", description: "Password and two-factor sign-in", trailing: { type: "chevron" }, onSelect: () => open("security") },
  ]}
/>
```

```ts
function ListGroup({ title, description, count, action, titleAs, items, density, divider, showHeader, className, children, ...props }: ListGroupProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `action` | `React.ReactNode` | — |
| `aria-label` | `string` | — |
| `className` | `string` | — |
| `count` | `number \| string` | — |
| `density` | `"compact" \| "comfortable"` | `"comfortable"` |
| `description` | `React.ReactNode` | — |
| `divider` | `boolean` | `true` |
| `items` | `ListItemData[]` | — |
| `showHeader` | `boolean` | — |
| `title` | `React.ReactNode` | — |
| `titleAs` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | — |
| `titleId` | `string` | — |

Also accepts the React.HTMLAttributes attributes (277).

Anatomy:

- `ListGroup` (`data-slot="list-group"`): The 400 px card (16 px radius, 8 px padding) with an optional header and rows from `items` or children. Basic, icon, avatar, brand, metric, ranking and comparison lists are this card with different slots.
- `ListGroupActions` — optional: A command menu (`role="menu"`): icon, title, description and a Kbd shortcut per action; one tab stop, arrow keys and typeahead.
- `ListGroupDetails` (`data-slot="list-group-details"`) — optional: The detail box an expandable row opens: label and value pairs on a subtle surface, then actions.
- `ListGroupDiscussion` — optional: Comments with author and time, a like that toggles, replies that show and hide, and an inline reply composer.
- `ListGroupExpandable` — optional: Rows that are disclosure buttons; the open row shows its details below. One open at a time unless `multiple`.
- `ListGroupHeader` (`data-slot="list-group-header"`) — optional: Title, optional description, count badge or link action at the top of the card.
- `ListGroupMasterDetail` (`data-slot="list-group-master-detail"`) — optional: An inbox-style listbox on the left and the detail of the chosen row on the right; stacks below 720 px.
- `ListGroupSection` (`data-slot="list-group-section"`) — optional: A labelled run of rows inside a group, with a count badge (Today 3, Yesterday 2).
- `ListGroupSelectable` — optional: A checkbox or radio per row, controlled with `value` or uncontrolled; a click anywhere on the row toggles it.
- `ListGroupSortable` — optional: Rows with drag handles. Drag with a pointer, press Alt with an arrow key, or use Move up and Move down in the row menu; every move is announced.
- `ListGroupToggle` — optional: A switch per row; the row toggles it, and disabled rows stay readable at half opacity.
- `ListGroupTree` — optional: Nested folders and items in a `role="tree"`, indented 20 px per level, with the full arrow-key pattern.
- `List Comment` (`data-slot="list-comment"`): One comment of the discussion: avatar, author, time, text and the reaction buttons.
- `List Thread` (`data-slot="list-thread"`) — optional: A comment with its replies; threads are divided by a hairline.
- `List Item` (`data-slot="list-item"`): A row inside the special groups; the same row as List Item.
- `List Item Row` (`data-slot="list-item-row"`): The rounded surface of such a row.
- `List Row Click Area` (`data-slot="list-row-click-area"`): A layer under the controls that lets a click anywhere on a selectable or toggle row reach its control.

Best practices:

- **When:** Use a List Group for a self-contained list in a settings page, a sidebar or next to a chart: a few rows under one heading. For a dashboard card with loading and empty states, use a List Panel.
- **Do:** Choose the group by what people do with the rows: pick (Selectable), switch (Toggle), reorder (Sortable), open (Expandable, Tree, Master–Detail) or run (Action).
- **Do:** Keep a group to about five to eight rows and link to the full list with the header action.
- **Do:** Name every group with a title or `aria-label`; the lists, trees and menus inside take their accessible name from it.
- **Don't:** Don't mix dividers and no dividers in one group. Lists with figures and states get dividers; feeds, rankings and timelines go without.
- **Don't:** Don't rely on drag alone. Sortable already offers Alt with the arrow keys and the row menu, so keep the handle visible.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-error`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--radius-md`, `--radius-sm`, `--radius-xl`, `--shadow-lg`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-move`, `--ease-overshoot`.

#### ListPanel

A dashboard card with a titled list: 31 ready panels (transactions, orders, integrations, team, activity, crypto, timelines …) with loading, empty and error states, or your own rows.

```tsx
import { ListPanel } from "@wunderui/react"

<ListPanel
  variant="recent-transactions"
  items={transactions}        // ListItemData[]; leave out to see the sample rows
  state={isPending ? "loading" : isError ? "error" : "ready"}
  onRetry={refetch}
  onAction={() => router.push("/transactions")}
/>
```

```ts
function ListPanel({ variant, title: titleProp, description: descriptionProp, action: actionProp, onAction, items: itemsProp, onItemSelect, state, loadingRows, skeleton, empty: emptyProp, onEmptyAction, error: errorProp, onRetry, footer: footerProp, onFooterAction, divider: dividerProp, density, timeline: timelineProp, titleAs: Heading, className, children, ...props }: ListPanelProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `action` | `React.ReactNode \| false` | — |
| `density` | `"compact" \| "comfortable"` | `"comfortable"` |
| `description` | `React.ReactNode` | — |
| `divider` | `boolean` | — |
| `empty` | `{ icon?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }` | — |
| `error` | `{ title?: React.ReactNode; description?: React.ReactNode }` | — |
| `footer` | `React.ReactNode` | — |
| `items` | `ListItemData[]` | — |
| `loadingRows` | `number` | — |
| `onAction` | `() => void` | — |
| `onEmptyAction` | `() => void` | — |
| `onFooterAction` | `() => void` | — |
| `onItemSelect` | `(item: ListItemData) => void` | — |
| `onRetry` | `() => void` | — |
| `skeleton` | `"circle" \| "square"` | — |
| `state` | `"loading" \| "ready" \| "empty" \| "error"` | `"ready"` |
| `timeline` | `boolean` | — |
| `title` | `React.ReactNode` | — |
| `titleAs` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` |
| `variant` | `"recent-transactions" \| "recent-orders" \| "invoices" \| "connected-integrations" \| "team-members" \| "activity-feed" \| "notifications" \| "upcoming-events" ` | — |

Also accepts the React.HTMLAttributes attributes (279).

Anatomy:

- `ListPanel` (`data-slot="list-panel"`): The dashboard card: 400 px, 16 px radius, 24 px padding above and below and 12 px at the sides, a 16 px semibold title, a link action and the rows. `variant` picks one of the 31 Figma panels.
- `ListPanelSkeleton` (`data-slot="list-panel-skeleton"`) — optional: Skeleton rows at the size of real rows while `state="loading"`: leading shape, two text lines, a value.
- `Header` (`data-slot="list-panel-header"`) — optional: Title, description and the link action ("View all").
- `Footer` (`data-slot="list-panel-footer"`) — optional: An optional full-width plain button under the rows (Available Modules).
- `State` (`data-slot="list-panel-state"`): The empty and error message: a round icon tile, title, description and one button (Try again for the error).

Best practices:

- **When:** Use a List Panel for a list card on a dashboard: recent transactions, orders, integrations, the team, an activity feed, a timeline or crypto holdings, next to charts and KPIs.
- **Do:** Start from a `variant` and pass your own `items`; the title, the dividers and the copy of the empty and error states come with it.
- **Do:** Pass `state="loading"`, `state="empty"` and `state="error"` with `onRetry`. The skeleton keeps the card's height, and the error is announced.
- **Do:** Link the header action to the full list, and give rows `onItemSelect` when they open a detail.
- **Don't:** Don't show more than five or six rows in a panel; the card sits in a grid with charts and should line up with them.
- **Don't:** Don't stretch a panel across a wide row on its own. It is designed at 400 px; let charts take the extra width.

Theming: reads `--border`, `--card`, `--foreground`, `--subtle`, `--text-secondary`, `--tint-red`, `--tint-text-red`, `--radius-md`, `--radius-xl`.

#### EmptyState

Placeholder shown when a list or search has no results.

```tsx
<EmptyState title="No results" description="..." action={<Button>Reset</Button>} />
```

```ts
function EmptyState({ icon, title, description, action, variant, className, }: {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    /** Frame style — mirrors the Figma Empty State "Style" variants. */
    variant?: keyof typeof EMPTY_STATE_VARIANTS;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `string` | — |
| `action` | `ReactNode` | — |
| `className` | `string` | — |
| `description` | `string` | — |
| `icon` | `ReactNode` | — |
| `variant` | `"outline" \| "default" \| "dashed" \| "background"` | `"dashed"` |

Anatomy:

- `EmptyState` (`data-slot="empty-state"`): A centred block of icon, title, description and action. The frame is `dashed` by default, or `default`, `outline` or `background`.
- `Icon` — optional: The `icon`, drawn in a muted circle above the title.
- `Title`: The `title`, a short line on what is missing: `No invoices yet`. It renders as a paragraph, not a heading.
- `Description` — optional: The `description` under the title: why the place is empty or what will appear here.
- `Action` — optional: The `action` node below the text, usually one small Button that fills the empty place.

Best practices:

- **When:** Use an Empty State where a list, table or search has nothing to show. While data is still loading, show a Skeleton; when loading failed, show an Alert that says what to do.
- **Do:** Say what will appear and why it is empty, then offer one action: `No invoices yet`, `They appear here as soon as the first one is sent.` and `New invoice`.
- **Do:** For a search without results, name the query and offer a way out: `No results for “invoice 2024”` with `Clear search`.
- **Do:** Use the frameless `default` look inside a card that already has a border, and the `dashed` default where the empty state stands on the page.
- **Don't:** Don't show a bare `No results` line. Without a reason and a next step, an empty place looks broken and leaves people stuck.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-secondary`, `--radius-2xl`, `--radius-xl`.

#### FileTree

An indented list of folders and files: a tree with arrow-key navigation whose folders open and close, and onSelect reports the chosen file or folder.

```tsx
<FileTree data={[{ id, name, children: [...] }]} />
```

```ts
function FileTree({ data, "aria-label": ariaLabel, onSelect, selectedId, className }: FileTreeProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `data` * | `FileTreeNode[]` | — |
| `aria-label` | `string` | — |
| `className` | `string` | — |
| `onSelect` | `(node: FileTreeNode) => void` | — |
| `selectedId` | `string` | — |

Anatomy:

- `FileTree`: A bordered panel with `role="tree"` (named by `aria-label`, default `Files`) that renders `data` as rows. Top-level folders start open, deeper ones closed. One row is the tab stop; arrow keys move between the visible rows.
- `Folder row` — optional: A `treeitem` with `aria-level`, `aria-expanded`, a chevron and a folder icon. A click, Enter or Space opens or closes its children with a slide and selects it; Right opens it or enters the first child, Left closes it.
- `File row` — optional: A `treeitem` with a file icon and the `name`, cut with an ellipsis when too long. A click, Enter or Space selects it and calls `onSelect`; the selected row has `aria-selected` and a muted fill.
- `Children` — optional: The nested rows in a `role="group"`, indented one step per level. While closed they are inert and the arrow keys skip them, so focus never lands inside a closed folder.

Best practices:

- **When:** Use a File Tree to show a folder structure people look through, such as the files of a template or an export. For items people search, sort or select, use Table.
- **Do:** Give every node a unique, stable `id`. It is the React key, and a reused id mixes up which folders are open.
- **Do:** Mark a folder with a `children` array, even an empty one. A node without `children` is drawn as a file.
- **Do:** Use `onSelect` to react to the chosen file or folder (open it in a preview, show its details), and `selectedId` when the selection lives in your state; without it the tree keeps its own.
- **Do:** Give the tree a name with `aria-label` when the page has more than one, such as `Project files`. Keyboard: arrows move, Right and Left open, enter and close folders, Home and End jump, a typed letter goes to the next row with that initial.
- **Don't:** Don't use it for multiple selection or drag and drop; it selects one row at a time.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-exit`.

#### FloatingToc

A table of contents for an article, with a marker that follows the section in view. It does not stick by itself: put it in a `sticky` container to keep it on screen.

```tsx
const articleRef = React.useRef<HTMLDivElement>(null)

<div ref={articleRef} className="overflow-y-auto">
  <section id="why">…</section>
  <section id="setup">…</section>
</div>
<FloatingToc
  items={[{ id: "why", label: "Why tokens" }, { id: "setup", label: "Set up the theme" }]}
  scrollContainer={articleRef}
/>
```

```ts
function FloatingToc({ items, activeId, onSelect, scrollContainer, className, }: {
    items: TocItem[];
    activeId?: string;
    onSelect?: (id: string) => void;
    /** The element that scrolls the sections, if it is not the page. */
    scrollContainer?: React.RefObject<HTMLElement | null>;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `items` * | `TocItem[]` | — |
| `activeId` | `string` | — |
| `className` | `string` | — |
| `onSelect` | `(id: string) => void` | — |
| `scrollContainer` | `React.RefObject<HTMLElement \| null>` | — |

Anatomy:

- `FloatingToc`: A `<nav>` named `On this page` with one link per section. It is not sticky itself; place it in a sticky column.
- `Entry`: An `<a>` to `#id` for each item, indented by `depth`. The current one carries `aria-current="location"`.
- `Active marker` — optional: A bar on the left line that glides to the current entry; a fainter one previews the hovered entry.

Best practices:

- **When:** Use a Floating TOC beside a long page with several headed sections, such as documentation or a policy. For switching between separate views, use Tabs.
- **Do:** Give every section an `id` that matches its item. The links and the scroll spy find sections by that `id`, and a missing one is never marked.
- **Do:** Pass `scrollContainer` when the sections scroll inside a panel rather than the page. Otherwise the spy watches the window and the marker stands still.
- **Do:** Put it in a sticky column yourself, for example with `sticky top-24`. The component draws the list and the marker, not its position.
- **Don't:** Don't set `activeId` unless you track the section yourself. A set `activeId` turns the scroll spy off, and the marker stops following the reader.

Theming: reads `--border`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-tertiary`, `--radius-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-move`.

#### HoloCard

A card with a mouse-tracking spotlight/gradient shine effect.

```tsx
<HoloCard>
  <p>Hover to reveal the spotlight effect.</p>
</HoloCard>
```

```ts
function HoloCard({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `HoloCard`: A bordered, padded card with a glow in the primary colour that follows the mouse while hovered.
- `Glow` — optional: A radial gradient that fades in on hover and tracks the pointer. It ignores pointer events and sits behind the content.
- `Content`: The `children`, placed above the glow.

Best practices:

- **When:** Use a Holo Card to make one or two showcase items stand out, such as a featured plan on a landing page. For everyday content and dashboard tiles, use Card.
- **Do:** Re-theme the glow by setting `--primary` on a wrapper, not with a gradient of your own. The glow mixes the primary colour, so it follows brand and dark mode.
- **Do:** Keep the card complete without the glow. It appears only on mouse hover, so touch and keyboard users never see it.
- **Don't:** Don't rely on the glow to show that the card is clickable. It is decoration with no focus state; put a real link or Button inside for the action.

Theming: reads `--border`, `--brand-600`, `--card`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### Kanban

A drag-and-drop board of columns and cards.

```tsx
<Kanban columns={columns} onColumnsChange={setColumns} />
```

```ts
function Kanban({ columns: controlledColumns, onColumnsChange, layout, className, }: {
    columns: KanbanColumn[];
    onColumnsChange?: (columns: KanbanColumn[]) => void;
    layout?: KanbanLayout;
    className?: string;
}): React.JSX.Element;
type KanbanLayout = "board" | "stacked" | "framed";
```

| Prop | Type | Default |
| --- | --- | --- |
| `columns` * | `KanbanColumn[]` | — |
| `className` | `string` | — |
| `layout` | `"board" \| "stacked" \| "framed"` | `"board"` |
| `onColumnsChange` | `(columns: KanbanColumn[]) => void` | — |

Anatomy:

- `Kanban`: The board, drawn from `columns`. Cards move by dragging or by keyboard, and every move is reported through `onColumnsChange`.
- `Column`: One stage with its title and card count in the header. It is tinted while a card is dragged or carried over it.
- `Card`: One item with its `title` and an optional `progress` bar, `tag` badge and `meta` text. It is a focusable, draggable element.
- `Announcer` — optional: A hidden live region that reads out each pick-up, move and drop with the column title and position.

Best practices:

- **When:** Use a Kanban when people move items through stages, such as tasks from To do to Done. When they sort, filter or edit fields across many items, use Data Table.
- **Do:** Pass `onColumnsChange` and store the result. Without it the board keeps its own copy: moves are not reported and a new `columns` value is ignored.
- **Do:** Give columns short, distinct titles. Screen readers hear them in every move, for example `column Done, position 2 of 4`.
- **Do:** Switch to `layout="stacked"` on narrow screens. The `board` layout scrolls sideways, and columns past the edge are easy to miss.
- **Don't:** Don't add your own key or drag handlers to the cards. Space or Enter picks a card up, the arrow keys move it, and Escape puts it back.

Theming: reads `--border`, `--border-control`, `--card`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-tertiary`, `--tint-indigo`, `--radius-lg`, `--radius-md`, `--radius-xl`, `--shadow-md`, `--duration-fast`, `--ease-move`.

#### ItemCard

A generic row card: icon, title, description, meta, action.

```tsx
<ItemCardGroup>
  <ItemCard icon={<FileText />} title="..." description="..." />
</ItemCardGroup>
```

```ts
function ItemCard({ icon, title, description, meta, action, className, }: {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    action?: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `ReactNode` | — |
| `action` | `ReactNode` | — |
| `className` | `string` | — |
| `description` | `ReactNode` | — |
| `icon` | `ReactNode` | — |
| `meta` | `ReactNode` | — |

Anatomy:

- `ItemCard`: One framed row: an optional icon tile, a title and description that truncate to one line, then `meta` and `action` on the right.
- `ItemCardGroup` — optional: A bordered box that stacks several ItemCards with a small gap, for a set that belongs together.

Best practices:

- **When:** Use an ItemCard for an object that stands on its own row: a file, a connected app, an integration, with one action. For many rows people compare by column, use a Table.
- **Do:** Put the action in `action` as a Button or a link. ItemCard takes no click handler of its own, so the row itself is not interactive.
- **Do:** Keep `title` and `description` short or give the full text another way. Both are cut to one line with an ellipsis.
- **Do:** Use `meta` for a short fact with its unit, such as `2.4 MB` or `Updated 3 min ago`.
- **Don't:** Don't wrap each ItemCard in a Card. It draws its own border and padding; for a set, use ItemCardGroup.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`.

#### StatCard

A single metric with its change, as a card with a dot and delta, a plain card with a caption, or an inline value.

```tsx
<StatCard label="Revenue" value="$48.2K" delta="12.4%" trend="up" trendGood />
```

```ts
function StatCard({ label, value, prev, delta, trend, trendGood, dotColor, caption, variant, className, }: StatCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `string` | — |
| `value` * | `string` | — |
| `caption` | `ReactNode` | — |
| `className` | `string` | — |
| `delta` | `string` | — |
| `dotColor` | `string` | `"var(--primary)"` |
| `prev` | `string` | — |
| `trend` | `"up" \| "down"` | `"up"` |
| `trendGood` | `boolean` | `true` |
| `variant` | `"trend" \| "simple" \| "inline"` | `"trend"` |

Anatomy:

- `StatCard` (`data-slot="stat-card"`): One metric with its label and value. `variant` picks the card with dot and delta (`trend`), the plain card with a caption (`simple`) or the bare value over its label (`inline`).

Best practices:

- **When:** Use StatCard for a single number with its change. For a number with a sparkline, progress or breakdown use Metric Card, and for a number above a chart use ChartCard.
- **Do:** Pass `value` as the formatted string with its unit, such as `$84,250` or `2.4%`. Numbers are shown as given and carry no formatting.
- **Do:** Set `trendGood={false}` when a rise is bad, such as churn. The delta colour follows `trendGood`, while the arrow follows `trend`.
- **Do:** Place several cards in a row with KPIGroup. It draws one frame with hairlines, and the cards drop their own borders.
- **Don't:** Don't add `prev` and a `caption` for the same comparison. `prev` belongs to the `trend` variant and `caption` to `simple`; use the one that matches the variant.

Theming: reads `--border`, `--brand-600`, `--card`, `--foreground`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--radius-xl`.

#### KPIGroup

A row of KPIs sharing one bordered container.

```tsx
<KPIGroup columns={3}>
  <StatCard label="MRR" value="$12.4K" />
</KPIGroup>
```

```ts
function KPIGroup({ children, columns, className, }: {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `className` | `string` | — |
| `columns` | `2 \| 3 \| 4` | `4` |

Anatomy:

- `KPIGroup` (`data-slot="kpi-group"`): The shared frame for a row of KPIs, divided by hairlines. Cards inside drop their own border, radius and shadow. `columns` sets 2, 3 or 4 per row at larger widths.

Best practices:

- **When:** Use KPIGroup for the KPI row at the top of a view when the cards belong together. For cards with sparklines or progress use MetricGroup.
- **Do:** Match `columns` to the number of children, 2, 3 or 4. The default is 4, which falls to 2 columns on medium widths and one on phones.
- **Do:** Use one card style inside, for example all `simple`. Mixed variants have different paddings and break the hairline rhythm.
- **Don't:** Don't wrap each card in its own border or shadow. The group removes them, and your own wrapper puts a card in a card.

Theming: reads `--border`, `--card`, `--radius-lg`.

#### MetricCard

One number with its trend and, per variant, a sparkline, progress, breakdown, comparison, distribution, status, action or AI insight.

```tsx
<MetricCard label="Revenue" value="$85,250" icon={<Activity />} menu trend={{ value: "12.4%", direction: "up" }}>
  <MetricSparkline data={series} variant="area" />
</MetricCard>
```

```ts
function MetricCard({ label, value, icon, iconVariant, onIconClick, info, menu, onMenuSelect, trend, caption, previous, aside, asideAlign, children, className, }: {
    label: string;
    value: string;
    /** Figma Show icon: a 32 px tile before the label. */
    icon?: React.ReactNode;
    /** Figma Type=Icon (muted tile) or Type=Icon Button (bordered button). */
    iconVariant?: "tile" | "button";
    /** Makes the icon button do something; without it the button is decorative. */
    onIconClick?: () => void;
    /** Text behind the (i) next to the label. */
    info?: React.ReactNode;
    /** Figma Show menu: `true` for the ⋯ menu (View details · Customize · Export data · Remove), or your own trigger. */
    menu?: boolean | React.ReactNode;
    /** Called with the chosen entry of the built-in ⋯ menu. */
    onMenuSelect?: (action: MetricMenuAction) => void;
    /** Figma Show trend: the Trend Chip under the value. */
    trend?: MetricTrend;
    /** Figma Caption, beside the chip — "vs last month". */
    caption?: React.ReactNode;
    /** Figma Comparison · Period: the previous value under the chip. */
    previous?: React.ReactNode;
    /** Sits beside the value: a radial progress, a donut, or a chart (Figma Area right / Bar right). */
    aside?: React.ReactNode;
    /**
     * Rings sit centred beside the value (`center`); charts sit on the trend
     * chip's baseline (`end`), so the bottom of the chart and the bottom of the
     * chip form one line. Defaults to `end` for a MetricSparkline, else `center`.
     */
    asideAlign?: "center" | "end";
    /** The visualization under the value: MetricSparkline, MetricProgress, … */
    children?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type MetricMenuAction = "view" | "customize" | "export" | "remove";
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `string` | — |
| `value` * | `string` | — |
| `aside` | `React.ReactNode` | — |
| `asideAlign` | `"center" \| "end"` | — |
| `caption` | `React.ReactNode` | — |
| `children` | `React.ReactNode` | — |
| `className` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `iconVariant` | `"tile" \| "button"` | `"tile"` |
| `info` | `React.ReactNode` | — |
| `menu` | `boolean \| React.ReactNode` | — |
| `onIconClick` | `() => void` | — |
| `onMenuSelect` | `(action: MetricMenuAction) => void` | — |
| `previous` | `React.ReactNode` | — |
| `trend` | `MetricTrend` | — |

Anatomy:

- `MetricCard` (`data-slot="metric-card"`): The KPI card: label, large value and an optional trend chip, caption and previous value. Pass a visualization as `children`, or a ring or chart beside the value with `aside`.
- `MetricBreakdown` — optional: A list of label and value rows under a hairline that splits the total into parts. Pass it as a child.
- `MetricComparison` — optional: Two or more periods as horizontal bars with their values. The first bar is solid and the others lighter. Pass it as a child.
- `MetricDistribution` — optional: A stacked bar of shares with its legend, described to screen readers as a list of labels and percents. Pass it as a child.
- `MetricDonut` — optional: A small donut for the `aside` slot, drawn from the same `parts` as the legend. It reads as an image with the part names and percents.
- `MetricInsight` — optional: A short sentence on the indigo tint with an icon, for a generated note about the number. Pass it as a child.
- `MetricLegend` — optional: The dots-and-labels row with each part's percent. Use it beside a MetricDonut; MetricDistribution already includes it.
- `MetricProgress` — optional: Progress toward a target as a `linear`, `segmented` or `radial` bar with a label and percent. Radial goes into `aside`.
- `MetricSparkline` — optional: A trend as a `line`, `area` or `bar` variant. Bars can be focused and read with the arrow keys, and `label` names the chart for screen readers.
- `MetricStatus` — optional: A pill badge with a short note beside it, for the state of the metric. Pass it as a child.
- `Header row` (`data-slot="metric-card-header"`): The top row: optional icon tile or button, the label with an optional info tooltip, and the optional menu on the right.
- `Value block` (`data-slot="metric-card-value"`): The block with the large value and the trend chip and caption below. A MetricSparkline in `aside` ends on the chip's baseline.
- `Sparkbars` (`data-slot="metric-sparkbars"`) — optional: The bar form of the sparkline. It is a focusable group; arrow keys, Home and End move the readout between bars.

Best practices:

- **When:** Use MetricCard for one number with context: a trend, a sparkline, progress or a breakdown. For a plain number use StatCard, and for a number above a full chart use ChartCard.
- **Do:** Give the number its unit in `value` and its comparison in `trend` with a `caption` such as `vs last month`. A change without its period is unclear.
- **Do:** Put a MetricSparkline beside the value through `aside`. It ends on the trend chip's baseline by default, so the chart and the chip form one line.
- **Do:** Name the visualization with `label` on MetricSparkline and `labels` for the bars, such as `Mon` or `Week 32`. The default label is the generic `Trend`.
- **Don't:** Don't pass a radial `MetricProgress` or a `MetricDonut` as `children`. Rings are built for `aside`, where they sit centred beside the value.
- **Don't:** Don't enable `menu` without `onMenuSelect`. The built-in menu offers View details, Customize, Export data and Remove, and reports the choice only through that callback.

Theming: reads `--background`, `--border`, `--brand-600`, `--card`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-secondary`, `--text-tertiary`, `--tint-green`, `--tint-indigo`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-purple`, `--radius-md`, `--radius-sm`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### MetricGroup

Several Metric Cards in one frame, divided by hairlines — the KPI row at the top of a dashboard.

```tsx
import { MetricCard, MetricGroup } from "@wunderui/react"

<MetricGroup>
  <MetricCard label="Revenue" value="$85,250" trend={{ value: "12.4%", direction: "up" }} caption="vs last month" />
  <MetricCard label="New customers" value="1,204" trend={{ value: "8.1%", direction: "up" }} caption="vs last month" />
  <MetricCard label="Churn" value="2.1%" trend={{ value: "0.4%", direction: "down" }} caption="vs last month" />
  <MetricCard label="Avg. order" value="$70.80" trend={{ value: "0.0%", direction: "neutral" }} caption="vs last month" />
</MetricGroup>
```

```ts
function MetricGroup({ children, columns, className, }: {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `columns` | `2 \| 3 \| 4` | `4` |

Anatomy:

- `MetricGroup` (`data-slot="metric-group"`): The shared frame for a row of Metric Cards, divided by hairlines. Cards drop their own border, radius and shadow. `columns` sets 2, 3 or 4 per row at larger widths.

Best practices:

- **When:** Use MetricGroup for the KPI row at the top of a dashboard when the cards have trends or charts. For plain stat cards use KPIGroup.
- **Do:** Set `columns` to the card count (2, 3 or 4). At the default 4 it shows 2 columns on medium widths and a single column on phones.
- **Do:** Give every card the same structure: label, value, trend and caption. Cells with different rows leave uneven gaps in the frame.
- **Don't:** Don't give the cards their own `className` borders or shadows. The group strips them, and the hairlines are the gaps showing the border colour.
- **Don't:** Don't use it for a single metric. One card needs no frame, so use MetricCard.

Theming: reads `--border`, `--card`, `--radius-lg`.

#### ListView

A simple bordered list of rows with leading/trailing content.

```tsx
<ListView>
  <ListViewItem leading={<Icon />} title="..." description="..." />
</ListView>
```

```ts
function ListView({ children, className, }: {
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `ListView`: The bordered frame that stacks the rows. It adds no list role of its own.
- `ListViewItem`: One row with optional `leading` and `trailing` content around a title and description, both cut to one line. Rows are divided by a line.

Best practices:

- **When:** Use a ListView for a short set of similar rows in one frame: members, sessions, connected devices. Rows that stand alone get an ItemCard; rows people sort or filter go in a Data Table.
- **Do:** Put an Avatar or an icon in `leading` and one action or a Badge in `trailing`. More controls make the row hard to scan.
- **Do:** Keep `title` and `description` short or show the full text elsewhere. Both are cut to one line with an ellipsis.
- **Don't:** Don't set row padding by hand. The rows read `--list-row-py`, so they follow the density setting.

Theming: reads `--border`, `--card`, `--foreground`, `--text-secondary`, `--radius-lg`, `--list-row-py`.

#### Timeline

A vertical sequence of dated, dot-connected events.

```tsx
<Timeline items={[{ id, title, timestamp, color }]} />
```

```ts
function Timeline({ items, orientation, compact, className, }: {
    items: TimelineItem[];
    /** "vertical" stacks the entries, "horizontal" lays them out in a row with the time above each dot. */
    orientation?: "vertical" | "horizontal";
    /** Smaller dots and text, for milestones and long lists. */
    compact?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `items` * | `TimelineItem[]` | — |
| `className` | `string` | — |
| `compact` | `boolean` | `false` |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |

Anatomy:

- `Timeline` (`data-slot="timeline"`): Draws the entries from `items`, stacked or in a row with `orientation`, and joins them with a line. `compact` makes dots and text smaller.
- `Dot` (`data-slot="timeline-dot"`) — optional: The marker of an entry, with an icon or a small point inside. `avatar` replaces it, and `color` sets its fill.
- `Entry`: One item: its `title`, an optional `description` and a `timestamp`, which sits beside the title or above the dot in a row.

Best practices:

- **When:** Use a Timeline for events in order, drawn from data: a shipment's stops, a project's milestones. For scheduled events use Agenda; for one rich entry with a person and a comment, use Timeline Event.
- **Do:** Pass dot colours as tokens, such as `color: "var(--success)"`. The icon colour inside is chosen to stay readable on that fill.
- **Do:** Set `compact` for long lists and milestones. Dots, text and gaps shrink so more entries fit.
- **Don't:** Don't write times like `recently`. Give each `timestamp` a date or a time with its unit, such as `Oct 12, 14:30` or `3 min ago`.

Theming: reads `--border`, `--brand-600`, `--foreground`, `--neutral-dark-content`, `--text-secondary`, `--text-tertiary`.

#### Widget

A generic dashboard widget shell: header, body, footer.

```tsx
<Widget title="Title" description="...">
  <YourContent />
</Widget>
```

```ts
function Widget({ title, description, action, footer, children, className, }: {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `action` | `ReactNode` | — |
| `className` | `string` | — |
| `description` | `ReactNode` | — |
| `footer` | `ReactNode` | — |
| `title` | `ReactNode` | — |

Anatomy:

- `Widget`: A framed dashboard tile with a header from `title`, `description` and `action`, the body from `children`, and an optional `footer` under a line.
- `Header` — optional: The `title` as an `<h3>` with the `description` under it and the `action` on the right. It renders only when `title` or `action` is set.
- `Footer` — optional: The `footer` content below a divider line, for a link such as `View all` or a note on the data.

Best practices:

- **When:** Use a Widget for one tile on a dashboard: a title, a list or chart in the body, and an optional footer link. For a content card with media or a custom header, use a Card.
- **Do:** Put widgets under a page heading of level two. The title renders as an `<h3>`, so the heading order stays intact.
- **Do:** Keep the header to one `action`, such as a plain `View all` button or an IconButton with an `aria-label`.
- **Don't:** Don't set a `description` without a `title` or `action`. The header is then not rendered, and the description does not appear.

Theming: reads `--border`, `--card`, `--foreground`, `--text-secondary`, `--radius-lg`.

#### AppLayout

The app shell: sticky navbar and sidebar over a scrolling page, aside, banner and footer, skip link, and a drawer below 64rem.

```tsx
<AppLayout sidebar={<Sidebar>...</Sidebar>} navbar={<Navbar>...</Navbar>}>
  <YourPage />
</AppLayout>
```

```ts
function AppLayout({ banner, navbar, sidebar, aside, asideLabel, asideOpen: asideOpenProp, onAsideOpenChange, footer, children, embedded, scroll, width, padding, skipLinkLabel, drawerBelow, className, }: AppLayoutProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `aside` | `React.ReactNode` | — |
| `asideLabel` | `string` | `"Details"` |
| `asideOpen` | `boolean` | — |
| `banner` | `React.ReactNode` | — |
| `className` | `string` | — |
| `drawerBelow` | `"40rem" \| "48rem" \| "64rem"` | `"64rem"` |
| `embedded` | `boolean` | `false` |
| `footer` | `React.ReactNode` | — |
| `navbar` | `React.ReactNode` | — |
| `onAsideOpenChange` | `(open: boolean) => void` | — |
| `padding` | `"comfortable" \| "none"` | `"comfortable"` |
| `scroll` | `"document" \| "pane"` | `"document"` |
| `sidebar` | `React.ReactNode` | — |
| `skipLinkLabel` | `string` | `"Skip to content"` |
| `width` | `"fluid" \| "contained"` | `"fluid"` |

Anatomy:

- `AppLayout` (`data-slot="app-layout"`): The app shell. It lays out banner, navbar, sidebar, main, aside and footer as landmarks, puts a skip link first, and turns sidebar and aside into drawers below `drawerBelow`.
- `Skip link` — optional: A link at the very start of the page for keyboard users. It stays out of sight until Tab reaches it, and activating it jumps past the navigation to the content area. `skipLinkLabel` sets its text, and `embedded` leaves it out.
- `Banner` (`data-slot="app-layout-banner"`) — optional: The `banner` prop: a bar above everything for offline, trial or impersonation notices. In document scroll mode it sticks to the top, and its height is published as `--shell-banner-h`.
- `Navbar` — optional: The `navbar` prop, usually a Navbar. It must be a direct child of the layout so it can stick; the layout measures its height into `--shell-navbar-h`.
- `Shell` (`data-slot="app-layout-shell"`): The grid below the navbar with three columns: sidebar, main and aside. In `pane` scroll mode it clips, so only the content scrolls.
- `Sidebar` (`data-slot="app-layout-sidebar"`) — optional: The `sidebar` prop: primary navigation, sticky beside the content. Below the breakpoint it leaves the grid and opens in a left drawer.
- `Main` (`data-slot="app-layout-main"`): The content area, a `<main>` that can take focus (`tabIndex={-1}`) so the skip link lands there. With `embedded` it is a plain `div`.
- `Aside` (`data-slot="app-layout-aside"`) — optional: The `aside` prop: a 20 rem context panel on the right, named by `asideLabel`. Closed, it is inert; below the breakpoint it opens as a right drawer.
- `Footer` (`data-slot="app-layout-footer"`) — optional: The `footer` prop: a `<footer>` landmark under the shell, with a top border.
- `Navigation drawer` — optional: A left Sheet that shows the sidebar below the breakpoint. It is named `Navigation` for screen readers and opens from the navigation trigger.
- `Aside drawer` — optional: A right Sheet that shows the aside below the breakpoint, named by `asideLabel`. Closing it also closes the aside.
- `AppLayoutNavigationTrigger` — optional: An icon button that opens the sidebar drawer. It is visible only below the drawer breakpoint; place it in the navbar.
- `AppLayoutAsideTrigger` — optional: A square button for the aside. On a wide screen it shows or hides the pane, on a narrow one it opens the drawer, and `aria-pressed` tells assistive technology which state it is in.

Best practices:

- **When:** Use AppLayout as the frame of a signed-in product page: navbar, sidebar, content and an optional detail panel. For a single centred page with no navigation, such as sign-in, skip the shell.
- **Do:** Pass the navbar as `navbar`, not as a child. It has to be a direct child of the layout to stick, and its height feeds the sticky sidebar and aside.
- **Do:** Choose `scroll="document"` for ordinary pages, which keeps anchors and print. Use `pane` only for editors, inboxes and canvases that must fill the viewport and scroll inside.
- **Do:** Always set `asideLabel` when you pass an `aside`. An unnamed aside loses its landmark role, and the drawer reuses the label as its title.
- **Do:** Put `AppLayoutNavigationTrigger` in the navbar. Below `drawerBelow` (64rem by default) the sidebar leaves the page, and this button is the only way back to it.
- **Don't:** Don't add your own `<main>` inside the children. The layout renders the `main` landmark; use `embedded` only for a demo inside another page.

Theming: reads `--background`, `--border`, `--card`, `--foreground`, `--ring`, `--radius-lg`, `--shadow-lg`, `--duration-base`, `--ease-entrance`, `--ease-move`.

#### Sidebar

App navigation in six modes: docked, offcanvas, icon rail, rail with flyouts, double sidebar and overlay drawer.

```tsx
<Sidebar logo={<Logo />} footer={<SidebarUser name="..." email="..." />}>
  <SidebarSection>
    <SidebarItem icon={<Home />} label="Dashboard" active />
  </SidebarSection>
</Sidebar>
```

```ts
function Sidebar({ logo, footer, collapsed, children, className, ...props }: Omit<ComponentProps<"aside">, "children"> & {
    logo?: ReactNode;
    footer?: ReactNode;
    /** Icon-only rail (Figma: Sidebar Collapsed). */
    collapsed?: boolean;
    children: ReactNode;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `collapsed` | `boolean` | `false` |
| `footer` | `ReactNode` | — |
| `logo` | `ReactNode` | — |

Also accepts the React.HTMLAttributes attributes (279).

Anatomy:

- `Sidebar` (`data-slot="sidebar"`): The navigation column, an `<aside>` that is 16 rem wide, or a 3 rem icon rail with `collapsed`. It lays out `logo`, the scrolling children and `footer`.
- `SidebarSearch` (`data-slot="sidebar-search"`) — optional: A search-shaped button, not an input, that opens a command palette. It shows a shortcut hint and shrinks to an icon in the rail.
- `SidebarCta` (`data-slot="sidebar-cta"`) — optional: A full-width primary button for one call to action, such as `Upgrade plan`. It is hidden in the collapsed rail.
- `SidebarHeading` — optional: A small caption above a run of links. It is hidden in the collapsed rail.
- `SidebarSection` — optional: A `<nav>` that holds a run of items and groups. Use one per block of links, and name it with `aria-label` when there are several.
- `SidebarItem`: A navigation row, an `<a>`. `active` sets `aria-current="page"`. In the rail the label stays as hidden text, so the link keeps its name.
- `SidebarGroup` (`data-slot="sidebar-group"`) — optional: An expandable row that holds a set of links. It is a disclosure with `aria-expanded`, not a menu, and it hides in the collapsed rail.
- `SidebarSwitchItem` — optional: A row with a label and a switch, such as `Dark mode`. The switch hides in the rail.
- `SidebarNotification` — optional: A row with an avatar, a title, a time and an unread dot. It is a button; the text hides in the rail.
- `Footer` — optional: The `footer` prop: a block pinned to the bottom with a top border, usually a user or workspace row.
- `SidebarUser` — optional: The signed-in person: avatar, name and email, plus a `trailing` slot. It is a static block; only the avatar stays in the rail.
- `SidebarWorkspace` — optional: A button with an avatar, a name and a chevron for switching workspace or account.
- `DoubleSidebar` (`data-slot="double-sidebar"`) — optional: Two-level navigation: a collapsed rail for top-level areas next to a full sidebar for the pages of the chosen area. Pass the rail as `rail`.

Best practices:

- **When:** Use a Sidebar for the primary navigation of an app with more than a few sections. For a handful of site links across the top, use a navbar. Place it in an app layout so it becomes a drawer on narrow screens.
- **Do:** Pass `icon` to every top-level `SidebarItem`. In the `collapsed` rail only the icon shows, and a row without one has nothing to click.
- **Do:** Mark the current page with `active` on its `SidebarItem`, and set `active` on the `SidebarGroup` that contains it. Both set the strong style, and the item sets `aria-current="page"`.
- **Do:** Give group children no icons. A `SidebarGroup` indents its links under its own icon and hides entirely in the rail.
- **Don't:** Don't rely on `SidebarGroup` in the collapsed rail. It disappears there, so offer a flyout or a flat list of the top-level pages.
- **Don't:** Don't use `SidebarItem` for commands. It renders an `<a>` with `href="#"` by default, so pass a real `href`; for actions use a button.

Theming: reads `--background`, `--card`, `--foreground`, `--input`, `--muted`, `--primary`, `--primary-foreground`, `--ring`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-foreground`, `--text-secondary`, `--text-tertiary`, `--radius-md`, `--control-md`, `--nav-item-py`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### Navbar

The top bar in four scroll modes — static, sticky, hide on scroll, transparent — with mega menu, search, overflow and a mobile drawer.

```tsx
<Navbar logo={<Logo />} actions={<Avatar />}>
  <NavbarLink active>Overview</NavbarLink>
</Navbar>
```

```ts
function Navbar({ logo, children, actions, search, command, mode, label, className }: NavbarProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actions` | `React.ReactNode` | — |
| `children` | `React.ReactNode` | — |
| `className` | `string` | — |
| `command` | `React.ReactNode` | — |
| `label` | `string` | `"Main"` |
| `logo` | `React.ReactNode` | — |
| `mode` | `"sticky" \| "transparent" \| "static" \| "hide-on-scroll"` | `"sticky"` |
| `search` | `React.ReactNode` | — |

Anatomy:

- `Navbar` (`data-slot="navbar-sentinel"`): The top bar. It renders a scroll marker and a `<header>`, moves links that do not fit into a `More` list, and below 36 rem collapses the links into a menu drawer.
- `Bar` (`data-slot="navbar"`): The `<header>` itself. `mode` makes it static, sticky, hiding on scroll down or transparent over a hero; a shadow marks it once the page scrolls.
- `Logo` — optional: The `logo` prop, at the start of the bar. The menu drawer repeats it at the top.
- `NavbarLink` — optional: A top-level link. With `href` it is a real `<a>`; without one it is a button for client-side routing. `active` sets `aria-current="page"`.
- `NavbarMenu` — optional: A mega menu: a button that opens a full-width panel of links on click or after a short hover. It is a disclosure with `aria-expanded`, not a `menu`.
- `NavbarMenuLink` — optional: One entry in a mega menu panel: a `title`, an optional `description` and an `icon`. In the drawer it shrinks to the title.
- `More list` — optional: A popover named `More links` that takes the links which no longer fit the row. Links inside it close it when followed.
- `NavbarSearchField` — optional: Inline search: an icon button that widens into a field. Escape or leaving it empty collapses it. Pass it as `search`.
- `NavbarSearch` (`data-slot="navbar-search"`) — optional: A search-shaped button, not an input, that opens a command palette; it shows a shortcut hint. Pass it as `command`; it hides in the narrow layout.
- `Actions` — optional: The `actions` prop: the icon cluster on the right for notifications, the theme and the account menu.
- `NotificationBell` — optional: An icon button with a bell. Its name includes the `count`, and the badge shows `99+` above 99. Place it in `actions`.
- `Notification count` (`data-slot="notification-count"`) — optional: The small badge on the bell. It appears only when `count` is above zero.
- `ThemeToggle` — optional: Switches light and dark. As `icons` it is a radio pair with names `Light mode` and `Dark mode`; as `switch` it is a labelled toggle for menus.
- `UserMenu` (`data-slot="user-menu"`) — optional: The account trigger with an avatar, an optional name and a chevron. Its name is `Account menu` plus the name. Pass it as the `render` of a dropdown trigger.
- `Menu drawer` — optional: A left Sheet below 36 rem, opened by the `Open menu` button. It lists all links, with mega menus as collapsible groups.
- `MobileNav` (`data-slot="mobile-nav"`) — optional: A separate 56 px top bar for phones with a menu button, a logo or `title`, and `actions`. Use it on its own, without Navbar, on small screens.
- `BottomTabBar` (`data-slot="bottom-tab-bar"`) — optional: A `<nav>` of icon and label tabs at the bottom of a phone screen. The current one gets `aria-current="page"`.

Best practices:

- **When:** Use Navbar for site-wide navigation across the top: a handful of links, optional mega menus, search and account controls. For a long list of app sections, use a Sidebar and keep the navbar for actions.
- **Do:** Pass `NavbarLink` and `NavbarMenu` as direct children of `Navbar`. The bar measures them to decide what moves into `More` or the drawer, and a wrapper component hides them.
- **Do:** Mark exactly one `NavbarLink` as `active`. It sets `aria-current="page"`, which is how screen readers tell where the user is.
- **Do:** Name the landmark with `label` when a page has a second navigation. The default `Main` is not enough next to a sidebar.
- **Do:** Use `hide-on-scroll` for long reading pages only. The bar stays while it holds focus or a menu is open, and under reduced motion it becomes plain sticky.
- **Don't:** Don't put commands in `NavbarMenu`. It is a disclosure of links, not a `menu`; use a dropdown menu for actions such as `Sign out`.

Theming: reads `--background`, `--border`, `--card`, `--foreground`, `--input`, `--muted`, `--popover`, `--popover-foreground`, `--ring`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-lg`, `--radius-md`, `--control-md`, `--shadow-lg`, `--shadow-sm`, `--duration-ambient`, `--duration-base`, `--duration-fast`, `--duration-instant`, `--ease-entrance`, `--ease-exit`, `--travel-sm`.

#### Segment

A single-select toggle group, like a compact tab bar, with a pill or a rounded-corner track.

```tsx
<Segment value={value} onValueChange={setValue} options={[{ value: "day", label: "Day" }]} />
```

```ts
function Segment({ options, value, onValueChange, size, shape, className, "aria-label": ariaLabel, }: {
    options: SegmentOption[];
    value: string;
    onValueChange: (value: string) => void;
    size?: SegmentSize;
    /** `pill` (default) or `rounded` for the square-cornered version. */
    shape?: SegmentShape;
    className?: string;
    /** Names the group for screen readers, e.g. "Version". */
    "aria-label"?: string;
}): React.JSX.Element;
type SegmentSize = "xs" | "sm" | "md" | "lg";
type SegmentShape = "pill" | "rounded";
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: string) => void` | — |
| `options` * | `SegmentOption[]` | — |
| `value` * | `string` | — |
| `aria-label` | `string` | — |
| `className` | `string` | — |
| `shape` | `"rounded" \| "pill"` | `"pill"` |
| `size` | `"sm" \| "xs" \| "lg" \| "md"` | `"md"` |

Anatomy:

- `Segment` (`data-slot="segment"`): A switch between a few views or values, as a pill or, with `shape="rounded"`, with square-cornered 8 px corners. It is one `tablist` with a single tab stop; arrow keys, Home and End move and select, skipping disabled options.

Best practices:

- **When:** Use a Segment to switch the view or the scope of one piece of content: day, week, month; list or grid. For separate panels of content, use Tabs. For on or off, use a switch.
- **Do:** Keep it to two to five options with one-word labels. The track hugs its content and does not scroll, so long labels crowd the control.
- **Do:** Pass `aria-label`, for example `Time range`. It names the tablist; the options only carry their own labels.
- **Do:** Pick the `size` by place: `xs` and `sm` inside a card or chart header, `md` and `lg` to line up with a Button. The `md` and `lg` heights follow the density tokens, so they stay level with buttons in compact and comfortable.
- **Don't:** Don't pass a `value` that matches no option. The first enabled option becomes the tab stop, but none of them looks selected.

Theming: reads `--background`, `--foreground`, `--muted`, `--ring`, `--text-secondary`, `--radius-md`, `--radius-sm`, `--control-lg`, `--control-md`, `--shadow-sm`, `--duration-fast`, `--ease-entrance`.

#### Stepper

A horizontal multi-step progress indicator with connectors.

```tsx
const [step, setStep] = useState(1)

<Stepper currentStep={step} steps={steps} navigable="all" onStepClick={setStep} />
```

```ts
function Stepper({ steps, currentStep, orientation, numbered, onStepClick, navigable, className }: StepperProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `currentStep` * | `number` | — |
| `steps` * | `StepperStep[]` | — |
| `className` | `string` | — |
| `navigable` | `"done" \| "all"` | `"done"` |
| `numbered` | `boolean` | `true` |
| `onStepClick` | `(index: number) => void` | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

Anatomy:

- `Stepper` (`data-slot="stepper"`): A progress indicator for a multi-step flow. `currentStep` is the zero-based index; earlier steps show a check and later ones their number. It is named `Progress`.

Best practices:

- **When:** Use a Stepper for a flow with a known number of ordered steps: checkout, onboarding, setup. For switching between parallel views, use Tabs or a Segment.
- **Do:** Name each step with a short noun such as `Account` or `Payment`. Labels in the horizontal layout stay on one line, so long ones crowd their neighbours; the vertical layout has room for a `description` underneath.
- **Do:** Use `orientation="vertical"` with `description` in a sidebar, and the horizontal layout above a form. Only the vertical one has the `numbered` option.
- **Do:** Make finished steps clickable with `onStepClick`. By default only done steps can be revisited; set `navigable="all"` only when the steps do not depend on each other.
- **Don't:** Don't use it for steps that can be done in any order. It marks one current step and the finished ones before it, which reads as a sequence.
- **Don't:** Don't make the step buttons the only way forward. They go to the finished steps; the forward action is your own `Continue` button.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--primary-foreground`, `--ring`, `--text-link`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-lg`, `--duration-base`, `--duration-slow`, `--ease-move`.

#### Command

A searchable command palette dialog with keyboard navigation (⌘K pattern).

```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem value="dashboard" onSelect={...}>Go to Dashboard</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

```ts
function Command({ className, children }: {
    className?: string;
    children: React.ReactNode;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `Command`: The root. It holds the search text and the active option, and filters its items as the user types. Render it inline or inside `CommandDialog`.
- `CommandDialog` — optional: A ready-made palette: `Command` inside a `Dialog` without a close button and without open or close motion, controlled with `open` and `onOpenChange`.
- `CommandEmpty` — optional: The message for an empty result, `No results found.` by default. Only the list renders it, and only when no item matches.
- `CommandGroup` — optional: A labelled set of items with an optional `heading`. It hides itself when none of its items match. Items must be its direct children.
- `CommandInput`: The search field, a `combobox` that keeps focus while arrow keys move the active option. It focuses itself on mount; pass `autoFocus={false}` for an inline palette.
- `CommandItem`: One option, a `role="option"` button. Its `value` is what the search matches and what the arrow keys visit; `onSelect` runs on click or Enter.
- `CommandList`: The scrolling `listbox` (up to 20 rem tall) that holds the groups. It shows `CommandEmpty` when nothing matches.
- `CommandSeparator` — optional: A hairline between groups. It is decorative and hidden from screen readers.

Best practices:

- **When:** Use Command for a searchable list of actions and destinations, opened by a shortcut. For choosing one value in a form, use a select or combobox field. For a short fixed list of actions, use a dropdown menu.
- **Do:** Give every `CommandItem` a unique `value` made of the words people search for, such as `Invite member`. Filtering matches the `value`, not the visible children, and an item without a value is skipped by the arrow keys.
- **Do:** Put `CommandGroup` directly inside `CommandList` and the items directly inside the group. The filter and the keyboard order read only this structure, so a wrapper `div` hides items from both.
- **Do:** Use `CommandDialog` with a global shortcut such as ⌘K, and pair it with a visible trigger. It opens with no animation on purpose, since a palette that people open many times a day should not delay them.
- **Don't:** Don't leave the field's name to a hint placeholder. The placeholder becomes the `aria-label`, so set `aria-label` yourself when the placeholder is an example such as `Try Invite`.
- **Don't:** Don't use `Command` for a search against a server. It filters the items you render, so fetch the matches and render only those yourself.

Theming: reads `--accent`, `--border`, `--brand-600`, `--foreground`, `--popover`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--control-lg`.

#### ContextMenu

Actions that open on right-click, styled like the dropdown menu.

```tsx
<ContextMenu>
  <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

```ts
function ContextMenu({ ...props }: ContextMenu.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<MenuRoot.Actions \| null>` | — |
| `children` | `React.ReactNode` | — |
| `closeParentOnEsc` | `Menu.Root.Props['closeParentOnEsc']` | — |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `highlightItemOnHover` | `boolean` | `true` |
| `loopFocus` | `boolean` | `true` |
| `onOpenChange` | `((open: boolean, eventDetails: ContextMenuRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'vertical'` |

Anatomy:

- `ContextMenu` (`data-slot="context-menu"`): Holds the open state. It renders nothing itself.
- `ContextMenuContent` (`data-slot="context-menu-content"`): The menu panel. It brings its own portal. Arrow keys move through the items, Enter chooses and Escape closes.
- `ContextMenuGroup` (`data-slot="context-menu-group"`) — optional: Groups related items under a `ContextMenuLabel` that serves as the group's accessible name.
- `ContextMenuItem` (`data-slot="context-menu-item"`): One action. `variant="destructive"` colours it red for deleting or removing; `disabled` keeps it visible but inert.
- `ContextMenuLabel` (`data-slot="context-menu-label"`) — optional: A small heading for a section of items. Inside a `ContextMenuGroup` it names the group; outside one it is plain text.
- `ContextMenuSeparator` (`data-slot="context-menu-separator"`) — optional: A hairline between sections of the menu.
- `ContextMenuTrigger` (`data-slot="context-menu-trigger"`): The area that opens the menu on right-click, long press or the context-menu key.

Best practices:

- **When:** Use a ContextMenu for shortcuts on an object people already work with: a table row, a file, a canvas item. For a menu opened from a visible button, use a dropdown menu.
- **Do:** Mirror every context action in a visible place, such as a row menu button. The menu opens only on the `contextmenu` event, so people who never right-click will not find it.
- **Do:** Put the most used action first, `variant="destructive"` items last and a `ContextMenuSeparator` before them, so a slip of the pointer does not land on a delete.
- **Do:** Keep labels as short verbs: `Rename`, `Duplicate`, `Delete`. The trigger area already names the object.
- **Don't:** Don't use a context menu to navigate or to hold a form. It is a `menu` of commands, so links to pages belong in a navbar or sidebar.

Theming: reads `--accent`, `--accent-foreground`, `--border`, `--destructive`, `--foreground`, `--muted-foreground`, `--popover`, `--popover-foreground`, `--radius-lg`, `--radius-md`, `--shadow-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-exit`.

#### NativeSelect

A full-width styled select trigger and popup list.

```tsx
<NativeSelect value={value} onValueChange={setValue}>
  <NativeSelectTrigger aria-label="Choose an option"><NativeSelectValue /></NativeSelectTrigger>
  <NativeSelectContent>
    <NativeSelectItem value="us">United States</NativeSelectItem>
  </NativeSelectContent>
</NativeSelect>
```

```ts
function NativeSelect({ items, children, ...props }: Select.Root.Props<string>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<SelectRootActions \| null>` | — |
| `autoComplete` | `string` | — |
| `children` | `React.ReactNode` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultValue` | `SelectValueType<Value, Multiple> \| null` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `highlightItemOnHover` | `boolean` | `true` |
| `id` | `string` | — |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `isItemEqualToValue` | `((itemValue: Value, value: Value) => boolean)` | — |
| `items` | `Record<string, React.ReactNode> \| ReadonlyArray<{ label: React.ReactNode; value: any; }> \| ReadonlyArray<Group<any>>` | — |
| `itemToStringLabel` | `((itemValue: Value) => string)` | — |
| `itemToStringValue` | `((itemValue: Value) => string)` | — |
| `modal` | `boolean` | `true` |
| `multiple` | `Multiple` | `false` |
| `name` | `string` | — |
| `onOpenChange` | `((open: boolean, eventDetails: SelectRootChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `onValueChange` | `((value: SelectValueType<Value, Multiple> \| (Multiple extends true ? never : null), eventDetails: SelectRootChangeEventDetails) => void)` | — |
| `open` | `boolean` | — |
| `readOnly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `value` | `SelectValueType<Value, Multiple> \| null` | — |

Anatomy:

- `NativeSelect` (`data-slot="native-select"`): The root. The `items` map of values to labels is read from the children when not given, so the trigger shows `Germany` for `de` at once.
- `NativeSelectContent` (`data-slot="native-select-content"`): The list under the trigger, with its own portal. It opens below the trigger, never over it, and matches its width.
- `NativeSelectItem` (`data-slot="native-select-item"`): One choice. The chosen one shows a check on the right.
- `NativeSelectTrigger` (`data-slot="native-select-trigger"`): The field-height button with a bordered box and a chevron. It opens the list, takes the focus ring and needs a label.
- `NativeSelectValue` (`data-slot="native-select-value"`): Shows the label of the chosen item inside the trigger.

Best practices:

- **When:** Use NativeSelect to choose one option from a short fixed list in a form: country, role, plan. For a long list with search, use a Combobox; for a choice inside a sentence, use InlineSelect.
- **Do:** Put it in a `Field` with a `FieldLabel`. The trigger announces the chosen value, but not what it is a value of.
- **Do:** Use values that are stable keys (`de`) and labels that read well (`Germany`), and keep the list under about ten items.
- **Don't:** Don't expect the browser's own `<select>`. The list is a styled popup, so `<option>` children do nothing; use `NativeSelectItem`.

Theming: reads `--accent`, `--accent-foreground`, `--card`, `--foreground`, `--input`, `--popover`, `--popover-foreground`, `--ring`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--field-md`, `--shadow-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`, `--ease-exit`, `--scale-enter`, `--travel-sm`.

#### InlineSelect

A compact select meant to sit inline within a sentence of text.

```tsx
<InlineSelect defaultValue="newest">
  <InlineSelectTrigger aria-label="Choose an option"><InlineSelectValue /></InlineSelectTrigger>
  <InlineSelectContent>...</InlineSelectContent>
</InlineSelect>
```

```ts
function InlineSelect({ items, children, ...props }: Select.Root.Props<string>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<SelectRootActions \| null>` | — |
| `autoComplete` | `string` | — |
| `children` | `React.ReactNode` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultValue` | `SelectValueType<Value, Multiple> \| null` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `highlightItemOnHover` | `boolean` | `true` |
| `id` | `string` | — |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `isItemEqualToValue` | `((itemValue: Value, value: Value) => boolean)` | — |
| `items` | `Record<string, React.ReactNode> \| ReadonlyArray<{ label: React.ReactNode; value: any; }> \| ReadonlyArray<Group<any>>` | — |
| `itemToStringLabel` | `((itemValue: Value) => string)` | — |
| `itemToStringValue` | `((itemValue: Value) => string)` | — |
| `modal` | `boolean` | `true` |
| `multiple` | `Multiple` | `false` |
| `name` | `string` | — |
| `onOpenChange` | `((open: boolean, eventDetails: SelectRootChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `onValueChange` | `((value: SelectValueType<Value, Multiple> \| (Multiple extends true ? never : null), eventDetails: SelectRootChangeEventDetails) => void)` | — |
| `open` | `boolean` | — |
| `readOnly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `value` | `SelectValueType<Value, Multiple> \| null` | — |

Anatomy:

- `InlineSelect` (`data-slot="inline-select"`): The root of a select that lives inside text. The `items` map of values to labels is read from the children when not given.
- `InlineSelectContent`: The list under the trigger, with its own portal. It opens below, never over the trigger.
- `InlineSelectItem`: One choice. The chosen one shows a check on the right.
- `InlineSelectTrigger` (`data-slot="inline-select-trigger"`): A borderless button showing the current value and a small chevron. It highlights on hover and has a focus ring.
- `InlineSelectValue`: Shows the label of the chosen item inside the trigger.

Best practices:

- **When:** Use InlineSelect to switch a value inside a sentence, a title or a toolbar: `Sort by Newest`. For a field with a border in a form, use NativeSelect.
- **Do:** Give the trigger an `aria-label` such as `Sort order`. It has no visible label, and the announced value alone does not say what is being chosen.
- **Do:** Keep option labels short, one or two words. The trigger is only as wide as the current label, so long labels push the surrounding text.
- **Don't:** Don't use it as the only way to reach a primary setting in a form. The missing border does not look like an input; use NativeSelect inside a Field.

Theming: reads `--foreground`, `--muted`, `--ring`, `--text-tertiary`, `--radius-md`.

#### CheckboxButtonGroup

A multi-select group of toggle-styled buttons.

```tsx
<CheckboxButtonGroup value={value} onValueChange={setValue}>
  <ToggleButton aria-label="Bold" value="bold"><Bold /></ToggleButton>
</CheckboxButtonGroup>
```

```ts
function CheckboxButtonGroup<Value extends string>({ className, ...props }: ToggleGroup.Props<Value>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `readonly Value[]` | — |
| `disabled` | `boolean` | `false` |
| `loopFocus` | `boolean` | `true` |
| `multiple` | `boolean` | `false` |
| `onValueChange` | `((groupValue: Value[], eventDetails: ToggleGroup.ChangeEventDetails) => void)` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `readonly Value[]` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `CheckboxButtonGroup` (`data-slot="checkbox-button-group"`): A wrapping row of toggle buttons where any number can be on at once. `value` is an array of the pressed buttons' values.
- `ToggleButton`: One button, pressed or not. Its `value` joins the group value; icon-only buttons need an `aria-label`.

Best practices:

- **When:** Use CheckboxButtonGroup for a few short options that can be combined: text styles, days of the week, filters. For exactly one choice, use RadioButtonGroup; for a long list, use Checkbox.
- **Do:** Keep `value` as `string[]` and update it in `onValueChange`. Wrapping on narrow screens is built in, so no custom breakpoints are needed.
- **Do:** Give every icon-only `ToggleButton` an `aria-label` such as `Bold`. The pressed state is announced, but the icon alone has no name.
- **Don't:** Don't use it for options with a sentence of explanation. A button holds a word or two; use a Checkbox with a description instead.

#### RadioButtonGroup

A single-select group of toggle-styled buttons.

```tsx
<RadioButtonGroup value={value} onValueChange={setValue}>
  <ToggleButton aria-label="Align left" value="left"><AlignLeft /></ToggleButton>
</RadioButtonGroup>
```

```ts
function RadioButtonGroup<Value extends string>({ className, ...props }: Omit<ToggleGroup.Props<Value>, "multiple">): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `readonly Value[]` | — |
| `disabled` | `boolean` | `false` |
| `loopFocus` | `boolean` | `true` |
| `onValueChange` | `((groupValue: Value[], eventDetails: ToggleGroup.ChangeEventDetails) => void)` | — |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `readonly Value[]` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `RadioButtonGroup` (`data-slot="radio-button-group"`): A wrapping row of toggle buttons of which exactly one value can be on. `value` is an array holding at most that one value.
- `ToggleButton`: One option button. Pressed buttons get a primary border and tint; icon-only buttons need an `aria-label`.

Best practices:

- **When:** Use RadioButtonGroup for a few short exclusive options: a size, a plan period, a layout. For several at once, use CheckboxButtonGroup; for options with explanations, use RadioGroup.
- **Do:** Keep the choices to a word or two each and no more than about five, so the row stays on one line.
- **Do:** Give icon-only `ToggleButton` elements an `aria-label` such as `Grid view`.
- **Don't:** Don't assume a value is always set. Pressing the active button again clears the choice, so accept an empty `value` or restore your default in `onValueChange`.

#### NumberStepper

A +/- increment control for a bounded numeric value.

```tsx
<NumberStepper value={value} onValueChange={setValue} min={0} max={10} />
```

```ts
function NumberStepper({ value, onValueChange, min, max, step, format, className, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Formats the displayed value, e.g. `(n) => `${n}%`` */
    format?: (value: number) => React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: number) => void` | — |
| `value` * | `number` | — |
| `className` | `string` | — |
| `format` | `(value: number) => React.ReactNode` | `(n) => String(n)` |
| `max` | `number` | `Infinity` |
| `min` | `number` | `-Infinity` |
| `step` | `number` | `1` |

Also accepts the React.HTMLAttributes attributes (278).

Anatomy:

- `NumberStepper`: A group of a minus button, the current value and a plus button. It is controlled: you pass `value` and `onValueChange`.
- `Decrease button`: A small plain icon button named `Decrease`. At `min` it looks disabled but stays focusable, so repeated Enter does not lose focus.
- `Value`: The number between the buttons, shown through `format` and announced politely when it changes.
- `Increase button`: A small plain icon button named `Increase`. It stops at `max` in the same way.

Best practices:

- **When:** Use NumberStepper for small counts changed by step: guests, quantity in a cart. For typing, long ranges or decimals, use NumberField.
- **Do:** Set `min`, `max` and `step` so the buttons stop at real limits. The value is clamped, so it never leaves the range.
- **Do:** Use `format` to add the unit, for example `(n) => n + " seats"`, so the number is not read without it.
- **Don't:** Don't use it for values the user may want to type, such as 250. There is no text entry, so a jump from 1 to 250 takes 249 clicks.

Theming: reads `--foreground`.

#### DropZone

A drag-and-drop file upload target with a click-to-browse fallback.

```tsx
<DropZone onFiles={(files) => upload(files)} accept="image/*" />
```

```ts
function DropZone({ onFiles, accept, hint, className, }: {
    onFiles?: (files: FileList) => void;
    accept?: string;
    /** Line under the prompt. Defaults to the accepted types, or "Any file type". State your size limit here. */
    hint?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `accept` | `string` | — |
| `className` | `string` | — |
| `hint` | `React.ReactNode` | — |
| `onFiles` | `(files: FileList) => void` | — |

Anatomy:

- `DropZone`: A dashed target around a hidden file input. A click anywhere or Enter/Space on the focused zone opens the file dialog, and files can be dropped on it.
- `File input`: The real `<input type="file">`, visually hidden, always `multiple`. It takes the focus ring's place on the zone and is described by the hint.
- `Hint` — optional: The small line under the prompt. It defaults to the accepted types, or `Any file type`, and is where a size limit belongs.

Best practices:

- **When:** Use DropZone for uploads where drag and drop helps: images, documents, imports. For a single file in a tight form row, a Button that opens the file dialog is enough.
- **Do:** State the limit in `hint`, for example `PDF or PNG, up to 10 MB`. The zone does not enforce a size.
- **Do:** Receive files in `onFiles` and show them in a list with name, size and a remove action. The zone itself shows no uploaded files or progress.
- **Don't:** Don't trust `accept` for dropped files. It filters the file dialog, but a drop passes every file to `onFiles`, so check the type there and report which file was refused.

Theming: reads `--border`, `--foreground`, `--primary`, `--ring`, `--text-link`, `--text-tertiary`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### RichTextEditor

A Tiptap-powered WYSIWYG editor with a formatting toolbar.

```tsx
<RichTextEditor content={html} onChange={setHtml} placeholder="Write something..." />
```

```ts
function RichTextEditor(props: RichTextEditorProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `content` | `string` | — |
| `onChange` | `(html: string) => void` | — |
| `placeholder` | `string` | — |

Anatomy:

- `RichTextEditor`: A bordered editor with a toolbar for bold, italic, underline, lists and links. It loads its engine on first render and returns HTML in `onChange`.
- `RichTextEditorSkeleton` — optional: The placeholder box shown until the editor has loaded. Export it for use as your own loading state.
- `Toolbar`: Icon buttons for Bold, Italic, Underline, Bulleted list, Numbered list and Link. Each has an `aria-label` and `aria-pressed`; Link asks for the address in a browser prompt, and an empty answer removes the link.
- `Editing area`: The editable text, at least 128 px tall, with the `placeholder` text while empty.

Best practices:

- **When:** Use RichTextEditor for formatted content: notes, descriptions, replies. For plain text, use Textarea.
- **Do:** Give it a visible label through `Field` or `Label`. The editing area has no label of its own.
- **Do:** Store the HTML from `onChange` and pass it back as `content`. `content` is the starting text, so later changes to the prop do not replace what the user typed.
- **Don't:** Don't use it for text that must stay plain, such as names or titles. The output is HTML (`<p>`, `<strong>`), not plain text.

Theming: reads `--border`, `--card`, `--input`, `--text-tertiary`, `--radius-lg`.

#### ColorPicker

Pick a colour: saturation and brightness, hue, opacity, eyedropper, HEX/RGB/HSL values and saved colours — inline or from a trigger field.

```tsx
<ColorPicker value={hex} onValueChange={setHex} />
```

```ts
function ColorPicker({ variant, value, defaultValue, onValueChange, alpha, defaultAlpha, onAlphaChange, showAlpha, format, defaultFormat, onFormatChange, swatches, defaultSwatches, onSwatchesChange, title, onClose, className, }: ColorPickerProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `alpha` | `number` | — |
| `className` | `string` | — |
| `defaultAlpha` | `number` | `1` |
| `defaultFormat` | `"hex" \| "rgb" \| "hsl"` | `"hex"` |
| `defaultSwatches` | `string[]` | `DEFAULT_SWATCHES` |
| `defaultValue` | `string` | `"#555CF3"` |
| `format` | `"hex" \| "rgb" \| "hsl"` | — |
| `onAlphaChange` | `(alpha: number) => void` | — |
| `onClose` | `() => void` | — |
| `onFormatChange` | `(format: ColorFormat) => void` | — |
| `onSwatchesChange` | `(swatches: string[]) => void` | — |
| `onValueChange` | `(hex: string) => void` | — |
| `showAlpha` | `boolean` | `true` |
| `swatches` | `string[]` | — |
| `title` | `React.ReactNode` | `"Color picker"` |
| `value` | `string` | — |
| `variant` | `"spectrum" \| "grid"` | `"spectrum"` |

Anatomy:

- `ColorPicker` (`data-slot="color-picker"`): The colour panel: a saturation and brightness area (or a swatch grid), a hue slider, optional opacity, value fields and saved swatches.
- `ColorPickerTrigger` (`data-slot="color-picker-trigger"`) — optional: A field with a colour dot and the hex value that opens a ColorPicker in a popover. It brings its own popover.

Best practices:

- **When:** Use ColorPicker for a free colour choice, with hex, RGB or HSL entry and opacity. For a short fixed palette in a table row, use CellColorPicker.
- **Do:** Use `ColorPickerTrigger` in forms and give it `label` (default `Colour`). Its accessible name becomes `Colour: <hex>`.
- **Do:** Treat `value` as `#RRGGBB` and keep opacity apart in `alpha` (0 to 1). Hide the opacity slider with `showAlpha={false}` where transparency makes no sense.
- **Do:** Pass `swatches` with `onSwatchesChange` to save the user's colours; the plus button adds the current colour.
- **Don't:** Don't add a native colour input beside it as a fallback. The area and both tracks are sliders that already take the arrow keys, and Shift makes bigger steps.

Theming: reads `--background`, `--border`, `--border-control`, `--card`, `--foreground`, `--muted`, `--popover`, `--popover-foreground`, `--ring`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--radius-sm`, `--radius-xl`, `--field-md`, `--shadow-lg`, `--duration-fast`, `--ease-entrance`.

#### CellColorPicker

A compact color swatch picker for inline use in a Data Grid cell.

```tsx
<CellColorPicker value={color} onValueChange={setColor} />
```

```ts
function CellColorPicker({ value, onValueChange, }: {
    value: string;
    onValueChange: (value: string) => void;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: string) => void` | — |
| `value` * | `string` | — |

Anatomy:

- `CellColorPicker`: A round swatch button that opens a six-colour popover. It is built for a table cell and returns the chosen colour as a hex string.
- `Swatch popover`: The popover with the six colour buttons. The active one has `aria-pressed` and a ring; choosing a colour does not close it.

Best practices:

- **When:** Use CellColorPicker for a colour column in a table: a label colour, a tag colour. For a free colour with opacity and a hex field, use ColorPicker.
- **Do:** Keep `value` as a hex string as `#RRGGBB` and store it with `onValueChange`. The trigger names itself `Colour <hex>. Choose a colour`.
- **Don't:** Don't expect colours outside the six swatches. A `value` that is not in the set still shows on the trigger, but the user can only pick from the six.
- **Don't:** Don't use it outside a row. It is 24 px wide and has no label; in a form, use ColorPickerTrigger so the field has a visible label and the hex value.

Theming: reads `--border`, `--card`, `--foreground`, `--popover`, `--ring`, `--duration-fast`, `--ease-entrance`.

#### CellSlider

A compact progress/value slider for inline use in a Data Grid cell.

```tsx
<CellSlider value={68} max={100} />
```

```ts
function CellSlider({ value, max }: {
    value: number;
    max?: number;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number` | — |
| `max` | `number` | `100` |

Anatomy:

- `CellSlider`: A small bar with a number beside it, 112 px wide. It shows `value` out of `max` (default 100) and cannot be dragged.
- `Bar`: The track with a primary-coloured fill. The fill width is `value / max`, capped at 100 %.
- `Number`: The raw `value` to the right of the bar, so the bar never has to be read on its own.

Best practices:

- **When:** Use CellSlider to show a level inside a table row: a score, a quota used. For a value the user changes, use Slider; for a task's completion, use Progress.
- **Do:** Set `max` to the real ceiling, such as `max={5}` for a 5-point score. The fill is clamped at 100 %, but the number still shows the raw value.
- **Do:** Put it in a column whose header names the measure, such as `Usage`. The bar and the number carry no label or role of their own.
- **Don't:** Don't build a cell around it that is expected to be editable. It has no handler, no keyboard support and no ARIA role; use a Slider with an `aria-label` in the cell instead.

Theming: reads `--muted`, `--primary`, `--text-tertiary`.

#### CellSelect

A compact select for inline use in a Data Grid cell.

```tsx
<CellSelect value={value} onValueChange={setValue} options={["Active", "Paused"]} />
```

```ts
function CellSelect({ value, onValueChange, options, "aria-label": ariaLabel, }: {
    value: string;
    onValueChange: (value: string) => void;
    options: string[];
    /** Name for screen readers — a combobox is not named by its current value. */
    "aria-label"?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: string) => void` | — |
| `options` * | `string[]` | — |
| `value` * | `string` | — |
| `aria-label` | `string` | — |

Anatomy:

- `CellSelect`: A compact select for a table cell: a 32 px trigger, 128 px wide, with the options as a plain string list.
- `Trigger`: The button showing the current value. It has no visible label, so it takes `aria-label` (default `Choose a value`).
- `Options list`: The popup under the trigger with one item per string in `options`; the chosen item shows a check.

Best practices:

- **When:** Use CellSelect to edit one value of a row in place: a status, an owner, a priority. For a select in a form with a label, use NativeSelect.
- **Do:** Set `aria-label` per column, for example `Priority`. A trigger that shows only its current value does not name itself to a screen reader.
- **Do:** Pass `options` as the exact strings you store, and keep `value` one of them. The value is the text, there is no separate label.
- **Don't:** Don't use it for long lists or for options that need a description. It has no search and no groups; use a Combobox in a form instead.

#### CellSwitch

A compact switch for inline use in a Data Grid cell.

```tsx
<CellSwitch aria-label="Example switch" checked={checked} onCheckedChange={setChecked} />
```

```ts
function CellSwitch({ checked, onCheckedChange, "aria-label": ariaLabel, }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    /** Name for screen readers — a cell has no visible label of its own. */
    "aria-label"?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `checked` * | `boolean` | — |
| `onCheckedChange` * | `(checked: boolean) => void` | — |
| `aria-label` | `string` | — |

Anatomy:

- `CellSwitch`: A Switch with a default `aria-label` of `Toggle`, for a table cell that has no visible label of its own.

Best practices:

- **When:** Use CellSwitch for an on/off column in a table: enabled, notify, public. Outside a table, use Switch with a visible label or a SelectorItem.
- **Do:** Set `aria-label` per row or column, for example `Email notifications for Alina Lorenz`. The default `Toggle` is identical for every row.
- **Do:** Keep `checked` in your own state and write it back in `onCheckedChange`. The cell does not keep any state of its own.
- **Don't:** Don't ship the default label when a column has more than one switch. Screen-reader users hear `Toggle` repeated and cannot tell which row they are on.

#### SelectorItem

A list row pairing a leading icon/avatar and label/description with a trailing radio, checkbox, or switch.

```tsx
<SelectorItem
  leading={<CreditCard />}
  title="Mastercard"
  description="Ending in 4242 · expires 08/28"
  control={<RadioGroupItem value="mastercard" />}
/>
```

```ts
function SelectorItem({ leading, title, description, control, className, }: {
    leading?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    control: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `control` * | `ReactNode` | — |
| `title` * | `ReactNode` | — |
| `className` | `string` | — |
| `description` | `ReactNode` | — |
| `leading` | `ReactNode` | — |

Anatomy:

- `SelectorItem` (`data-slot="selector-item"`): A bordered row that pairs a title and description with a control on the right. The whole row is the control's label, so a click anywhere toggles it.
- `SelectorItemGroup` (`data-slot="selector-item-group"`) — optional: A vertical stack of rows with a 8 px gap. Use it so several options read as one list.
- `Leading` — optional: An optional icon or logo before the title, passed as `leading`.
- `Control`: The `RadioGroupItem`, `Checkbox` or `Switch` passed as `control`. The row border turns primary while it is checked.

Best practices:

- **When:** Use SelectorItem for choices that need a title and an explanation: payment methods, plans, a setting with a switch. For a short label next to a box, use CheckboxField.
- **Do:** Pass the matching control: `RadioGroupItem` inside a `RadioGroup`, or `Checkbox` or `Switch` alone. The border follows the control's checked state.
- **Do:** Keep `title` to one line and put the detail in `description`. Both are truncated, so long text is cut with an ellipsis.
- **Don't:** Don't put a link or button in `title` or `description`. The row is one label, and a click on it toggles the control.

Theming: reads `--border`, `--card`, `--foreground`, `--muted-foreground`, `--primary`, `--ring`, `--radius-lg`, `--duration-fast`, `--ease-move`.

#### Label

An accessible label for a form control.

```tsx
<Label htmlFor="email">Email</Label>
```

```ts
function Label({ className, ...props }: React.ComponentProps<"label">): React.JSX.Element;
```

Anatomy:

- `Label` (`data-slot="label"`): A styled `<label>` in a row with a gap. Connect it with `htmlFor`; inside a Field with a disabled control it dims.

Best practices:

- **When:** Use Label to name a control that a Field does not wrap: a checkbox or switch beside its text, a standalone input. For a Field's own label, use FieldLabel.
- **Do:** Match `htmlFor` to the control's `id`, or wrap the control in the Label. Clicking the text then focuses or toggles the control.
- **Do:** Write a noun in sentence case (`Work email`) and keep rules for the answer in the help text below the control.
- **Don't:** Don't use a placeholder or a heading instead of a Label. A placeholder vanishes on typing and a heading is not linked to the input.

Theming: reads `--foreground`.

#### Field

Labelling and validation for a single form control — label, description, and error message.

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <FieldControl render={<Input type="email" />} />
  <FieldDescription>We&apos;ll never share your email.</FieldDescription>
</Field>
```

```ts
function Field({ className, ...props }: Field.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<FieldRoot.Actions \| null>` | — |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `dirty` | `boolean` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | — |
| `name` | `string` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `touched` | `boolean` | — |
| `validate` | `((value: unknown, formValues: Form.Values) => string \| string[] \| null \| void \| Promise<string \| string[] \| null \| void>)` | — |
| `validationDebounceTime` | `number` | `0` |
| `validationMode` | `"onBlur" \| "onChange" \| "onSubmit"` | `'onSubmit'` |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `Field` (`data-slot="field"`): The wrapper of one form control. It links the label, description and error to the control through ARIA and carries `name`, `invalid`, `disabled` and `validate`.
- `FieldControl` (`data-slot="field-control"`) — optional: A bare input bound to the field. The Input component joins its Field by itself, so FieldControl is needed only for a plain input.
- `FieldDescription` (`data-slot="field-description"`) — optional: Help text under the control. It is linked with `aria-describedby`, so a screen reader reads it with the label.
- `FieldError` (`data-slot="field-error"`) — optional: The error message. It shows when the control is invalid (or when `match` is set) and is linked to the control.
- `FieldLabel` (`data-slot="field-label"`): The visible name of the control. Clicking it focuses the control; it is also the accessible name.

Best practices:

- **When:** Use Field around every form control that has a label, a hint or an error. For a group of related controls, wrap the Fields in a Fieldset; for submit handling, use Form.
- **Do:** Put a `FieldLabel` first, then the control, then `FieldDescription` or `FieldError`. A label is a noun (`Work email`) and a description is a full sentence.
- **Do:** Give each Field a `name` when it sits in a Form. The name is how server errors passed to the Form's `errors` find their field.
- **Do:** Write `FieldError` text that says what to do: `Enter an email address like name@company.com`. Use `validate` or the `match` prop to decide when it shows.
- **Don't:** Don't build the label, hint and error by hand with `<label>` and `<p>`. You lose the `aria-describedby` and `aria-invalid` links that Field sets.

Theming: reads `--foreground`, `--text-error`, `--text-tertiary`.

#### Fieldset

A native fieldset with a legend, for grouping related fields.

```tsx
<Fieldset>
  <FieldsetLegend>Shipping address</FieldsetLegend>
  <Field>
    <FieldLabel>Street</FieldLabel>
    <FieldControl render={<Input />} />
  </Field>
</Fieldset>
```

```ts
function Fieldset({ className, ...props }: Fieldset.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.FieldsetHTMLAttributes attributes (278).

Anatomy:

- `Fieldset` (`data-slot="fieldset"`): A real `<fieldset>` drawn as a bordered card with 16 px of padding and a 16 px gap between children. It names a group of controls.
- `FieldsetLegend` (`data-slot="fieldset-legend"`): The group's name, read by a screen reader before each control inside it. Without it the group has no name.

Best practices:

- **When:** Use Fieldset for controls that belong together: a radio group, a set of checkboxes, an address. A single control needs only a Field.
- **Do:** Always include a `FieldsetLegend`, such as `Notification channels`. It is the question a radio group or checkbox set answers.
- **Do:** Put Fields inside, not loose controls. The Fieldset spaces them with a gap; keep per-control labels and errors in the Fields.
- **Don't:** Don't wrap a Fieldset in a Card. It already has a border, background and padding, so the result is a card inside a card.

Theming: reads `--border`, `--card`, `--foreground`, `--radius-lg`.

#### Form

A form wrapper that simplifies validation and submission.

```tsx
<Form onSubmit={handleSubmit}>
  <Field>
    <FieldLabel>Name</FieldLabel>
    <FieldControl render={<Input />} />
  </Field>
  <Button type="submit">Submit</Button>
</Form>
```

```ts
function Form({ className, ...props }: Form.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<Form.Actions \| null>` | — |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `errors` | `FormContext['errors']` | — |
| `onFormSubmit` | `((formValues: FormValues, eventDetails: Form.SubmitEventDetails) => void)` | — |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `validationMode` | `"onBlur" \| "onChange" \| "onSubmit"` | `'onSubmit'` |

Also accepts the React.FormHTMLAttributes attributes (283).

Anatomy:

- `Form` (`data-slot="form"`): The `<form>` element in a vertical stack with a 16 px gap. It validates on submit and hands field errors from the server to the matching Fields.
- `Form actions`: The row of buttons at the end, built with FormActions. A submit button inside the form submits it.

Best practices:

- **When:** Use Form for everything the user submits together. A single input that acts at once, such as a search box, needs no Form.
- **Do:** Handle submit with `onFormSubmit`, which receives the values by field `name`. Give every Field a `name`.
- **Do:** Return server errors through `errors`, keyed by field name, e.g. `{ email: "That address is already in use." }`. The error appears in the matching `FieldError`.
- **Do:** Keep the default `validationMode` (`onSubmit`) unless a field needs instant feedback. A field then re-validates as the user corrects it.
- **Don't:** Don't add an `onClick` to the submit button to run validation. Use `onFormSubmit`, so Enter in a field submits the same way.

#### InputGroup

Groups an input with leading/trailing addons — icons, buttons, or text.

```tsx
<InputGroup>
  <InputGroupAddon><Mail /></InputGroupAddon>
  <input placeholder="you@example.com" />
</InputGroup>
```

```ts
function InputGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
```

Anatomy:

- `InputGroup` (`data-slot="input-group"`): The bordered frame of one input and its addons. It owns the height, border and focus ring; the inner `<input>` loses its own.
- `InputGroupAddon` (`data-slot="input-group-addon"`) — optional: A leading or trailing slot for an icon, text or button. It is muted and keeps icons at 16 px.
- `Input`: The `<input>` inside the group. It fills the remaining width, and `aria-invalid` on it turns the group border destructive.

Best practices:

- **When:** Use InputGroup when an input needs an icon, a unit or a button inside its border: a search icon, `https://`, a copy button. A plain field needs only Input.
- **Do:** Put the `<input>` as a direct child. The group styles `> input`, so an extra wrapper around it breaks the sizing.
- **Do:** Set `aria-invalid` on the input itself for errors. The group reads it, and `has-disabled` dims the whole group when the input is disabled.
- **Don't:** Don't set a border or height on the input inside. The group draws the border and sets the height, so adjust those on the group with `className`.

Theming: reads `--card`, `--destructive`, `--input`, `--ring`, `--text-tertiary`, `--radius-md`, `--field-md`, `--duration-fast`, `--ease-entrance`.

#### NumberField

A numeric input with increment/decrement buttons.

```tsx
<NumberField defaultValue={3} min={0} max={10}>
  <NumberFieldGroup>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

```ts
function NumberField({ ...props }: NumberField.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `allowOutOfRange` | `boolean` | `false` |
| `allowWheelScrub` | `boolean` | `false` |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `number` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `format` | `Intl.NumberFormatOptions` | — |
| `id` | `string` | — |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `largeStep` | `number` | `10` |
| `locale` | `Intl.LocalesArgument` | — |
| `max` | `number` | — |
| `min` | `number` | — |
| `name` | `string` | — |
| `onValueChange` | `((value: number \| null, eventDetails: NumberFieldRoot.ChangeEventDetails) => void)` | — |
| `onValueCommitted` | `((value: number \| null, eventDetails: NumberFieldRoot.CommitEventDetails) => void)` | — |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `smallStep` | `number` | `0.1` |
| `snapOnStep` | `boolean` | `false` |
| `step` | `number \| 'any'` | `1` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `value` | `number \| null` | — |

Also accepts the React.HTMLAttributes attributes (273).

Anatomy:

- `NumberField` (`data-slot="number-field"`): The root. It holds the numeric `value` (null when empty), the limits, the steps and the `format`.
- `NumberFieldDecrement` (`data-slot="number-field-decrement"`) — optional: The minus button on the left. It disables itself at `min`.
- `NumberFieldGroup` (`data-slot="number-field-group"`): The bordered frame around the buttons and the input. It carries the focus ring.
- `NumberFieldIncrement` (`data-slot="number-field-increment"`) — optional: The plus button on the right. It disables itself at `max`.
- `NumberFieldInput` (`data-slot="number-field-input"`): The text input for typing a number. Arrow Up and Down step; Shift uses `largeStep` (10), Alt uses `smallStep` (0.1).

Best practices:

- **When:** Use NumberField when the user types a number or steps it: quantity, seats, a threshold. When only the buttons make sense and there is no typing, use NumberStepper.
- **Do:** Set `min`, `max` and `step` to the real limits, such as `min={1} max={50}`. The buttons disable at the edges.
- **Do:** Put the unit in the label or `format`, for example `format={{ style: "currency", currency: "EUR" }}`. Numbers carry their unit.
- **Do:** Treat the value as `number | null`. An empty field reports `null`, not `0`.
- **Don't:** Don't leave the input unlabelled; the buttons are named, the field is not. Wrap it in a `Field` with a `FieldLabel`.

Theming: reads `--card`, `--input`, `--muted`, `--ring`, `--text-secondary`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### OtpField

A segmented input for one-time passwords and verification codes.

```tsx
<OtpField length={4}>
  <OtpFieldInput />
  <OtpFieldInput />
  <OtpFieldInput />
  <OtpFieldInput />
</OtpField>
```

```ts
function OtpField({ className, ...props }: OTPField.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `length` * | `number` | — |
| `autoComplete` | `string` | `'one-time-code'` |
| `autoSubmit` | `boolean` | `false` |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultValue` | `string` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `id` | `string` | — |
| `inputMode` | `React.HTMLAttributes<HTMLInputElement>['inputMode']` | — |
| `mask` | `boolean` | `false` |
| `name` | `string` | — |
| `normalizeValue` | `((value: string) => string)` | — |
| `onValueChange` | `((value: string, eventDetails: OTPFieldRoot.ChangeEventDetails) => void)` | — |
| `onValueComplete` | `((value: string, eventDetails: OTPFieldRoot.CompleteEventDetails) => void)` | — |
| `onValueInvalid` | `((value: string, eventDetails: OTPFieldRoot.InvalidEventDetails) => void)` | — |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `validationType` | `"none" \| "numeric" \| "alpha" \| "alphanumeric"` | `'numeric'` |
| `value` | `string` | — |

Also accepts the React.HTMLAttributes attributes (272).

Anatomy:

- `OtpField` (`data-slot="otp-field"`): The group of single-character boxes. `length` sets how many digits it expects, and `onValueComplete` fires when the last one is filled.
- `OtpFieldInput` (`data-slot="otp-field-input"`): One box for one character. Typing moves to the next box, Backspace to the previous, and pasting fills them all.

Best practices:

- **When:** Use OtpField for one-time codes sent by email or SMS, and for short PINs. For longer free text or codes with dashes, use Input.
- **Do:** Render one `OtpFieldInput` per digit and set the same number in `length`. A code with six digits needs six boxes.
- **Do:** Start verification in `onValueComplete` and set `autoSubmit` where the form should submit by itself. Show the result in a `FieldError`.
- **Do:** Leave `autoComplete` at its default `one-time-code`, so phones can offer the code from the message.
- **Don't:** Don't tell the user only that the code failed. Say what to do: `That code has expired. Request a new one.`

Theming: reads `--card`, `--foreground`, `--input`, `--ring`, `--radius-md`, `--control-lg`, `--duration-fast`, `--ease-entrance`.

#### Combobox

An input combined with a filterable list of predefined items to select.

```tsx
<Combobox items={frameworks} value={value} onValueChange={setValue}>
  <ComboboxInputGroup>
    <ComboboxInput placeholder="Search..." />
    <ComboboxTrigger />
  </ComboboxInputGroup>
  <ComboboxPopup>
    <ComboboxEmpty>No results.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxPopup>
</Combobox>
```

```ts
function Combobox<Value, Multiple extends boolean | undefined = false, Item = Value>(props: ComboboxProps<Value, Multiple, Item>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<ComboboxRoot.Actions \| null>` | — |
| `autoComplete` | `string` | — |
| `autoHighlight` | `boolean` | `false` |
| `children` | `React.ReactNode` | — |
| `defaultInputValue` | `React.ComponentProps<'input'>['defaultValue']` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultValue` | `ComboboxValueType<Value, Multiple> \| null` | — |
| `disabled` | `boolean` | `false` |
| `filter` | `null \| ((item: Item, query: string, itemToString?: (item: Item) => string) => boolean)` | — |
| `filteredItems` | `readonly Item[] \| readonly Group<Item>[]` | — |
| `form` | `string` | — |
| `grid` | `boolean` | `false` |
| `highlightItemOnHover` | `boolean` | `true` |
| `id` | `string` | — |
| `inline` | `boolean` | `false` |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `inputValue` | `React.ComponentProps<'input'>['value']` | — |
| `isItemEqualToValue` | `((itemValue: Value, value: Value) => boolean)` | — |
| `items` | `readonly Value[] \| readonly ComboboxItemGroup<Value>[] \| ComboboxItemCollection<Item, Value>` | — |
| `itemToStringLabel` | `((itemValue: Value) => string)` | — |
| `itemToStringValue` | `((itemValue: Value) => string)` | — |
| `limit` | `number` | `-1` |
| `locale` | `Intl.LocalesArgument` | — |
| `loopFocus` | `boolean` | `true` |
| `modal` | `boolean` | `false` |
| `multiple` | `Multiple` | `false` |
| `name` | `string` | — |
| `onInputValueChange` | `((inputValue: string, eventDetails: ComboboxRoot.ChangeEventDetails) => void)` | — |
| `onItemHighlighted` | `((highlightedValue: Value \| undefined, eventDetails: ComboboxRoot.HighlightEventDetails) => void)` | — |
| `onOpenChange` | `((open: boolean, eventDetails: ComboboxRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `onValueChange` | `\| (( value: Multiple extends true ? Value[] : Value \| null, eventDetails: ComboboxPrimitive.Root.ChangeEventDetails ) => void)` | — |
| `open` | `boolean` | — |
| `openOnInputClick` | `boolean` | `true` |
| `readOnly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `value` | `ComboboxValueType<Value, Multiple> \| null` | — |
| `virtualized` | `boolean` | `false` |

Anatomy:

- `Combobox`: The root. It holds the items, the selection and the filter; `multiple` turns `value` into an array.
- `ComboboxEmpty` (`data-slot="combobox-empty"`) — optional: Shown when the filter matches nothing. It is hidden while it has no content.
- `ComboboxGroup` (`data-slot="combobox-group"`) — optional: A labelled section when `items` is an array of `{ items }` groups.
- `ComboboxGroupLabel` (`data-slot="combobox-group-label"`) — optional: The small heading of a group; it labels the options that follow it.
- `ComboboxInput` (`data-slot="combobox-input"`): The text input that filters the list. It has the combobox role; arrow keys move, Enter selects, Esc closes.
- `ComboboxInputGroup` (`data-slot="combobox-input-group"`) — optional: The bordered frame around the input and its trigger. It carries the field height, border and focus ring.
- `ComboboxItem` (`data-slot="combobox-item"`): One option. The chosen item shows a check on the right.
- `ComboboxList` (`data-slot="combobox-list"`): Renders the filtered items. Pass a render function as the child so each item is mapped from the current list.
- `ComboboxPopup` (`data-slot="combobox-popup"`): The option panel. It brings its own portal and positioner, matches the input width and scrolls when it is tall.
- `ComboboxPortal` — optional: Renders the list outside the DOM flow. `ComboboxPopup` already includes it.
- `ComboboxTrigger` (`data-slot="combobox-trigger"`) — optional: The chevron button that opens the list without typing. Its `aria-label` is `Show options`.

Best practices:

- **When:** Use a Combobox to choose one or more items from a list too long to scan: people, countries, projects. For free text with suggestions, use Autocomplete; for fewer than ten fixed options, use NativeSelect.
- **Do:** Type the state as `useState<Value | null>`. In single mode `onValueChange` receives `null` when the selection is cleared.
- **Do:** Always render a `ComboboxEmpty` with a sentence such as `No people found. Try a different name.`
- **Do:** Pass `multiple` for several choices and keep `value` as an array. Group long lists with `{ items }` objects and a `ComboboxGroupLabel`.
- **Don't:** Don't leave the input unlabelled. The placeholder disappears once the user types; label it with `Field` or `Label`.

Theming: reads `--accent`, `--accent-foreground`, `--card`, `--foreground`, `--input`, `--muted-foreground`, `--popover`, `--popover-foreground`, `--ring`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--field-md`, `--shadow-md`, `--duration-fast`, `--ease-entrance`.

#### Autocomplete

An input that suggests options as you type.

```tsx
<Autocomplete items={fruits}>
  <AutocompleteInputGroup>
    <AutocompleteInput placeholder="Type a fruit..." />
  </AutocompleteInputGroup>
  <AutocompletePopup>
    <AutocompleteEmpty>No matches.</AutocompleteEmpty>
    <AutocompleteList>
      {(item) => <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>}
    </AutocompleteList>
  </AutocompletePopup>
</Autocomplete>
```

```ts
function Autocomplete<ItemValue>({ items, ...props }: Autocomplete.Root.Props<ItemValue>): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<AutocompleteRootActions \| null>` | — |
| `autoHighlight` | `boolean \| 'always'` | `false` |
| `children` | `React.ReactNode` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultValue` | `AriaCombobox.Props<React.ComponentProps<'input'>['defaultValue'], 'none'>['defaultInputValue']` | — |
| `disabled` | `boolean` | `false` |
| `filter` | `AriaCombobox.Props<ItemValue, 'none'>['filter']` | — |
| `filteredItems` | `readonly ItemValue[] \| readonly Group<ItemValue>[]` | — |
| `form` | `string` | — |
| `grid` | `boolean` | `false` |
| `highlightItemOnHover` | `boolean` | `true` |
| `id` | `string` | — |
| `inline` | `boolean` | `false` |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `items` | `readonly ItemValue[] \| readonly Group<ItemValue>[]` | — |
| `itemToStringValue` | `((itemValue: ItemValue) => string)` | — |
| `keepHighlight` | `boolean` | `false` |
| `limit` | `number` | `-1` |
| `locale` | `Intl.LocalesArgument` | — |
| `loopFocus` | `boolean` | `true` |
| `modal` | `boolean` | `false` |
| `mode` | `'list' \| 'both' \| 'inline' \| 'none'` | `'list'` |
| `name` | `string` | — |
| `onItemHighlighted` | `((highlightedValue: ItemValue \| undefined, eventDetails: AutocompleteRootHighlightEventDetails) => void)` | — |
| `onOpenChange` | `((open: boolean, eventDetails: AutocompleteRootChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `onValueChange` | `((value: string, eventDetails: AutocompleteRootChangeEventDetails) => void)` | — |
| `open` | `boolean` | — |
| `openOnInputClick` | `boolean` | `false` |
| `readOnly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `submitOnItemClick` | `AriaCombobox.Props<ItemValue, 'none'>['submitOnItemClick']` | `false` |
| `value` | `AriaCombobox.Props<React.ComponentProps<'input'>['value'], 'none'>['inputValue']` | — |
| `virtualized` | `boolean` | `false` |

Anatomy:

- `Autocomplete` (`data-slot="autocomplete"`): The root. It holds the typed text, the items and the filter; `value` is the string in the input, not a chosen item.
- `AutocompleteEmpty` (`data-slot="autocomplete-empty"`) — optional: Shown instead of the list when nothing matches. It is hidden while it has no content.
- `AutocompleteInput` (`data-slot="autocomplete-input"`): The text input. It is the combobox: arrow keys move through the suggestions, Enter takes one, Esc closes the list.
- `AutocompleteInputGroup` (`data-slot="autocomplete-input-group"`) — optional: The bordered frame around the input. It carries the height, border and focus ring so the input inside stays borderless.
- `AutocompleteItem` (`data-slot="autocomplete-item"`): One suggestion. Its `value` is what fills the input when it is chosen.
- `AutocompleteList` (`data-slot="autocomplete-list"`): Renders the items. Pass a render function as the child so the filtered list, not the full one, is mapped.
- `AutocompletePopup` (`data-slot="autocomplete-popup"`): The suggestion panel. It brings its own portal and positioner, matches the width of the input and scrolls when it runs out of room.
- `AutocompletePortal` — optional: Renders the list outside the DOM flow. `AutocompletePopup` already includes it, so mount it yourself only for a custom popup.

Best practices:

- **When:** Use Autocomplete when the user may type anything and the list only suggests: a search box, a tag, a city. When the answer must be one of the items, use a Combobox.
- **Do:** Give the input a visible label through `Field` or `Label`. The placeholder is a hint such as `Type a fruit...`, not the name of the field.
- **Do:** Always include an `AutocompleteEmpty` with a sentence like `No matches. Check the spelling or try a shorter word.` so an empty list never looks like a broken one.
- **Do:** Control `value` as a string with `onValueChange` when the text drives something else, such as a server search. The value is the input text, never an item object.
- **Don't:** Don't treat the value as validated. Typed text that matches no item still ends up in `value`, so check it on submit or use a Combobox.

Theming: reads `--accent`, `--accent-foreground`, `--card`, `--foreground`, `--input`, `--popover`, `--popover-foreground`, `--ring`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--field-md`, `--shadow-md`, `--duration-fast`, `--ease-entrance`.

#### Calendar

A month grid for picking one date or a range, with keyboard navigation and optional min, max and disabled days.

```tsx
<Calendar mode="single" selected={date} onSelect={setDate} />
```

```ts
function Calendar({ mode, selected, onSelect, month, defaultMonth, onMonthChange, min, max, disabled, className }: CalendarProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `defaultMonth` | `Date` | — |
| `disabled` | `CalendarDisabled` | — |
| `max` | `Date` | — |
| `min` | `Date` | — |
| `mode` | `"single"` | `"single"` |
| `month` | `Date` | — |
| `onMonthChange` | `(month: Date) => void` | — |
| `onSelect` | `(date: Date) => void` | — |
| `selected` | `Date` | — |

Anatomy:

- `Calendar` (`data-slot="calendar"`): An inline month grid, Monday first, in single or range `mode`. It has no popover, so place it in a card or use DatePicker for a field. `min`, `max` and `disabled` limit which days can be picked.
- `Month bar` — optional: The previous and next month buttons around the month name. Both carry an `aria-label`; the month is controlled with `month` and `onMonthChange`. A button is disabled when its month lies completely outside `min`–`max`. The month name labels the grid and is announced when it changes.
- `Day button`: One `<button>` per day inside a `gridcell`, in `row`s under the weekday `columnheader`s of a `role="grid"`. The chosen day's cell has `aria-selected`, today has `aria-current="date"`, and days of neighbouring months are muted but still selectable. Days outside `min`–`max` or matched by `disabled` are `aria-disabled` and dimmed.

Best practices:

- **When:** Use Calendar to show a month inline, for example next to a schedule or inside your own popover. To pick a date into a form field, use DatePicker.
- **Do:** Set `mode="range"` and keep `selected` as `{ from, to }`. The first click sets `from`, the second sets `to` (an earlier day swaps the two), and a third click starts a new range.
- **Do:** Open on the right month with `defaultMonth`, or control it with `month` and `onMonthChange` when two calendars must move together.
- **Do:** Limit the choice with `min` and `max`, and block single days with `disabled` (a list of dates or a test such as weekends). Blocked days stay reachable with the arrow keys and are announced as unavailable; still say near the calendar why a day is blocked.
- **Do:** Count on the date-grid keyboard: Tab enters the grid once (on the selected day, today or the first day), arrows move by day and week, Home and End go to the start and end of the week, Page Up and Page Down change the month (with Shift the year), Enter or Space picks the day.

Theming: reads `--accent`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--text-link`, `--text-tertiary`, `--duration-fast`, `--ease-entrance`.

#### DatePicker

A Calendar inside a Popover, with Cancel/Apply actions.

```tsx
<DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
```

```ts
function DatePicker(props: DatePickerProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `defaultValue` | `Date` | — |
| `disabled` | `CalendarProps["disabled"]` | — |
| `max` | `Date` | — |
| `min` | `Date` | — |
| `mode` | `"single"` | — |
| `numberOfMonths` | `1 \| 2` | — |
| `onValueChange` | `(date: Date \| undefined) => void` | — |
| `placeholder` | `string` | — |
| `presets` | `boolean \| DatePreset[]` | — |
| `value` | `Date` | — |

Anatomy:

- `DatePicker`: A button that opens a popover with one or two calendars. The value changes only when the user chooses Apply.
- `Trigger`: The button the user clicks to open the picker. It carries a calendar icon and shows the chosen date or range, or the placeholder text (`Pick a date` or `Pick a date range`) while nothing is chosen.
- `Presets` — optional: A list of quick ranges (`Last 7 days`, `Month to date`) beside the calendars. It appears with `presets` in range mode.
- `Calendar`: One month in single mode, two side by side in range mode (`numberOfMonths`). It is the Calendar component, with its keyboard grid; `min`, `max` and `disabled` are passed through to it.
- `Footer`: Cancel and Apply. Cancel, Esc or a click outside closes the popover and discards the draft.

Best practices:

- **When:** Use DatePicker to put one date or one range into a form field or filter bar. For an always-visible month, use Calendar.
- **Do:** Set `mode="range"` for periods and `presets` for reports: `true` brings seven quick ranges, or pass your own `{ label, range }` list.
- **Do:** Put a visible `Label` above the trigger. The button shows only the date or the placeholder, so the label says what the date is for.
- **Do:** Set `placeholder` to the action in the context, such as `Pick a start date`. The default texts are generic.
- **Do:** Pass `min`, `max` and `disabled` to keep impossible dates out of the calendar, such as past days or weekends. Say next to the field what is allowed, because blocked days only look dimmed.

Theming: reads `--border`, `--foreground`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### ChatMessage

A single message bubble on the indigo tint, aligned right for the user and left for the assistant.

```tsx
<ChatConversation>
  <ChatMessage role="user" avatar={<Avatar />}>Question...</ChatMessage>
  <ChatMessage role="assistant">Answer...</ChatMessage>
</ChatConversation>
```

```ts
function ChatMessage({ role, avatar, children, className, }: {
    role: "user" | "assistant";
    avatar?: ReactNode;
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `ReactNode` | — |
| `role` * | `"user" \| "assistant"` | — |
| `avatar` | `ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `ChatMessage`: One turn of the chat: a tinted bubble up to 75% of the width. `role="user"` puts it on the right, `assistant` on the left, each with the corner next to the sender flattened.
- `ChatConversation` (`data-slot="chat-conversation"`) — optional: Stacks the messages of a chat with an even gap.
- `Avatar` — optional: The optional `avatar` before the bubble, an Avatar or Agent Avatar. For the user the row is reversed, so it sits on the right.

Best practices:

- **When:** Use ChatMessage for one turn in a chat. Group several in a Chat Conversation. For a chat with several agents, add an Agent Avatar to each message.
- **Do:** Set `role` on every message. It flips the row and the flattened corner; both roles use the same tint, so give the assistant an `avatar` as well.
- **Do:** Wrap the messages in `ChatConversation` for an even rhythm instead of spacing them by hand.
- **Don't:** Don't put wide content into the bubble. It wraps at 75% of the width, so show code in a Code Block and documents in an Artifact Panel.
- **Don't:** Don't recolour the bubbles to tell sender from receiver. The library uses one tint for both on purpose; role and position do that.

Theming: reads `--tint-indigo`, `--tint-text-indigo`, `--radius-2xl`, `--radius-sm`.

#### ChatMessageActions

Copy / retry / thumbs up-down actions shown under an assistant message.

```tsx
<ChatMessageActions />
```

```ts
function ChatMessageActions({ className, onCopy, onRegenerate, feedback, onFeedback, }: {
    className?: string;
    onCopy?: () => void;
    onRegenerate?: () => void;
    /** The rating already given; marks the matching thumb as pressed. */
    feedback?: "up" | "down";
    onFeedback?: (value: "up" | "down") => void;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `feedback` | `"up" \| "down"` | — |
| `onCopy` | `() => void` | — |
| `onFeedback` | `(value: "up" \| "down") => void` | — |
| `onRegenerate` | `() => void` | — |

Anatomy:

- `ChatMessageActions`: A row of four icon buttons under an assistant message: Copy, Regenerate, Good response and Bad response. Each has an `aria-label` and a tooltip title.

Best practices:

- **When:** Use ChatMessageActions under a finished assistant message: copy, regenerate and a thumbs rating. For actions on code or a document, use the controls of Code Block or Artifact Panel.
- **Do:** Show it once the answer is complete, not while it streams. Copy and Regenerate act on the whole message.
- **Do:** Pass the rating already given as `feedback`. The matching thumb stays pressed through `aria-pressed`, also after a reload.
- **Do:** Do the copying in `onCopy` and confirm it where the eye is, for example in a tooltip. The component writes nothing to the clipboard itself.
- **Don't:** Don't pass `onFeedback` without storing the value and handing it back as `feedback`. The thumbs only mirror `feedback`; they do not toggle on their own.

Theming: reads `--foreground`, `--muted`, `--ring`, `--text-link`, `--text-tertiary`, `--radius-md`.

#### ChatLoader

A bouncing-dots indicator shown while the assistant is composing a reply.

```tsx
{isStreaming && <ChatLoader />}
```

```ts
function ChatLoader({ className }: {
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |

Anatomy:

- `ChatLoader`: Three bouncing dots with the hidden text `Assistant is typing`, announced through `role="status"`. The dots stand still under reduced motion.

Best practices:

- **When:** Use ChatLoader at the end of a conversation while the assistant has not started its answer. For a running tool call, use Chat Tool with `status="running"`; for a whole run, use Agent Status.
- **Do:** Show it after the user sends and remove it with the first streamed text, so the loader and the growing reply never appear together.
- **Do:** Leave the built-in text alone. It tells screen readers that the assistant is typing, which the moving dots cannot do under reduced motion.
- **Don't:** Don't leave it on after a failure or an abort. It has no timeout and no error state, so replace it with the failure message and a retry.

Theming: reads `--text-tertiary`, `--duration-fast`.

#### ChatAttachment

A file chip attached to a chat message, with an optional remove button.

```tsx
<ChatAttachment name="file.pdf" size="2.4 MB" onRemove={() => remove(file)} />
```

```ts
function ChatAttachment({ name, size, onRemove, className, }: {
    name: string;
    size?: string;
    onRemove?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `string` | — |
| `className` | `string` | — |
| `onRemove` | `() => void` | — |
| `size` | `string` | — |

Anatomy:

- `ChatAttachment`: A chip for a file attached to a message or prompt: file icon, truncated name and an optional size line.
- `Remove button` — optional: An icon button named `Remove <name>`, rendered only when `onRemove` is given. Its hit area is larger than the icon.

Best practices:

- **When:** Use ChatAttachment for a file attached to a message or a prompt. For a reference to a person, channel or link inside a prompt, use Context Pill.
- **Do:** Pass `size` already formatted with its unit, such as `2.4 MB`. The chip shows it as given.
- **Do:** Pass `onRemove` only while the file can still be taken back, typically before sending.
- **Don't:** Don't pass a path as `name`. The name truncates at the end, so the part that tells files apart should come first.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-tertiary`, `--radius-lg`.

#### ChatSource

A citation chip linking to a source referenced in an answer.

```tsx
<ChatSource title="Page title" domain="example.com" index={1} />
```

```ts
function ChatSource({ title, domain, index, href, onClick, className, }: {
    title: string;
    domain: string;
    index?: number;
    href?: string;
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `domain` * | `string` | — |
| `title` * | `string` | — |
| `className` | `string` | — |
| `href` | `string` | `"#"` |
| `index` | `number` | — |
| `onClick` | `() => void` | — |

Anatomy:

- `ChatSource`: A compact link card for one cited source: optional number, globe icon, truncated title and domain. With a real `href` it opens in a new tab with `rel="noreferrer"`.

Best practices:

- **When:** Use ChatSource for one source cited in an answer. For a numbered, pinned list of all sources use Source List.
- **Do:** Give `index` the same number as the citation in the answer text, such as `[1]`, so a reader finds the source.
- **Do:** Pass the real `href`. With the default `#` the card does not navigate and only calls `onClick`.
- **Don't:** Don't put a full URL into `domain`. Pass the host, such as `docs.example.com`, and the page name as `title`; both truncate to one line.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--radius-md`.

#### ChatTool

A collapsible card showing a tool/function call's name, status, and result.

```tsx
<ChatTool name="search_web(query)" status="running">
  Optional result content
</ChatTool>
```

```ts
function ChatTool({ name, status, children, className, }: {
    name: string;
    status?: "running" | "done";
    children?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `string` | — |
| `children` | `React.ReactNode` | — |
| `className` | `string` | — |
| `status` | `"running" \| "done"` | `"done"` |

Anatomy:

- `ChatTool`: One tool call in a chat: wrench icon, tool name, a running spinner or a done check, and the arguments or result behind a disclosure.
- `Details` — optional: The `children`, shown below the header when expanded. Without children there is no chevron and no `aria-expanded`.

Best practices:

- **When:** Use ChatTool for a tool call inside a chat message. For a file edit use Diff View; for a run with many steps use a run timeline.
- **Do:** Pass the arguments or result as `children` to make the row expandable. Keep them short and as text.
- **Do:** Set `status="running"` while the call is in flight. The spinner stops under reduced motion, and screen readers hear `Running` or `Done`.
- **Don't:** Don't show a failed call with it. It knows only `running` and `done`, and done shows a green check. Use a run error for failures.

Theming: reads `--border`, `--card`, `--foreground`, `--success`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### ChainOfThought

A collapsible list of the model's intermediate reasoning steps.

```tsx
<ChainOfThought steps={["Step one.", "Step two."]} />
```

```ts
function ChainOfThought({ steps, defaultOpen, className, }: {
    steps: string[];
    defaultOpen?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `steps` * | `string[]` | — |
| `className` | `string` | — |
| `defaultOpen` | `boolean` | `false` |

Anatomy:

- `ChainOfThought`: A collapsed block for the model's reasoning, folded away under an answer.
- `Toggle`: A `button` with `aria-expanded` that opens and closes the list. Its label is fixed: `Thought for a few seconds`.
- `Steps`: The `steps` strings as short lines with a bullet, rendered as text.

Best practices:

- **When:** Use ChainOfThought to fold the model's reasoning away under an answer. For tool calls and their results use Chat Tool; for the steps an agent plans to take, use Agent Plan.
- **Do:** Keep it closed, which is the default, so the answer comes first. Set `defaultOpen` only where the reasoning is the content.
- **Do:** Pass `steps` as short plain strings, one thought per entry. They render as text lines, not markup.
- **Don't:** Don't expect the header to show a duration. Its text is fixed; for measured times use Duration Bar or Agent Status.
- **Don't:** Don't hide a failure in it. A failed step needs its own error state with the step and the cause, visible without opening anything.

Theming: reads `--border`, `--card`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### CodeBlock

A syntax-styled code block with a language label and copy button.

```tsx
<CodeBlock language="tsx" code={source} />
```

```ts
function CodeBlock({ code, language, className, onCopy, }: {
    code: string;
    language?: string;
    className?: string;
    /** Called after the code landed on the clipboard. The block already confirms it with a tooltip. */
    onCopy?: () => void;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `code` * | `string` | — |
| `className` | `string` | — |
| `language` | `string` | — |
| `onCopy` | `() => void` | — |

Anatomy:

- `CodeBlock` (`data-slot="code-block"`): A bordered code snippet with a header and the code below.
- `Header`: The `language` label (default `code`) and the Copy button, which confirms with `Copied` and a tooltip.
- `Code region`: A scrollable `pre` with `role="region"`, named `<language> code`. Long lines scroll sideways and the region takes focus for the arrow keys.

Best practices:

- **When:** Use CodeBlock for a snippet in a message or a doc: language label, copy button and sideways scrolling. For a file the agent made, with versions, use Artifact Panel; for a change, Diff View.
- **Do:** Pass `language`, such as `tsx` or `bash`. It labels the header and names the region for screen readers.
- **Do:** Use `onCopy` for side effects only. The block already confirms the copy itself, so add no toast.
- **Don't:** Don't expect syntax highlighting. The block renders plain monospace text in the foreground colour.
- **Don't:** Don't wrap long lines by hand. The region scrolls and is reachable by keyboard.

Theming: reads `--code-border`, `--foreground`, `--muted`, `--ring`, `--success`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--duration-ambient`, `--duration-fast`, `--duration-slow`, `--ease-exit`, `--ease-move`, `--ease-overshoot`.

#### Markdown

Prose styling wrapper for rendered markdown/HTML assistant output.

```tsx
<Markdown>{/* rendered markdown output */}</Markdown>
```

```ts
function Markdown({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `Markdown`: A styled text container for formatted agent answers. It styles headings, links, inline code and lists, and does not parse Markdown itself.

Best practices:

- **When:** Use Markdown to give an agent answer consistent typography once it is parsed. For source code with copy and line numbers, use a Code Block.
- **Do:** Parse the string into React elements first and pass those as `children`. The component only styles `h1`, `h2`, `a`, `code`, `ul`, `ol` and `p`, so a raw string stays raw.
- **Do:** Render agent text through that parser, not through `dangerouslySetInnerHTML`. Model output and tool results are data, and they can contain markup.
- **Don't:** Don't expect tables, block code or deeper headings to be styled. Only the elements listed above have rules, so use Code Block or Table for the rest.
- **Don't:** Don't override the link or paragraph colour with hex values. Links use `text-link` and paragraphs `text-secondary`, which follow light and dark.

Theming: reads `--foreground`, `--muted`, `--text-link`, `--text-secondary`.

#### PromptInput

An auto-resizing chat input with attach and send buttons.

```tsx
<PromptInput value={value} onValueChange={setValue} onSubmit={handleSubmit} models={models} />
```

```ts
function PromptInput({ value, onValueChange, onSubmit, placeholder, "aria-label": ariaLabel, models, model, defaultModel, onModelChange, tools, onAttach, className, }: {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
    /** Accessible name of the text field (the placeholder is not a name). */
    "aria-label"?: string;
    /** Models for the model chip; the chip opens a popover to switch between them. */
    models?: ModelOption[];
    model?: string;
    defaultModel?: string;
    onModelChange?: (id: string) => void;
    /** Extra buttons after the attach button (link, web search …). */
    tools?: React.ReactNode;
    /** Called by the attach (paperclip) button — open your file picker here. */
    onAttach?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `onValueChange` * | `(value: string) => void` | — |
| `value` * | `string` | — |
| `aria-label` | `string` | — |
| `className` | `string` | — |
| `defaultModel` | `string` | — |
| `model` | `string` | — |
| `models` | `ModelOption[]` | — |
| `onAttach` | `() => void` | — |
| `onModelChange` | `(id: string) => void` | — |
| `onSubmit` | `() => void` | — |
| `placeholder` | `string` | `"Ask anything..."` |
| `tools` | `React.ReactNode` | — |

Anatomy:

- `PromptInput`: The message box of a chat: a growing textarea with Attach files, optional tools and model chip, and a round Send button.
- `Text field`: The `<textarea>` named by `aria-label`, "Message" by default. It grows up to about 160 px and then scrolls.
- `Attach button` — optional: An icon button named "Attach files". It calls `onAttach`, where you open your file picker.
- `Model chip` — optional: A Model Picker shown only when `models` is passed.
- `Send button`: A round primary icon button named "Send". It is disabled while the text is empty.

Best practices:

- **When:** Use a Prompt Input for chat and agent prompts with a send button. For a short single-line field, use Input. For voice, use Voice Input.
- **Do:** Keep `value` in state and send in `onSubmit`. Enter sends, Shift+Enter adds a line, and an Enter that confirms IME input is not a send.
- **Do:** Give the field a name that fits the screen through `aria-label`, such as `Message to the planner`. The placeholder does not count as a name.
- **Do:** Pass `models` and `onModelChange` when the user may switch models. The chip appears only then.
- **Don't:** Don't clear `value` before `onSubmit` has read it. The component skips empty prompts itself, but clearing the text after a send is your job.

Theming: reads `--card`, `--foreground`, `--input`, `--ring`, `--text-tertiary`, `--radius-xl`.

#### PromptSuggestion

A pill-shaped suggested-prompt chip shown above an empty chat input.

```tsx
<PromptSuggestion onClick={() => setPrompt(text)}>{text}</PromptSuggestion>
```

```ts
function PromptSuggestion({ children, onClick, className, }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `onClick` | `() => void` | — |

Anatomy:

- `PromptSuggestion`: A rounded chip with a ready-made prompt. It is a plain `<button>` that calls `onClick` and takes its text from `children`.

Best practices:

- **When:** Use Prompt Suggestions on an empty chat to show what is possible. For a command list opened by typing "/", use Slash Command Menu.
- **Do:** Write each suggestion as the full request the click will use, such as `Summarise this week's failed runs`. Short labels hide what happens.
- **Do:** Fill the prompt box in `onClick` and let the person edit before sending. Sending directly would put words in their mouth.
- **Don't:** Don't expect an icon or a description. The chip is text only; for commands with both, use Slash Command Menu.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--text-secondary`, `--duration-fast`, `--ease-entrance`.

#### TextShimmer

A shimmering-gradient text effect for a 'thinking...' loading label.

```tsx
<TextShimmer>Thinking...</TextShimmer>
```

```ts
function TextShimmer({ children, className }: {
    children: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `string` | — |
| `className` | `string` | — |

Anatomy:

- `TextShimmer`: A line of text with a light that sweeps across it every two seconds, for a label that says the agent is working.

Best practices:

- **When:** Use a Text Shimmer for a short status such as `Thinking` while work is open. For a measured value, use Usage Meter; for a step status, use Plan Step.
- **Do:** Pass a short string only. `children` is typed as a string, and the shimmer reads best on a few words.
- **Do:** Swap the shimmer for plain text as soon as the work ends. The loop means "in progress", so it must not outlive the work.
- **Do:** Say the same state in words next to it, such as `Reading 3 files`. With reduced motion the sweep stops, so the text carries the meaning.
- **Don't:** Don't use more than one shimmer in a view. A running step may pulse, but nothing else should loop.

Theming: reads `--foreground`, `--text-tertiary`.

#### ChatListView

A sidebar list of past conversations with preview and timestamp.

```tsx
<ChatListView items={[{ id, title, preview, timestamp, active }]} />
```

```ts
function ChatListView({ items, onSelect, className, }: {
    items: ChatListItem[];
    /** Called with the clicked item; the default "#" navigation is prevented. */
    onSelect?: (item: ChatListItem) => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `items` * | `ChatListItem[]` | — |
| `className` | `string` | — |
| `onSelect` | `(item: ChatListItem) => void` | — |

Anatomy:

- `ChatListView` (`data-slot="chat-list-view"`): The list of past conversations. Each row is a link with title, timestamp and a one-line preview.
- `Row`: One conversation. The open one carries `aria-current="page"` and a filled background.

Best practices:

- **When:** Use ChatListView for the history of conversations in a sidebar or panel: title, preview and time per entry. For navigation between app sections use a sidebar.
- **Do:** Set `active` on the open conversation only. It gets `aria-current="page"` and a filled row.
- **Do:** Handle selection in `onSelect`. Rows are anchors whose `#` navigation is prevented, so Tab and Enter work like on links.
- **Do:** Pass `timestamp` already formatted, such as `2 min ago` or `Mon`. It renders as given next to the title.
- **Don't:** Don't put a whole message into `preview`. It truncates to one line, so send the first words of the last message.

Theming: reads `--foreground`, `--muted`, `--text-tertiary`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### AgentStatus

A pill showing what a run is doing right now, with a live elapsed counter.

```tsx
<AgentStatus status="running" since={run.startedAt} />
```

```ts
function AgentStatus({ status, since, endedAt, label, showElapsed, size, className, }: {
    status: AgentRunStatus;
    /** When the run entered this status (or started, together with `endedAt`). Drives the elapsed counter. */
    since?: Date | string | number;
    /** When a finished run ended. With `since`, the pill shows the final duration `endedAt − since`. */
    endedAt?: Date | string | number;
    /** Overrides the default status label. */
    label?: string;
    showElapsed?: boolean;
    size?: "sm" | "default";
    className?: string;
}): React.JSX.Element;
type AgentRunStatus = "idle" | "running" | "waiting" | "done" | "failed" | "cancelled";
```

| Prop | Type | Default |
| --- | --- | --- |
| `status` * | `"done" \| "running" \| "failed" \| "waiting" \| "idle" \| "cancelled"` | — |
| `className` | `string` | — |
| `endedAt` | `Date \| string \| number` | — |
| `label` | `string` | — |
| `showElapsed` | `boolean` | `true` |
| `since` | `Date \| string \| number` | — |
| `size` | `"sm" \| "default"` | `"default"` |

Anatomy:

- `AgentStatus` (`data-slot="agent-status"`): The state of one run as a pill: icon, word and, when `since` is set, an elapsed time. The `running` icon spins only when motion is allowed; the word carries the state either way.

Best practices:

- **When:** Use AgentStatus for the state of one run, with its elapsed time. For spend against a budget use Cost Meter; for the steps of a run use a run timeline.
- **Do:** Pass `since` for `running` and `waiting`; both tick every second. For a finished run pass `since` and `endedAt`, and the pill shows the fixed duration.
- **Do:** Use `waiting` when a person has to act (it reads `Waiting for you`) and `idle` when nothing is queued. A run blocked on an approval is `waiting`, not `running`.
- **Do:** Override `label` only for a more precise word such as `Retrying`, and keep the status that matches the run so icon and tint stay right.
- **Don't:** Don't build the pill from a Badge and a spinner. AgentStatus has one icon, tint and word per state, and a stalled run still shows how long it has been there.

Theming: reads `--border`, `--brand-quaternary`, `--destructive`, `--muted`, `--primary`, `--success`, `--text-secondary`, `--text-tertiary`, `--text-warning`, `--tint-green`, `--tint-indigo`, `--tint-red`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-red`.

#### ApprovalCard

The human-in-the-loop gate: what the agent wants to do, how risky it is, approve or reject.

```tsx
<ApprovalCard
  title="Send 14 payment reminders"
  summary="Emails the contact on every invoice more than 30 days overdue."
  risk="medium"
  requestedAt="2 min ago"
  expiresAt={request.expiresAt}
  preview={<pre>{request.payload}</pre>}
  onApprove={() => approve(request.id)}
  onReject={() => reject(request.id)}
/>
```

```ts
function ApprovalCard({ title, summary, preview, risk, requestedAt, expiresAt, state, defaultOpen, kind, cost, approveLabel, rejectLabel, secondaryAction, onApprove, onReject, onEdit, className, ref, }: {
    title: React.ReactNode;
    /** One sentence: what happens if this is approved. */
    summary?: React.ReactNode;
    /** The payload, diff or command behind the request. Renders in a disclosure. */
    preview?: React.ReactNode;
    risk?: ApprovalRisk;
    /** Shown verbatim next to the title, e.g. "2 min ago". */
    requestedAt?: React.ReactNode;
    /** After this moment the card resolves itself as `expired`. */
    expiresAt?: Date | string | number;
    /** Controlled state. Omit to let the card manage its own. */
    state?: ApprovalState;
    defaultOpen?: boolean;
    kind?: ApprovalKind;
    /** high-cost: the banner, e.g. { estimate: "8.40", budget: "0.00", note: "…" }. */
    cost?: {
        estimate: React.ReactNode;
        budget?: React.ReactNode;
        note?: React.ReactNode;
    };
    /** Defaults per kind: Approve / Allow once / Allow / Run anyway. */
    approveLabel?: string;
    /** Defaults per kind: Reject / Reject / Deny / Cancel. */
    rejectLabel?: string;
    /** A second, softer way to say yes — e.g. "Always allow" or "Render 400 only". Resolves as approved. */
    secondaryAction?: {
        label: string;
        onClick?: () => void;
    };
    onApprove?: () => void;
    onReject?: () => void;
    /** When given, an "Edit" action appears beside reject. */
    onEdit?: () => void;
    className?: string;
    /** The card is focusable (tabIndex -1): call ref.current.focus() when a new request needs attention, instead of focusing Approve. */
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
type ApprovalRisk = "low" | "medium" | "high";
type ApprovalState = "pending" | "approved" | "rejected" | "expired";
type ApprovalKind = "inline" | "dialog-diff" | "permission" | "high-cost";
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `approveLabel` | `string` | — |
| `className` | `string` | — |
| `cost` | `{ estimate: React.ReactNode; budget?: React.ReactNode; note?: React.ReactNode }` | — |
| `defaultOpen` | `boolean` | `false` |
| `expiresAt` | `Date \| string \| number` | — |
| `kind` | `"inline" \| "dialog-diff" \| "permission" \| "high-cost"` | `"inline"` |
| `onApprove` | `() => void` | — |
| `onEdit` | `() => void` | — |
| `onReject` | `() => void` | — |
| `preview` | `React.ReactNode` | — |
| `ref` | `React.Ref<HTMLDivElement>` | — |
| `rejectLabel` | `string` | — |
| `requestedAt` | `React.ReactNode` | — |
| `risk` | `"low" \| "medium" \| "high"` | `"medium"` |
| `secondaryAction` | `{ label: string; onClick?: () => void }` | — |
| `state` | `"pending" \| "approved" \| "rejected" \| "expired"` | — |
| `summary` | `React.ReactNode` | — |

Anatomy:

- `ApprovalCard` (`data-slot="approval-card"`): The human-in-the-loop gate. A focusable group named by its title; it resolves in place to `approved`, `rejected` or `expired`, or follows `state` when you control it.
- `Risk badge`: The `low`, `medium` or `high` risk label next to the title, with a matching icon tint. Defaults to `medium`.
- `Cost banner` — optional: In `high-cost`, a yellow banner with `cost.estimate`, the run budget and a note.
- `Details` — optional: The `preview` payload. In `inline` and `high-cost` it sits behind a `Show what will run` toggle; in `dialog-diff` and `permission` it is shown directly.
- `Actions`: Approve and Reject, plus an optional softer `secondaryAction` and an Edit button when `onEdit` is given. Labels default per `kind`.

Best practices:

- **When:** Use ApprovalCard wherever an agent may not go on without a person's yes. `kind` picks the layout: `inline`, `dialog-diff`, `permission` or `high-cost`. For a lasting Allow, Ask or Deny setting per tool, use Tool Permission Row.
- **Do:** Write `summary` as one sentence about what happens on approval, set `risk` honestly and put the exact payload in `preview`, so the person can inspect it before deciding.
- **Do:** Set `expiresAt` where requests lapse. The card counts down, turns the time red under a minute and resolves itself as `expired` without running anything.
- **Do:** When a new request appears, move focus to the card with `ref.current.focus()`. Never focus Approve; the card is focusable for this reason.
- **Don't:** Don't start with `state="approved"` or approve inside your own handler. A default yes removes the gate.
- **Don't:** Don't hide Reject in a menu or add a louder Approve elsewhere. Use `secondaryAction` for a softer yes such as `Always allow`, and `onEdit` to change the request.

Theming: reads `--border`, `--brand-quaternary`, `--card`, `--destructive`, `--foreground`, `--muted`, `--primary`, `--ring`, `--success`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--text-warning`, `--tint-green`, `--tint-red`, `--tint-text-green`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-lg`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### RunTimeline

Every step of a run in order, with duration, tokens and expandable input/output.

```tsx
<RunTimeline steps={run.steps} activeStepId={run.currentStepId} />
```

```ts
function RunTimeline({ steps, activeStepId, defaultExpandedId, className, }: {
    steps: RunStep[];
    /** Highlights the row the run is currently on. */
    activeStepId?: string;
    /** Opens one step's detail on first render. */
    defaultExpandedId?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `steps` * | `RunStep[]` | — |
| `activeStepId` | `string` | — |
| `className` | `string` | — |
| `defaultExpandedId` | `string` | — |

Anatomy:

- `RunTimeline` (`data-slot="run-timeline"`): The ordered list of what an agent did. Each step has a status marker and a label, and may expand to show input and output.
- `Step`: One `<li>` with a marker for pending, running, done, failed or skipped. The state word is available to screen readers.
- `Step meta` — optional: Tokens, cost and duration at the right of the row. Pass the cost formatted with its currency.
- `Step detail` — optional: An Input and Output block that opens in place. Only steps with `input` or `output` get a button, and one step is open at a time.

Best practices:

- **When:** Use a Run Timeline to show what a finished or running agent did, step by step. For a plan that has not run, use Plan Step. For raw timestamped lines, use Log Stream.
- **Do:** Set `activeStepId` to the step the run is on. The row is highlighted and carries `aria-current="step"`.
- **Do:** Put an approval request into the waiting step's `output` and open it with `defaultExpandedId`. The gate then sits where the run stopped.
- **Do:** Give `cost` with its currency, for example `€0.04`, and `durationMs` as measured. Don't estimate numbers that look like measurements.
- **Don't:** Don't pass HTML from tools as `input` or `output`. Tool results are data, so render them as text nodes.

Theming: reads `--border`, `--card`, `--destructive`, `--destructive-foreground`, `--foreground`, `--muted`, `--primary`, `--success`, `--success-foreground`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### CostMeter

Spend against budget for a run, a day or a month — amber at 80%, red when it is gone.

```tsx
<CostMeter spent={17.4} budget={20} currency="EUR" period="day" />
```

```ts
function CostMeter({ spent, budget, unit, currency, period, label, warnAt, showRemaining, className, }: {
    spent: number;
    budget: number;
    unit?: CostUnit;
    /** ISO code, used when `unit` is "currency". */
    currency?: string;
    period?: CostPeriod;
    /** Overrides the default "Spend this run" heading. */
    label?: string;
    /** Fraction of the budget at which the meter turns amber. */
    warnAt?: number;
    showRemaining?: boolean;
    className?: string;
}): React.JSX.Element;
type CostUnit = "currency" | "tokens" | "requests";
type CostPeriod = "run" | "day" | "month";
```

| Prop | Type | Default |
| --- | --- | --- |
| `budget` * | `number` | — |
| `spent` * | `number` | — |
| `className` | `string` | — |
| `currency` | `string` | `"EUR"` |
| `label` | `string` | — |
| `period` | `"run" \| "day" \| "month"` | `"run"` |
| `showRemaining` | `boolean` | `true` |
| `unit` | `"currency" \| "tokens" \| "requests"` | `"currency"` |
| `warnAt` | `number` | `0.8` |

Anatomy:

- `CostMeter` (`data-slot="cost-meter"`): What an agent has spent against what it may spend: heading, budget, amount, bar and a status line. Turns amber at `warnAt` and red once the budget is reached.
- `Meter bar`: A `role="meter"` bar showing the percentage of the budget used.
- `Status line`: The percentage used, and `Nearly spent`, `Budget reached` or the remaining amount. The remainder hides with `showRemaining={false}`.

Best practices:

- **When:** Use CostMeter for what an agent spent against its budget. For usage against a plan quota use Usage Meter; for the context window, Context Meter.
- **Do:** Set `unit`, `currency` (ISO code, default `EUR`) and `period` (`run`, `day`, `month`), so heading and numbers carry their unit.
- **Do:** Rely on the words as well as the colour. At `warnAt`, default `0.8`, the line says `Nearly spent`; at the budget it says `Budget reached`.
- **Do:** Pair it with an approval of kind `high-cost` where continuing would exceed the budget.
- **Don't:** Don't pass `budget={0}` to mean unlimited. A zero budget counts as used up by any spend.

Theming: reads `--border`, `--brand-quaternary`, `--card`, `--destructive`, `--foreground`, `--muted`, `--primary`, `--text-error`, `--text-secondary`, `--text-tertiary`, `--text-warning`, `--radius-xl`, `--duration-ambient`, `--ease-entrance`.

#### RunError

A failed run: which step threw, how many attempts are left, retry or resume.

```tsx
<RunError
  message="The invoice API refused the request"
  failedStep="fetch_invoices"
  attempt={2}
  maxAttempts={3}
  detail={error.stack}
  onRetryFrom={() => resume(run.id)}
  onRetry={() => restart(run.id)}
  onCancel={() => cancel(run.id)}
/>
```

```ts
function RunError({ message, failedStep, attempt, maxAttempts, detail, detailLanguage, onRetry, onRetryFrom, onCancel, defaultOpen, className, }: {
    message: React.ReactNode;
    /** The step that threw, e.g. "fetch_invoices". */
    failedStep?: React.ReactNode;
    attempt?: number;
    maxAttempts?: number;
    /** Stack trace or raw error body, shown in a CodeBlock behind a disclosure. */
    detail?: string;
    detailLanguage?: string;
    /** Start the whole run over. */
    onRetry?: () => void;
    /** Resume from the failed step, keeping everything before it. */
    onRetryFrom?: () => void;
    onCancel?: () => void;
    defaultOpen?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `message` * | `React.ReactNode` | — |
| `attempt` | `number` | — |
| `className` | `string` | — |
| `defaultOpen` | `boolean` | `false` |
| `detail` | `string` | — |
| `detailLanguage` | `string` | `"text"` |
| `failedStep` | `React.ReactNode` | — |
| `maxAttempts` | `number` | — |
| `onCancel` | `() => void` | — |
| `onRetry` | `() => void` | — |
| `onRetryFrom` | `() => void` | — |

Anatomy:

- `RunError` (`data-slot="run-error"`): The failure card of a run: message, failed step, attempt count, optional error detail, and the buttons to resume, run again or cancel.
- `Message`: The headline that says what went wrong. The whole card is a `role="alert"`, so it is announced when it appears.
- `Failure line` — optional: The failed step in monospace and, with `attempt` and `maxAttempts`, "Attempt n of m". At the last attempt it adds "no retries left".
- `Error detail` — optional: A disclosure that opens a Code Block with the stack trace or the raw error body. It is closed unless `defaultOpen` is set.
- `Actions` — optional: Resume from this step (primary), Run again and Cancel run. Each appears only when its handler is passed.

Best practices:

- **When:** Use a Run Error when a whole run stops. For a failed command, use Terminal Output with its exit code. For a single failed row in a plan, use Plan Step.
- **Do:** Say what failed and what to do in `message`, such as `Couldn't read invoices. Check the connection and resume.` Name the step in `failedStep`.
- **Do:** Pass `onRetryFrom` when earlier steps are kept. Resume from this step then becomes the primary action and Run again turns plain.
- **Do:** Put the stack trace in `detail`. It sits behind a disclosure, so the headline stays short.
- **Don't:** Don't pass `onRetry` once `attempt` reaches `maxAttempts`. The card marks "no retries left" but still renders any button you give it.

Theming: reads `--card`, `--destructive`, `--foreground`, `--text-secondary`, `--tint-red`, `--tint-text-red`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### AgentGrid

The fleet view — every agent, its current status and how long it has been there.

```tsx
<AgentGrid
  agents={agents}
  columns={2}
  selectedId={selected}
  onSelect={(agent) => setSelected(agent.id)}
/>
```

```ts
function AgentGrid({ agents, onSelect, selectedId, columns, className, }: {
    agents: AgentSummary[];
    onSelect?: (agent: AgentSummary) => void;
    selectedId?: string;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `agents` * | `AgentSummary[]` | — |
| `className` | `string` | — |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` |
| `onSelect` | `(agent: AgentSummary) => void` | — |
| `selectedId` | `string` | — |

Anatomy:

- `AgentGrid` (`data-slot="agent-grid"`): The fleet view: a grid of agent cards. `columns` sets the widest layout (1 to 4, default 3) and the grid drops to fewer columns on narrow screens.
- `Agent card` (`data-slot="agent-grid-item"`) — optional: One agent: icon, name, a description clamped to two lines, a status pill with live counter and an optional meta line. With `onSelect` it becomes a `button` role card, reached with Tab and activated with Enter or Space.
- `Action` — optional: The trailing control of a card, such as a menu or a Run button. Clicks and keys on it never select the card.

Best practices:

- **When:** Use AgentGrid for the fleet overview: every agent, what each is doing and for how long. For the steps of one run use a run timeline; for parallel workers inside one run, use Agent Lane.
- **Do:** Set `since` to the moment the agent entered its current status. The pill then counts from it, so nobody has to ask how long an agent has been stuck.
- **Do:** Pass `onSelect` together with `selectedId` when the grid drives a detail pane. The selected card gets a primary ring and `aria-pressed`.
- **Do:** Put short facts in `meta`, such as `14 runs today · €2.10`, and keep `description` to one sentence.
- **Don't:** Don't expect a click on `action` to open the agent. It is stopped on purpose, so keep run, pause or menu controls there and use `onSelect` only for opening.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### PlanStep

One step of an agent plan: number or status icon, title, status in words and how long it took.

```tsx
<PlanStep
  status="running"
  title="Sync tokens from Figma"
  detail="Rewriting the variant map so legacy props keep resolving after the rename."
  meta={[
    { label: "Target", value: "packages/react/tabs.tsx" },
    { label: "Estimate", value: "4 min" },
  ]}
  since={step.startedAt}
/>
```

```ts
function PlanStep({ index, status, title, detail, meta, duration, since, action, density, className, }: {
    /** Shown in the marker while the step is queued or blocked. */
    index?: number;
    status?: PlanStepStatus;
    title: React.ReactNode;
    /** What the step is doing, shown below the title. */
    detail?: React.ReactNode;
    /** Label and value pairs under the detail, e.g. Target and Estimate. */
    meta?: PlanStepMeta[];
    /** Already formatted, e.g. "1m 12s" or "0:16". Shows "—" when empty. */
    duration?: React.ReactNode;
    /** When the step started. A running step then counts up from it. */
    since?: Date | string | number;
    /** A control on the right, e.g. a Retry button for a failed step. */
    action?: React.ReactNode;
    density?: PlanStepDensity;
    className?: string;
}): React.JSX.Element;
type PlanStepStatus = "queued" | "running" | "done" | "failed" | "skipped" | "blocked";
type PlanStepDensity = "default" | "compact";
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `action` | `React.ReactNode` | — |
| `className` | `string` | — |
| `density` | `"compact" \| "default"` | `"default"` |
| `detail` | `React.ReactNode` | — |
| `duration` | `React.ReactNode` | — |
| `index` | `number` | — |
| `meta` | `PlanStepMeta[]` | — |
| `since` | `Date \| string \| number` | — |
| `status` | `"done" \| "running" \| "failed" \| "queued" \| "skipped" \| "blocked"` | `"queued"` |

Anatomy:

- `PlanStep` (`data-slot="plan-step"`): One row of an agent plan: a numbered or status marker, the title, the status in words, and the time the step took.
- `Marker`: The round badge. It shows the step number while queued or blocked, and an icon for running, done, failed and skipped. It is hidden from screen readers.
- `Status label`: The status as a word (Queued, Running, Done, Failed, Skipped, Blocked), with the duration after it. Without a duration it shows a dash.
- `Detail` — optional: Optional text under the title plus label and value pairs from `meta`. It is hidden in the `compact` density.
- `Action` — optional: A slot on the right for a control such as a Retry button on a failed step.

Best practices:

- **When:** Use a Plan Step for the plan before and during a run, where steps are named in advance. For the log of what a run actually did, with input and output, use Run Timeline.
- **Do:** Set `status` for every step, and pass `since` for the running one. It then counts up by itself, and the count starts on the client, so it does not cause a hydration mismatch.
- **Do:** Add an `action` such as `Retry` to a failed step and explain the failure in `detail`. A failed step with no way forward is a dead end.
- **Do:** Use `density="compact"` in side panels. It drops the detail block, so keep what matters in the title.
- **Don't:** Don't rely on the marker colour alone. The status word is always shown next to it, so keep it and don't hide it for space.

Theming: reads `--card`, `--foreground`, `--subtle`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-red`, `--tint-text-green`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-md`.

#### AgentPlan

The agent's plan as a checklist: follow it live, edit it before the run, or group it into phases.

```tsx
<AgentPlan mode="tree" title="Migrate icons to Lucide 1.4" groups={plan.phases} />
```

```ts
function AgentPlan({ title, subtitle, mode, steps, groups, onStop, stopLabel, onStart, onStepsChange, hint, className, }: {
    title: React.ReactNode;
    /** Overrides the computed "2 of 7 done" / "4 to run · 1 skipped" line. */
    subtitle?: React.ReactNode;
    mode?: AgentPlanMode;
    /** Steps for `live` and `editable`. In `editable` only `id`, `title` and a skipped status are used. */
    steps?: AgentPlanStep[];
    /** Phases for `tree`. */
    groups?: AgentPlanGroup[];
    /** Shows the Stop button in `live`. */
    onStop?: () => void;
    stopLabel?: string;
    /** Shows the Start button in `editable`; receives the steps that will run. */
    onStart?: (steps: AgentPlanDraftStep[]) => void;
    /** Called in `editable` after every reorder, skip or add. */
    onStepsChange?: (steps: AgentPlanDraftStep[]) => void;
    /** Footer hint in `editable`. */
    hint?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type AgentPlanMode = "live" | "editable" | "tree";
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `groups` | `AgentPlanGroup[]` | `[]` |
| `hint` | `React.ReactNode` | `"Drag to change the order. Skipped steps stay in the plan."` |
| `mode` | `"tree" \| "live" \| "editable"` | `"live"` |
| `onStart` | `(steps: AgentPlanDraftStep[]) => void` | — |
| `onStepsChange` | `(steps: AgentPlanDraftStep[]) => void` | — |
| `onStop` | `() => void` | — |
| `steps` | `AgentPlanStep[]` | `[]` |
| `stopLabel` | `string` | `"Stop"` |
| `subtitle` | `React.ReactNode` | — |

Anatomy:

- `AgentPlan` (`data-slot="agent-plan"`): The agent's plan as a card in one of three modes: `live` follows a run, `editable` lets a person change the plan before it starts, `tree` groups steps into phases. It is a `section` named by the title.
- `Header`: Title and a computed line such as `2 of 7 done`. In `live` it also holds a progress bar and the Stop button when `onStop` is given.
- `Plan step`: One step with number or status icon, title, status in words and duration. A running step counts up from `since`.
- `Phase` — optional: A group in `tree` mode: a toggle with `aria-expanded` and a count like `2 of 5`. It opens by default once any step has started.
- `Add step form` — optional: In `editable` mode, an input and Add button below the list. New steps get the next position.

Best practices:

- **When:** Use AgentPlan to show what the agent intends to do: `live` to follow a run, `editable` to let a person reorder, skip and add steps before it starts, `tree` for plans in phases. For what actually ran, with tool output, use a run timeline.
- **Do:** Use `editable` before the run and start it from `onStart`. It receives only the steps that will run, and the button reads `Start 4 steps` and disables at zero.
- **Do:** Pass `onStop` in `live` mode so a run can always be stopped, and set `stopLabel` if `Stop` is not precise enough.
- **Do:** Give every step a status (`queued`, `running`, `done`, `failed`, `skipped`, `blocked`) and `since` on the running one. Failed and blocked steps stay visible.
- **Don't:** Don't pass elements as `title` in `editable` mode. The list uses `id`, the title text and the skipped status only; non-string titles fall back to the `id`.

Theming: reads `--border`, `--brand-primary`, `--card`, `--foreground`, `--muted`, `--ring`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-md`, `--radius-xl`, `--duration-ambient`, `--duration-fast`, `--ease-entrance`.

#### PlanSummary

A plan on one card before it runs: goal, steps, time, cost, tools and phases.

```tsx
<PlanSummary
  goal="Ship the Tabs v2 release"
  description="Drafted 3 min ago from the release notes"
  stats={[
    { label: "Steps", value: 7 },
    { label: "Est. time", value: "18 min" },
    { label: "Est. cost", value: "$0.42" },
  ]}
  tools={["Figma API", "GitHub", "npm"]}
  phases={[
    { title: "Map the old icons", steps: 3 },
    { title: "Swap the components", steps: 4 },
    { title: "Publish and announce", steps: 3 },
  ]}
  onEdit={openEditor}
  onRun={() => run(plan.id)}
/>
```

```ts
function PlanSummary({ goal, description, stats, tools, phases, onEdit, onRun, editLabel, runLabel, className, }: {
    goal: React.ReactNode;
    /** Where the plan came from, e.g. "Drafted 3 min ago from the release notes". */
    description?: React.ReactNode;
    /** Usually Steps, Est. time and Est. cost. */
    stats?: PlanSummaryStat[];
    /** Tool names, shown as chips. */
    tools?: string[];
    phases?: PlanSummaryPhase[];
    onEdit?: () => void;
    onRun?: () => void;
    editLabel?: string;
    runLabel?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `goal` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `description` | `React.ReactNode` | — |
| `editLabel` | `string` | `"Edit plan"` |
| `onEdit` | `() => void` | — |
| `onRun` | `() => void` | — |
| `phases` | `PlanSummaryPhase[]` | `[]` |
| `runLabel` | `string` | `"Run plan"` |
| `stats` | `PlanSummaryStat[]` | `[]` |
| `tools` | `string[]` | `[]` |

Anatomy:

- `PlanSummary` (`data-slot="plan-summary"`): The plan on one card before anything runs: goal, stats, tools, phases and the Edit plan and Run plan buttons.
- `Stats` — optional: A definition list of label and large value pairs, usually Steps, Est. time and Est. cost.
- `Tools` — optional: The tool names as indigo pills in a list.
- `Phases` — optional: An ordered list of phase titles. A numeric `steps` value reads "1 step" or "n steps"; text is shown as given.
- `Actions` — optional: Edit plan as a plain button and Run plan as the primary one. Each appears only when its handler is passed.

Best practices:

- **When:** Use a Plan Summary to ask for a go before a run starts. For the steps of a running plan, use Plan Step. For a gate in the middle of a run, use Approval Card.
- **Do:** Put units in the stat values, such as `12 min` and `€0.40`, and say where the plan came from in `description`. Cost and time are what people decide on.
- **Do:** List every tool the plan will touch in `tools`. A plan that hides a tool hides what it may change.
- **Do:** Pass `onRun` only when the plan may start. The primary Run plan button disappears without it, so there is no half-working card.
- **Don't:** Don't start the run before a click on Run plan. Nothing here auto-starts, and a plan that starts itself is a pre-approved plan.

Theming: reads `--border`, `--card`, `--foreground`, `--text-tertiary`, `--radius-xl`.

#### ActivityItem

One line in a live activity stream: status, action, tool and elapsed time.

```tsx
<ActivityItem status="running" label="Comparing Figma and code tokens" tool="tokens.diff" since={action.startedAt} />
<ActivityItem status="done" label="Read 214 variables from Figma" tool="figma.read" elapsed="3.6s" />
```

```ts
function ActivityItem({ status, label, tool, elapsed, since, wrap, className, }: {
    status: ActivityStatus;
    label: React.ReactNode;
    /** Tool or file name, shown as a chip. */
    tool?: React.ReactNode;
    /** Already formatted, e.g. "6.3s". Shows "—" when empty. */
    elapsed?: React.ReactNode;
    /** When the action started. A running item then counts up from it. */
    since?: Date | string | number;
    /** Lets a long label break onto a second line instead of truncating. */
    wrap?: boolean;
    className?: string;
}): React.JSX.Element;
type ActivityStatus = "running" | "done" | "failed" | "waiting";
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `React.ReactNode` | — |
| `status` * | `"done" \| "running" \| "failed" \| "waiting"` | — |
| `className` | `string` | — |
| `elapsed` | `React.ReactNode` | — |
| `since` | `Date \| string \| number` | — |
| `tool` | `React.ReactNode` | — |
| `wrap` | `boolean` | `false` |

Anatomy:

- `ActivityItem` (`data-slot="activity-item"`): One line of a live activity stream: status dot, label, optional tool chip and elapsed time. The dot pulses while `running`, and screen readers hear the status word before the label.
- `Tool chip` — optional: A pill with the tool or file name, shown when `tool` is set. It truncates at a fixed width.

Best practices:

- **When:** Use ActivityItem for one line in a live activity stream: what the agent is doing, with which tool and for how long. For a step with output and detail, use a run timeline step; for a plan as a checklist, use Agent Plan.
- **Do:** Pass `since` on a `running` item so it counts up by itself. Pass a formatted `elapsed` such as `6.3s` once the action ended, so the final time stays fixed.
- **Do:** Keep `label` to the action in plain words, such as `Reading 14 files`, and put the tool or file name in `tool`. Set `wrap` only where a second line is worth the height; otherwise the label truncates.
- **Do:** Set `status` to `failed` or `waiting` instead of dropping the line. The status word is part of the accessible name, the dot colour is not.
- **Don't:** Don't let the dot colour explain a failure. Put the cause into `label`, for example `Write failed: file is read-only`.

Theming: reads `--brand-primary`, `--foreground`, `--text-tertiary`, `--tint-text-green`, `--tint-text-red`.

#### LogStream

A run's log with an All or Errors filter and auto-scroll.

```tsx
<LogStream
  lines={[
    { time: "0:05.2", level: "warn", message: "Figma API busy, retrying in 2s" },
    { time: "0:12.0", level: "error", message: "Push to docs-preview timed out" },
  ]}
/>
```

```ts
function LogStream({ title, lines, level: levelProp, defaultLevel, onLevelChange, autoScroll: autoScrollProp, defaultAutoScroll, onAutoScrollChange, maxHeight, emptyLabel, className, }: {
    title?: React.ReactNode;
    lines: LogLine[];
    /** Controlled filter. */
    level?: LogLevelFilter;
    defaultLevel?: LogLevelFilter;
    onLevelChange?: (level: LogLevelFilter) => void;
    /** Controlled auto-scroll. */
    autoScroll?: boolean;
    defaultAutoScroll?: boolean;
    onAutoScrollChange?: (autoScroll: boolean) => void;
    /** Height in px after which the log scrolls. */
    maxHeight?: number;
    /** Shown when the filter leaves no lines. */
    emptyLabel?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type LogLevelFilter = "all" | "errors";
```

| Prop | Type | Default |
| --- | --- | --- |
| `lines` * | `LogLine[]` | — |
| `autoScroll` | `boolean` | — |
| `className` | `string` | — |
| `defaultAutoScroll` | `boolean` | `true` |
| `defaultLevel` | `"errors" \| "all"` | `"all"` |
| `emptyLabel` | `React.ReactNode` | — |
| `level` | `"errors" \| "all"` | — |
| `maxHeight` | `number` | `240` |
| `onAutoScrollChange` | `(autoScroll: boolean) => void` | — |
| `onLevelChange` | `(level: LogLevelFilter) => void` | — |
| `title` | `React.ReactNode` | `"Run log"` |

Anatomy:

- `LogStream` (`data-slot="log-stream"`): The card around a run log: title, an All or Errors filter, the scrolling log and the Auto-scroll toggle.
- `Level filter` — optional: Two toggle buttons, All and Errors, with `aria-pressed`. Controlled through `level`, or uncontrolled with `defaultLevel`.
- `Log`: The scrolling `role="log"` region. It is a polite live region, takes keyboard focus for scrolling and stops growing at `maxHeight`.
- `Log line` — optional: Time, level dot and level word, then the message. Info lines show no level word on screen but keep it for screen readers.
- `Auto-scroll toggle` — optional: A pressed-state button that keeps the newest line in view. It is on by default and can be controlled through `autoScroll`.

Best practices:

- **When:** Use a Log Stream for the timestamped lines a run writes while it works. For one command with its exit code and output streams, use Terminal Output. For the steps of a run, use Run Timeline.
- **Do:** Pass `time` already formatted, such as `0:02.9`, and give each line a stable `id`. The log uses `id` as the row key.
- **Do:** Set `level` to `error` on failing lines. The Errors filter shows only those, and the empty text then reads "No errors so far." instead of "Nothing logged yet."
- **Do:** Keep Auto-scroll on for a live run and let the reader turn it off. Control it with `autoScroll` and `onAutoScrollChange` if the page needs to know.
- **Don't:** Don't pass HTML strings or untrusted markup as `message`. Log lines come from tools and files, so render them as plain text nodes.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--tint-text-red`, `--tint-text-yellow`, `--radius-md`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### AgentLane

One parallel worker: its status, queue, throughput and the tasks it holds.

```tsx
<AgentLane
  name="Figma sync"
  status="saturated"
  queue={18}
  throughput={96}
  tasks={[
    { title: "Binding 214 variables", state: "Running" },
    { title: "Rebuild the icon sets", state: "Queued" },
  ]}
  more={16}
/>
```

```ts
function AgentLane({ name, status, queue, throughput, tasks, more, emptyLabel, className, }: {
    name: React.ReactNode;
    status: AgentLaneStatus;
    /** Tasks waiting in this lane. */
    queue: number;
    /** Tasks per minute. Shows "—" when empty. */
    throughput?: number;
    tasks?: AgentLaneTask[];
    /** Tasks not shown as chips, rendered as "+16 more waiting". */
    more?: number;
    /** Shown when the lane holds no tasks. */
    emptyLabel?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type AgentLaneStatus = "active" | "idle" | "saturated";
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `queue` * | `number` | — |
| `status` * | `"active" \| "idle" \| "saturated"` | — |
| `className` | `string` | — |
| `emptyLabel` | `React.ReactNode` | `"Waiting for a free slot"` |
| `more` | `number` | — |
| `tasks` | `AgentLaneTask[]` | `[]` |
| `throughput` | `number` | — |

Anatomy:

- `AgentLane` (`data-slot="agent-lane"`): One worker of a run that fans out: name, status word, queue length, throughput and the tasks it holds. It is a `section` named by the lane name.
- `Task` — optional: One entry of `tasks`: a truncated title with a short `state` underneath, such as `Running` or `Queued`.

Best practices:

- **When:** Use AgentLane for one worker of a run that fans out. Put several side by side to see where work piles up. For a fleet of independent agents, use Agent Grid.
- **Do:** Set `status` to `saturated` when the queue grows faster than the lane works. The dot and the word `Saturated` turn yellow, so the state is readable without colour.
- **Do:** Pass `throughput` in tasks per minute. Leave it out when it is unknown: the lane shows `—` instead of a wrong `0/min`.
- **Do:** List only the tasks running now in `tasks` and pass the rest as `more`; it renders `+16 more waiting`.
- **Don't:** Don't leave an idle lane unexplained. `emptyLabel` says why, default `Waiting for a free slot`; change it when the reason is another one, such as `No tasks assigned`.

Theming: reads `--border`, `--brand-primary`, `--card`, `--foreground`, `--subtle`, `--text-link`, `--text-tertiary`, `--tint-text-yellow`, `--radius-md`, `--radius-xl`.

#### DurationBar

A step's share of the run as a bar, with a tick at the estimate and red when it runs over.

```tsx
<DurationBar label="Build the docs" value={8.3} max={12.4} />
<DurationBar label="Check the stroke widths" value={12.4} max={12.4} planned={9.6} />
```

```ts
function DurationBar({ label, value, max, planned, tone: toneProp, formatValue, valueLabel, fill, className, }: {
    label: React.ReactNode;
    /** How long the step took, in seconds unless you pass `formatValue`. */
    value: number;
    /** The longest step or the whole run — the full width of the bar. */
    max: number;
    /** The estimate. Draws a tick and turns the bar red when `value` is past it. */
    planned?: number;
    /** Overrides the tone derived from `planned`. */
    tone?: DurationBarTone;
    formatValue?: (value: number) => string;
    /** Replaces the visible time on the right, e.g. "6 min actual · planned 4 min". Screen readers still hear the value text. */
    valueLabel?: React.ReactNode;
    /** Lets the bar take the free width; the label and the time keep their own width. */
    fill?: boolean;
    className?: string;
}): React.JSX.Element;
type DurationBarTone = "default" | "over";
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `React.ReactNode` | — |
| `max` * | `number` | — |
| `value` * | `number` | — |
| `className` | `string` | — |
| `fill` | `boolean` | `false` |
| `formatValue` | `(value: number) => string` | `formatSeconds` |
| `planned` | `number` | — |
| `tone` | `"default" \| "over"` | — |
| `valueLabel` | `React.ReactNode` | — |

Anatomy:

- `DurationBar` (`data-slot="duration-bar"`): One step's time as a share of `max`: label, a bar and the time. A `role="meter"` whose value text includes the estimate and the overrun.
- `Planned tick` — optional: A thin mark on the bar at the `planned` value. The bar and the time turn red once `value` is past it.

Best practices:

- **When:** Use DurationBar for the time of one step against the longest step or the whole run, stacked in a list. For the state of a run use Agent Status.
- **Do:** Pass the same `max` to every row of a list, the longest step or the total, so the bars can be compared.
- **Do:** Pass `planned` where an estimate exists. Past it, the bar and the time turn red, and screen readers hear how far over it is.
- **Do:** Use `valueLabel` for wording such as `6 min actual · planned 4 min`. Screen readers still hear the computed text.
- **Don't:** Don't pass milliseconds without `formatValue`. `value` is read as seconds.
- **Don't:** Don't set `tone="over"` to mean failed. Over means slower than planned; a failure needs its own state.

Theming: reads `--brand-primary`, `--destructive`, `--subtle`, `--text-error`, `--text-secondary`, `--text-tertiary`, `--duration-ambient`, `--ease-entrance`.

#### DiffView

The result of an edit tool call: file, added and removed lines, and the changed code.

```tsx
<DiffView
  file="packages/react/src/components/ui/tabs.tsx"
  hunks={[{ header: "@@ -41,3 +41,6 @@ TabsList", lines: [
    { type: "del", old: 42, content: '  return <div role="tablist" {...props} />' },
    { type: "add", new: 42, content: "  const ref = useRovingFocus()" },
  ] }]}
/>
```

```ts
function DiffView({ file, hunks, mode, additions, deletions, defaultOpen, className, }: {
    file: React.ReactNode;
    hunks: DiffHunk[];
    mode?: DiffMode;
    /** Defaults to the number of added lines. */
    additions?: number;
    /** Defaults to the number of removed lines. */
    deletions?: number;
    defaultOpen?: boolean;
    className?: string;
}): React.JSX.Element;
type DiffMode = "unified" | "compact";
```

| Prop | Type | Default |
| --- | --- | --- |
| `file` * | `React.ReactNode` | — |
| `hunks` * | `DiffHunk[]` | — |
| `additions` | `number` | — |
| `className` | `string` | — |
| `defaultOpen` | `boolean` | `true` |
| `deletions` | `number` | — |
| `mode` | `"compact" \| "unified"` | `"unified"` |

Anatomy:

- `DiffView` (`data-slot="diff-view"`): The result of an edit: file name, counts of added and removed lines and the changed lines. Colour is backed by a `+` or `−` sign and by hidden `Added` and `Removed` text.
- `Header`: A button with `aria-expanded` and `aria-controls` that folds the diff, showing the file and the counts.
- `Hunk header` — optional: The `header` text of a hunk, such as `@@ -41,3 +41,6 @@`. Shown only in `unified`.
- `Lines`: The rows of a hunk in a horizontally scrollable region that takes keyboard focus. `unified` adds two line-number columns.

Best practices:

- **When:** Use DiffView for the result of an edit tool call or the payload of an approval. For a plain snippet use Code Block; for a whole file the agent wrote, Artifact Panel.
- **Do:** Use `unified` where reviewers need context, with line numbers and hunk headers. Use `compact` for summaries; it keeps only the changed lines.
- **Do:** Put it in `preview` of an ApprovalCard with `kind="dialog-diff"`, so the person sees the exact change before deciding.
- **Do:** Pass `additions` and `deletions` when the hunks are trimmed. Otherwise they are counted from the lines.
- **Don't:** Don't set `defaultOpen={false}` when the diff is what someone has to approve. It is open by default for that reason.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--tint-green`, `--tint-red`, `--tint-text-green`, `--tint-text-red`, `--radius-lg`, `--duration-fast`, `--ease-entrance`.

#### TerminalOutput

The result of a code-execution tool call: command, exit code, run time, stdout and stderr.

```tsx
<TerminalOutput
  command="pnpm vitest run tabs"
  exitCode={0}
  duration="3.8 s"
  stdout={run.stdout}
  stderr={run.stderr}
/>
```

```ts
function TerminalOutput({ command, exitCode, duration, stdout, stderr, defaultStream, maxHeight, className, }: {
    command: React.ReactNode;
    exitCode?: number;
    /** Already formatted, e.g. "3.8 s". */
    duration?: React.ReactNode;
    stdout?: TerminalLine[];
    stderr?: TerminalLine[];
    defaultStream?: TerminalStream;
    /** Height in px after which the output scrolls. */
    maxHeight?: number;
    className?: string;
}): React.JSX.Element;
type TerminalStream = "stdout" | "stderr";
```

| Prop | Type | Default |
| --- | --- | --- |
| `command` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `defaultStream` | `"stdout" \| "stderr"` | `"stdout"` |
| `duration` | `React.ReactNode` | — |
| `exitCode` | `number` | — |
| `maxHeight` | `number` | `280` |
| `stderr` | `TerminalLine[]` | `[]` |
| `stdout` | `TerminalLine[]` | `[]` |

Anatomy:

- `TerminalOutput` (`data-slot="terminal-output"`): The result of a command: the command line with exit-code badge and duration, a stdout and stderr tab pair, and the scrolling output.
- `Command line`: The command in monospace after a dollar sign, the exit badge (green for 0, red otherwise), the duration and the copy button.
- `Stream tabs` — optional: A stdout and stderr tab list. Arrow keys switch and Home and End jump; a red count shows lines on stderr.
- `Output panel`: The focusable tab panel that scrolls after `maxHeight`. Lines are plain text, in tones for muted, success and error.

Best practices:

- **When:** Use Terminal Output for what a code-execution tool call returned. For a running stream of timestamped lines, use Log Stream. For a code listing, use Code Block.
- **Do:** Pass `exitCode` when the command is done and leave it out while it runs. Without it the card has no badge and reports a running status.
- **Do:** Split output into `stdout` and `stderr` and mark single lines with `tone`, such as `error`. Copy takes the visible stream.
- **Do:** Pass `duration` already formatted with its unit, such as `3.8 s`.
- **Don't:** Don't send output through HTML. Lines render as text, which is how command output from an agent should stay.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-error`, `--text-secondary`, `--text-success`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--font-sans`, `--duration-fast`, `--ease-entrance`.

#### SearchResultCard

One ranked result of a web-search tool call: source, relevance, title and snippet.

```tsx
<SearchResultCard
  rank={1}
  title="Tabs pattern — keyboard interaction"
  url="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
  snippet="Arrow keys move focus between tabs; …"
  relevance={0.94}
/>
```

```ts
function SearchResultCard({ rank, title, url, snippet, relevance, selected, className, }: {
    rank?: number;
    title: React.ReactNode;
    url: string;
    snippet?: React.ReactNode;
    /** 0–1 or 0–100. Shown as "94% match". */
    relevance?: number;
    selected?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `url` * | `string` | — |
| `className` | `string` | — |
| `rank` | `number` | — |
| `relevance` | `number` | — |
| `selected` | `boolean` | `false` |
| `snippet` | `React.ReactNode` | — |

Anatomy:

- `SearchResultCard` (`data-slot="search-result-card"`): One ranked web-search result: rank, host and path, relevance badge, the linked title and a snippet.
- `Rank` — optional: A numbered circle shown when `rank` is set.
- `Source line` — optional: The host without `www.` and the path, taken from `url`. A value that is not a full URL is shown as given.
- `Relevance badge` — optional: "n% match". It accepts 0 to 1 or 0 to 100. It turns indigo on a selected result.
- `Title link`: The title as a link that opens in a new tab with `rel="noreferrer"`.

Best practices:

- **When:** Use a Search Result Card to show what a search tool call returned. For the pinned sources of a final answer, use Source List.
- **Do:** Mark the result the agent used with `selected`. The ring and the indigo badge show the difference without reading the snippet.
- **Do:** Pass the full `url`, with the scheme. The card shows the host and path from it, so the person can judge the source before clicking.
- **Do:** Keep the snippet to the text the tool returned. It is data from the web, so render it as text.
- **Don't:** Don't invent a relevance score. Pass `relevance` only when the tool provides one, or the badge claims a precision that does not exist.

Theming: reads `--border`, `--card`, `--primary`, `--ring`, `--subtle`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-sm`.

#### ToolPermissionRow

Whether an agent may call a tool: Allow, Ask or Deny, with the scope it covers.

```tsx
<ToolPermissionRow
  tool="figma.write_variables"
  description="Create and update variables in the WunderUI Figma file"
  defaultValue="ask"
  scope="Asks before each write · current file only"
  onValueChange={(value) => save("figma.write_variables", value)}
/>
```

```ts
function ToolPermissionRow({ tool, description, value: valueProp, defaultValue, onValueChange, scope, scopeDetail, className, }: {
    /** The tool id, shown in monospace, e.g. "figma.write_variables". */
    tool: React.ReactNode;
    description?: React.ReactNode;
    value?: ToolPermission;
    defaultValue?: ToolPermission;
    onValueChange?: (value: ToolPermission) => void;
    scope?: React.ReactNode;
    scopeDetail?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type ToolPermission = "allow" | "ask" | "deny";
```

| Prop | Type | Default |
| --- | --- | --- |
| `tool` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `defaultValue` | `"ask" \| "allow" \| "deny"` | `"ask"` |
| `description` | `React.ReactNode` | — |
| `onValueChange` | `(value: ToolPermission) => void` | — |
| `scope` | `React.ReactNode` | — |
| `scopeDetail` | `React.ReactNode` | — |
| `value` | `"ask" \| "allow" \| "deny"` | — |

Anatomy:

- `ToolPermissionRow` (`data-slot="tool-permission-row"`): One tool an agent may call, with an Allow, Ask or Deny switch, and a scope line that can fold out into more detail.
- `Tool name`: The tool id in monospace with an optional description. Pass a string, so the switch gets the name "Permission for" plus the id.
- `Permission switch`: A three-way segment. Allow runs the tool without asking, Ask pauses for a person and Deny blocks it. It defaults to Ask.
- `Scope line` — optional: Text that says what the setting covers. With `scopeDetail` it becomes a button with `aria-expanded` that folds out the detail.

Best practices:

- **When:** Use a Tool Permission Row in a list of tools to set what runs on its own. For the access one request asks for, use Scope List.
- **Do:** Leave the default at Ask. A tool that is allowed without asking is a decision the person has to make on purpose.
- **Do:** Fill `scope` with what Allow would cover, such as `Any file under apps/docs`, and fold longer lists into `scopeDetail`.
- **Do:** Use the tool's real id, such as `figma.write_variables`, and a one-line description of the effect, so the person knows what they allow.
- **Don't:** Don't set `defaultValue="allow"` for tools that write, delete or spend. Reserve it for read-only tools the person has already seen.

Theming: reads `--card`, `--foreground`, `--ring`, `--text-secondary`, `--text-tertiary`, `--radius-sm`, `--duration-fast`, `--ease-entrance`.

#### ExpiryTimer

Countdown until an approval or permission request lapses — amber at the end, red once expired.

```tsx
<ExpiryTimer expiresAt={request.expiresAt} warnAt={60_000} onExpire={() => expire(request.id)} />
```

```ts
function ExpiryTimer({ expiresAt, warnAt, onExpire, label, expiredLabel, className, }: {
    expiresAt: Date | string | number;
    /** Milliseconds left at which the timer turns amber. */
    warnAt?: number;
    onExpire?: () => void;
    label?: React.ReactNode;
    expiredLabel?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `expiresAt` * | `Date \| string \| number` | — |
| `className` | `string` | — |
| `expiredLabel` | `React.ReactNode` | `"Expired"` |
| `label` | `React.ReactNode` | `"Expires in"` |
| `onExpire` | `() => void` | — |
| `warnAt` | `number` | `60_000` |

Anatomy:

- `ExpiryTimer` (`data-slot="expiry-timer"`): A pill counting down to `expiresAt`: `Expires in 04:32`. Amber under `warnAt`, red as `Expired` once it ran out. A `role="timer"` that stays silent every second.

Best practices:

- **When:** Use ExpiryTimer for the countdown on a request that lapses, such as a permission request. An ApprovalCard counts down by itself when you pass it `expiresAt`.
- **Do:** Pass `expiresAt` as a Date, an ISO string or a timestamp. A new deadline resets the one-time `onExpire`.
- **Do:** Handle `onExpire` by changing the request itself, for example by marking it expired and disabling Approve. The timer only shows the time and calls it once.
- **Do:** Leave the announcement to the component. It says `Expiring soon` and `Expired` once and does not read out every second.
- **Don't:** Don't pass `warnAt` in seconds. It is in milliseconds, default `60_000`.
- **Don't:** Don't treat the pill as the lock. It uses the visitor's clock, so check the deadline on the server as well.

Theming: reads `--subtle`, `--text-secondary`, `--tint-red`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`.

#### ScopeList

What an agent asks to access, one scope per row, with a countdown until the request lapses.

```tsx
<ScopeList
  scopes={[
    { title: "Read the docs site", detail: "apps/docs · 412 files" },
    { title: "Open a pull request", detail: "wunder-ui/wunderui · branch tokens-sync" },
  ]}
  expiresAt={request.expiresAt}
/>
```

```ts
function ScopeList({ title, scopes, expiresAt, warnAt, onExpire, bare, className, }: {
    title?: React.ReactNode;
    scopes: Scope[];
    expiresAt?: Date | string | number;
    warnAt?: number;
    onExpire?: () => void;
    /** Drop the card frame, e.g. inside an Approval Card. */
    bare?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `scopes` * | `Scope[]` | — |
| `bare` | `boolean` | `false` |
| `className` | `string` | — |
| `expiresAt` | `Date \| string \| number` | — |
| `onExpire` | `() => void` | — |
| `title` | `React.ReactNode` | `"Requested access"` |
| `warnAt` | `number` | — |

Anatomy:

- `ScopeList` (`data-slot="scope-list"`): The list of access an agent asks for, one scope per row with icon, title and monospace target, and an optional expiry countdown.
- `Expiry timer` — optional: An Expiry Timer in the header, shown when `expiresAt` is set. `warnAt` sets when it warns and `onExpire` fires at zero.
- `Scope row`: An icon (a shield by default), the scope title and an optional `detail`, such as the path or count it covers.

Best practices:

- **When:** Use a Scope List to show what a tool or agent may touch. For the Allow, Ask or Deny choice per tool, use Tool Permission Row.
- **Do:** Write each `title` as the permission in plain words and put the target in `detail`, such as `Read files` and `apps/docs · 412 files`.
- **Do:** Set `bare` when the list sits inside an Approval Card, so the frame does not double up.
- **Do:** Set `expiresAt` for requests that lapse and handle `onExpire`. Show the expired state; an expired request must not stay approvable.
- **Don't:** Don't list a broad scope without a target. A row that only says `Files` hides how much the agent can reach.

Theming: reads `--border`, `--card`, `--foreground`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`.

#### UsageMeter

One limit as a row: what is used, what is allowed, and a warning before it runs out.

```tsx
<UsageMeter label="Tokens today" used={420_000} limit={1_000_000} unit="tokens" sub="Resets at 00:00 UTC" />
```

```ts
function UsageMeter({ label, used, limit, unit, sub, warnAt, format, className, }: {
    label: React.ReactNode;
    used: number;
    limit: number;
    /** Word after the overage, e.g. "tokens" → "Over by 20k tokens". */
    unit?: string;
    /** Small print under the bar, e.g. "Resets at 00:00 UTC". */
    sub?: React.ReactNode;
    /** Fraction of the limit at which the meter turns amber. */
    warnAt?: number;
    /** Formats `used`, `limit` and the overage. Defaults to 420k / 1M. */
    format?: (value: number) => string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `React.ReactNode` | — |
| `limit` * | `number` | — |
| `used` * | `number` | — |
| `className` | `string` | — |
| `format` | `(value: number) => string` | `formatCompact` |
| `sub` | `React.ReactNode` | — |
| `unit` | `string` | — |
| `warnAt` | `number` | `0.8` |

Anatomy:

- `UsageMeter` (`data-slot="usage-meter"`): One limit as a row: label, used and allowed values, a meter bar and a status line that warns before the limit and reports an overage.
- `Meter bar`: A `role="meter"` with the status text as its value text. It is primary below `warnAt`, amber from there and red above the limit.
- `Status line` — optional: "n% used", "n% · nearly at the limit" or "Over by" the overage with `unit`. The small print in `sub` sits beside it.

Best practices:

- **When:** Use a Usage Meter for limits that can be passed, such as quotas and rate limits. For the cost of a run, use Cost Meter; for context fill, use Context Meter.
- **Do:** Set `unit` to the word that follows the overage, such as `tokens`, and put reset times in `sub`, such as `Resets at 00:00 UTC`.
- **Do:** Change `warnAt` from the default 0.8 only when the limit has a longer lead time. The meter turns amber at that share, before it runs out.
- **Do:** Pass `format` for money or bytes. The default shortens numbers to `420k` and `1M`, which suits tokens only.
- **Don't:** Don't hide the status text and rely on the bar colour. The word is there for people who cannot tell amber from red.

Theming: reads `--brand-quaternary`, `--destructive`, `--foreground`, `--primary`, `--subtle`, `--text-error`, `--text-secondary`, `--text-tertiary`, `--text-warning`, `--duration-ambient`, `--ease-entrance`.

#### ContextMeter

How full the model's context window is: a ring for the prompt toolbar or a bar with a breakdown.

```tsx
<ContextMeter used={42_000} limit={200_000} breakdown={parts} />
```

```ts
function ContextMeter({ used, limit, breakdown, variant, label, warnAt, warning, className, }: {
    used: number;
    limit: number;
    /** What fills the window, e.g. system prompt, files, conversation. */
    breakdown?: ContextPart[];
    variant?: "ring" | "bar";
    label?: string;
    warnAt?: number;
    /** Shown under the bar once `warnAt` is reached. */
    warning?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `limit` * | `number` | — |
| `used` * | `number` | — |
| `breakdown` | `ContextPart[]` | — |
| `className` | `string` | — |
| `label` | `string` | `"Context window"` |
| `variant` | `"ring" \| "bar"` | `"ring"` |
| `warnAt` | `number` | `0.8` |
| `warning` | `React.ReactNode` | `"Nearly full — older messages get summarised next."` |

Anatomy:

- `ContextMeter` (`data-slot="context-meter"`): How full the model's context window is. `ring` is compact for a prompt toolbar; `bar` shows label, token count, bar and legend.
- `Breakdown` — optional: The `breakdown` parts. In `ring` they open in a tooltip on a button; in `bar` they are segments of the bar plus a legend.
- `Warning text` — optional: In `bar`, the `warning` line shown once `warnAt` is reached. The `ring` only turns amber.

Best practices:

- **When:** Use ContextMeter for the context window: `ring` in a prompt toolbar, `bar` where the breakdown deserves room. For money or request budgets use Cost Meter; for plan quotas, Usage Meter.
- **Do:** Pass `breakdown` with token counts per part, such as system prompt, files and conversation. In `ring` they appear in a tooltip that is also reachable by keyboard.
- **Do:** Write `warning` as the consequence and the next step. The default says that older messages get summarised next. Change `warnAt`, a fraction with default `0.8`, to fit the model.
- **Don't:** Don't let the `breakdown` tokens exceed `limit`. Segment widths are `tokens / limit`, so the bar and the legend would disagree.

Theming: reads `--brand-quaternary`, `--brand-secondary`, `--brand-tertiary`, `--foreground`, `--primary`, `--ring`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--text-warning`, `--radius-md`, `--duration-ambient`, `--ease-entrance`.

#### SlashCommandMenu

The popover that opens when someone types / in the prompt: commands with a short description, filtered as they type.

```tsx
const menu = useMenuKeys(list.length, { open, onEnter: (i) => run(list[i]) })

<SlashCommandMenu commands={commands} query={query} activeIndex={menu.index} onSelect={run} />
```

```ts
function SlashCommandMenu({ commands, query, activeIndex, onActiveIndexChange, onSelect, id, className, }: {
    commands: SlashCommand[];
    /** Text typed after "/", e.g. "t". */
    query?: string;
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    onSelect?: (command: SlashCommand) => void;
    id?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `commands` * | `SlashCommand[]` | — |
| `activeIndex` | `number` | `0` |
| `className` | `string` | — |
| `id` | `string` | — |
| `onActiveIndexChange` | `(index: number) => void` | — |
| `onSelect` | `(command: SlashCommand) => void` | — |
| `query` | `string` | `""` |

Anatomy:

- `SlashCommandMenu`: The "/" popover: a listbox of commands that filters by what is typed after the slash and shows the keys at the bottom.
- `Heading` — optional: "Commands", or the matching text when `query` is set.
- `Command row`: A `role="option"` with icon tile, the name with a leading slash and an optional description. The active row is filled.
- `Key hint` — optional: A footer line for the arrow keys, Enter and Escape.

Best practices:

- **When:** Use a Slash Command Menu for actions that start with "/" in a prompt. For references to files and people, use Mention Picker.
- **Do:** Pass the text after "/" as `query`. The list matches names that start with it and shows "No command matches" when none do.
- **Do:** Use `useMenuKeys` on the textarea for the arrow keys, Enter and Escape, and point `aria-activedescendant` at `${id}-${index}`. Focus stays in the prompt.
- **Do:** Write each description as the effect of the command, such as `Clear the conversation`. Run the command in `onSelect`.
- **Don't:** Don't run a command on hover. Hover only moves the active row; Enter or a click runs it.

Theming: reads `--border`, `--card`, `--foreground`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--shadow-md`.

#### MentionPicker

The @ picker for adding context to a prompt: files, people and channels in groups.

```tsx
<MentionPicker groups={groups} query={query} onSelect={(item) => addPill(item)} />
```

```ts
function MentionPicker({ groups, query, activeId, onActiveIdChange, onSelect, id, className, }: {
    groups: MentionGroup[];
    query?: string;
    activeId?: string;
    onActiveIdChange?: (id: string) => void;
    onSelect?: (item: MentionItem) => void;
    id?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `groups` * | `MentionGroup[]` | — |
| `activeId` | `string` | — |
| `className` | `string` | — |
| `id` | `string` | — |
| `onActiveIdChange` | `(id: string) => void` | — |
| `onSelect` | `(item: MentionItem) => void` | — |
| `query` | `string` | `""` |

Anatomy:

- `MentionPicker`: The "@" popover: a listbox of grouped files, people, channels and links that filters itself by the text typed after "@".
- `Group` — optional: A `role="group"` section with a small heading. Groups with no matching item disappear from the list.
- `Mention row`: One `role="option"`: an avatar for people or an icon for other kinds, the label and an optional description. Hover moves the active item.
- `Empty message` — optional: "Nothing matches" with the typed query, shown when no group has a match.

Best practices:

- **When:** Use a Mention Picker for "@" references to things in the workspace. For commands that start with "/", use Slash Command Menu. For the chip that remains after picking, use Context Pill.
- **Do:** Pass the text after "@" as `query` and drive `activeId` from the prompt's arrow keys. Point `aria-activedescendant` at the option id `${id}-${item.id}`, so focus stays in the textarea.
- **Do:** Give every item a unique `id` and a `kind`. The id builds the option id, and the kind decides between avatar and icon.
- **Do:** Set `initials` and `color` for people, so the avatar matches the one used elsewhere in the screen.
- **Don't:** Don't move focus into the list. The rows cancel `mousedown`, so clicking a row never blurs the prompt, and the picker is built for that.

Theming: reads `--border`, `--card`, `--foreground`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--shadow-md`.

#### ContextPill

A removable chip for what the prompt refers to: a file, a person, a channel or a link.

```tsx
<ContextPill kind="file" label="tabs.tsx" onRemove={() => remove("tabs")} />
```

```ts
function ContextPill({ kind, label, initials, color, onRemove, className, }: {
    kind: MentionKind;
    label: string;
    initials?: string;
    color?: AvatarColor;
    onRemove?: () => void;
    className?: string;
}): React.JSX.Element;
type MentionKind = "file" | "person" | "channel" | "link";
type AvatarColor = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative" | "grey";
```

| Prop | Type | Default |
| --- | --- | --- |
| `kind` * | `"link" \| "file" \| "person" \| "channel"` | — |
| `label` * | `string` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey"` | `"orange"` |
| `initials` | `string` | — |
| `onRemove` | `() => void` | — |

Anatomy:

- `ContextPill` (`data-slot="context-pill"`): A removable chip for what the prompt refers to. `person` shows an avatar, `file`, `channel` and `link` an icon.
- `Remove button` — optional: An icon button named `Remove <label>`, rendered only when `onRemove` is given.

Best practices:

- **When:** Use ContextPill for what a prompt refers to: a file, person, channel or link. For a file with name and size use Chat Attachment.
- **Do:** Set `kind` to what is referenced. A `person` shows `initials` (default: the first two letters of `label`) in the given `color`.
- **Do:** Pass `onRemove` for chips the user added. Leave it out for context the system added and the user may not remove.
- **Don't:** Don't put a path or sentence into `label`. It truncates on one line, so use the file or channel name.

Theming: reads `--border`, `--foreground`, `--ring`, `--subtle`, `--text-secondary`, `--text-tertiary`.

#### PromptModeSwitch

What the agent may do with the next prompt — answer, act or edit — with the send keys underneath.

```tsx
<PromptModeSwitch value={mode} onValueChange={setMode} />
```

```ts
function PromptModeSwitch({ value, defaultValue, onValueChange, hints, showKeys, className, }: {
    value?: PromptMode;
    defaultValue?: PromptMode;
    onValueChange?: (mode: PromptMode) => void;
    hints?: Record<PromptMode, string>;
    showKeys?: boolean;
    className?: string;
}): React.JSX.Element;
type PromptMode = "ask" | "agent" | "edit";
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `defaultValue` | `"ask" \| "agent" \| "edit"` | `"ask"` |
| `hints` | `Record<PromptMode, string>` | `MODE_HINT` |
| `onValueChange` | `(mode: PromptMode) => void` | — |
| `showKeys` | `boolean` | `true` |
| `value` | `"ask" \| "agent" \| "edit"` | — |

Anatomy:

- `PromptModeSwitch` (`data-slot="prompt-mode-switch"`): A segmented Ask, Agent and Edit control with a live hint of what the next prompt may do and the keys for sending.
- `Mode segment`: Three options named "Prompt mode": Ask, Agent and Edit. It defaults to Ask and can be controlled through `value`.
- `Mode hint` — optional: One line that explains the chosen mode. It is a polite live region, so the change is announced.
- `Key hint` — optional: "Enter to send, Shift+Enter for a new line". Turn it off with `showKeys={false}`.

Best practices:

- **When:** Use a Prompt Mode Switch to decide what the agent may do before the person sends. For the choice between models, use Model Picker.
- **Do:** Keep Ask as the default. Ask only answers and changes nothing, so a first prompt can never do more than the person expects.
- **Do:** Rewrite `hints` when your modes behave differently. The text must describe what the mode can change, not how it is named.
- **Do:** Show the mode next to the prompt, not in a settings page. The person decides per prompt, so the switch has to be in view when they type.
- **Don't:** Don't soften what Agent does in the hint. The default says "Asks before risky steps", so back that with an approval gate for every risky step.

Theming: reads `--text-secondary`, `--text-tertiary`.

#### ModelPicker

The model chip in a prompt box: always clickable, it opens a popover to switch models.

```tsx
<ModelPicker models={models} value={model} onValueChange={setModel} />
```

```ts
function ModelPicker({ models, value, defaultValue, onValueChange, side, align, label, className, }: {
    models: ModelOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (id: string) => void;
    side?: "top" | "bottom";
    align?: "start" | "center" | "end";
    /** Heading above the list. */
    label?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `models` * | `ModelOption[]` | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` |
| `className` | `string` | — |
| `defaultValue` | `string` | — |
| `label` | `string` | `"Model"` |
| `onValueChange` | `(id: string) => void` | — |
| `side` | `"top" \| "bottom"` | `"top"` |
| `value` | `string` | — |

Anatomy:

- `ModelPicker` (`data-slot="model-picker"`): The model chip for a prompt box: a button with the model name that opens a popover list with a check on the current one.
- `Model chip`: The trigger button. Its name reads "Model: " plus the current model, and the chevron turns while the popover is open.
- `Model list`: The popover with a `role="listbox"` of options: mark, name, optional tag, description and a check on the selected model.

Best practices:

- **When:** Use a Model Picker as a small chip inside a prompt box. For a full card with specs and reasoning effort, use Model Select.
- **Do:** Give each model a short `description` or `meta` line and, for the default, a `tag` such as `Recommended`. The row shows `description` first and falls back to `meta`.
- **Do:** Leave `side="top"` when the prompt sits at the bottom of the screen, and use `bottom` when it sits near the top. The popover then never opens off screen.
- **Do:** Handle `onValueChange` and store the id. Picking a model closes the popover, so no extra close step is needed.
- **Don't:** Don't fill it with a long list. The popover has no search field, so keep it to the few models a person really chooses between.

Theming: reads `--border-control`, `--card`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--duration-fast`, `--ease-entrance`.

#### ModelSelect

Pick the model and how hard it should think, with context size and price at a glance.

```tsx
<ModelSelect models={models} value={model} onValueChange={setModel} effort={effort} onEffortChange={setEffort} />
```

```ts
function ModelSelect({ models, value, defaultValue, onValueChange, effort, defaultEffort, onEffortChange, className, }: {
    models: ModelOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (id: string) => void;
    effort?: Effort;
    defaultEffort?: Effort;
    onEffortChange?: (effort: Effort) => void;
    className?: string;
}): React.JSX.Element;
type Effort = "low" | "medium" | "high";
```

| Prop | Type | Default |
| --- | --- | --- |
| `models` * | `ModelOption[]` | — |
| `className` | `string` | — |
| `defaultEffort` | `"low" \| "medium" \| "high"` | `"medium"` |
| `defaultValue` | `string` | — |
| `effort` | `"low" \| "medium" \| "high"` | — |
| `onEffortChange` | `(effort: Effort) => void` | — |
| `onValueChange` | `(id: string) => void` | — |
| `value` | `string` | — |

Anatomy:

- `ModelSelect` (`data-slot="model-select"`): A card that shows the model list beside the details of the chosen model: description, specs and a reasoning-effort switch.
- `Model list`: A `role="listbox"` of models with name and meta. The selected row has `aria-selected` and a subtle fill.
- `Model details` — optional: Name, description and the `specs` as label and value pairs for the selected model.
- `Reasoning effort` — optional: A Low, Medium or High segment with a one-line hint of the cost. It defaults to Medium and can be controlled with `effort`.

Best practices:

- **When:** Use a Model Select on a settings or onboarding screen where people compare models. For the compact chip in a prompt box, use Model Picker.
- **Do:** Fill `specs` with comparable pairs such as context size and price per million tokens, and write units into the value. The details change with every selection.
- **Do:** Handle `onEffortChange` together with `onValueChange` and save both. The High hint says it "costs more", so show the effect where the person decides.
- **Don't:** Don't leave `meta` empty on the models. The list rows show only the name and `meta`, so the models are hard to tell apart without it.
- **Don't:** Don't squeeze it into a narrow column. It is capped at 560 px wide and stacks the list over the details below the `sm` breakpoint.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`, `--radius-md`, `--shadow-md`.

#### VoiceInput

Talk instead of typing: idle, listening with a live waveform and transcript, then transcribing.

```tsx
<VoiceInput state={state} seconds={seconds} transcript={text} onStart={start} onStop={stop} />
```

```ts
function VoiceInput({ state, transcript, seconds, onStart, onStop, hint, className, }: {
    state?: VoiceState;
    /** The words heard so far (listening). */
    transcript?: React.ReactNode;
    seconds?: number;
    onStart?: () => void;
    onStop?: () => void;
    hint?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type VoiceState = "idle" | "listening" | "transcribing";
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `hint` | `React.ReactNode` | `"Nova writes down what you say"` |
| `onStart` | `() => void` | — |
| `onStop` | `() => void` | — |
| `seconds` | `number` | `0` |
| `state` | `"idle" \| "listening" \| "transcribing"` | `"idle"` |
| `transcript` | `React.ReactNode` | — |

Anatomy:

- `VoiceInput` (`data-slot="voice-input"`): A pill for dictation with three states: tap to talk, listening with waveform, clock and transcript, and transcribing.
- `Record button`: A round button named "Start recording" or "Stop recording". It calls `onStart` and `onStop`.
- `Waveform and transcript` — optional: Shown while listening. The bars are decorative; the transcript is a polite live region.
- `Status text` — optional: "Tap to talk" with a hint, or "Transcribing…" with the length of audio in seconds. The elapsed clock shows while listening.

Best practices:

- **When:** Use a Voice Input when speaking is an option next to typing. For typed prompts, use Prompt Input.
- **Do:** Control it with `state` and do the recording in your code. The component only shows state; it never opens the microphone.
- **Do:** Feed `transcript` while listening and `seconds` from a measured timer. The live region reads the transcript, so people who cannot see the bars still follow along.
- **Do:** Replace the default `hint` with your product's own line. The built-in text names an assistant.
- **Don't:** Don't send the transcript without letting the person read it. Put the text into the prompt box after `transcribing`.

Theming: reads `--border`, `--card`, `--destructive`, `--destructive-foreground`, `--foreground`, `--primary`, `--primary-foreground`, `--ring`, `--subtle`, `--text-error`, `--text-secondary`, `--duration-fast`.

#### ArtifactPanel

The side panel for what the agent made — code or a document — with versions, copy and download.

```tsx
<ArtifactPanel title="tabs.tsx" versions={["v1", "v2", "v3"]} version={v} onVersionChange={setV} code={source} onCopy={copy} onClose={close} />
```

```ts
function ArtifactPanel({ title, meta, versions, version, onVersionChange, code, children, onCopy, onDownload, onClose, className, }: {
    title: React.ReactNode;
    meta?: React.ReactNode;
    versions?: string[];
    version?: string;
    onVersionChange?: (v: string) => void;
    /** Renders the code view with line numbers. Omit and pass `children` for a document. */
    code?: string;
    children?: React.ReactNode;
    onCopy?: () => void;
    onDownload?: () => void;
    onClose?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `children` | `React.ReactNode` | — |
| `className` | `string` | — |
| `code` | `string` | — |
| `meta` | `React.ReactNode` | — |
| `onClose` | `() => void` | — |
| `onCopy` | `() => void` | — |
| `onDownload` | `() => void` | — |
| `onVersionChange` | `(v: string) => void` | — |
| `version` | `string` | — |
| `versions` | `string[]` | `[]` |

Anatomy:

- `ArtifactPanel` (`data-slot="artifact-panel"`): The side panel for what the agent made, code or a document. A `section` with a header and a body.
- `Header`: Title, optional `meta` line, version switch and the Copy, Download and Close buttons.
- `Version switch` — optional: A segmented control that appears from two `versions`. It starts on the last version and keeps its own selection unless you pass `version`.
- `Code view` — optional: Shown when `code` is set: numbered lines in a scrollable `pre` that takes keyboard focus for the arrow keys.
- `Document view` — optional: Shown when `code` is omitted: `children` as padded body text.

Best practices:

- **When:** Use ArtifactPanel for what the agent made, shown beside the chat: code or a document with versions, copy, download and close. For a change to a file use Diff View; for a snippet inside a message use Code Block.
- **Do:** Pass `code` for code and `children` for a document. When both are given, `code` wins.
- **Do:** List `versions` oldest first. The panel opens on the last one, and the switch only appears with two or more.
- **Do:** Pass `onCopy`, `onDownload` and `onClose` only for actions that exist. Each button renders only when its handler is given.
- **Don't:** Don't use the panel for the transcript of tool calls. It shows a result; steps and tool output belong in a run timeline or terminal output.
- **Don't:** Don't turn model output into markup. `code` renders as text in a `code` element, and `children` should be text too.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--subtle`, `--text-secondary`, `--text-tertiary`, `--radius-lg`.

#### SourceList

Numbered sources pinned to a chat; citations like [1] in answers point here.

```tsx
<SourceList sources={[{ title: "Tabs pattern — WAI-ARIA", meta: "w3.org · web page", kind: "web" }]} />
```

```ts
function SourceList({ sources, title, className, id }: {
    sources: Source[];
    title?: React.ReactNode;
    className?: string;
    id?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `sources` * | `Source[]` | — |
| `className` | `string` | — |
| `id` | `string` | — |
| `title` | `React.ReactNode` | `"Sources"` |

Anatomy:

- `SourceList` (`data-slot="source-list"`): A card with the numbered sources of an answer: kind icon, title, meta line and an optional link, with a count of pinned items.
- `Header` — optional: The title ("Sources" by default) and the count of pinned items.
- `Source row`: The number, a kind icon for web, file, doc or channel, the title and the meta. With `href` the row is a link to a new tab.

Best practices:

- **When:** Use a Source List for the references behind an answer. For the results of one search call, use Search Result Card.
- **Do:** Keep the order stable. Citations such as [1] in the answer point to the same number here, so renumbering breaks them.
- **Do:** Pass `id` and link citations to `#id-1`. Each row gets the id `${id}-${n}`, so an anchor can jump to it.
- **Do:** Set `kind` and a `meta` line such as the host or file path. The icon and the line tell the person what they open before they click.
- **Don't:** Don't add a source the agent did not use. The list reads as proof, so unused entries make the answer look better than it is.

Theming: reads `--border`, `--card`, `--foreground`, `--ring`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-lg`, `--radius-sm`.

#### AgentAvatar

Who is talking in a multi-agent chat: tint colour, name and role.

```tsx
<AgentAvatar name="Planner" role="Breaks the task into steps" initials="PL" color="indigo" />
```

```ts
function AgentAvatar({ name, role, initials, color, className }: {
    name: React.ReactNode;
    role?: React.ReactNode;
    initials: string;
    color?: AvatarColor;
    className?: string;
}): React.JSX.Element;
type AvatarColor = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative" | "grey";
```

| Prop | Type | Default |
| --- | --- | --- |
| `initials` * | `string` | — |
| `name` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey"` | `"indigo"` |
| `role` | `React.ReactNode` | — |

Anatomy:

- `AgentAvatar` (`data-slot="agent-avatar"`): Who is speaking in a multi-agent chat: a tinted avatar with the agent's initials, its name and an optional role underneath.

Best practices:

- **When:** Use AgentAvatar to say which agent speaks in a multi-agent chat: tint, name and role. For a single assistant or a person, a plain Avatar is enough. To mark the change of speaker, add a Handoff Divider.
- **Do:** Give each agent its own `color` and keep it for the whole conversation, so people learn who is who from the tint.
- **Do:** Add a short `role` such as `Researcher` or `Reviewer`. It renders under the name and tells people what the agent is responsible for.
- **Do:** Pass the two-letter `initials` yourself. The avatar shows them as given and does not derive them from `name`.
- **Don't:** Don't reuse a tint for two agents in one conversation. Name and role always render, but the tint is what people scan first.

Theming: reads `--foreground`, `--text-secondary`.

#### HandoffDivider

Marks the moment one agent passes the conversation to another.

```tsx
<HandoffDivider from="Planner" to="Writer" />
```

```ts
function HandoffDivider({ from, to, className }: {
    from: React.ReactNode;
    to: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `from` * | `React.ReactNode` | — |
| `to` * | `React.ReactNode` | — |
| `className` | `string` | — |

Anatomy:

- `HandoffDivider` (`data-slot="handoff-divider"`): A separator with the text "{from} handed off to {to}" between two hairlines, marking the turn where one agent passes the conversation on.
- `Handoff label` — optional: The centred text with the lightning icon. `from` and `to` are the only content, so pass short agent names.

Best practices:

- **When:** Use a Handoff Divider in a multi-agent chat at the point where the speaker changes. To show who speaks, use an avatar with name and role on the message itself.
- **Do:** Pass the same agent names that the messages show, such as `Planner` and `Reviewer`, so the label reads as a sentence: "Planner handed off to Reviewer".
- **Do:** Place one divider per handoff, between the last message of the first agent and the first message of the next. The divider already has `role="separator"`.
- **Don't:** Don't put long text or a reason into `from` or `to`. The label is one line between two hairlines; put the reason in a message.
- **Don't:** Don't use it as a general section break. It always reads "handed off to", so it only fits a change between agents.

Theming: reads `--border`, `--text-secondary`, `--text-tertiary`.

#### Alert

An inline banner in 5 colors and 2 sizes, with an optional close button and action.

```tsx
<Alert variant="positive">
  <AlertTitle>Positive</AlertTitle>
  <AlertDescription>Text for notifications here.</AlertDescription>
</Alert>
```

```ts
function Alert({ variant, size, icon, onClose, className, children, ...props }: React.ComponentProps<"div"> & {
    variant?: AlertVariant;
    size?: AlertSize;
    /** Replaces the leading icon (default: a check circle, a warning triangle for negative and warning). `null` hides it. */
    icon?: React.ReactNode;
    onClose?: () => void;
}): React.JSX.Element;
type AlertVariant = "plain" | "positive" | "primary" | "negative" | "warning";
type AlertSize = "small" | "large";
```

| Prop | Type | Default |
| --- | --- | --- |
| `icon` | `React.ReactNode` | — |
| `onClose` | `() => void` | — |
| `size` | `"small" \| "large"` | `"large"` |
| `variant` | `"plain" \| "primary" \| "positive" \| "negative" \| "warning"` | `"plain"` |

Also accepts the React.HTMLAttributes attributes (280).

Anatomy:

- `Alert` (`data-slot="alert"`): The banner. It renders with `role="alert"`, picks its icon from the `variant`, and shows a close button only when you pass `onClose`.
- `Icon` (`data-slot="alert-icon"`) — optional: The leading icon: a check circle, or a warning triangle for `negative` and `warning`. Replace it with `icon`, hide it with `icon={null}`.
- `AlertTitle` (`data-slot="alert-title"`) — optional: The bold first line. In the `small` size it stays on one line and truncates only when the banner is very narrow.
- `AlertDescription` (`data-slot="alert-description"`): The message text. In the `small` size it takes the remaining width of the line and truncates; in `large` it wraps under the title.
- `Close button` (`data-slot="alert-close"`) — optional: A `<button>` labelled `Dismiss` that calls `onClose`. It is rendered only when `onClose` is set.

Best practices:

- **When:** Use an Alert for a message that stays on the page until the cause is gone: a failed payment, a limit reached, a read-only workspace. For feedback on a finished action, use a toast.
- **Do:** Pick the `variant` by meaning: `negative` for what blocks the user, `warning` for what needs attention soon, `positive` for a confirmed state, `primary` for neutral news. `plain` is for notes without urgency.
- **Do:** Put the next step in the text or as one action button inside `Alert`: `Update payment method`. An alert that only states a problem leaves the user to find the fix.
- **Do:** Use `size="small"` for a one-line notice with a short title and description. Longer text belongs in `large`, where it wraps instead of truncating.
- **Don't:** Don't pass `onClose` on an alert that reports a blocking problem. A dismissed error leaves the page looking healthy while the cause is still there.
- **Don't:** Don't rely on the colour alone. The title or description has to say what is wrong, since the variants differ only by tint and icon.

Theming: reads `--border`, `--brand-quaternary`, `--card`, `--destructive`, `--foreground`, `--primary`, `--ring`, `--success`, `--text-warning`, `--tint-green`, `--tint-indigo`, `--tint-red`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-red`, `--radius-lg`, `--radius-sm`, `--duration-fast`, `--ease-entrance`.

#### Toaster

A temporary notification that appears in the corner of the screen, with success/error/warning/info types.

```tsx
import { Toaster, useToast } from "@wunderui/react"

// wrap your app once
<Toaster>{children}</Toaster>

// then anywhere inside it
const { add } = useToast()
add({ type: "success", title: "Successfully saved", description: "Your changes have been saved." })
```

```ts
function Toaster({ children, position, }: {
    children: React.ReactNode;
    /** Corner the stack lives in. */
    position?: "top-right" | "bottom-right";
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `position` | `"top-right" \| "bottom-right"` | `"top-right"` |

Anatomy:

- `Toaster`: The one-line setup: it wraps your app in a provider, renders the viewport and draws every toast. `position` picks the corner.
- `ToastProvider` — optional: The provider on its own, with a default `timeout` of 5000 ms. Toaster already includes it.
- `ToastViewport` (`data-slot="toast-viewport"`) — optional: The fixed container in the top-right or bottom-right corner that holds the stack. Toaster already renders it.
- `Toast` (`data-slot="toast"`) — optional: One notification. Older toasts sit smaller and fainter behind the newest, and hovering the viewport spreads the stack into a list.
- `Content` (`data-slot="toast-content"`) — optional: The row inside a toast: the type dot, the text block and the close button.
- `Title` (`data-slot="toast-title"`): The bold line that names the outcome, such as `Changes saved`. Set it with `title` in `add`.
- `Description` (`data-slot="toast-description"`) — optional: A secondary line, drawn only when `description` is passed to `add`.
- `Action` (`data-slot="toast-action"`) — optional: An inline text link such as `Undo`, drawn only when `actionProps` is passed to `add`.
- `Close button` (`data-slot="toast-close"`) — optional: A button labelled `Close` that dismisses the toast. It can be reached with Tab; toasts never take focus themselves.

Best practices:

- **When:** Use a toast for short feedback on an action the user took: saved, copied, sent. For a message that has to stay until the cause is fixed, use an Alert.
- **Do:** Mount `Toaster` once around the app and call `useToast().add({ title, type })` anywhere below it. `useToast` only works inside the provider.
- **Do:** Name the outcome in `title` and set `type` (`success`, `error`, `warning`, `info`) to match. Add `actionProps` with `Undo` when the action can be reversed.
- **Don't:** Don’t make a toast the only place an error appears. It disappears by itself after 5000 ms and never takes focus, so anyone looking elsewhere will not see it. Keep the message where the user is working, for example in an inline alert.
- **Don't:** Don't fire several toasts for one action. The stack shows four at most; older ones fade out.

Theming: reads `--border`, `--brand-600`, `--card`, `--destructive`, `--foreground`, `--success`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--yellow-600`, `--radius-md`, `--radius-sm`, `--shadow-lg`, `--duration-slow`, `--ease-entrance`.

#### PullToRefresh

Drag down from the top of any content past a threshold to trigger an async refresh, with a rotating spinner and a rubber-band release.

```tsx
<PullToRefresh onRefresh={async () => { await refetch() }}>
  <YourCardContent />
</PullToRefresh>
```

```ts
function PullToRefresh({ onRefresh, threshold, maxPull, children, className, }: PullToRefreshProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `onRefresh` * | `() => void \| Promise<void>` | — |
| `className` | `string` | — |
| `maxPull` | `number` | `110` |
| `threshold` | `number` | `70` |

Anatomy:

- `PullToRefresh` (`data-slot="pull-to-refresh"`): Wraps your content and turns a downward drag from the top into a refresh. The pull starts only when everything above is scrolled to the top.
- `Indicator` (`data-slot="pull-to-refresh-indicator"`): The spinner above the content. It fades and rotates while you pull, then spins until `onRefresh` resolves.

Best practices:

- **When:** Use PullToRefresh for a touch-first list or feed that the user reloads by hand. For data that updates itself, show the new state and skip the gesture.
- **Do:** Return the promise from `onRefresh`. The spinner and the lock stay until it settles, also when it fails, so a slow request never looks finished.
- **Do:** Keep `threshold` at or below `maxPull` (defaults 70 and 110). The pull moves at half the finger speed, so the user drags about twice the threshold.
- **Don't:** Don't make the gesture the only way to refresh. It is pointer-based with no keyboard route, so give keyboard and screen reader users a visible `Refresh` button.
- **Don't:** Don't expect a tap to work right after a pull. The click that ends a drag is swallowed on purpose, so the item under the finger is not opened.

Theming: reads `--primary`, `--duration-slow`, `--ease-entrance`.

#### Rating

An interactive star rating input.

```tsx
<Rating value={value} onValueChange={setValue} max={5} />
```

```ts
function Rating({ value, onValueChange, max, type, label, readOnly, className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, }: {
    value: number;
    onValueChange?: (value: number) => void;
    max?: number;
    type?: RatingType;
    label?: RatingLabel;
    readOnly?: boolean;
    className?: string;
    /** Names the group ("Rating" by default); read-only, it replaces "Rated 3.5 out of 5". */
    "aria-label"?: string;
    /** Id of a visible label that names the group, instead of `aria-label`. */
    "aria-labelledby"?: string;
}): React.JSX.Element;
type RatingType = "stars" | "hearts" | "emojis" | "scale";
type RatingLabel = "none" | "left" | "right" | "tooltip";
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number` | — |
| `aria-label` | `string` | — |
| `aria-labelledby` | `string` | — |
| `className` | `string` | — |
| `label` | `"none" \| "left" \| "right" \| "tooltip"` | `"none"` |
| `max` | `number` | — |
| `onValueChange` | `(value: number) => void` | — |
| `readOnly` | `boolean` | `false` |
| `type` | `"scale" \| "stars" \| "hearts" \| "emojis"` | `"stars"` |

Anatomy:

- `Rating` (`data-slot="rating"`): The group of options. Interactive it is a `radiogroup` with one Tab stop; with `readOnly` it is a single image that reads `Rated 3.5 out of 5`.
- `RatingCell` — optional: A read-only star row with the value on the right, made for table cells. Takes `value` and `max`.

Best practices:

- **When:** Use Rating to collect or show a score: stars or hearts for opinions, emojis for sentiment, `scale` for a 0 to 10 survey answer. In a table column, use `RatingCell`.
- **Do:** Name the group with `aria-label` or `aria-labelledby`, for example `Rate this article`. The default name is only `Rating`.
- **Do:** Set `readOnly` when you display an average. A fractional `value` such as 3.5 fills rounded stars and keeps the exact number in the accessible name.
- **Do:** Turn on `label="right"` when the number matters. Without it, a score of 4.5 is only a row of icons.
- **Don't:** Don't expect hover to select. It previews the fill, but only a click or an arrow key calls `onValueChange`; arrows move and select in one step.
- **Don't:** Don't use the `emojis` type for a required answer. Clicking the chosen face again clears it and sends `0`.

Theming: reads `--background`, `--border`, `--border-control`, `--brand-quaternary`, `--brand-tertiary`, `--card`, `--foreground`, `--primary`, `--primary-foreground`, `--ring`, `--subtle`, `--text-secondary`, `--tint-indigo`, `--radius-md`, `--radius-sm`, `--shadow-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### NumberValue

A large number with its change beside it: caret up or down, green or red.

```tsx
<NumberValue value="1,204" delta="4.2%" trend="up" trendGood />
```

```ts
function NumberValue({ value, delta, trend, trendGood, className, }: {
    value: string;
    delta?: string;
    trend?: "up" | "down";
    trendGood?: boolean;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `string` | — |
| `className` | `string` | — |
| `delta` | `string` | — |
| `trend` | `"up" \| "down"` | — |
| `trendGood` | `boolean` | `true` |

Anatomy:

- `NumberValue` (`data-slot="number-value"`): A bold 24 px figure with an optional change beside it. The caret and the label appear only when both `delta` and `trend` are set.

Best practices:

- **When:** Use NumberValue for one headline figure with its change, inside your own layout. For a pill that shows only a percentage change, use a trend chip.
- **Do:** Pass `value` as a finished string with its unit: `$48,200`, `1,284 users`. The component does not format numbers, so the unit has to come with it.
- **Do:** Set `trendGood={false}` when the change is bad, and keep `trend` for the caret direction. Colour follows `trendGood`, direction follows `trend`: a falling churn rate is `trend="down"` with the default `trendGood`.
- **Do:** Give `delta` its sign and unit: `+4.2%`. The caret is decorative (`aria-hidden`), so the text must carry the direction.
- **Don't:** Don't pass `delta` without `trend`. The change is hidden unless both are set.

Theming: reads `--foreground`, `--text-error`, `--text-success`.

#### TrendChip

A small pill showing a change, up or down, in seven icon styles.

```tsx
<TrendChip value="12.4%" direction="up" />
```

```ts
function TrendChip({ value, direction, icon, sentiment, className, }: {
    value: string;
    /** Figma Trend Chip · Trend; `flat` is the old name for `neutral`. */
    direction?: "up" | "down" | "neutral" | "flat";
    /** Figma Trend Chip · Icon; the same glyph turns for `down`. */
    icon?: TrendChipIcon;
    /**
     * Figma Trend Chip · Sentiment: whether the change is good or bad. `auto` colours by direction
     * (up green, down red); use `positive` for a fall that is good (churn, cost) or `negative` for
     * a rise that is bad. The arrow always follows `direction`.
     */
    sentiment?: "auto" | "positive" | "negative" | "neutral";
    className?: string;
}): React.JSX.Element;
type TrendChipIcon = "trending" | "arrow" | "arrow-diagonal" | "triangle" | "circle-trending" | "circle-diagonal" | "circle-arrow";
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `string` | — |
| `className` | `string` | — |
| `direction` | `"up" \| "down" \| "neutral" \| "flat"` | `"up"` |
| `icon` | `"triangle" \| "trending" \| "arrow" \| "arrow-diagonal" \| "circle-trending" \| "circle-diagonal" \| "circle-arrow"` | `"trending"` |
| `sentiment` | `"auto" \| "positive" \| "negative" \| "neutral"` | `"auto"` |

Anatomy:

- `TrendChip` (`data-slot="trend-chip"`): The pill. `direction` colours it green, red or neutral grey, and `icon` chooses which of seven glyphs shows the direction.
- `TrendCaret` — optional: The filled triangle used by the `triangle` icon and by the change label of a number value. It is decorative and hidden from screen readers.

Best practices:

- **When:** Use a TrendChip for a percentage change next to a figure: in a table cell, a card header, a list row. For the figure and its change as one unit, use a number value.
- **Do:** Write the sign and unit into `value`: `+12.4%`, `-3 pts`. The glyph is `aria-hidden`, so the text is the only thing a screen reader gets.
- **Do:** Choose one `icon` style per screen and keep it. The chip's padding adapts to the glyph, so mixed styles in a column do not line up.
- **Don't:** Don't use `direction` to mean good or bad. `up` is always green and `down` always red, so a falling error rate shows red. Show such a metric with a number value and `trendGood`.
- **Don't:** Don't use `direction="flat"` in new code. It is the old name for `neutral`.

Theming: reads `--muted`, `--text-secondary`, `--tint-green`, `--tint-red`, `--tint-text-green`, `--tint-text-red`.

#### PressableFeedback

Wraps any content with a scale-down press animation.

```tsx
<PressableFeedback onPress={handlePress}>{children}</PressableFeedback>
```

```ts
function PressableFeedback({ children, onPress, className, asChild, }: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
    /** Apply the press effect to the child element instead of wrapping it. */
    asChild?: boolean;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `asChild` | `boolean` | `false` |
| `className` | `string` | — |
| `onPress` | `() => void` | — |

Anatomy:

- `PressableFeedback`: Scales its content down to 95% while pressed. Alone it renders a `<button>`; with `asChild` it lends the effect to its single child.

Best practices:

- **When:** Use PressableFeedback to give press feedback to something that is not a button yet, such as a card or a tile. Buttons and icon buttons already react to a press.
- **Do:** Pass `asChild` when the child is already a button or a link. Without it you nest a `<button>` inside a `<button>`, which is invalid HTML.
- **Do:** Handle the action with `onPress`. With `asChild` the child's own `onClick` still runs first, then `onPress`.
- **Don't:** Don't put links or other buttons inside it without `asChild`. The content then sits inside a `<button>`, so nested interactive elements break.

Theming: reads `--duration-fast`, `--ease-move`.

#### EmojiReactionButton

A toggleable emoji reaction with a count, like a Slack reaction.

```tsx
<EmojiReactionButton emoji="🔥" count={12} active={active} onToggle={toggle} />
```

```ts
function EmojiReactionButton({ emoji, count, active, onToggle, className, }: {
    emoji: string;
    count: number;
    active?: boolean;
    onToggle?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `count` * | `number` | — |
| `emoji` * | `string` | — |
| `active` | `boolean` | — |
| `className` | `string` | — |
| `onToggle` | `() => void` | — |

Anatomy:

- `EmojiReactionButton`: A pill `<button>` with an emoji and its count. `active` marks your own reaction and is exposed as `aria-pressed`; `onToggle` fires on every click.

Best practices:

- **When:** Use EmojiReactionButton for one reaction under a message or comment, with its count. To let the user add a new reaction, offer an emoji picker next to the row.
- **Do:** Update `count` and `active` together in `onToggle`. The component keeps no state, so toggling without changing `active` leaves the pill unchanged.
- **Do:** Set `active` for the reactions the current user made, so the tint and `aria-pressed` show which ones they can take back.
- **Don't:** Don't keep a reaction with a count of 0 in the row. Remove it until someone reacts again.

Theming: reads `--border`, `--muted`, `--primary`, `--text-secondary`, `--tint-indigo`, `--tint-text-indigo`, `--duration-fast`, `--ease-entrance`.

#### EmojiPicker

A grid of selectable emoji, typically shown inside a Popover.

```tsx
<EmojiPicker onSelect={(emoji) => insert(emoji)} />
```

```ts
function EmojiPicker({ emojis, onSelect, className, }: {
    emojis?: string[];
    onSelect?: (emoji: string) => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `emojis` | `string[]` | `DEFAULT_EMOJIS` |
| `onSelect` | `(emoji: string) => void` | — |

Anatomy:

- `EmojiPicker`: A six-column grid of emoji buttons in a `role="group"` named `Emoji`. Each button's name is its emoji, and `onSelect` receives the one clicked.

Best practices:

- **When:** Use EmojiPicker for a short, curated set of emoji to react or label with. It shows only the emojis you pass, so it is not a searchable emoji keyboard.
- **Do:** Place it inside a popover that opens from an icon button, and close the popover in `onSelect`. The picker has its own card styling and does not close anything itself.
- **Do:** Pass a short `emojis` array in a fixed order, 12 by default. The grid has six columns, so multiples of six fill the rows.
- **Don't:** Don't use an emoji as the only information in a control. The buttons are named by the emoji alone, so keep visible text where the meaning matters.

Theming: reads `--border`, `--muted`, `--popover`, `--ring`, `--radius-lg`, `--radius-md`, `--shadow-lg`.

#### Sheet

A panel that slides in from an edge of the screen — left, right, or bottom.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger render={<Button />}>Open</SheetTrigger>
  <SheetContent side="right">...</SheetContent>
</Sheet>
```

```ts
function Sheet({ ...props }: Dialog.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `actionsRef` | `React.RefObject<DialogRoot.Actions \| null>` | — |
| `children` | `React.ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| `defaultOpen` | `boolean` | `false` |
| `defaultTriggerId` | `string \| null` | — |
| `disablePointerDismissal` | `boolean` | `false` |
| `handle` | `DialogHandle<Payload>` | — |
| `modal` | `boolean \| 'trap-focus'` | `true` |
| `onOpenChange` | `((open: boolean, eventDetails: DialogRoot.ChangeEventDetails) => void)` | — |
| `onOpenChangeComplete` | `((open: boolean) => void)` | — |
| `open` | `boolean` | — |
| `triggerId` | `string \| null` | — |

Anatomy:

- `Sheet` (`data-slot="sheet"`): Holds the open state and links trigger, panel and close buttons. Renders nothing itself.
- `SheetClose` (`data-slot="sheet-close"`) — optional: Closes the sheet. Wrap a Cancel or Done button in it.
- `SheetContent` (`data-slot="sheet-content"`): The panel. It brings its own portal and backdrop, slides in from `side` (`right` by default) and shows a close button unless `showCloseButton={false}`.
- `SheetDescription` (`data-slot="sheet-description"`) — optional: One or two sentences on what the sheet is for, read out after the title.
- `SheetHeader` — optional: Stacks the title and the description at the top of the panel.
- `SheetTitle` (`data-slot="sheet-title"`): Names the sheet; screen readers announce it when the sheet opens.
- `SheetTrigger` (`data-slot="sheet-trigger"`) — optional: The element that opens the sheet. Focus returns to it when the sheet closes.

Best practices:

- **When:** Use a Sheet for detail views, edit forms and filters that should keep the page visible behind them. For a short decision, use a Dialog. For a confirmation with consequences, use an Alert Dialog.
- **Do:** Always include a `SheetTitle`, also when the design shows none. It is the only name the sheet has for screen readers.
- **Do:** Choose `side="bottom"` for phones and `right` for desktop detail views. The bottom sheet is capped at 80vh, the side sheets at `max-w-sm`.
- **Do:** Put a primary action and a `Cancel` button inside the content, the Cancel wrapped in `SheetClose`. The corner × alone is easy to miss on a form.
- **Don't:** Don't set `showCloseButton={false}` without another way out. Add a `SheetClose` button, since Escape is the only other route for keyboard users.

Theming: reads `--background`, `--border`, `--foreground`, `--popover`, `--popover-foreground`, `--text-secondary`, `--radius-xl`, `--card-padding`, `--shadow-xl`, `--duration-deliberate`, `--duration-slow`, `--ease-exit`, `--ease-overshoot`.

#### Resizable

A two-pane layout with a draggable divider between them.

```tsx
<Resizable defaultSize={280} min={160} max={480}>
  <PanelA />
  <PanelB />
</Resizable>
```

```ts
function Resizable({ children, direction, defaultSize, min, max, side, onSizeChange, handleLabel, className, }: {
    children: [React.ReactNode, React.ReactNode];
    direction?: "horizontal" | "vertical";
    defaultSize?: number;
    min?: number;
    max?: number;
    side?: ResizableSide;
    onSizeChange?: (size: number) => void;
    /** Accessible name of the handle, e.g. "Resize sidebar". */
    handleLabel?: string;
    className?: string;
}): React.JSX.Element;
type ResizableSide = "start" | "end" | "left" | "right" | "top" | "bottom";
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `[React.ReactNode, React.ReactNode]` | — |
| `className` | `string` | — |
| `defaultSize` | `number` | `280` |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `handleLabel` | `string` | `"Resize panels"` |
| `max` | `number` | `560` |
| `min` | `number` | `120` |
| `onSizeChange` | `(size: number) => void` | — |
| `side` | `"left" \| "right" \| "start" \| "end" \| "top" \| "bottom"` | `"start"` |

Anatomy:

- `Resizable` (`data-slot="resizable"`): Two panels split by a draggable handle. `side` picks the panel that has the pixel size (`defaultSize`, between `min` and `max`); the other takes the rest.
- `Panel` (`data-slot="resizable-panel"`): One of the two children. The sized panel has a fixed width or height, the other one fills the remaining space; both scroll on their own.
- `Handle` (`data-slot="resizable-handle"`): The divider. It is a focusable `separator`: arrow keys move it by 16 px (64 with Shift), Home and End jump to the limits.

Best practices:

- **When:** Use Resizable when the user decides how much room a side panel gets: a file tree next to an editor, a list next to a detail view. For a fixed split, plain layout is simpler.
- **Do:** Pass exactly two children. The first is the start panel (left or top) and the second is the end panel, and the `side` prop says which one has the set size.
- **Do:** Set `handleLabel` to name the panel, such as `Resize sidebar`. The default `Resize panels` does not say which split it moves.
- **Do:** Persist the size from `onSizeChange` if it should survive a reload. The component keeps its size in memory and starts from `defaultSize` again.
- **Don't:** Don't expect `min` and `max` to beat the container. The size is also capped to leave 48 px for the other panel, so a large `min` is ignored.

Theming: reads `--border`, `--card`, `--primary`, `--ring`, `--text-tertiary`, `--shadow-xs`, `--duration-fast`, `--ease-move`.

#### ScrollArea

A scrollable container with custom, always-styled scrollbars.

```tsx
<ScrollArea className="h-40 w-64 rounded-lg border border-border">
  <div className="flex flex-col gap-2 p-4">
    {items.map((item) => <p key={item.id}>{item.label}</p>)}
  </div>
</ScrollArea>
```

```ts
function ScrollArea({ className, children, ...props }: ScrollArea.Root.Props): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `overflowEdgeThreshold` | `number \| Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number; }>` | `0` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |

Also accepts the React.HTMLAttributes attributes (275).

Anatomy:

- `ScrollArea` (`data-slot="scroll-area"`): A scrolling region with a styled scrollbar. Give it a fixed height or width; it adds the viewport, content wrapper, vertical bar and corner.
- `Viewport` (`data-slot="scroll-area-viewport"`): The element that scrolls. It shows a focus ring when focused, follows the root's corner radius and stops scroll chaining with `overscroll-contain`.
- `Content` (`data-slot="scroll-area-content"`): The wrapper around your children. It grows with them and is measured to size the thumb.
- `ScrollBar` (`data-slot="scroll-area-scrollbar"`) — optional: The scrollbar track, vertical by default. The root renders one for you; `orientation` switches a bar to horizontal.
- `Thumb` (`data-slot="scroll-area-thumb"`): The draggable handle inside the scrollbar. Its length shows how much of the content is visible.

Best practices:

- **When:** Use a ScrollArea for a panel with its own scrolling inside a fixed layout, when the scrollbar must look the same on every platform: a long list in a popover, a log, a side panel. For ordinary overflow, `overflow-y-auto` is enough.
- **Do:** Give the root a height, such as `h-72`. The viewport fills the root, so without a bounded size the content only grows and nothing scrolls.
- **Do:** Put the border and radius on the root. The viewport inherits the radius, so the content is clipped at the rounded corners.
- **Don't:** Don't nest scroll areas in each other. Two scrolling regions compete for the wheel and the keyboard, so cut the inner one down to a plain list.
- **Don't:** Don't expect sideways scrolling out of the box. The root renders only the vertical bar.

Theming: reads `--border`, `--ring`, `--duration-fast`, `--ease-entrance`.

#### PageHeader

The title row at the top of a page or section, with an optional description, buttons or a text link.

```tsx
<PageHeader
  title="Audit log"
  description="Every security event in your workspace, newest first."
  actions={
    <>
      <Button variant="plain" size="sm">Export</Button>
      <Button variant="primary" size="sm">New rule</Button>
    </>
  }
/>

<PageHeader level="section" title="Recent orders" description="Last 5 transactions" link="View all" href="/orders" />
```

```ts
function PageHeader({ title, description, level, actions, link, href, onLinkClick, className }: PageHeaderProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `actions` | `React.ReactNode` | — |
| `className` | `string` | — |
| `description` | `React.ReactNode` | — |
| `href` | `string` | `"#"` |
| `level` | `"page" \| "section"` | `"page"` |
| `link` | `React.ReactNode` | — |
| `onLinkClick` | `React.MouseEventHandler<HTMLAnchorElement>` | — |

Anatomy:

- `PageHeader` (`data-slot="page-header"`): The title of a page or section with an optional description and, on the trailing edge, `actions` or a text `link`.

Best practices:

- **When:** Use Page Header at the top of an app page or above a section. For the title of a sign-in form, use Auth Heading.
- **Do:** Keep `level="page"` (an `h1`) once per view and use `level="section"` (an `h2`) for sections below it.
- **Do:** Put at most one primary button in `actions`; other actions stay plain. Use `link` for a single text action such as `View all`.
- **Don't:** Don't use `level="page"` for a section title. It renders a second `h1` and a display-size title.

Theming: reads `--foreground`, `--text-link`, `--text-secondary`.

#### KeyboardHint

One or more key caps with a short label, for the shortcut legend at the bottom of a command menu.

```tsx
<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
<KeyboardHint keys={["↵"]} label="Open" />
<KeyboardHint keys={["esc"]} label="Close" />
```

```ts
function KeyboardHint({ keys, label, className }: {
    keys: string[];
    label: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `keys` * | `string[]` | — |
| `label` * | `string` | — |
| `className` | `string` | — |

Anatomy:

- `KeyboardHint` (`data-slot="keyboard-hint"`): A row of key caps followed by a short label, for example the arrow keys and `to navigate`.

Best practices:

- **When:** Use Keyboard Hint in the footer of a palette or search overlay to explain keys. For a single shortcut inside a sentence, use Kbd.
- **Do:** Pass one entry per key in `keys` (`["↑", "↓"]`) and describe the action in `label`, starting with `to`.
- **Do:** Show only the keys that work in the current view.
- **Don't:** Don't put a combined shortcut in one string such as `Ctrl+K`. Each entry becomes one key cap, so split it into `["Ctrl", "K"]`.

Theming: reads `--border`, `--muted`, `--text-secondary`, `--text-tertiary`, `--radius-sm`.

#### CommandItemRow

One row in a command menu: an icon, a label, optional context and its shortcut keys.

```tsx
const [active, setActive] = useState(0)

<CommandItemRow icon={<Search />} label="Search files" keys={["⌘", "K"]} active={active === 0} onSelect={() => setActive(0)} />
<CommandItemRow icon={<Plus />} label="New project" keys={["⌘", "N"]} active={active === 1} onSelect={() => setActive(1)} />
{/* No keys: a chevron is shown instead */}
<CommandItemRow icon={<UserPlus />} label="Invite teammates" meta="Workspace" active={active === 2} onSelect={() => setActive(2)} />
```

```ts
function CommandItemRow({ icon, label, meta, keys, active, onSelect, className }: CommandItemRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `icon` * | `React.ReactNode` | — |
| `label` * | `React.ReactNode` | — |
| `active` | `boolean` | — |
| `className` | `string` | — |
| `keys` | `string[]` | — |
| `meta` | `React.ReactNode` | — |
| `onSelect` | `() => void` | — |

Anatomy:

- `CommandItemRow` (`data-slot="command-item"`): One selectable row of a command palette, with an icon, a label, optional `meta` and either shortcut keys or a chevron.

Best practices:

- **When:** Use Command Item Row for actions and destinations in a command palette. For search hits with a description and a link, use Search Result.
- **Do:** Set `active` on the highlighted row from your own arrow-key handling. The row is a button with a hover state but does not move a selection itself.
- **Do:** Pass `keys` for rows that have a shortcut (`["G", "I"]`). Omit it for rows that open a deeper level, which then show a chevron.
- **Don't:** Don't put the shortcut in `label` or `meta`. `keys` renders real key caps and keeps the label short enough to truncate cleanly.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--radius-md`, `--radius-sm`, `--duration-fast`, `--ease-entrance`.

#### SearchResult

A search hit with an icon, a title, a short excerpt and where it lives.

```tsx
<SearchResult
  icon={<FileText />}
  title="Onboarding checklist"
  description="Five steps every new teammate completes in their first week."
  meta="Docs · Updated 2 days ago"
  href="/docs/onboarding"
/>
```

```ts
function SearchResult({ icon, title, description, meta, href, onSelect, className }: SearchResultProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `description` | `React.ReactNode` | — |
| `href` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `meta` | `React.ReactNode` | — |
| `onSelect` | `() => void` | — |

Anatomy:

- `SearchResult` (`data-slot="search-result"`): One hit of a search page: an icon tile, title, a description limited to two lines, a meta line and a chevron.

Best practices:

- **When:** Use Search Result in a results list with descriptions. For actions in a command palette, use Command Item Row.
- **Do:** Pass `href` for results that go to a page. Without `href` the row acts as a button, and the click never jumps to `#`.
- **Do:** Keep `description` to a sentence or two, and use `meta` for path, date or type.
- **Don't:** Don't rely on the default icon for every kind of result. Pass an `icon` that tells types apart.

Theming: reads `--foreground`, `--muted`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### NotificationItem

One entry in a notification list, with an avatar or icon, the message, optional actions and an unread dot.

```tsx
<NotificationItem
  avatar={{ src: "/avatars/05.png" }}
  quote="Can we move the launch review to Thursday?"
  time="2 min ago"
  unread
  onClick={() => markRead(id)}
>
  <strong>Sarah Lindqvist</strong> commented on Q3 roadmap
</NotificationItem>

<NotificationItem
  avatar={{ initials: "LM", color: "blue" }}
  time="1 hour ago"
  unread
  actions={
    <>
      <Button size="sm" variant="primary">Accept</Button>
      <Button size="sm" variant="plain">Decline</Button>
    </>
  }
>
  <strong>Lucas Meyer</strong> invited you to WunderUI Design
</NotificationItem>

<NotificationItem icon={<Rocket />} time="Yesterday">
  <strong>Deploy</strong> finished for main in 42 seconds
</NotificationItem>
```

```ts
function NotificationItem({ icon, avatar, children, quote, actions, time, unread, onClick, className }: NotificationItemProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `time` * | `React.ReactNode` | — |
| `actions` | `React.ReactNode` | — |
| `avatar` | `{ src?: string; initials?: string; color?: AvatarColor }` | — |
| `className` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `onClick` | `() => void` | — |
| `quote` | `React.ReactNode` | — |
| `unread` | `boolean` | — |

Anatomy:

- `NotificationItem` (`data-slot="notification-item"`): One entry of a notification list: icon or avatar, message, optional quote and actions, the time and an unread marker.

Best practices:

- **When:** Use Notification Item in the notification centre or a popover list. For a history of changes on one object, use Timeline Event.
- **Do:** Wrap the actor in `<strong>` inside `children`. The row styles it, in the unread tint as well.
- **Do:** Set `unread` for new entries: the row is tinted and shows a dot with the label `Unread`.
- **Don't:** Don't pass `icon` together with `avatar`. The icon is ignored when an avatar is set.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--primary`, `--ring`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--radius-xl`.

#### ChecklistTask

One step of an onboarding checklist that can be ticked off, with the next step to do highlighted.

```tsx
<ul>
  <li>
    <ChecklistTask done onClick={() => toggle("profile")}>Complete your profile</ChecklistTask>
  </li>
  <li>
    <ChecklistTask
      current
      meta="Takes about 2 min"
      action={<Button size="sm" variant="primary">Start</Button>}
      onClick={() => toggle("invite")}
    >
      Invite your team
    </ChecklistTask>
  </li>
  <li>
    <ChecklistTask meta="3 min" onClick={() => toggle("project")}>Create your first project</ChecklistTask>
  </li>
</ul>
```

```ts
function ChecklistTask({ done, current, children, meta, action, onClick, className, }: {
    done?: boolean;
    /** The step to do next — tinted, with room for `meta` and an `action`. */
    current?: boolean;
    children: React.ReactNode;
    meta?: React.ReactNode;
    /** A button shown on the current step, e.g. "Start". */
    action?: React.ReactNode;
    /** Toggle the step. */
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `action` | `React.ReactNode` | — |
| `className` | `string` | — |
| `current` | `boolean` | — |
| `done` | `boolean` | — |
| `meta` | `React.ReactNode` | — |
| `onClick` | `() => void` | — |

Anatomy:

- `ChecklistTask` (`data-slot="checklist-task"`): One step of an onboarding checklist in one of three states: `done`, `current` (tinted, with `meta` and an `action`) or open.

Best practices:

- **When:** Use Checklist Task for the steps of an onboarding or setup checklist. For a plain list of items without a next step, use Checkbox Field.
- **Do:** Mark exactly one step `current` and give it an `action` such as `Start`. Only the current step shows the action; its circle becomes its own checkbox button labelled `Mark as done`.
- **Do:** Handle `onClick` as a toggle: it fires for done and open steps alike, so a step can be ticked and unticked again.
- **Don't:** Don't pass `action` to steps that are not `current`. It is not rendered there.

Theming: reads `--card`, `--foreground`, `--muted`, `--muted-foreground`, `--primary`, `--ring`, `--success`, `--success-foreground`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--duration-fast`, `--ease-move`.

#### ProjectCard

A clickable project tile with a colored cover, a name and a short line of detail.

```tsx
<ProjectCard
  name="Website redesign"
  meta="Edited 2 hours ago"
  color="indigo"
  cover={<LayoutDashboard className="size-8" />}
  onClick={() => openProject("website")}
/>
```

```ts
function ProjectCard({ name, meta, color, cover, onClick, className }: {
    name: React.ReactNode;
    meta?: React.ReactNode;
    color?: TintColor;
    cover?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
type TintColor = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative";
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"indigo"` |
| `cover` | `React.ReactNode` | — |
| `meta` | `React.ReactNode` | — |
| `onClick` | `() => void` | — |

Anatomy:

- `ProjectCard` (`data-slot="project-card"`): A button tile with a tinted cover area, the project name and a meta line.

Best practices:

- **When:** Use Project Card for projects or workspaces in a grid. For files with previews and selection, use File Card.
- **Do:** Pick `color` from the tint set to tell projects apart, and put an icon or image in `cover`.
- **Do:** Pass `onClick`; the whole card is the button.
- **Don't:** Don't put buttons or links in `cover`. The whole card is a `<button>`, and nested controls are invalid.

Theming: reads `--border`, `--card`, `--foreground`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-xl`, `--shadow-md`, `--duration-fast`, `--ease-entrance`.

#### FileCard

A file tile with a preview, a name and details, plus optional selection, a menu and a deleted state.

```tsx
const [selected, setSelected] = useState(false)

<FileCard
  name="Q3 report.pdf"
  meta="PDF · 2.4 MB"
  icon={<FileText />}
  color="red"
  selected={selected}
  onSelectedChange={setSelected}
  onMenu={() => openMenu()}
/>

{/* In the trash */}
<FileCard name="Old logo.svg" meta="Image · 12 KB" color="blue" icon={<ImageIcon />} deletedAt="Deleted 3 days ago" />
```

```ts
function FileCard({ name, meta, icon, color, thumbnail, selected, onSelectedChange, deletedAt, onMenu, onOpen, className }: FileCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"red"` |
| `deletedAt` | `React.ReactNode` | — |
| `icon` | `React.ReactNode` | — |
| `meta` | `React.ReactNode` | — |
| `onMenu` | `() => void` | — |
| `onOpen` | `() => void` | — |
| `onSelectedChange` | `(selected: boolean) => void` | — |
| `selected` | `boolean` | — |
| `thumbnail` | `string` | — |

Anatomy:

- `FileCard` (`data-slot="file-card"`): A tile for a file or folder with a preview area, name and meta line. Optional checkbox, open area and menu button sit on or beside the preview.

Best practices:

- **When:** Use File Card in a grid of files and folders. For a flat list with columns, use Table. For projects with a cover, use Project Card.
- **Do:** Pass `onOpen` so the preview becomes a real button. The checkbox sits next to it, not inside, so no control is nested in another.
- **Do:** Pass `onSelectedChange` for bulk selection: the checkbox shows on hover and focus, and stays visible once `selected` is true.
- **Don't:** Don't set `onMenu` on a trashed file and expect a menu. With `deletedAt` the card shows the deletion line in the error colour and hides the menu button.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--ring`, `--text-error`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### StatusBar

The phone status bar with the time, for the top of a mobile screen mockup.

```tsx
<div className="overflow-hidden rounded-xl border border-border bg-card">
  <StatusBar time="9:41" />
  {/* screen content */}
</div>
```

```ts
function StatusBar({ time, className }: {
    time?: string;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `time` | `string` | `"9:41"` |

Anatomy:

- `StatusBar` (`data-slot="status-bar"`): A decorative phone status bar with a time and a device icon, for mobile frames in mockups.

Best practices:

- **When:** Use Status Bar at the top of phone frames in previews and documentation. A real app doesn't need it: the device draws its own.
- **Do:** Pass `time` as a string to match the screenshot; the default is `9:41`.
- **Do:** Place it above the screen content, inside the phone frame.
- **Don't:** Don't ship it in a production screen. It shows no battery or network state.

Theming: reads `--card`, `--foreground`.

#### TabItem

A single underlined tab that shows a count while it is active, used inside a Tab Bar.

```tsx
const [tab, setTab] = useState("All")

<TabBar>
  <TabItem active={tab === "All"} count={24} onClick={() => setTab("All")}>All</TabItem>
  <TabItem active={tab === "Unread"} count={3} onClick={() => setTab("Unread")}>Unread</TabItem>
  <TabItem active={tab === "Mentions"} count={5} onClick={() => setTab("Mentions")}>Mentions</TabItem>
</TabBar>
```

```ts
function TabItem({ active, count, children, onClick, className, ...props }: TabItemProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `active` | `boolean` | — |
| `count` | `React.ReactNode` | — |
| `onClick` | `() => void` | — |

Also accepts the React.ButtonHTMLAttributes attributes (288).

Anatomy:

- `TabItem` (`data-slot="tab-item"`): One underline tab. The active tab is coloured, has `aria-selected`, and shows a `count` badge when one is given.

Best practices:

- **When:** Use Tab Item inside a Tab Bar. For tabs with content panels, use Tabs.
- **Do:** Set `active` on the tab that matches the open view.
- **Do:** Use `count` for items in a view, such as unread messages. It shows only on the active tab.
- **Don't:** Don't use tabs for actions. A tab switches a view and does not run a command.

Theming: reads `--border-control`, `--foreground`, `--primary`, `--ring`, `--text-link`, `--text-secondary`, `--radius-sm`, `--duration-fast`, `--ease-entrance`.

#### TabBar

A horizontal row of underlined tabs on a bottom border that scrolls sideways when space runs out.

```tsx
const tabs = ["Overview", "Activity", "Members", "Billing", "Settings"]
const [tab, setTab] = useState("Overview")

<TabBar>
  {tabs.map((t) => (
    <TabItem key={t} active={tab === t} onClick={() => setTab(t)}>
      {t}
    </TabItem>
  ))}
</TabBar>
```

```ts
function TabBar({ children, className, "aria-label": ariaLabel }: {
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `aria-label` | `string` | — |
| `className` | `string` | — |

Anatomy:

- `TabBar` (`data-slot="tab-bar"`): The tab list of the underline tabs. One tab stop, arrow keys move and activate, Home and End jump, and it scrolls sideways when tabs don't fit.

Best practices:

- **When:** Use Tab Bar with Tab Item for the underline tabs in blocks such as inboxes and tables. In your own screens, Tabs is the full component with panels.
- **Do:** Give the bar an `aria-label` that names what it switches.
- **Do:** Link each Tab Item to its panel with `id` and `aria-controls`, and set `aria-labelledby` on the panel.
- **Don't:** Don't put non-tab elements in it. It has the role `tablist` and arrow keys move between tabs.

Theming: reads `--border`.

#### TimelineEvent

One entry in an activity feed or history, with an avatar or status dot and a line to the next entry.

```tsx
<TimelineEvent
  avatar={{ src: "/avatars/01.png" }}
  title={<><strong>Alina Lorenz</strong> created a project</>}
  time="9:12"
  object={{ label: "Checkout redesign" }}
/>
<TimelineEvent avatar={{ initials: "LM", color: "blue" }} title={<><strong>Lucas Meyer</strong> commented</>} time="10:30">
  <p>Looks great. Can we ship the new cart before Friday?</p>
</TimelineEvent>
<TimelineEvent
  status={{ tone: "success", icon: <GitMerge /> }}
  title="Merged into main"
  badge="v2.4.0"
  badgeColor="green"
  meta="Sep 17, 2026 · 14:25"
  last
/>
```

```ts
function TimelineEvent({ avatar, status, title, time, object, badge, badgeColor, meta, children, last, className }: TimelineEventProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `avatar` | `{ src?: string; initials?: string; color?: AvatarColor }` | — |
| `badge` | `React.ReactNode` | — |
| `badgeColor` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey" \| "black" \| "white"` | `"grey"` |
| `children` | `React.ReactNode` | — |
| `className` | `string` | — |
| `last` | `boolean` | — |
| `meta` | `React.ReactNode` | — |
| `object` | `{ icon?: React.ReactNode; label: React.ReactNode }` | — |
| `status` | `{ tone?: "success" \| "primary" \| "warning" \| "muted"; icon?: React.ReactNode }` | — |
| `time` | `React.ReactNode` | — |

Anatomy:

- `TimelineEvent` (`data-slot="timeline-event"`): One entry of an activity feed: an avatar or a status dot on the left, a line down to the next entry, and the text on the right.
- `Avatar or status`: An Avatar from `avatar`, or a round status mark from `status` with a tone and an icon, a check by default.
- `Connector line` — optional: The line to the next entry. It turns green under a `success` status and is left out when `last` is set.
- `Title row`: The `title` with `time` or a `badge` on the right. Text in `<strong>` stands out from the rest of the sentence.
- `Object chip` — optional: A small chip under the title from `object`, naming what the event concerns, with a folder icon by default.

Best practices:

- **When:** Use a Timeline Event for one rich entry in an activity feed: who did what, to which object, with a comment or attachment below. For a simple sequence drawn from data, use a Timeline.
- **Do:** Write the title as a sentence and wrap the names in `<strong>`: `<strong>Alina Lorenz</strong> moved <strong>Q4 report</strong> to Done`.
- **Do:** Name the person in the title. The avatar image is decorative and has an empty `alt`, so the title is all screen readers get.
- **Don't:** Don't leave `last` off the final entry. Without it the connector line runs on into empty space below the feed.

Theming: reads `--border`, `--brand-quaternary`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--success`, `--success-foreground`, `--text-secondary`, `--text-tertiary`, `--radius-md`.

#### Price

A price with an optional billing period, a crossed-out old price and a savings badge.

```tsx
<Price amount="$39" period="/ seat / month" size="lg" />
<Price amount="$489" compareAt="$599" badge="Save 18%" size="md" />
<Price amount="$24.00" size="sm" />
```

```ts
function Price({ amount, period, compareAt, badge, size, className }: PriceProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `amount` * | `React.ReactNode` | — |
| `badge` | `React.ReactNode` | — |
| `className` | `string` | — |
| `compareAt` | `React.ReactNode` | — |
| `period` | `React.ReactNode` | — |
| `size` | `"sm" \| "md" \| "lg"` | `period ? "lg" : "sm"` |

Anatomy:

- `Price` (`data-slot="price"`): A price with optional billing `period`, struck-through `compareAt` and a savings `badge`.

Best practices:

- **When:** Use Price for plan prices, sale prices and product prices. Don't build price text by hand in cards.
- **Do:** Pass `period` (`/ month`) for plans. The size then defaults to `lg`; without a period it defaults to `sm`.
- **Do:** For a sale, pass `compareAt` for the old price and `badge` for the saving, such as `Save 19%`.
- **Don't:** Don't rely on the default size inside a dense list. Set `size` explicitly so a plan card and a product row stay aligned.

Theming: reads `--foreground`, `--text-tertiary`.

#### TextLinkRow

A line of text followed by a link, like “Don't have an account? Sign up”, or a back link with an arrow.

```tsx
<TextLinkRow text="Don't have an account?" link="Sign up" href="/sign-up" />
<TextLinkRow variant="small" text="Didn't get the email?" link="Resend" />
<TextLinkRow variant="icon" text="Need help?" link="Contact support" />
<TextLinkRow variant="back" text="Use a different method" href="/sign-in" />
```

```ts
function TextLinkRow({ text, link, href, onLinkClick, variant, className, }: TextLinkRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `text` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `href` | `string` | `"#"` |
| `link` | `React.ReactNode` | — |
| `onLinkClick` | `React.MouseEventHandler<HTMLAnchorElement>` | — |
| `variant` | `"inline" \| "small" \| "stacked" \| "icon" \| "back"` | `"inline"` |

Anatomy:

- `TextLinkRow` (`data-slot="text-link-row"`): A line of text with a link, such as `Already have an account? Sign in`. `variant` picks inline, small, stacked, icon or back.

Best practices:

- **When:** Use Text Link Row below auth forms to move to the other form. For a back link, use `variant="back"`.
- **Do:** Write `text` as the question and `link` as the action (`Sign up`).
- **Do:** Use `small` or `icon` for secondary help lines (`icon` adds a help icon) and `stacked` for two centred lines.
- **Don't:** Don't pass `link` with `variant="back"`. The back variant shows an arrow and `text` only.

Theming: reads `--foreground`, `--text-link`, `--text-secondary`, `--text-tertiary`.

#### SocialSignInButtons

Sign-in buttons for Google, Apple, GitHub and Microsoft, side by side or stacked.

```tsx
<SocialSignInButtons
  providers={["google", "apple", "github"]}
  layout="vertical"
  onSelect={(provider) => signIn(provider)}
/>

{/* Icon and name only */}
<SocialSignInButtons providers={["google", "github"]} prefix="" />
```

```ts
function SocialSignInButtons({ providers, layout, prefix, onSelect, className, }: SocialSignInButtonsProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `layout` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `onSelect` | `(provider: SocialProvider) => void` | — |
| `prefix` | `string` | `"Continue with"` |
| `providers` | `SocialProvider[]` | `["google", "github"]` |

Anatomy:

- `SocialSignInButtons` (`data-slot="social-sign-in"`): Provider buttons for Google, Apple, GitHub or Microsoft. `layout` sets one row or a stack; each press calls `onSelect` with the provider.

Best practices:

- **When:** Use Social Sign In Buttons above or below the email form on sign-in and sign-up. For the email submit, use a Button.
- **Do:** Pass only the `providers` you have wired. The default is Google and GitHub.
- **Do:** Keep the `prefix` the same on sign-in and sign-up (`Continue with`), or pass `""` for logo and name only.
- **Don't:** Don't turn them into the primary action. They are plain buttons, so the email submit stays the only primary one.

#### OptionRow

A selectable card with a radio button or checkbox, a title and a short description.

```tsx
const [picked, setPicked] = useState(["dashboards"])
const toggle = (id: string) =>
  setPicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))

<OptionRow
  variant="checkbox"
  value="dashboards"
  title="Dashboards"
  description="Analytics, admin panels and internal tools"
  selected={picked.includes("dashboards")}
  onSelect={() => toggle("dashboards")}
/>
```

```ts
function OptionRow({ title, description, icon, badge, badgeColor, selected, variant, value, disabled, onSelect, href, className, }: OptionRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `badge` | `React.ReactNode` | — |
| `badgeColor` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey" \| "black" \| "white"` | `"green"` |
| `className` | `string` | — |
| `description` | `React.ReactNode` | — |
| `disabled` | `boolean` | — |
| `href` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `onSelect` | `() => void` | — |
| `selected` | `boolean` | `false` |
| `value` | `string` | — |
| `variant` | `"radio" \| "checkbox" \| "link" \| "icon"` | `"radio"` |

Anatomy:

- `OptionRow` (`data-slot="option-row"`): A selectable card with a title, description and optional badge. `variant` picks `radio`, `checkbox`, `link` (chevron, no control) or `icon`.

Best practices:

- **When:** Use Option Row to choose between a few described options, such as a verification method or a role. For on-off settings, use Settings Row.
- **Do:** Wrap the `radio` and `icon` variants in Option Row Group and give each row a unique `value`.
- **Do:** Set `selected` from the group's value (`selected={value === "email"}`). It only draws the tinted frame; the selection itself lives in the group.
- **Don't:** Don't use `variant="link"` for a choice. It is a navigation row that renders a link and calls `onSelect` without storing a selection.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--primary`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--radius-md`, `--radius-xl`, `--duration-fast`, `--ease-entrance`.

#### OptionRowGroup

Wraps radio Option Rows so that exactly one of them is selected.

```tsx
const [method, setMethod] = useState("app")

<OptionRowGroup value={method} onValueChange={setMethod}>
  <OptionRow variant="icon" value="app" icon={<ShieldCheck />} title="Authenticator app"
    description="Use a code from an app like 1Password" badge="Recommended" selected={method === "app"} />
  <OptionRow variant="icon" value="sms" icon={<Smartphone />} title="Text message"
    description="We send a code to your phone" selected={method === "sms"} />
  <OptionRow variant="icon" value="key" icon={<KeyRound />} title="Security key"
    description="Use a hardware key or passkey" selected={method === "key"} />
</OptionRowGroup>
```

```ts
function OptionRowGroup({ value, onValueChange, children, className, }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `onValueChange` | `(value: string) => void` | — |
| `value` | `string` | — |

Anatomy:

- `OptionRowGroup`: The radio group around Option Rows. It keeps one row selected and stacks them with a gap.

Best practices:

- **When:** Use Option Row Group around radio-style Option Rows. For a group of plain radio buttons, use Radio Group.
- **Do:** Control it with `value` and `onValueChange`; the handler gets the `value` string of the chosen row.
- **Do:** Give every row inside a distinct `value`, and set each row's `selected` from the group value so the frames follow.
- **Don't:** Don't put `checkbox` or `link` variants inside. They have no radio control and don't take part in the group.

#### UserInfo

An avatar with a name and a second line, for account menus, sidebars and quotes.

```tsx
<UserInfo name="Sarah Lindqvist" subtext="Head of Product, WunderUI" src="/avatars/05.png" />
<UserInfo name="Alina Lorenz" subtext="Free plan" initials="AL" color="indigo" variant="sidebar" />
<UserInfo name="Lucas Meyer" subtext="lucas@initech.dev" src="/avatars/02.png" variant="menu" onMenu={openMenu} />
```

```ts
function UserInfo({ name, subtext, src, initials, color, variant, onMenu, className }: UserInfoProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `string` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative" \| "grey"` | — |
| `initials` | `string` | — |
| `onMenu` | `() => void` | — |
| `src` | `string` | — |
| `subtext` | `string` | — |
| `variant` | `"person" \| "sidebar" \| "menu"` | `"person"` |

Anatomy:

- `UserInfo` (`data-slot="user-info"`): An avatar with a name and a secondary line. `variant` picks person, sidebar or menu (adds a button).

Best practices:

- **When:** Use User Info for the signed-in account in a sidebar, a menu or an account chooser. For people in table rows, use Person Cell.
- **Do:** Pass `src` for a photo. Otherwise initials come from `name` unless `initials` is set, tinted with `color`.
- **Do:** Use `subtext` for the email or role.
- **Don't:** Don't use `variant="menu"` without `onMenu`. The button would do nothing.

Theming: reads `--foreground`, `--text-tertiary`, `--radius-xl`.

#### PasswordRequirement

One password rule in a checklist that turns green once the password meets it.

```tsx
const rules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "number", label: "At least one number", test: (p: string) => /\\d/.test(p) },
]

<ul className="flex flex-col gap-1.5">
  {rules.map((r) => (
    <PasswordRequirement key={r.id} met={r.test(password)}>
      {r.label}
    </PasswordRequirement>
  ))}
</ul>
```

```ts
function PasswordRequirement({ met, children, className }: {
    met: boolean;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `met` * | `boolean` | — |
| `className` | `string` | — |

Anatomy:

- `PasswordRequirement` (`data-slot="password-requirement"`): One rule of a password policy as a `<li>`: a green check when `met`, an empty circle otherwise.

Best practices:

- **When:** Use Password Requirement for a visible checklist of password rules below a new-password field. For a single strength rating, use Password Strength.
- **Do:** Render the items inside a `<ul>`; the component is a list item.
- **Do:** Compute `met` from the same rules your validation uses, so the checklist can't show a green check for a password that gets rejected.
- **Don't:** Don't list rules you don't enforce. Show only the rules your validation checks.

Theming: reads `--success`, `--text-secondary`, `--text-tertiary`.

#### PasswordStrength

A four-step meter with a label that shows how strong a password is.

```tsx
import { PasswordField, PasswordStrength, getPasswordStrength } from "@wunderui/react"

const [password, setPassword] = useState("")
const strength = getPasswordStrength(password) // null while empty

<PasswordField label="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
{strength && <PasswordStrength strength={strength} />}
```

```ts
function PasswordStrength({ strength, label, className, }: {
    strength: PasswordStrengthLevel;
    label?: string;
    className?: string;
}): React.JSX.Element;
type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";
```

| Prop | Type | Default |
| --- | --- | --- |
| `strength` * | `"strong" \| "weak" \| "fair" \| "good"` | — |
| `className` | `string` | — |
| `label` | `string` | — |

Anatomy:

- `PasswordStrength` (`data-slot="password-strength"`): A four-segment meter with a label. The level (`weak`, `fair`, `good`, `strong`) sets the filled segments and the colour; changes are announced politely.

Best practices:

- **When:** Use Password Strength under a new-password field for quick feedback. For rule-by-rule feedback, use Password Requirement.
- **Do:** Derive `strength` with `getPasswordStrength(password)` and render the meter only when it returns a level. It returns `null` for an empty password.
- **Do:** Pass `label` to replace the default text, for example to localise it.
- **Don't:** Don't treat the helper as your password policy. It scores length and character classes only, so enforce your real rules on the server.

Theming: reads `--border`, `--brand-quaternary`, `--brand-secondary`, `--destructive`, `--success`, `--text-error`, `--text-success`, `--text-warning`, `--tint-text-blue`.

#### OtpCodeInput

Large boxes for typing a 4- or 6-digit verification code.

```tsx
const [code, setCode] = useState("")

<OtpCodeInput length={6} value={code} onValueChange={setCode} onComplete={(value) => verify(value)} autoFocus />
```

```ts
function OtpCodeInput({ length, value, onValueChange, onComplete, invalid, disabled, autoFocus, "aria-label": ariaLabel, className, }: OtpCodeInputProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `aria-label` | `string` | — |
| `autoFocus` | `boolean` | — |
| `className` | `string` | — |
| `disabled` | `boolean` | — |
| `invalid` | `boolean` | — |
| `length` | `4 \| 6` | `6` |
| `onComplete` | `(value: string) => void` | — |
| `onValueChange` | `(value: string) => void` | — |
| `value` | `string` | — |

Anatomy:

- `OtpCodeInput` (`data-slot="otp-code-input"`): A one-time code field of four or six separate digit boxes. Each box is labelled `Digit n of N` for screen readers.

Best practices:

- **When:** Use OTP Code Input to enter a code sent by email, SMS or an authenticator app. For other short text, use Input.
- **Do:** Submit from `onComplete`. It fires once all digits are filled, so the person doesn't need a separate confirm step.
- **Do:** Set `invalid` after a wrong code, and give the group a clear `aria-label` such as `Verification code` if the default `One-time code` doesn't fit.
- **Don't:** Don't use any length but 4 or 6. `length` accepts only those two values.

Theming: reads `--border`, `--card`, `--destructive`, `--muted-foreground`, `--ring`, `--radius-xl`.

#### BackupCode

A recovery code that copies itself when clicked and is crossed out once it has been used.

```tsx
<div className="grid grid-cols-2 gap-2">
  <BackupCode code="4F7K-2M9Q" onCopy={(code) => notify(`Copied ${code}`)} />
  <BackupCode code="8XJD-P3LW" used />
</div>
```

```ts
function BackupCode({ code, used, onCopy, className }: {
    code: string;
    used?: boolean;
    onCopy?: (code: string) => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `code` * | `string` | — |
| `className` | `string` | — |
| `onCopy` | `(code: string) => void` | — |
| `used` | `boolean` | — |

Anatomy:

- `BackupCode` (`data-slot="backup-code"`): One recovery code as a button. A click copies the code to the clipboard; with `used` it is disabled and struck through.

Best practices:

- **When:** Use Backup Code to list recovery codes after two-factor setup, in a grid with one code per button. For a single long value with a copy action, such as an invite URL, use Invite Link Row.
- **Do:** Set `used` on codes that were already redeemed, so the list shows which ones are left.
- **Do:** Confirm the copy in `onCopy`, for example with a toast. It fires only after the clipboard accepted the text.
- **Don't:** Don't show your own "Copied" message on click. When the clipboard is blocked (iframe, http, permission denied), `onCopy` does not fire, and a message of your own would be wrong.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--text-tertiary`, `--radius-md`, `--duration-base`, `--duration-fast`, `--ease-entrance`.

#### InviteRow

An email field and a role picker for inviting one person, with a button to remove the row.

```tsx
const [rows, setRows] = useState([{ email: "lucas@wunderui.dev", role: "Admin" }])
const update = (i: number, patch: Partial<Row>) =>
  setRows((list) => list.map((r, j) => (j === i ? { ...r, ...patch } : r)))

{rows.map((r, i) => (
  <InviteRow
    key={i}
    email={r.email}
    role={r.role}
    roles={["Admin", "Member", "Viewer"]}
    onEmailChange={(email) => update(i, { email })}
    onRoleChange={(role) => update(i, { role })}
    onRemove={() => setRows((list) => list.filter((_, j) => j !== i))}
  />
))}
```

```ts
function InviteRow({ email, role, roles, onEmailChange, onRoleChange, onRemove, stacked, className, }: InviteRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `email` * | `string` | — |
| `role` * | `string` | — |
| `className` | `string` | — |
| `onEmailChange` | `(email: string) => void` | — |
| `onRemove` | `() => void` | — |
| `onRoleChange` | `(role: string) => void` | — |
| `roles` | `string[]` | `["Admin", "Editor", "Viewer"]` |
| `stacked` | `boolean` | — |

Anatomy:

- `InviteRow` (`data-slot="invite-row"`): One invitee: an email field, a role select and, when `onRemove` is set, a remove button. It is fully controlled.

Best practices:

- **When:** Use Invite Row for each person in a team invite list, one row per invitee. For one shareable link instead, use Invite Link Row.
- **Do:** Keep it controlled: pass `email` and `role` with `onEmailChange` and `onRoleChange`. Without the handlers the fields do not change.
- **Do:** Pass your own `roles` when the defaults (`Admin`, `Editor`, `Viewer`) don't match the product. Use `stacked` in narrow containers; otherwise the select moves next to the field from the small breakpoint.
- **Don't:** Don't pass `onRemove` to a row you must keep. The remove button only renders when the handler exists.

#### InviteLinkRow

A read-only invite link with a copy button that confirms when the link is copied.

```tsx
<InviteLinkRow link="https://wunderui.app/invite/wunderui/8f3k2m9q" onCopy={() => track("invite_link_copied")} />
```

```ts
function InviteLinkRow({ link, onCopy, className }: {
    link: string;
    onCopy?: () => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `link` * | `string` | — |
| `className` | `string` | — |
| `onCopy` | `() => void` | — |

Anatomy:

- `InviteLinkRow` (`data-slot="invite-link-row"`): A read-only field with the invite link and a button that copies it. The button reads `Copied` for a moment after a successful copy.

Best practices:

- **When:** Use Invite Link Row when people join through a shareable link. To invite by email address and role, use Invite Row.
- **Do:** Use `onCopy` for side effects such as a toast or tracking. It fires only after the clipboard accepted the link.
- **Do:** Pass the full URL in `link`; the field is read-only and truncates long values.
- **Don't:** Don't add your own copied state. The row already switches the button label and resets it, and it stays unchanged if the clipboard is blocked.

Theming: reads `--success`.

#### SettingsRow

A setting's title and description with a switch, or any other control, on the right.

```tsx
const [email, setEmail] = useState(true)

{/* checked or onCheckedChange turns the row into a switch */}
<SettingsRow title="Email notifications" description="Mentions, replies and invites" checked={email} onCheckedChange={setEmail} />

{/* any other control */}
<SettingsRow
  title="Two-factor authentication"
  description="Add a second step when you sign in"
  control={<Button variant="plain" size="sm">Set up</Button>}
/>
```

```ts
function SettingsRow({ title, description, control, checked, onCheckedChange, className }: SettingsRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `checked` | `boolean` | — |
| `className` | `string` | — |
| `control` | `React.ReactNode` | — |
| `description` | `React.ReactNode` | — |
| `onCheckedChange` | `(checked: boolean) => void` | — |

Anatomy:

- `SettingsRow` (`data-slot="settings-row"`): A setting with a title, a description and a trailing control, or a switch when `checked` or `onCheckedChange` is set.

Best practices:

- **When:** Use Settings Row for lists of preferences. For choices between described options, use Option Row.
- **Do:** Pass `checked` and `onCheckedChange` for a switch. It is labelled by the title.
- **Do:** Pass a `control` (a Button, a Badge) for settings that open something or show a state.
- **Don't:** Don't pass both a switch and `control`. When `checked` or `onCheckedChange` is set, `control` is ignored.

Theming: reads `--foreground`, `--text-secondary`.

#### InlineNote

A small line of supporting text with an icon, either neutral or as a warning.

```tsx
<InlineNote>14-day free trial of Pro included. No credit card required.</InlineNote>
<InlineNote tone="warning">Billing stops immediately. Unused credit of $184.00 is not refunded.</InlineNote>
<InlineNote icon={<Bell />}>Links expire after 15 minutes and can only be used once.</InlineNote>
```

```ts
function InlineNote({ tone, icon, children, className, }: {
    tone?: "neutral" | "warning";
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `tone` | `"neutral" \| "warning"` | `"neutral"` |

Anatomy:

- `InlineNote` (`data-slot="inline-note"`): A small hint line with an icon. `tone="neutral"` shows a shield, `tone="warning"` a triangle in the warning colour.

Best practices:

- **When:** Use Inline Note for a one-line reassurance or caution below a form or action, such as how a code is used. For a message that needs attention on its own, use Alert.
- **Do:** Use `tone="warning"` when the note states a consequence, and keep the neutral tone for reassurance.
- **Do:** Pass an `icon` only when the default does not fit; it is shown at a small fixed size.
- **Don't:** Don't use it for a field error. Put that in the `error` of the field so it is announced with the input.

Theming: reads `--text-secondary`, `--text-tertiary`, `--text-warning`.

#### AuthHeading

The title and subtitle at the top of a sign-in, sign-up or onboarding form.

```tsx
<AuthHeading title="Create your workspace" subtitle="A workspace is where your team designs and ships together." />
<AuthHeading align="center" title="You're all set, Alina!" subtitle="Your workspace is ready. Here's what you've set up." />
```

```ts
function AuthHeading({ title, subtitle, align, as: Heading, className, }: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    align?: "start" | "center";
    /** The heading element: h1 on an auth page, a lower level when the heading sits inside a larger page. Looks the same either way. */
    as?: "h1" | "h2" | "h3";
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `align` | `"start" \| "center"` | `"start"` |
| `as` | `"h1" \| "h2" \| "h3"` | `"h1"` |
| `className` | `string` | — |
| `subtitle` | `React.ReactNode` | — |

Anatomy:

- `AuthHeading` (`data-slot="auth-heading"`): The title and optional subtitle at the top of an auth form. It renders an `h1` by default; `as` changes the heading level without changing the look.

Best practices:

- **When:** Use Auth Heading at the top of sign-in, sign-up, verification and onboarding forms. For the title of an app page with actions, use Page Header.
- **Do:** Keep the default `h1` when the form is the whole page. Set `as="h2"` or `as="h3"` when the heading sits inside a larger page, so the document outline stays correct.
- **Do:** Write the title as the task (`Welcome back`) and put the reassurance or hint in `subtitle`. Use `align="center"` when the card content is centred.
- **Don't:** Don't pick `as` to change the size. The look is the same for every level, so the choice is only about structure.

Theming: reads `--foreground`, `--text-secondary`.

#### AvatarStack

Overlapping avatars with a “+N” count for everyone past the limit.

```tsx
const team = [
  { name: "Alina Lorenz", src: "/avatars/01.png" },
  { name: "Lucas Meyer", src: "/avatars/02.png" },
  { name: "Jonas Berg", initials: "JB", color: "purple" },
  // …
]

<AvatarStack people={team} size="default" max={4} />
```

```ts
function AvatarStack({ people, size, max, className }: {
    people: Person[];
    size?: "sm" | "xs" | "default";
    max?: number;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `people` * | `Person[]` | — |
| `className` | `string` | — |
| `max` | `number` | `3` |
| `size` | `"sm" \| "xs" \| "default"` | `"sm"` |

Anatomy:

- `AvatarStack` (`data-slot="avatar-stack"`): Shows the first `max` people, three by default, as overlapping avatars, with a `+N` avatar for the rest.
- `Person`: One entry of `people`: the photo from `src`, or initials from `initials` or `name`, tinted in `color`, indigo by default.
- `Count` — optional: A `+N` avatar of the same size, shown only when `people` holds more than `max`.

Best practices:

- **When:** Use an Avatar Stack for a compact row of assignees or guests passed as data, such as on a task or a schedule row. To compose avatars by hand, with a hover effect, use Avatar Group.
- **Do:** Pass the full `people` list and let `max` cut it. The `+N` count is worked out from what is left over.
- **Do:** Give every person a `name`. It is the avatar's hover title and the source of the initials when there is no `src` or `initials`.
- **Don't:** Don't place the stack on a tinted or muted background without checking it. The rings that separate the faces are drawn in the card colour, not in the colour behind.

Theming: reads `--card`, `--text-secondary`.

#### KanbanCardItem

A task card for a Kanban board, with labels, due date, comments, checklist progress and assignees.

```tsx
<KanbanCardItem
  title="Redesign the onboarding checklist"
  labels={[
    { label: "Design", color: "purple" },
    { label: "High", color: "red" },
  ]}
  due="Oct 4"
  comments={6}
  checklist={{ done: 3, total: 5 }}
  assignees={team}
  selected={selected}
  onClick={() => setSelected((s) => !s)}
/>
```

```ts
function KanbanCardItem({ title, labels, due, comments, checklist, assignees, selected, onClick, className }: KanbanCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `assignees` | `Person[]` | — |
| `checklist` | `{ done: number; total: number }` | — |
| `className` | `string` | — |
| `comments` | `number` | — |
| `due` | `React.ReactNode` | — |
| `labels` | `{ label: React.ReactNode; color?: BadgeColor }[]` | — |
| `onClick` | `() => void` | — |
| `selected` | `boolean` | — |

Anatomy:

- `KanbanCardItem` (`data-slot="kanban-card"`): A card on a board with labels, a title, due date, comment and checklist counts and assignees. With `onClick` it becomes a keyboard-operable button.
- `Avatar stack` (`data-slot="avatar-stack"`) — optional: The assignees, three faces at most, with a `+N` count for the rest.

Best practices:

- **When:** Use Kanban Card Item for work items in a board column, under a Column Header. For a record in a table on small screens, use Record Card.
- **Do:** Pass `onClick` to open the item. The card then gets `role="button"`, a tab stop and Enter and Space handling.
- **Do:** Send only the meta you have. `due`, `comments` and `checklist` each render only when set; `checklist` takes `{ done, total }`.
- **Don't:** Don't add many long labels. Each label is a pill that wraps onto further lines and pushes the title down.

Theming: reads `--border`, `--card`, `--foreground`, `--primary`, `--text-secondary`, `--text-tertiary`, `--radius-xl`, `--shadow-md`, `--duration-fast`, `--ease-entrance`.

#### ColumnHeader

The top of a Kanban column, with a colored dot, a card count and buttons to add a card or open a menu.

```tsx
<ColumnHeader title="In progress" count={4} dotClassName="bg-primary" onAdd={addCard} onMenu={openMenu} />

{/* With a work-in-progress limit */}
<ColumnHeader title="Review" count="3 / 3" dotClassName="bg-brand-quaternary" />
```

```ts
function ColumnHeader({ title, count, dotClassName, onAdd, onMenu, className }: ColumnHeaderProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `count` | `React.ReactNode` | — |
| `dotClassName` | `string` | `"bg-muted-foreground"` |
| `onAdd` | `() => void` | — |
| `onMenu` | `() => void` | — |

Anatomy:

- `ColumnHeader` (`data-slot="column-header"`): The header of a board column: a coloured dot, the title, a count and optional add and menu buttons.

Best practices:

- **When:** Use Column Header above the cards of a Kanban column. For the title row of a page or section, use Page Header.
- **Do:** Pass `onAdd` and `onMenu` only when the column supports them. The `Add card` and `Column menu` buttons render only when the handlers exist.
- **Do:** Use `count` for the number of cards, or text like `3 / 3` when the column has a work-in-progress limit. Colour the dot with a background token class in `dotClassName`, for example `bg-success`.
- **Don't:** Don't use a hex colour for the dot. `dotClassName` takes a class, and tokens keep the dot right in light and dark.

Theming: reads `--foreground`, `--muted-foreground`.

#### EventChip

A small colored event label that fits in a calendar day cell.

```tsx
<EventChip color="indigo" onClick={() => open("standup")}>Standup</EventChip>
<EventChip color="purple">Design review</EventChip>

{/* As a popover trigger */}
<PopoverTrigger render={<EventChip color="green" />}>Lunch with Mira</PopoverTrigger>
```

```ts
function EventChip({ color, children, className, ...props }: React.ComponentProps<"button"> & {
    color?: EventColor;
}): React.JSX.Element;
type EventColor = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green";
```

| Prop | Type | Default |
| --- | --- | --- |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green"` | `"indigo"` |

Also accepts the React.ButtonHTMLAttributes attributes (289).

Anatomy:

- `EventChip` (`data-slot="event-chip"`): A one-line, colour-coded event label for a calendar cell. It is a `<button>` that forwards its props and truncates long titles.

Best practices:

- **When:** Use Event Chip inside calendar day cells, where space is tight. For a time-based list of events, use Agenda Event.
- **Do:** Give the chip an `onClick`, or render it as the trigger of a popover or menu. It forwards button props, so you don't need a second interactive element around it.
- **Do:** Choose `color` by meaning, such as one colour per calendar, and keep it consistent across the month. There are eight colours.
- **Don't:** Don't put more than a short title in `children`. The text sits on one line and is cut off with an ellipsis.

Theming: reads `--brand-quaternary`, `--brand-secondary`, `--brand-septenary`, `--brand-tertiary`, `--chart-3`, `--destructive`, `--primary`, `--ring`, `--success`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-sm`.

#### AgendaEvent

One event in an agenda list, with its start and end time, a color bar, details and guests.

```tsx
<AgendaEvent
  start="9:00"
  end="9:15"
  title="Daily standup"
  meta="Zoom"
  color="indigo"
  guests={team}
  onClick={() => openEvent("standup")}
  onMenu={openMenu}
/>
```

```ts
function AgendaEvent({ start, end, title, meta, color, guests, onMenu, onClick, className }: AgendaEventProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `start` * | `React.ReactNode` | — |
| `title` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `color` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green"` | `"purple"` |
| `end` | `React.ReactNode` | — |
| `guests` | `Person[]` | — |
| `meta` | `React.ReactNode` | — |
| `onClick` | `() => void` | — |
| `onMenu` | `() => void` | — |

Anatomy:

- `AgendaEvent` (`data-slot="agenda-event"`): One row of a schedule with a line below it. With `onClick`, the title becomes a `<button>` stretched over the whole row.
- `Time`: The `start` time above an optional `end` time, in a narrow fixed column.
- `Colour bar` — optional: A short bar in the event `color`, one of eight hues, `purple` by default.
- `Title`: The `title` on one truncated line, with `meta` below it in smaller text, such as the room or the call link.
- `Guests` (`data-slot="avatar-stack"`) — optional: The `guests` as overlapping avatars: the first three, then a `+N` count for the rest.
- `Menu button` — optional: A small ghost icon button named `Event menu`, shown when `onMenu` is set. It sits above the stretched title, so its click does not open the event.

Best practices:

- **When:** Use an Agenda Event for a schedule row with guests, a menu or a detail view to open. For a plain read-only list of times and titles, use Agenda.
- **Do:** Pass `onClick` instead of wrapping the row in a link or button. The title turns into a real button over the whole row, and the menu button stays reachable on its own.
- **Do:** Keep `title` short and put the place or the call details in `meta`. Both lines are cut to one line with an ellipsis.
- **Do:** Give every guest a `name`. It becomes the avatar's hover title and the source of the initials when there is no `src`.
- **Don't:** Don't let the colour bar carry the meaning alone. The bar has no text, so name the kind of event in `title` or `meta` as well.

Theming: reads `--border`, `--brand-quaternary`, `--brand-secondary`, `--brand-septenary`, `--brand-tertiary`, `--card`, `--chart-3`, `--destructive`, `--foreground`, `--muted`, `--primary`, `--ring`, `--success`, `--text-secondary`, `--text-tertiary`.

#### ConversationItem

One conversation in an inbox list, with sender, subject, preview, tags and an unread state.

```tsx
<ConversationItem
  person={{ name: "Sarah Lindqvist", src: "/avatars/05.png" }}
  time="10:42"
  subject="Q3 roadmap review"
  preview="I left a few notes on the launch dates, can you take a look before Thursday?"
  tags={[{ label: "Urgent", color: "red" }]}
  unread
  active={selectedId === 1}
  onClick={() => select(1)}
/>
```

```ts
function ConversationItem({ person, time, subject, preview, tags, unread, active, onClick, className }: ConversationItemProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `person` * | `Person` | — |
| `preview` * | `React.ReactNode` | — |
| `subject` * | `React.ReactNode` | — |
| `time` * | `React.ReactNode` | — |
| `active` | `boolean` | — |
| `className` | `string` | — |
| `onClick` | `() => void` | — |
| `tags` | `{ label: React.ReactNode; color?: BadgeColor }[]` | — |
| `unread` | `boolean` | — |

Anatomy:

- `ConversationItem` (`data-slot="conversation-item"`): One thread in an inbox list: sender avatar, name, time, subject, a one-line preview and optional tags.

Best practices:

- **When:** Use Conversation Item for the thread list of an inbox or support view. For a multi-column list, use Table.
- **Do:** Set `unread` for new threads: the row gets a tint, a dot next to the time and a bold subject.
- **Do:** Set `active` on the thread that is open in the reading pane. It sets `aria-current` and a muted background.
- **Don't:** Don't count on `active` to change the background of an unread thread. The muted background applies only to read threads, so mark a thread read once it opens.

Theming: reads `--border`, `--foreground`, `--muted`, `--primary`, `--text-secondary`, `--text-tertiary`, `--tint-indigo`, `--tint-text-indigo`, `--duration-fast`, `--ease-entrance`.

#### PersonCell

An avatar with a name and role for tables and lists, with an optional capacity bar.

```tsx
<PersonCell person={{ name: "Sarah Lindqvist", src: "/avatars/05.png" }} role="sarah@wunderui.dev" />
<PersonCell person={{ name: "Jonas Berg", color: "purple" }} role="Product designer" capacity={{ value: 80, label: "32h" }} />
```

```ts
function PersonCell({ person, role, capacity, className }: PersonCellProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `person` * | `Person` | — |
| `capacity` | `{ value: number; label?: React.ReactNode }` | — |
| `className` | `string` | — |
| `role` | `React.ReactNode` | — |

Anatomy:

- `PersonCell` (`data-slot="person-cell"`): An avatar with a name, an optional role line and, with `capacity`, a workload bar and label.

Best practices:

- **When:** Use Person Cell in tables, leaderboards and team lists where a row needs a person. For an account block in a sidebar or menu, use User Info.
- **Do:** Pass `capacity` as `{ value, label }` with a unit in the label, such as `32h`. The bar is clamped to 0 to 100.
- **Do:** Pass `src` in the person for a photo; otherwise initials are derived from the name and tinted with `color`.
- **Don't:** Don't add a long `role`. The name and role truncate on one line each.

Theming: reads `--foreground`, `--muted`, `--success`, `--text-tertiary`.

#### TaskRow

A row in a Gantt task list: either a task with its color, assignee and dates, or a group header that folds open and closed.

```tsx
const [open, setOpen] = useState(true)

<TaskRow group name="Checkout redesign" open={open} onToggle={() => setOpen((o) => !o)} />
{open && (
  <>
    <TaskRow name="Research and interviews" barClassName="bg-success" assignee={ada} dates="Sep 1 – Sep 12" />
    <TaskRow name="Wireframes" barClassName="bg-primary" assignee={sarah} dates="Sep 15 – Sep 26" />
  </>
)}
```

```ts
function TaskRow({ name, group, open, onToggle, barClassName, assignee, dates, className }: TaskRowProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `assignee` | `Person` | — |
| `barClassName` | `string` | `"bg-primary"` |
| `className` | `string` | — |
| `dates` | `React.ReactNode` | — |
| `group` | `boolean` | — |
| `onToggle` | `() => void` | — |
| `open` | `boolean` | `true` |

Anatomy:

- `TaskRow` (`data-slot="task-row"`): One line of a Gantt task list: a status bar, name, assignee and dates, or with `group` a collapsible group header.

Best practices:

- **When:** Use Task Row in the left list of a timeline or Gantt view. For a step in an onboarding checklist, use Checklist Task.
- **Do:** Use `group` rows with `open` and `onToggle` for collapsible sections. They set `aria-expanded`.
- **Do:** Set `barClassName` to a background token class such as `bg-success` to show the status.
- **Don't:** Don't pass `assignee` or `dates` to a group row. It shows only the title.

Theming: reads `--border`, `--foreground`, `--primary`, `--text-tertiary`, `--control-md`.

#### RecordCard

A card that stands in for a table row on small screens: who it is, a status and a few key fields.

```tsx
<RecordCard
  person={{ name: "Sarah Lindqvist", src: "/avatars/05.png" }}
  title="Sarah Lindqvist"
  subtitle="sarah@wunderui.dev"
  badge={{ label: "Active", color: "green" }}
  fields={[
    { label: "Plan", value: "Pro" },
    { label: "Seats", value: "12" },
    { label: "MRR", value: "$468" },
  ]}
  onClick={() => openCustomer("sarah")}
/>
```

```ts
function RecordCard({ person, title, subtitle, badge, fields, onClick, className }: RecordCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` * | `React.ReactNode` | — |
| `badge` | `{ label: React.ReactNode; color?: BadgeColor }` | — |
| `className` | `string` | — |
| `fields` | `{ label: React.ReactNode; value: React.ReactNode }[]` | — |
| `onClick` | `() => void` | — |
| `person` | `Person` | — |
| `subtitle` | `React.ReactNode` | — |

Anatomy:

- `RecordCard` (`data-slot="record-card"`): A card that stands in for a table row on small screens: person, title, subtitle, status badge and a grid of labelled fields.

Best practices:

- **When:** Use Record Card as the mobile version of a Table or Data Table row. On wide screens keep the table.
- **Do:** Pass up to three `fields`. They fill a grid of three columns and the values truncate.
- **Do:** Pass `onClick` for the row action. The title becomes a button stretched over the card.
- **Don't:** Don't pass long field values. Each sits in a third of the card width and is cut off on one line.

Theming: reads `--border`, `--card`, `--foreground`, `--muted`, `--ring`, `--text-tertiary`, `--radius-xl`.

#### Stars

A small, read-only row of stars that shows a rating.

```tsx
<Stars value={4.8} />
<Stars value={7} max={10} />
```

```ts
function Stars({ value, max, className }: {
    value: number;
    max?: number;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `value` * | `number` | — |
| `className` | `string` | — |
| `max` | `number` | `5` |

Anatomy:

- `Stars` (`data-slot="stars"`): A read-only row of stars. It is an image with the label `n of N stars`.

Best practices:

- **When:** Use Stars to show a rating. To let people give a rating, use Rating.
- **Do:** Show the number next to the stars (`4.6`) and the count of reviews where it matters.
- **Do:** Pass `max` for scales other than five.
- **Don't:** Don't expect partial stars. `value` is rounded to whole stars, so `4.5` fills five.

Theming: reads `--border`, `--brand-quaternary`.

#### ProductImage

A product photo, or a colored placeholder with an icon when there is no photo yet.

```tsx
{/* Placeholder until there is a photo */}
<ProductImage tint="yellow" className="size-24 rounded-xl" />
<ProductImage tint="green" icon={<Send className="size-6" />} className="size-24 rounded-xl" />

{/* With a photo */}
<ProductImage src={product.photo} alt={product.name} className="aspect-[3/2] w-full rounded-xl" />
```

```ts
function ProductImage({ src, alt, tint, icon, className }: {
    src?: string;
    alt?: string;
    tint?: Tint;
    icon?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
type Tint = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative";
```

| Prop | Type | Default |
| --- | --- | --- |
| `alt` | `string` | `""` |
| `className` | `string` | — |
| `icon` | `React.ReactNode` | — |
| `src` | `string` | — |
| `tint` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"yellow"` |

Anatomy:

- `ProductImage` (`data-slot="product-image"`): A product picture that fills its box. With no `src` it falls back to a tinted tile with an icon.

Best practices:

- **When:** Use Product Image for thumbnails and photos in commerce parts. For a person, use Avatar.
- **Do:** Set the size with `className` (`size-12 rounded-md`). The component has no size of its own.
- **Do:** Pass a descriptive `alt` when the image carries information. The default is an empty `alt`, which marks it as decorative.
- **Don't:** Don't rely on the fallback as final content. The `icon` and `tint` only hold the place until an image exists.

Theming: reads `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`.

#### ProductCard

A shop tile with image, name, price and rating, plus optional wishlist and add-to-cart buttons.

```tsx
<ProductCard
  name="Standing desk Pro"
  price="$489"
  compareAt="$599"
  rating={4.8}
  reviews={312}
  badge={{ label: "Sale" }}
  tint="indigo"
  wishlisted={wishlisted}
  onWishlist={() => setWishlisted((w) => !w)}
  onAddToCart={() => cart.add("desk-pro")}
/>

<ProductCard name="Ergonomic chair" price="$329" availability="In stock" tint="green" onAddToCart={() => cart.add("chair")} />
```

```ts
function ProductCard({ name, price, compareAt, rating, reviews, availability, badge, image, tint, wishlisted, onWishlist, onAddToCart, addToCartLabel, onClick, className }: ProductCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `price` * | `React.ReactNode` | — |
| `addToCartLabel` | `React.ReactNode` | `"Add to cart"` |
| `availability` | `React.ReactNode` | — |
| `badge` | `{ label: React.ReactNode; color?: BadgeColor }` | — |
| `className` | `string` | — |
| `compareAt` | `React.ReactNode` | — |
| `image` | `string` | — |
| `onAddToCart` | `() => void` | — |
| `onClick` | `() => void` | — |
| `onWishlist` | `() => void` | — |
| `rating` | `number` | — |
| `reviews` | `number` | — |
| `tint` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"indigo"` |
| `wishlisted` | `boolean` | — |

Anatomy:

- `ProductCard` (`data-slot="product-card"`): A shop tile with image, badge, wishlist toggle, name, price, rating or availability and an add-to-cart button. Only the name and price are required.
- `Product image` (`data-slot="product-image"`) — optional: The image area. It shows `image`, or a tinted tile when none is given.

Best practices:

- **When:** Use Product Card in product grids, wishlists and recommendations. For a compact row with quick add, use Product Mini Card.
- **Do:** Pass `onClick` to make the image open the product and `onWishlist` with `wishlisted` for the heart toggle (`aria-pressed`).
- **Do:** Use `availability` (`In stock`) in wishlists. It replaces the rating line, so pass either one.
- **Don't:** Don't pass a non-text `name` together with `onClick`. The image button takes its label from `name` only when it is a string, otherwise it reads `Open product`.

Theming: reads `--destructive`, `--foreground`, `--inverse`, `--text-inverse`, `--text-success`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-xl`.

#### LineItem

One product line in a cart or order summary, with image, variant, quantity and price.

```tsx
<LineItem name="Standing desk Pro" variant="Oak · 160 × 80 cm" price="$489.00" tint="indigo" />
<LineItem name="Monitor arm" variant="Black" quantity={2} price="$258.00" tint="blue" />

{/* Tighter, for an order summary */}
<LineItem size="compact" name="Cable tray" variant="White" price="$39.00" />
```

```ts
function LineItem({ name, variant, price, quantity, image, tint, size, trailing, className }: LineItemProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `price` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `image` | `string` | — |
| `quantity` | `number` | — |
| `size` | `"compact" \| "regular"` | `"regular"` |
| `tint` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"yellow"` |
| `trailing` | `React.ReactNode` | — |
| `variant` | `React.ReactNode` | — |

Anatomy:

- `LineItem` (`data-slot="line-item"`): One line of a cart, order or invoice: a thumbnail, name, optional variant, a `× n` quantity and the price.
- `Product image` (`data-slot="product-image"`) — optional: The thumbnail. It shows `image`, or a tinted tile with an icon when there is none.

Best practices:

- **When:** Use Line Item for the lines of a cart, checkout summary, order confirmation or invoice. For a product to browse, use Product Card.
- **Do:** Pass `price` already formatted with currency. The row doesn't format numbers.
- **Do:** Use `size="compact"` inside summary panels that bring their own padding; `regular` pads the row itself. Put a stepper or remove button in `trailing`.
- **Don't:** Don't pass `quantity={1}` expecting `× 1`. The quantity is shown only above one.

Theming: reads `--foreground`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-md`.

#### ProductMiniCard

A compact product row with a quick add button, for recommendations next to a cart.

```tsx
<ProductMiniCard name="Cable tray" price="$39" tint="yellow" onAdd={() => cart.add("cable-tray")} />
<ProductMiniCard name="Monitor arm" price="$129" tint="blue" onAdd={() => cart.add("monitor-arm")} />
```

```ts
function ProductMiniCard({ name, price, image, tint, onAdd, onClick, className }: {
    name: React.ReactNode;
    price: React.ReactNode;
    image?: string;
    tint?: Tint;
    onAdd?: () => void;
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
type Tint = "indigo" | "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "alternative";
```

| Prop | Type | Default |
| --- | --- | --- |
| `name` * | `React.ReactNode` | — |
| `price` * | `React.ReactNode` | — |
| `className` | `string` | — |
| `image` | `string` | — |
| `onAdd` | `() => void` | — |
| `onClick` | `() => void` | — |
| `tint` | `"indigo" \| "blue" \| "purple" \| "pink" \| "red" \| "orange" \| "yellow" \| "green" \| "alternative"` | `"yellow"` |

Anatomy:

- `ProductMiniCard` (`data-slot="product-mini-card"`): A compact bordered row with a thumbnail, name, price and an optional round add button.
- `Product image` (`data-slot="product-image"`) — optional: The thumbnail. It shows `image`, or a tinted tile when none is given.

Best practices:

- **When:** Use Product Mini Card for recommendations beside a cart or product page. For a full grid tile, use Product Card.
- **Do:** Pass `onAdd` for the quick add. It renders an icon button labelled `Add to cart`.
- **Do:** Pass `onClick` to open the product. It is attached to the name and price, not to the thumbnail.
- **Don't:** Don't use it for items already in the cart. Use Line Item there.

Theming: reads `--border`, `--card`, `--foreground`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-xl`.

#### CheckoutSteps

The numbered steps of a checkout, where finished steps can be clicked to go back.

```tsx
const [step, setStep] = useState(1)

<CheckoutSteps steps={["Information", "Shipping", "Payment", "Review"]} current={step} onStepClick={setStep} />
```

```ts
function CheckoutSteps({ steps, current, onStepClick, className }: {
    steps: string[];
    current: number;
    onStepClick?: (index: number) => void;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `current` * | `number` | — |
| `steps` * | `string[]` | — |
| `className` | `string` | — |
| `onStepClick` | `(index: number) => void` | — |

Anatomy:

- `CheckoutSteps` (`data-slot="checkout-steps"`): The numbered step trail of a checkout, for example Information, Shipping, Payment, Review. The current step carries `aria-current="step"`.

Best practices:

- **When:** Use Checkout Steps to show where the buyer is in a fixed, linear flow such as checkout or order tracking. To switch between sibling views, use Tab Bar.
- **Do:** Pass `onStepClick` so finished steps can be revisited. Without it every step is disabled.
- **Do:** Keep step names to one word each (`steps` is a list of strings), so the trail stays short on small screens.
- **Don't:** Don't expect to jump ahead. Upcoming steps are always disabled; the buyer reaches them through the form's own continue button.

Theming: reads `--border`, `--foreground`, `--inverse`, `--text-inverse`, `--text-tertiary`.

#### HistogramBar

One row of a rating breakdown: the star level, a filled bar and its share.

```tsx
<HistogramBar label={5} value={78} />
<HistogramBar label={4} value={14} />
<HistogramBar label={3} value={5} count="16" />
```

```ts
function HistogramBar({ label, value, count, className }: {
    label: React.ReactNode;
    value: number;
    count?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `React.ReactNode` | — |
| `value` * | `number` | — |
| `className` | `string` | — |
| `count` | `React.ReactNode` | — |

Anatomy:

- `HistogramBar` (`data-slot="histogram-bar"`): One row of a rating distribution: a star label, a filled track and a count or percentage.

Best practices:

- **When:** Use Histogram Bar for the star breakdown next to a rating summary. For a single progress value, use Progress.
- **Do:** Pass `value` as a percentage from 0 to 100. Values outside the range are clamped.
- **Do:** Stack one bar per rating, from 5 to 1, with `label` as the number. Pass `count` for the absolute number; without it the row shows the rounded percentage.
- **Don't:** Don't pass a fraction such as `0.8`. It draws a bar of under one percent.

Theming: reads `--brand-quaternary`, `--foreground`, `--muted`, `--text-secondary`, `--tint-text-yellow`.

#### ReviewCard

A customer review with author, rating, text, photos, a reply from the store and a helpful button.

```tsx
<ReviewCard
  author={{ name: "Mira K.", color: "green" }}
  verified
  rating={5}
  date="Sep 12, 2026"
  title="Rock solid at standing height"
  reply={{ from: "WunderUI Store", date: "Sep 13", text: "Thanks, Mira! Glad the desk fits your setup." }}
  helpfulCount={24}
  helpful={helpful}
  onHelpful={() => setHelpful((h) => !h)}
  onReport={report}
>
  No wobble at all, even fully raised. Setup took about 30 minutes and the motor is quiet.
</ReviewCard>
```

```ts
function ReviewCard({ author, verified, rating, date, title, children, photos, reply, helpfulCount, helpful, onHelpful, onReport, onMenu, flagged, className }: ReviewCardProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `author` * | `Person` | — |
| `children` * | `React.ReactNode` | — |
| `date` * | `React.ReactNode` | — |
| `rating` * | `number` | — |
| `className` | `string` | — |
| `flagged` | `React.ReactNode` | — |
| `helpful` | `boolean` | — |
| `helpfulCount` | `number` | — |
| `onHelpful` | `() => void` | — |
| `onMenu` | `() => void` | — |
| `onReport` | `() => void` | — |
| `photos` | `string[]` | — |
| `reply` | `{ from: React.ReactNode; date?: React.ReactNode; text: React.ReactNode; logo?: React.ReactNode }` | — |
| `title` | `React.ReactNode` | — |
| `verified` | `boolean` | — |

Anatomy:

- `ReviewCard` (`data-slot="review-card"`): A customer review with author, stars, date, optional title, text, photos, shop reply and helpful and report actions.
- `Product image` (`data-slot="product-image"`) — optional: The thumbnails of the attached `photos`.

Best practices:

- **When:** Use Review Card in review lists on product pages. For the star breakdown above the list, use Histogram Bar.
- **Do:** Set `verified` only for confirmed purchases; it adds a `Verified purchase` badge.
- **Do:** Pass `onHelpful` with `helpful` to toggle the button (`aria-pressed`) and `helpfulCount` for the count text.
- **Don't:** Don't put block elements in `children`. The text is wrapped in a `<p>`, so pass plain text or inline markup.

Theming: reads `--background`, `--border`, `--brand-quaternary`, `--card`, `--foreground`, `--primary`, `--text-link`, `--text-secondary`, `--text-tertiary`, `--tint-alternative`, `--tint-blue`, `--tint-green`, `--tint-indigo`, `--tint-orange`, `--tint-pink`, `--tint-purple`, `--tint-red`, `--tint-text-alternative`, `--tint-text-blue`, `--tint-text-green`, `--tint-text-indigo`, `--tint-text-orange`, `--tint-text-pink`, `--tint-text-purple`, `--tint-text-red`, `--tint-text-yellow`, `--tint-yellow`, `--radius-md`, `--radius-xl`.

#### PaymentMethods

A row of small labels for the payment methods a shop accepts.

```tsx
<PaymentMethods methods={["VISA", "MC", "AMEX", "PayPal", "Apple Pay"]} className="justify-center" />
```

```ts
function PaymentMethods({ methods, className }: {
    methods?: string[];
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `className` | `string` | — |
| `methods` | `string[]` | `["VISA", "MC", "AMEX", "PayPal", "Apple Pay", "Klarna"]` |

Anatomy:

- `PaymentMethods` (`data-slot="payment-methods"`): A wrapping row of small text chips for the accepted payment methods. The chips show names, not brand logos.

Best practices:

- **When:** Use Payment Methods in a cart or checkout footer to show which methods are accepted. It is a display only.
- **Do:** Pass only the methods you accept in `methods`. The default list is `VISA`, `MC`, `AMEX`, `PayPal`, `Apple Pay` and `Klarna`.
- **Do:** Keep names short, as in the defaults; each chip is a small box with a minimum width.
- **Don't:** Don't expect logos or an interactive choice. The chips are plain text and not selectable.

Theming: reads `--border`, `--card`, `--text-secondary`, `--radius-sm`.

#### TextField

A text input with a label, helper or error text, and optional icons or add-ons on either side.

```tsx
<TextField
  label="Work email"
  type="email"
  placeholder="name@example.com"
  leading={<Mail className="size-4" />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  helper="We'll send a sign-in link to this address."
  error={valid ? undefined : "Enter a full email address, like alina@wunderui.dev."}
/>
<TextField label="Company" optional placeholder="WunderUI" leading={<Building2 className="size-4" />} />
```

```ts
function TextField({ label, labelTrailing, optional, helper, error, leading, trailing, size, id: idProp, className, wrapperClassName, ...props }: TextFieldProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `error` | `React.ReactNode` | — |
| `helper` | `React.ReactNode` | — |
| `label` | `React.ReactNode` | — |
| `labelTrailing` | `React.ReactNode` | — |
| `leading` | `React.ReactNode` | — |
| `optional` | `boolean` | — |
| `size` | `React.ComponentProps<typeof Input>["size"]` | — |
| `trailing` | `React.ReactNode` | — |
| `wrapperClassName` | `string` | — |

Also accepts the React.InputHTMLAttributes attributes (309).

Anatomy:

- `TextField` (`data-slot="text-field"`): An Input with a label, optional tag, helper or error text and optional leading and trailing add-ons. It wires `id`, `aria-invalid` and `aria-describedby` for you.

Best practices:

- **When:** Use Text Field for labelled fields in forms. For a bare input in a toolbar or table, use Input.
- **Do:** Pass `error` with a message that says what to do. It replaces `helper` and sets `aria-invalid`.
- **Do:** Use `optional` to mark optional fields and `labelTrailing` for a link such as `Forgot password?`.
- **Don't:** Don't replace `label` with a placeholder. The label stays visible while typing.

Theming: reads `--destructive`, `--foreground`, `--text-error`, `--text-tertiary`, `--field-lg`, `--field-sm`.

#### PasswordField

A password input with a button to show or hide what was typed.

```tsx
<PasswordField
  label="Password"
  placeholder="Enter your password"
  labelTrailing={<a href="/reset" data-hit className="text-xs font-medium text-text-link hover:underline">Forgot password?</a>}
/>
```

```ts
function PasswordField({ trailing, ...props }: TextFieldProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `error` | `React.ReactNode` | — |
| `helper` | `React.ReactNode` | — |
| `label` | `React.ReactNode` | — |
| `labelTrailing` | `React.ReactNode` | — |
| `leading` | `React.ReactNode` | — |
| `optional` | `boolean` | — |
| `size` | `React.ComponentProps<typeof Input>["size"]` | — |
| `trailing` | `React.ReactNode` | — |
| `wrapperClassName` | `string` | — |

Also accepts the React.InputHTMLAttributes attributes (309).

Anatomy:

- `PasswordField`: A text field with a show-and-hide toggle for the password. The toggle button has `aria-pressed` and a label that follows its state.
- `Text field` (`data-slot="text-field"`): The labelled field underneath. It supplies `label`, `helper`, `error` and the `size` options.

Best practices:

- **When:** Use Password Field for every password input. For other text with a label and hint, use Text Field.
- **Do:** Set `autoComplete="new-password"` on sign-up and password-change forms. The default is `current-password`, which suits sign-in.
- **Do:** Pass `labelTrailing` with a `Forgot password?` link on sign-in, and show what is wrong in `error`.
- **Don't:** Don't pass `type`. Props are applied after the field's own type, so it would override the show-and-hide toggle.

Theming: reads `--destructive`, `--foreground`, `--ring`, `--text-error`, `--text-tertiary`, `--radius-sm`, `--field-lg`, `--field-sm`.

#### TextareaField

A multi-line text input with a label and helper or error text.

```tsx
const [text, setText] = useState("")

<TextareaField
  label="Message"
  optional
  placeholder="Tell us what you're working on"
  maxLength={280}
  value={text}
  onChange={(e) => setText(e.target.value)}
  helper={`${text.length} / 280 characters`}
/>
```

```ts
function TextareaField({ label, helper, error, optional, id: idProp, wrapperClassName, ...props }: TextareaFieldProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `error` | `React.ReactNode` | — |
| `helper` | `React.ReactNode` | — |
| `label` | `React.ReactNode` | — |
| `optional` | `boolean` | — |
| `showCount` | `boolean` | — |
| `size` | `"sm" \| "default" \| "lg"` | — |
| `wrapperClassName` | `string` | — |

Also accepts the React.TextareaHTMLAttributes attributes (294).

Anatomy:

- `TextareaField` (`data-slot="textarea-field"`): A Textarea with its label, helper text and error wired together. It accepts every Textarea prop, such as `size`, `maxLength` and `showCount`.
- `Label` — optional: The `label` text linked to the textarea with an auto-generated `id`. `optional` adds a muted `(optional)` after it.
- `Helper and error` — optional: One line under the box. An `error` replaces `helper`, turns the box invalid and is linked with `aria-describedby`.

Best practices:

- **When:** Use TextareaField for a multi-line answer with a label in a form: a message, a bio. For a single line, use a Field with Input; for formatting, use RichTextEditor.
- **Do:** Set `showCount` together with `maxLength` to show `n/max`. The counter needs both.
- **Do:** Write `error` as an instruction, for example `Add at least 20 characters so we can help.`, and keep `helper` for the rule.
- **Don't:** Don't pass both expecting two lines. `error` replaces `helper` while it is set.

Theming: reads `--foreground`, `--text-error`, `--text-tertiary`.

#### CheckboxField

A checkbox with a clickable label and an optional description below it.

```tsx
<CheckboxField
  checked={terms}
  onCheckedChange={(v) => setTerms(!!v)}
  label={<>I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a></>}
/>
<CheckboxField
  checked={news}
  onCheckedChange={(v) => setNews(!!v)}
  label="Product updates"
  description="One email a month about new components and blocks."
/>
```

```ts
function CheckboxField({ label, description, id: idProp, wrapperClassName, className, ...props }: CheckboxFieldProps): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `label` * | `React.ReactNode` | — |
| `checked` | `boolean` | `undefined` |
| `className` | `string \| ((state: State) => string \| undefined)` | — |
| `defaultChecked` | `boolean` | `false` |
| `description` | `React.ReactNode` | — |
| `disabled` | `boolean` | `false` |
| `form` | `string` | — |
| `id` | `string` | — |
| `indeterminate` | `boolean` | `false` |
| `inputRef` | `React.Ref<HTMLInputElement>` | — |
| `name` | `string` | `undefined` |
| `nativeButton` | `boolean` | `false` |
| `onCheckedChange` | `((checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void)` | — |
| `parent` | `boolean` | `false` |
| `readOnly` | `boolean` | `false` |
| `render` | `React.ReactElement \| ComponentRenderFn<RenderFunctionProps, State>` | — |
| `required` | `boolean` | `false` |
| `style` | `React.CSSProperties \| ((state: State) => React.CSSProperties \| undefined)` | — |
| `uncheckedValue` | `string` | — |
| `value` | `string` | — |
| `wrapperClassName` | `string` | — |

Also accepts the React.HTMLAttributes attributes (273).

Anatomy:

- `CheckboxField` (`data-slot="checkbox-field"`): A Checkbox with its label and an optional description in one clickable row. Anything in the row toggles the box.
- `Label`: The text next to the box. Links inside it are styled as links, so consent text such as `I agree to the Terms` works.
- `Description` — optional: A second line in smaller text under the label. Use it for a consequence or a rule, not for the label itself.

Best practices:

- **When:** Use CheckboxField for one yes/no in a form: consent, a newsletter, a remember-me. For a group of related boxes, use a Fieldset; for a setting that takes effect at once, use a Switch.
- **Do:** Write the label as the statement that is true when the box is checked: `Send me product updates`. Put the detail, such as how often, in `description`.
- **Do:** Pass `checked` with `onCheckedChange` or `defaultChecked`; all props of Checkbox work here as well.
- **Don't:** Don't wrap it in another `<label>`. The row already is one and links the text to the box with an auto-generated `id`.

Theming: reads `--text-link`, `--text-secondary`, `--text-tertiary`.

#### FormActions

The row of buttons at the end of a form, aligned right, left or spread to both edges.

```tsx
<FormActions>
  <Button variant="plain" size="sm">Cancel</Button>
  <Button variant="primary" size="sm" type="submit">Save changes</Button>
</FormActions>

<FormActions align="between">
  <Button variant="ghost" size="sm">Delete workspace</Button>
  <Button variant="primary" size="sm">Save</Button>
</FormActions>
```

```ts
function FormActions({ children, align, className }: {
    children: React.ReactNode;
    align?: "start" | "end" | "between";
    className?: string;
}): React.JSX.Element;
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` * | `React.ReactNode` | — |
| `align` | `"start" \| "end" \| "between"` | `"end"` |
| `className` | `string` | — |

Anatomy:

- `FormActions` (`data-slot="form-actions"`): The button row at the end of a form. It wraps on narrow screens and aligns its children to `start`, `end` (default) or `between`.

Best practices:

- **When:** Use FormActions at the bottom of a Form or dialog body to hold its buttons. For a bar that sticks to a selection, use an action bar instead.
- **Do:** Put the cancel action first and the primary one last, so the primary button sits at the right edge with the default `align="end"`.
- **Do:** Name the buttons for their effect: `Save changes` and `Cancel`, not `Submit` and `OK`.
- **Do:** Use `align="between"` when one action sits on its own, such as `Delete project` on the left and `Save changes` on the right.
- **Don't:** Don't show more than one primary button. A row has one filled button; the others are plain.

## Templates

Full pages assembled only from WunderUI components:

- **SaaS Dashboard** — A whole SaaS app on the Analytics Dashboard app shell: 18 analytics dashboards, sales, files, team, billing, notifications, search, onboarding and upgrade prompts, with a live demo. (Sidebar, SidebarGroup, AreaChart, Table, Dialog, CommandItemRow) · https://wunderui.com/templates/dashboard
- **Settings page** — Profile, preferences, notifications and a danger zone, grouped into sections with real form controls. (AppLayout, Input, Textarea, Switch, RadioGroup, Alert) · https://wunderui.com/templates/settings
- **AI inbox** — Conversation list, threaded messages with tool calls and sources, and a prompt input that sends. (ChatListView, ChatMessage, ChatTool, ChainOfThought, PromptInput) · https://wunderui.com/templates/inbox
- **Agent workspace** — Run list, a run's timeline with an approval waiting inside it, and a context rail with sources, tools and spend. (AgentGrid, AgentStatus, RunTimeline, ApprovalCard, CostMeter, RunError) · https://wunderui.com/templates/agent-workspace
- **Sign in** — Split authentication screen with email and password, provider buttons and a product panel. (Input, Checkbox, Button, DividerWithLabel, Badge) · https://wunderui.com/templates/sign-in

## Starting points

### Application shell

```tsx
import { AppLayout, Navbar, Sidebar, SidebarHeading, SidebarItem, SidebarSection, SidebarUser } from "@wunderui/react"

<AppLayout
  sidebar={
    <Sidebar logo={<Logo />} footer={<SidebarUser name="Felix Brandt" email="felix@example.com" />}>
      <SidebarSection>
        <SidebarHeading>Workspace</SidebarHeading>
        <SidebarItem label="Overview" active />
        <SidebarItem label="Deals" />
      </SidebarSection>
    </Sidebar>
  }
  navbar={<Navbar logo={<span>Overview</span>} actions={<Avatar />} />}
>
  {children}
</AppLayout>
```

### Dashboard row

```tsx
import { KPIGroup, Progress, StatCard, Widget } from "@wunderui/react"

<KPIGroup columns={4}>
  <StatCard label="MRR" value="€34,100" delta="+14.2%" trend="up" trendGood prev="€29,850" />
</KPIGroup>

<Widget title="Plan usage" description="Seats used this month">
  <Progress value={72} aria-label="Seats used: 72 %" />
</Widget>
```

### Agent run view

```tsx
import { AgentStatus, ApprovalCard, CostMeter, RunTimeline } from "@wunderui/react"

<div className="flex flex-col gap-4">
  <AgentStatus status={run.status} since={run.startedAt} />

  {run.pendingApproval && (
    <ApprovalCard
      title={run.pendingApproval.title}
      summary={run.pendingApproval.summary}
      risk={run.pendingApproval.risk}
      expiresAt={run.pendingApproval.expiresAt}
      onApprove={() => approve(run.id)}
      onReject={() => reject(run.id)}
    />
  )}

  <RunTimeline steps={run.steps} activeStepId={run.currentStepId} />
  <CostMeter spent={run.spend} budget={run.budget} period="run" />
</div>
```

### Re-theming a subtree

```tsx
<div style={{ "--primary": "#1AD598", "--ring": "#1AD598", "--chart-1": "#1AD598" } as React.CSSProperties}>
  {/* every WunderUI component inside now uses the new accent */}
</div>
```

---

Docs: https://wunderui.com/components · Templates: https://wunderui.com/templates · Machine-readable index: https://wunderui.com/design.json
