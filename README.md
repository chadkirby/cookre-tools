# cookre-tools

Public tools for [Cook:RE](https://www.cookre.app). Today that is the assistant plugin; other
utilities may join it.

## The Cook:RE plugin

`plugins/cookre/` connects ChatGPT, Codex and Claude to a cook's Cook:RE library through the
remote MCP server at `https://api.cookre.app/mcp` (OAuth). It carries:

- `plugin.json`, `mcp.json`: the portable [Agent Plugins](https://developers.openai.com/plugins/build/plugins)
  manifest and MCP reference, with OpenAI's listing metadata under `extensions["com.openai"]`.
- `skills/cookre-recipes/`: the workflow the assistant needs (search before asking, read before
  editing, pass `baseRev` and `snapshot`, use L and S handles, what Cook:RE cannot do).
- `assets/`: logo and composer icons, made from the app icon.
- `.claude-plugin/plugin.json`, `.mcp.json`: Claude's manifest and server reference, so the same
  folder serves Claude's plugin directory.

The plugin needs nothing from the Cook:RE app's repository. The two meet at the MCP tools' names
and meaning: renaming a tool breaks every connected assistant, so update the skill in the same
release.

### Build the OpenAI upload

```bash
node scripts/build-openai-plugin.mjs                   # dist/cookre-openai-<version>.zip
node scripts/build-openai-plugin.mjs --without-claude  # leave out the Claude files
```

The build refuses to write if a file looks like it holds a secret, or if `plugin.json` names a
file that isn't in the package. Use `--without-claude` only if the OpenAI portal's checks flag the
Claude files.

### Check it as a Claude plugin

```bash
claude plugin validate plugins/cookre
```

### Status of the review cases

`review.test_cases` in `plugins/cookre/plugin.json` are drafted, **not yet run**. Run each in
ChatGPT on the web and in Codex against a demo library (connect with the reviewer passphrase on
the Link Cook:RE page), and fix the skill, not the expectation, where one fails. Still to add:
screenshots (`interface.screenshots`) and `review.demo_recording_url`.

## Licence

MIT
