# Installing the WunderUI MCP server

Instructions for an AI agent (Cline, Claude Code, Cursor …) that sets up this server.

## Requirements

- Node.js 20 or newer (`node --version`)
- No API key, no account, nothing to clone or build: the server runs from npm with `npx`

## Add it to the MCP settings

Add this entry to the client's MCP settings file. For Cline that is `cline_mcp_settings.json` (open it from the MCP Servers panel → Configure):

```json
{
  "mcpServers": {
    "wunderui": {
      "command": "npx",
      "args": ["-y", "wunderui-mcp"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

On Windows, if `npx` is not found, use `"command": "cmd"` with `"args": ["/c", "npx", "-y", "wunderui-mcp"]`.

## Optional environment variables

| Variable | Effect |
| --- | --- |
| `WUNDERUI_LICENSE_KEY` | A WunderUI Pro licence key. Unlocks `get_block_source` and the Pro skills in `get_skill`. Everything else works without it. |
| `WUNDERUI_OFFLINE` | Set to `1` to use only the bundled data and never fetch updates from wunderui.com. |

Leave both out for a normal install.

## Check that it works

Call the `get_library_info` tool. It returns the library name, version, counts and which data source is in use. Then try `list_components` with `{ "plan": "free" }`.
