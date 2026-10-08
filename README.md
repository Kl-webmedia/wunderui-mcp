# WunderUI MCP

An MCP server that gives an AI coding agent the [WunderUI](https://wunderui.com) design system: design tokens, the component inventory with real prop signatures, page templates and starter snippets. The agent builds *with* the library instead of reinventing a data grid out of raw divs.

```bash
claude mcp add wunderui -- npx -y wunderui-mcp
```

Works with Claude Code, Cursor, Windsurf, Cline, Codex, VS Code and any other client that speaks MCP over stdio. No key and no account needed.

## Tools

| Tool | What the agent gets |
| --- | --- |
| `list_components` | The inventory, filterable by category, plan (free or pro) or free text |
| `get_component` | Exports, the TypeScript prop signature, the import line, an example, the docs URL |
| `get_tokens` | Light and dark tokens as JSON, a CSS block, or Tailwind `@theme` mappings |
| `get_design_md` | The full DESIGN.md, or one section (`rules`, `donts`, `tasks`, `tokens`, `inventory`, `reference`, `templates`, `starters`) |
| `list_templates` | The full-page templates and what each is built from |
| `get_starter` | Copy-paste TSX: app shell, dashboard, data grid, AI chat, theming |
| `get_library_info` | Package name, version, install commands, stack, counts, data source |

Every component carries its plan. On the Free plan, an agent should only use components marked `free`; the others need WunderUI Core or Pro.

## Install

**Claude Code**

```bash
claude mcp add wunderui -- npx -y wunderui-mcp
```

**Cursor**: `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "wunderui": { "command": "npx", "args": ["-y", "wunderui-mcp"] }
  }
}
```

**Windsurf, Cline, Codex, VS Code**: the same shape, in that editor's MCP config.

## Installing WunderUI itself

The server describes the library; it does not ship it. `@wunderui/react` is not on the public npm registry: Core and Pro licence holders install it from the wunderui-core download (the `wunderui-setup` agent skill does it for you), and the server tells agents exactly that. The Free plan covers the Figma preview and the documentation at [wunderui.com](https://wunderui.com).

## Where the data comes from

`data/design.json` and `data/DESIGN.md` are generated from the WunderUI source with every release: tokens from the stylesheet, props from the built type definitions, names and descriptions from the docs.

The server starts with the bundled copy and answers immediately. In the background it fetches the current `design.json` and `DESIGN.md` from wunderui.com and switches to them when they are at least as new, so agents see new components without a package update. `get_library_info` reports which source is in use.

| Variable | Effect |
| --- | --- |
| `WUNDERUI_OFFLINE=1` | never touch the network, use the bundled copy |
| `WUNDERUI_SITE=<url>` | fetch the live data from another origin |

## Without MCP

The same data is served as static files for agents and editors that don't speak MCP:

- `https://wunderui.com/DESIGN.md`: paste at the top of a prompt
- `https://wunderui.com/llms.txt`: the llms.txt convention
- `https://wunderui.com/design.json`: the same structured index

## Verify

```bash
npm install
npm run smoke
```

Starts the server with a real MCP client and calls every tool once.

## Licence

The server code is MIT. The WunderUI components it describes are licensed per plan, see [wunderui.com/pricing](https://wunderui.com/#pricing).
