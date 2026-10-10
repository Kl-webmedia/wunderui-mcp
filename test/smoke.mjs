/**
 * Starts the server over stdio with a real MCP client and calls every tool once.
 * Run: npm run smoke --workspace=@wunderui/mcp
 */

import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

const here = dirname(fileURLToPath(import.meta.url))
const entry = resolve(here, "../src/index.mjs")

const client = new Client({ name: "wunderui-smoke", version: "1.0.0" })
// pass the environment through, so WUNDERUI_SITE / WUNDERUI_LICENSE_KEY reach the server under test
await client.connect(new StdioClientTransport({ command: process.execPath, args: [entry], env: { ...process.env } }))

const { tools } = await client.listTools()
console.log(`tools: ${tools.map((tool) => tool.name).join(", ")}`)

const calls = [
  ["get_library_info", {}],
  ["list_components", { category: "Charts" }],
  ["list_components", { query: "grid" }],
  ["get_component", { name: "data-grid" }],
  ["get_component", { name: "StatCard" }],
  ["get_component", { name: "nope" }],
  ["get_tokens", { format: "css", theme: "light" }],
  ["get_tokens", { format: "tailwind" }],
  ["get_design_md", { section: "rules" }],
  ["list_templates", {}],
  ["get_starter", { kind: "dashboard" }],
  ["get_instructions", {}],
  ["list_skills", {}],
  ["get_skill", { name: "wunderui-token-check" }],
  ["get_skill", { name: "wunderui-motion-audit" }],
  ["get_block_source", { category: "app", block: "billing" }],
]

let failed = 0
for (const [name, args] of calls) {
  try {
    const result = await client.callTool({ name, arguments: args })
    const body = result.content?.[0]?.text ?? ""
    if (!body.trim()) throw new Error("empty response")
    console.log(`ok  ${name}(${JSON.stringify(args)}) → ${body.length} chars | ${body.slice(0, 90).replace(/\s+/g, " ")}…`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${name}(${JSON.stringify(args)}): ${error.message}`)
  }
}

await client.close()
console.log(failed === 0 ? `\nAll ${calls.length} calls passed.` : `\n${failed} of ${calls.length} calls failed.`)
process.exit(failed === 0 ? 0 : 1)
