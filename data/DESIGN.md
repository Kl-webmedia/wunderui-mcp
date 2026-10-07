# WunderUI — DESIGN.md

> Design context for AI coding agents. Paste this into your prompt, or let your
> agent pull it from https://wunderui.com/DESIGN.md.
> Generated from the WunderUI source on 2026-10-07 · @wunderui/react@0.1.0

WunderUI is a React component library and design system: 201
documented components in 6 groups, built on Base UI
primitives and Tailwind CSS v4. It covers the parts most kits skip — data grid,
kanban, charts, an application shell and a full AI chat set.

## Install

```bash
npm install @wunderui/react
```

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
10. **Motion comes from tokens too.** Duration is `duration-instant|fast|base|slow|deliberate|ambient`, easing is `ease-entrance|exit|move|overshoot`. Never write a raw `duration-300` and never write `ease-in-out` — both are the default every generator reaches for, and both read as mechanical.
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
{isLoading ? <Spinner /> : <AreaChart data={data} … />}
```

**Do**

```tsx
<AreaChart data={data} index="month" categories={["Revenue"]} loading={isLoading} />
```

The built-in skeleton keeps the chart's height, so the layout does not jump.

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
| `--input` | `#7694AD` | `#6E6E70` |
| `--code-border` | `var(--light-300)` | `color-mix(in srgb, var(--foreground) 14%, var(--muted))` |
| `--border-control` | `var(--light-300)` | `#323438` |
| `--ring` | `var(--brand-600)` | `var(--brand-400)` |
| `--text-secondary` | `#454648` | `#D1D1D1` |
| `--text-tertiary` | `#6E6E70` | `#A2A3A3` |
| `--success` | `#1AD598` | `#1AD598` |
| `--success-foreground` | `#17181A` | `#17181A` |
| `--chart-1` | `var(--brand-600)` | `var(--brand-600)` |
| `--chart-2` | `#F3654A` | `#F3654A` |
| `--chart-3` | `#A584F3` | `#A584F3` |
| `--chart-4` | `#FACA4A` | `#FACA4A` |
| `--chart-5` | `#1AD598` | `#1AD598` |
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
6. **One overshoot per screen.** `ease-overshoot` is punctuation. Two of them on one view and the interface reads as a toy.
7. **Reduced motion is opt-in, not a kill switch.** Wrap the animation in `@media (prefers-reduced-motion: no-preference)` so the still state is the default and you cannot forget a selector.
8. **Never `transition-all`.** Name the properties — `transition-[opacity,transform]` — or use bare `transition`, which covers colour, shadow, transform and opacity but no layout property. `transition-all` animates things you did not mean to animate, including on first paint.
9. **Loading keeps its height.** A skeleton occupies the same box as the content it stands in for, and crossfades — it never collapses and reflows.
10. **A looping ambient animation is the one place `ease-in-out` belongs.** A shimmer that runs forever has no entrance and no exit, so symmetry is correct there and nowhere else.

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

## Component inventory

**Plans.** 76 components are **Free** (Free License: personal, non-commercial use); 125 are **Pro** and need WunderUI Core or Pro — charts, KPI cards, the data grid, the app layout and navigation, AI & agents. On the Free plan, build only with components marked Free and name the Pro component that would do the job better.

### Primitives

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Accordion` | Free | A vertically stacked set of collapsible panels, in card or divider style. | AccordionContent, AccordionItem, AccordionTrigger |
| `Avatar` | Free | A user or entity's profile image with a text fallback. | AvatarBadge, AvatarColor, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, AvatarStack |
| `AvatarGroup` | Free | A stack of overlapping avatars, with an optional overflow count. | AvatarGroupCount |
| `Badge` | Free | A small status or category label in 12 colors and 6 styles. | BadgeCell, BadgeColor, BadgeStyle |
| `Breadcrumb` | Free | Shows the user's location in a hierarchy, in "plain" or bordered "border" style. | BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator |
| `Button` | Free | The main action trigger, in 10 variants, 2 shapes and 5 sizes. | ButtonCell, ButtonGroup |
| `IconButton` | Free | A square or circular button for a single icon action. | IconButtonTextCell |
| `ButtonGroup` | Free | A row of connected buttons sharing borders and outer corners, for view switchers or segmented actions. | — |
| `Card` | Free | A bordered container for grouping related content. | CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, CardVariant |
| `Checkbox` | Free | A single choice that is on or off, with an indeterminate state for “some selected”. | CheckboxButtonGroup, CheckboxField, CheckboxFieldProps |
| `Switch` | Free | A toggle control for a binary setting. | SwitchItemCell |
| `RadioGroup` | Free | A set of mutually exclusive options. | RadioGroupItem |
| `Input` | Free | A single-line text field with sm/default/lg sizes and error state. | InputGroup, InputGroupAddon |
| `Textarea` | Free | A multi-line text field with sm/default/lg sizes and an optional character counter. | TextareaField, TextareaFieldProps |
| `Progress` | Free | A horizontal bar showing completion of a task. | ProgressCell, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue |
| `Slider` | Free | A draggable control for selecting one value or a range along a track. | SliderControl, SliderIndicator, SliderLabel, SliderThumb, SliderTrack, SliderValue |
| `Pagination` | Free | Page navigation with Prev/Next and numbered pages, or a simple "Page X of Y" mode. | PaginationSimple |
| `Separator` | Free | A thin dividing line, horizontal or vertical, solid or dashed. | — |
| `DividerWithLabel` | Free | A separator with a centered text label, e.g. for "or" between two sign-in options. | — |
| `Skeleton` | Free | A pulsing placeholder shown while content is loading. | — |
| `Tooltip` | Free | A short label shown on hover, in any of 4 directions. | TooltipContent, TooltipTrigger |
| `Dialog` | Free | A modal window for focused tasks, built on Base UI. | DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogIcon, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger |
| `AlertDialog` | Free | A dialog for confirmations and destructive actions: a click outside does not close it, only a button or Escape does. | AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger |
| `Collapsible` | Free | A single collapsible panel controlled by a trigger button. | CollapsibleContent, CollapsibleTrigger |
| `Toggle` | Free | A standalone two-state button that can be pressed or unpressed. | ToggleButton |
| `Meter` | Free | A graphical display of a fixed value within a range, e.g. disk usage. | MeterIndicator, MeterLabel, MeterTrack, MeterValue |
| `Kbd` | Free | Displays a keyboard key or shortcut, e.g. inside a search input. | KbdGroup |
| `Spinner` | Free | A spinning indicator for an in-progress loading state. | — |
| `Toolbar` | Free | A container for grouping a set of buttons and controls. | ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator |
| `DropdownMenu` | Pro | A menu of actions: icons, shortcuts, checkbox and radio entries, submenus, two-line entries, loading and empty states. | DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuEmpty, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuLoading, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger |
| `HoverCard` | Free | A rich preview popup shown on hovering a trigger. | HoverCardContent, HoverCardTrigger |
| `Table` | Pro | Rows and columns with 23 ready-made cell types; for sorting and search use Data Grid. | TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow |
| `Tabs` | Free | Switches between related views in the same context. | TabsContent, TabsIndicator, TabsList, TabsTrigger |
| `Agenda` | Free | A time-ordered list of scheduled events. | AgendaEvent, AgendaEventProps, AgendaItem |
| `ActionBar` | Free | A floating bar of bulk actions for a selection. | — |
| `Carousel` | Free | A horizontally scrollable row of items with arrow controls. | — |
| `EmptyState` | Free | Placeholder shown when a list or search has no results. | — |
| `FileTree` | Free | A collapsible, indented tree of folders and files. | FileTreeNode |
| `FloatingToc` | Free | A sticky table of contents with an active-section indicator. | — |
| `HoloCard` | Free | A card with a mouse-tracking spotlight/gradient shine effect. | — |
| `Kanban` | Pro | A drag-and-drop board of columns and cards. | KanbanCard, KanbanCardItem, KanbanCardProps, KanbanColumn |
| `ItemCard` | Free | A generic row card: icon, title, description, meta, action. | ItemCardGroup |
| `ListView` | Pro | A simple bordered list of rows with leading/trailing content. | ListViewItem |
| `Timeline` | Free | A vertical sequence of dated, dot-connected events. | TimelineEvent, TimelineEventProps, TimelineItem |
| `Widget` | Free | A generic dashboard widget shell: header, body, footer. | — |

### Overlays

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Popover` | Free | A floating panel anchored to a trigger element. | PopoverClose, PopoverContent, PopoverTrigger |
| `EmojiPicker` | Free | A grid of selectable emoji, typically shown inside a Popover. | — |
| `Sheet` | Free | A panel that slides in from an edge of the screen — left, right, or bottom. | SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger |

### Charts

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `AreaChart` | Pro | A gradient-filled area chart for visualizing trends over time. | — |
| `BarChart` | Pro | Compares categorical data with grouped or stacked bars. | — |
| `LineChart` | Pro | Plots one or more series as smooth or linear lines. | LineChartReferenceLine |
| `ComposedChart` | Pro | Combines bars and a trend line in a single chart. | — |
| `PieChart` | Pro | Shows proportions of a whole, with an optional donut mode. | — |
| `RadarChart` | Pro | Compares multiple series across shared axes on a polar grid. | — |
| `RadialChart` | Pro | A circular progress-style chart for a single goal value. | — |
| `RadialGauge` | Pro | A half ring split into segments — shares of a whole with the legend underneath. | — |
| `BubbleChart` | Pro | A scatter plot where marker size encodes a third dimension of the data. | — |
| `CandlestickChart` | Pro | An OHLC (open/high/low/close) chart for visualizing price movement over time. | — |
| `Sparkline` | Pro | A tiny trend line without axes — green when it rises, red when it falls — for table cells, price cards and metric tiles. | SparklineProps |
| `FunnelChart` | Pro | Shows drop-off across sequential stages, each with a label and value. | — |
| `ColumnChart` | Pro | Vertical bars for comparing categories side by side. | — |

### Data Display

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `DataGrid` | Pro | A full-featured table: sort, search, select, resize columns, paginate. | DataGridColumn |

### KPI

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `StatCard` | Pro | A single metric with its change, as a card with a dot and delta, a plain card with a caption, or an inline value. | — |
| `KPIGroup` | Pro | A row of KPIs sharing one bordered container. | — |
| `MetricCard` | Pro | One number with its trend and, per variant, a sparkline, progress, breakdown, comparison, distribution, status, action or AI insight. | — |

### Navigation

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `AppLayout` | Pro | The app shell: sticky navbar and sidebar over a scrolling page, aside, banner and footer, skip link, and a drawer below 64rem. | AppLayoutAsideTrigger, AppLayoutNavigationTrigger, AppLayoutProps |
| `Sidebar` | Pro | App navigation in six modes: docked, offcanvas, icon rail, rail with flyouts, double sidebar and overlay drawer. | SidebarCta, SidebarGroup, SidebarHeading, SidebarItem, SidebarItemProps, SidebarNotification, SidebarSearch, SidebarSection, SidebarSwitchItem, SidebarUser, SidebarWorkspace |
| `Navbar` | Pro | The top bar in four scroll modes — static, sticky, hide on scroll, transparent — with mega menu, search, overflow and a mobile drawer. | NavbarLink, NavbarLinkProps, NavbarMenu, NavbarMenuLink, NavbarMode, NavbarProps, NavbarSearch, NavbarSearchField, NavbarSearchProps |
| `Segment` | Pro | A pill-shaped single-select toggle group, like a compact tab bar. | SegmentOption, SegmentSize |
| `Stepper` | Pro | A horizontal multi-step progress indicator with connectors. | StepperProps, StepperStep |
| `Command` | Pro | A searchable command palette dialog with keyboard navigation (⌘K pattern). | CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandItemRow, CommandItemRowProps, CommandList, CommandSeparator |
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
| `Field` | Free | Labelling and validation for a single form control — label, description, and error message. | FieldControl, FieldDescription, FieldError, FieldLabel, Fieldset, FieldsetLegend |
| `Fieldset` | Free | A native fieldset with a legend, for grouping related fields. | FieldsetLegend |
| `Form` | Free | A form wrapper that simplifies validation and submission. | FormActions |
| `InputGroup` | Free | Groups an input with leading/trailing addons — icons, buttons, or text. | InputGroupAddon |
| `NumberField` | Free | A numeric input with increment/decrement buttons. | NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput |
| `OtpField` | Free | A segmented input for one-time passwords and verification codes. | OtpFieldInput |
| `Combobox` | Free | An input combined with a filterable list of predefined items to select. | ComboboxEmpty, ComboboxGroup, ComboboxGroupLabel, ComboboxInput, ComboboxInputGroup, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxPortal, ComboboxTrigger |
| `Autocomplete` | Free | An input that suggests options as you type. | AutocompleteEmpty, AutocompleteInput, AutocompleteInputGroup, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompletePortal |
| `Calendar` | Free | A month-grid date picker with single or range selection. | CalendarProps |
| `DatePicker` | Free | A Calendar inside a Popover, with Cancel/Apply actions. | DatePickerProps |

### AI

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `ChatMessage` | Pro | A single message bubble on the indigo tint, aligned right for the user and left for the assistant. | ChatMessageActions |
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
| `Alert` | Free | An inline banner in 5 colors and 2 sizes, with an optional close button and action. | AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle |
| `ToastProvider` | Free | A temporary notification that appears in the corner of the screen, with success/error/warning/info types. | ToastViewport, Toaster |
| `PullToRefresh` | Free | Drag down from the top of any content past a threshold to trigger an async refresh, with a rotating spinner and a rubber-band release. | — |
| `Rating` | Free | An interactive star rating input. | RatingCell, RatingLabel, RatingType |
| `NumberValue` | Free | A large number with its change beside it: caret up or down, green or red. | — |
| `TrendChip` | Free | A small pill showing a change, up or down, in seven icon styles. | TrendChipIcon |
| `PressableFeedback` | Free | Wraps any content with a scale-down press animation. | — |
| `EmojiReactionButton` | Free | A toggleable emoji reaction with a count, like a Slack reaction. | — |

### Layout

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `Resizable` | Pro | A two-pane layout with a draggable divider between them. | — |
| `ScrollArea` | Pro | A scrollable container with custom, always-styled scrollbars. | — |

### Block Parts

| Component | Plan | What it does | Related exports |
| --- | --- | --- | --- |
| `PageHeader` | Pro | The title row at the top of a page or section, with an optional description, buttons or a text link. | PageHeaderProps |
| `KeyboardHint` | Pro | One or more key caps with a short label, for the shortcut legend at the bottom of a command menu. | — |
| `CommandItemRow` | Pro | One row in a command menu: an icon, a label, optional context and its shortcut keys. | CommandItemRowProps |
| `SearchResult` | Pro | A search hit with an icon, a title, a short excerpt and where it lives. | SearchResultCard, SearchResultProps |
| `NotificationItem` | Pro | One entry in a notification list, with an avatar or icon, the message, optional actions and an unread dot. | NotificationItemProps |
| `ChecklistTask` | Pro | One step of an onboarding checklist that can be ticked off, with the next step to do highlighted. | — |
| `ProjectCard` | Pro | A clickable project tile with a colored cover, a name and a short line of detail. | — |
| `FileCard` | Pro | A file tile with a preview, a name and details, plus optional selection, a menu and a deleted state. | FileCardProps |
| `StatusBar` | Pro | The phone status bar with the time, for the top of a mobile screen mockup. | — |
| `TabItem` | Pro | A single underlined tab that shows a count while it is active, used inside a Tab Bar. | — |
| `TabBar` | Pro | A horizontal row of underlined tabs on a bottom border that scrolls sideways when space runs out. | — |
| `TimelineEvent` | Pro | One entry in an activity feed or history, with an avatar or status dot and a line to the next entry. | TimelineEventProps |
| `Price` | Pro | A price with an optional billing period, a crossed-out old price and a savings badge. | PriceProps |
| `TextLinkRow` | Pro | A line of text followed by a link, like “Don't have an account? Sign up”, or a back link with an arrow. | TextLinkRowProps |
| `SocialSignInButtons` | Pro | Sign-in buttons for Google, Apple, GitHub and Microsoft, side by side or stacked. | — |
| `OptionRow` | Pro | A selectable card with a radio button or checkbox, a title and a short description. | OptionRowGroup, OptionRowProps |
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
| `AvatarStack` | Pro | Overlapping avatars with a “+N” count for everyone past the limit. | — |
| `KanbanCardItem` | Pro | A task card for a Kanban board, with labels, due date, comments, checklist progress and assignees. | — |
| `ColumnHeader` | Pro | The top of a Kanban column, with a colored dot, a card count and buttons to add a card or open a menu. | ColumnHeaderProps |
| `EventChip` | Pro | A small colored event label that fits in a calendar day cell. | — |
| `AgendaEvent` | Pro | One event in an agenda list, with its start and end time, a color bar, details and guests. | AgendaEventProps |
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
| `TextareaField` | Pro | A multi-line text input with a label and helper or error text. | TextareaFieldProps |
| `CheckboxField` | Pro | A checkbox with a clickable label and an optional description below it. | CheckboxFieldProps |
| `FormActions` | Pro | The row of buttons at the end of a form, aligned right, left or spread to both edges. | — |

## Reference

Every component with its usage example and the prop signature from the build.

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

#### Breadcrumb

Shows the user's location in a hierarchy, in "plain" or bordered "border" style.

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

#### IconButton

A square or circular button for a single icon action.

```tsx
<IconButton variant="primary" shape="circle">
  <Plus />
</IconButton>
```

```ts
function IconButton({ className, variant, shape, size, ...props }: Button.Props & VariantProps<typeof iconButtonVariants>): React.JSX.Element;
```

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
function ButtonGroup({ shape, className, ...props }: React.ComponentProps<"div"> & {
    shape?: ButtonGroupShape;
}): React.JSX.Element;
type ButtonGroupShape = "rounded" | "pill";
```

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

#### Checkbox

A single choice that is on or off, with an indeterminate state for “some selected”.

```tsx
<Checkbox aria-label="Example checkbox" defaultChecked onCheckedChange={setValue} />
```

```ts
function Checkbox({ className, ...props }: Checkbox.Root.Props): React.JSX.Element;
```

#### Switch

A toggle control for a binary setting.

```tsx
<Switch aria-label="Example switch" defaultChecked onCheckedChange={setValue} />
```

```ts
function Switch({ className, size, ...props }: Switch.Root.Props & {
    size?: "sm" | "default";
}): React.JSX.Element;
```

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

#### Input

A single-line text field with sm/default/lg sizes and error state.

```tsx
<Input size="default" placeholder="Email" />
```

```ts
function Input({ className, type, size, ref, onInvalid, onInput, onBlur, ...props }: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>): React.JSX.Element;
```

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

#### Progress

A horizontal bar showing completion of a task.

```tsx
<Progress value={65} />
```

```ts
function Progress({ className, children, value, ...props }: Progress.Root.Props): React.JSX.Element;
```

#### Slider

A draggable control for selecting one value or a range along a track.

```tsx
<Slider aria-label="Value" defaultValue={40} onValueChange={setValue} />
```

```ts
function Slider({ className, children, value, defaultValue, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: Slider.Root.Props): React.JSX.Element;
```

#### Pagination

Page navigation with Prev/Next and numbered pages, or a simple "Page X of Y" mode.

```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

```ts
function Pagination({ page, pageCount, onPageChange, className }: PaginationProps): React.JSX.Element;
```

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

#### Skeleton

A pulsing placeholder shown while content is loading.

```tsx
<Skeleton variant="title" />
<Skeleton variant="text" />
```

```ts
function Skeleton({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>): React.JSX.Element;
```

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

#### Collapsible

A single collapsible panel controlled by a trigger button.

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>Show details</CollapsibleTrigger>
  <CollapsibleContent>Lorem ipsum dolor sit amet...</CollapsibleContent>
</Collapsible>
```

```ts
function Collapsible({ ...props }: Collapsible.Root.Props): React.JSX.Element;
```

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

#### Spinner

A spinning indicator for an in-progress loading state.

```tsx
<Spinner />
```

```ts
function Spinner({ className, ...props }: React.ComponentProps<"svg">): React.JSX.Element;
```

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

#### AreaChart

A gradient-filled area chart for visualizing trends over time.

```tsx
<AreaChart data={data} index="month" categories={["revenue", "cost"]} />
```

```ts
function AreaChart({ data, index, categories, colors, height, stacked, curveType, variant, fillOpacity, dashed, outline, fillOnly, strokeWidth, strokeWidths, showGrid, showAxis, showTooltip, showLegend, yDomain, baseline, yTicks, xTicks, xAxisFormatter, sparkline, yAxisFormatter, valueFormatter, animate, loading, className, }: AreaChartProps): React.JSX.Element;
```

#### BarChart

Compares categorical data with grouped or stacked bars.

```tsx
<BarChart data={data} index="month" categories={["revenue", "cost"]} stacked={false} />
```

```ts
function BarChart({ data, index, categories, colors, height, layout, stacked, stackGap, radius, barSize, maxBarSize, barGap, lollipop, segments, background, showGrid, showAxis, showTooltip, showLegend, yAxisFormatter, yDomain, yTicks, valueFormatter, animate, loading, className, }: BarChartProps): React.JSX.Element;
```

#### LineChart

Plots one or more series as smooth or linear lines.

```tsx
<LineChart data={data} index="month" categories={["revenue", "cost"]} curved />
```

```ts
function LineChart({ data, index, categories, colors, height, showGrid, showAxis, showXAxis, showTooltip, showLegend, showDots, endDot, curved, curveType, dashed, area, strokeWidth, strokeWidths, xTicks, xAxisFormatter, yDomain, yTicks, activeIndex, referenceLines, yAxisFormatter, valueFormatter, animate, loading, className, }: LineChartProps): React.JSX.Element;
```

#### ComposedChart

Combines bars and a trend line in a single chart.

```tsx
<ComposedChart data={data} index="month" bars={["revenue"]} lines={["cost"]} />
```

```ts
function ComposedChart({ data, index, bars, lines, colors, height, showGrid, showAxis, showTooltip, valueFormatter, animate, loading, className, }: ComposedChartProps): React.JSX.Element;
```

#### PieChart

Shows proportions of a whole, with an optional donut mode.

```tsx
<PieChart data={[{ name: "Direct", value: 42 }]} donut />
```

```ts
function PieChart({ data, colors, height, donut, variant, innerRadius, paddingAngle, cornerRadius, startAngle, endAngle, track, centerLabel, legend, showLabel, showTooltip, valueFormatter, animate, loading, className, }: PieChartProps): React.JSX.Element;
```

#### RadarChart

Compares multiple series across shared axes on a polar grid.

```tsx
<RadarChart data={data} index="metric" categories={["a", "b"]} />
```

```ts
function RadarChart({ data, index, categories, colors, height, showTooltip, fillOpacity, showDots, animate, loading, className, }: RadarChartProps): React.JSX.Element;
```

#### RadialChart

A circular progress-style chart for a single goal value.

```tsx
<RadialChart data={[{ name: "Goal", value: 72 }]} />
```

```ts
function RadialChart({ data, colors, height, showTooltip, innerRadius, centerLabel, animate, loading, className, }: RadialChartProps): React.JSX.Element;
```

#### RadialGauge

A half ring split into segments — shares of a whole with the legend underneath.

```tsx
import { ChartCard, RadialGauge } from "@wunderui/react"

<ChartCard title="Radial Gauge">
  <RadialGauge data={[{ name: "Audience", value: 46 }, { name: "Earnings", value: 24 }, { name: "Visitors", value: 7 }]} max={100} />
</ChartCard>
```

```ts
function RadialGauge({ data, colors, max, height, thickness, paddingAngle, cornerRadius, track, centerLabel, legend, showTooltip, valueFormatter, animate, loading, className, }: RadialGaugeProps): React.JSX.Element;
```

#### BubbleChart

A scatter plot where marker size encodes a third dimension of the data.

```tsx
<BubbleChart data={data} xKey="visits" yKey="revenue" sizeKey="deals" />
```

```ts
function BubbleChart({ data, xKey, yKey, sizeKey, name, color, height, sizeRange, showGrid, showAxis, showTooltip, valueFormatter, groupKey, colors, animate, loading, className, }: BubbleChartProps): React.JSX.Element;
```

#### CandlestickChart

An OHLC (open/high/low/close) chart for visualizing price movement over time.

```tsx
<CandlestickChart
  data={candles}            // { day, month, open, high, low, close, sma20, sma50 }
  index="day"
  bandKey="month"           // alternating month bands
  lines={[{ key: "sma20", label: "20 Day SMA" }, { key: "sma50", label: "50 Day SMA" }]}
  yAxisSide="right"
  showLegend
/>
```

```ts
function CandlestickChart({ data, index, height, upColor, downColor, lines, bandKey, volumeKey, lastPrice, yAxisSide, yDomain, yTicks, xTicks, yAxisFormatter, xAxisFormatter, showGrid, showAxis, showTooltip, showLegend, priceLabel, animate, loading, className, }: CandlestickChartProps): React.JSX.Element;
```

#### Sparkline

A tiny trend line without axes — green when it rises, red when it falls — for table cells, price cards and metric tiles.

```tsx
import { Sparkline } from "@wunderui/react"

<Sparkline data={[40, 44, 41, 48, 52, 50, 58]} aria-label="Up 45 % over seven days" />
<Sparkline data={prices} variant="area" width="100%" height={96} />
```

```ts
function Sparkline({ data, variant, trend, color, width, height, strokeWidth, animate, loading, className, "aria-label": ariaLabel, }: SparklineProps): React.JSX.Element;
```

#### FunnelChart

Shows drop-off across sequential stages, each with a label and value.

```tsx
<FunnelChart data={[
  { label: "Impressions", value: "2,620,120", percent: 100 },
  { label: "Purchases", value: "246", percent: 18 },
]} />
```

```ts
function FunnelChart({ data, series, labels, max, height, color, variant, direction, fillOpacity, showAxis, showHeader, showTooltip, seriesLabel, yAxisFormatter, animate, loading, className, }: FunnelChartProps): React.JSX.Element;
```

#### ColumnChart

Vertical bars for comparing categories side by side.

```tsx
import { ColumnChart } from "@wunderui/react"

<ColumnChart data={data} index="month" categories={["revenue", "cost"]} />
```

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

#### ActionBar

A floating bar of bulk actions for a selection.

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

#### Carousel

A horizontally scrollable row of items with arrow controls.

```tsx
<Carousel>
  {items.map((item) => <Card key={item.id}>{item.label}</Card>)}
</Carousel>
```

```ts
function Carousel({ children, className, label, }: {
    children: React.ReactNode;
    className?: string;
    /** Accessible name of the scrolling region. */
    label?: string;
}): React.JSX.Element;
```

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

#### FileTree

A collapsible, indented tree of folders and files.

```tsx
<FileTree data={[{ id, name, children: [...] }]} />
```

```ts
function FileTree({ data, className, }: {
    data: FileTreeNode[];
    className?: string;
}): React.JSX.Element;
```

#### FloatingToc

A sticky table of contents with an active-section indicator.

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

#### Kanban

A drag-and-drop board of columns and cards.

```tsx
<Kanban columns={columns} onColumnsChange={setColumns} />
```

```ts
function Kanban({ columns: controlledColumns, onColumnsChange, className, }: {
    columns: KanbanColumn[];
    onColumnsChange?: (columns: KanbanColumn[]) => void;
    className?: string;
}): React.JSX.Element;
```

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

#### StatCard

A single metric with its change, as a card with a dot and delta, a plain card with a caption, or an inline value.

```tsx
<StatCard label="Revenue" value="$48.2K" delta="12.4%" trend="up" trendGood />
```

```ts
function StatCard({ label, value, prev, delta, trend, trendGood, dotColor, caption, variant, className, }: StatCardProps): React.JSX.Element;
```

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

#### Timeline

A vertical sequence of dated, dot-connected events.

```tsx
<Timeline items={[{ id, title, timestamp, color }]} />
```

```ts
function Timeline({ items, className, }: {
    items: TimelineItem[];
    className?: string;
}): React.JSX.Element;
```

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

#### Segment

A pill-shaped single-select toggle group, like a compact tab bar.

```tsx
<Segment value={value} onValueChange={setValue} options={[{ value: "day", label: "Day" }]} />
```

```ts
function Segment({ options, value, onValueChange, size, className, }: {
    options: SegmentOption[];
    value: string;
    onValueChange: (value: string) => void;
    size?: SegmentSize;
    className?: string;
}): React.JSX.Element;
type SegmentSize = "xs" | "sm" | "md" | "lg";
```

#### Stepper

A horizontal multi-step progress indicator with connectors.

```tsx
const [step, setStep] = useState(1)

<Stepper currentStep={step} steps={steps} navigable="all" onStepClick={setStep} />
```

```ts
function Stepper({ steps, currentStep, orientation, numbered, onStepClick, navigable, className }: StepperProps): React.JSX.Element;
```

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

#### RichTextEditor

A Tiptap-powered WYSIWYG editor with a formatting toolbar.

```tsx
<RichTextEditor content={html} onChange={setHtml} placeholder="Write something..." />
```

```ts
function RichTextEditor(props: RichTextEditorProps): React.JSX.Element;
```

#### ColorPicker

Pick a colour: saturation and brightness, hue, opacity, eyedropper, HEX/RGB/HSL values and saved colours — inline or from a trigger field.

```tsx
<ColorPicker value={hex} onValueChange={setHex} />
```

```ts
function ColorPicker({ variant, value, defaultValue, onValueChange, alpha, defaultAlpha, onAlphaChange, showAlpha, format, defaultFormat, onFormatChange, swatches, defaultSwatches, onSwatchesChange, title, onClose, className, }: ColorPickerProps): React.JSX.Element;
```

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

#### Label

An accessible label for a form control.

```tsx
<Label htmlFor="email">Email</Label>
```

```ts
function Label({ className, ...props }: React.ComponentProps<"label">): React.JSX.Element;
```

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
function Combobox(props: Combobox.Root.Props<any, any>): React.JSX.Element;
```

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
      {(item) => <AutocompleteItem key={item}>{item}</AutocompleteItem>}
    </AutocompleteList>
  </AutocompletePopup>
</Autocomplete>
```

```ts
function Autocomplete(props: Autocomplete.Root.Props<any>): React.JSX.Element;
```

#### Calendar

A month-grid date picker with single or range selection.

```tsx
<Calendar mode="single" selected={date} onSelect={setDate} />
```

```ts
function Calendar({ mode, selected, onSelect, month, defaultMonth, onMonthChange, className }: CalendarProps): React.JSX.Element;
```

#### DatePicker

A Calendar inside a Popover, with Cancel/Apply actions.

```tsx
<DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
```

```ts
function DatePicker(props: DatePickerProps): React.JSX.Element;
```

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

#### ChatMessageActions

Copy / retry / thumbs up-down actions shown under an assistant message.

```tsx
<ChatMessageActions />
```

```ts
function ChatMessageActions({ className }: {
    className?: string;
}): React.JSX.Element;
```

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

#### PromptInput

An auto-resizing chat input with attach and send buttons.

```tsx
<PromptInput value={value} onValueChange={setValue} onSubmit={handleSubmit} models={models} />
```

```ts
function PromptInput({ value, onValueChange, onSubmit, placeholder, models, model, defaultModel, onModelChange, tools, className, }: {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
    /** Models for the model chip; the chip opens a popover to switch between them. */
    models?: ModelOption[];
    model?: string;
    defaultModel?: string;
    onModelChange?: (id: string) => void;
    /** Extra buttons after the attach button (link, web search …). */
    tools?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

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

#### AgentStatus

A pill showing what a run is doing right now, with a live elapsed counter.

```tsx
<AgentStatus status="running" since={run.startedAt} />
```

```ts
function AgentStatus({ status, since, label, showElapsed, size, className, }: {
    status: AgentRunStatus;
    /** When the run entered this status. Drives the elapsed counter. */
    since?: Date | string | number;
    /** Overrides the default status label. */
    label?: string;
    showElapsed?: boolean;
    size?: "sm" | "default";
    className?: string;
}): React.JSX.Element;
type AgentRunStatus = "idle" | "running" | "waiting" | "done" | "failed" | "cancelled";
```

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

#### ScopeList

What an agent asks to access, one scope per row, with a countdown until the request lapses.

```tsx
<ScopeList
  scopes={[
    { title: "Read the docs site", detail: "apps/docs · 412 files" },
    { title: "Open a pull request", detail: "Kl-webmedia/wunderui · branch tokens-sync" },
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

#### ToastProvider

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
function ToastProvider({ children, timeout, ...props }: Toast.Provider.Props): React.JSX.Element;
```

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

#### Rating

An interactive star rating input.

```tsx
<Rating value={value} onValueChange={setValue} max={5} />
```

```ts
function Rating({ value, onValueChange, max, type, label, readOnly, className, }: {
    value: number;
    onValueChange?: (value: number) => void;
    max?: number;
    type?: RatingType;
    label?: RatingLabel;
    readOnly?: boolean;
    className?: string;
}): React.JSX.Element;
type RatingType = "stars" | "hearts" | "emojis" | "scale";
type RatingLabel = "none" | "left" | "right" | "tooltip";
```

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

#### TrendChip

A small pill showing a change, up or down, in seven icon styles.

```tsx
<TrendChip value="12.4%" direction="up" />
```

```ts
function TrendChip({ value, direction, icon, className, }: {
    value: string;
    /** Figma Trend Chip · Trend; `flat` is the old name for `neutral`. */
    direction?: "up" | "down" | "neutral" | "flat";
    /** Figma Trend Chip · Icon; the same glyph turns for `down`. */
    icon?: TrendChipIcon;
    className?: string;
}): React.JSX.Element;
type TrendChipIcon = "trending" | "arrow" | "arrow-diagonal" | "triangle" | "circle-trending" | "circle-diagonal" | "circle-arrow";
```

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

#### StatusBar

The phone status bar with the time, for the top of a mobile screen mockup.

```tsx
<div className="overflow-hidden rounded-2xl border border-border bg-card">
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
function TabItem({ active, count, children, onClick, className }: {
    active?: boolean;
    count?: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}): React.JSX.Element;
```

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
function TabBar({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
```

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

#### OtpCodeInput

Large boxes for typing a 4- or 6-digit verification code.

```tsx
const [code, setCode] = useState("")

<OtpCodeInput length={6} value={code} onValueChange={setCode} onComplete={(value) => verify(value)} autoFocus />
```

```ts
function OtpCodeInput({ length, value, onValueChange, onComplete, invalid, disabled, autoFocus, className, }: OtpCodeInputProps): React.JSX.Element;
```

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

#### AuthHeading

The title and subtitle at the top of a sign-in, sign-up or onboarding form.

```tsx
<AuthHeading title="Create your workspace" subtitle="A workspace is where your team designs and ships together." />
<AuthHeading align="center" title="You're all set, Alina!" subtitle="Your workspace is ready. Here's what you've set up." />
```

```ts
function AuthHeading({ title, subtitle, align, className, }: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    align?: "start" | "center";
    className?: string;
}): React.JSX.Element;
```

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

#### PersonCell

An avatar with a name and role for tables and lists, with an optional capacity bar.

```tsx
<PersonCell person={{ name: "Sarah Lindqvist", src: "/avatars/05.png" }} role="sarah@wunderui.dev" />
<PersonCell person={{ name: "Jonas Berg", color: "purple" }} role="Product designer" capacity={{ value: 80, label: "32h" }} />
```

```ts
function PersonCell({ person, role, capacity, className }: PersonCellProps): React.JSX.Element;
```

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

#### PaymentMethods

A row of small labels for the payment methods a shop accepts.

```tsx
<PaymentMethods methods={["VISA", "MC", "AMEX", "PayPal", " Pay"]} className="justify-center" />
```

```ts
function PaymentMethods({ methods, className }: {
    methods?: string[];
    className?: string;
}): React.JSX.Element;
```

#### TextField

A text input with a label, helper or error text, and optional icons or add-ons on either side.

```tsx
<TextField
  label="Work email"
  type="email"
  placeholder="name@company.com"
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

#### PasswordField

A password input with a button to show or hide what was typed.

```tsx
<PasswordField
  label="Password"
  placeholder="Enter your password"
  labelTrailing={<a href="/reset" className="text-xs font-medium text-text-link hover:underline">Forgot password?</a>}
/>
```

```ts
function PasswordField({ trailing, ...props }: TextFieldProps): React.JSX.Element;
```

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

## Templates

Full pages assembled only from WunderUI components:

- **Analytics dashboard** — KPI row, two charts, a transactions table and an activity rail — the page every internal tool starts with. (AppLayout, KPIGroup, AreaChart, BarChart, DataGrid, Timeline) · https://wunderui.com/templates/dashboard
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
import { AreaChart, KPIGroup, StatCard, Widget } from "@wunderui/react"

<KPIGroup columns={4}>
  <StatCard label="MRR" value="€34,100" delta="+14.2%" trend="up" trendGood prev="€29,850" />
</KPIGroup>

<Widget title="Revenue" description="Last six months">
  <AreaChart data={data} index="month" categories={["Revenue"]} height={240} />
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
