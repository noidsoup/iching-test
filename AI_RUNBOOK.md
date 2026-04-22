# AI runbook — iching-test

How assistants should work in this repository: layout, verification, and safety.

## Repository layout

| Path | Purpose |
|------|---------|
| `src/` | Vue app (`main.js`), `App.vue`, assets (`src/assets/hexagrams.json`) |
| `tests/` | Vitest specs (`*.spec.js`) |
| `vite.config.js` | Vite + Vue plugin + Vuetify auto-import + Vitest options |
| `eslint.config.js` | ESLint flat config (Vue essential) |
| `iching-test wiki/` | Obsidian-compatible LLM wiki (read `SCHEMA.md` before edits) |
| `simplemem_client.py`, `simplemem_cli.py` | Optional cross-session memory (Python) |

There is **no** `docs/` folder today; nothing to migrate into the wiki until you add docs.

## Environment variables

- **Vite:** No secrets required for local dev. Use `.env` / `.env.local` with `VITE_*` prefix only if you add client env vars later.
- **SimpleMem (optional):** Copy `.env.example` to `.env` and set `SIMPLEMEM_*` if using cloud memory. Never commit `.env`.

Secrets live only in **local `.env`** or your OS secret store — **never** in git.

## Verification commands

Run from the repository root after `npm install`:

```bash
npm run lint
npm test
npm run build
```

For a quick smoke check during UI work: `npm run dev` and open the printed local URL (default **http://localhost:5173**).

## Node version

Use **Node 18+** (see `package.json` `engines`). Older Node is unsupported for this toolchain.

## SimpleMem

- Enable with `SIMPLEMEM_ENABLED=true` in `.env`.
- Namespace for this repo: **`iching-test`**.
- Local fallback store: `uncommitted/simplemem/` (gitignored).
- CLI examples: `python simplemem_cli.py add --text "..."` ; `python simplemem_cli.py query --question "..."`.

## Wiki and session handoff

- **Wiki log:** Append session notes to `iching-test wiki/log.md` when doing significant wiki or project close-out work (see global `llm-wiki-every-project` guidance).
- **Session file:** Keep `AI_SESSION_MEMORY.md` short and current.

## CI / deploy

No GitHub Actions or deploy manifests are present in this repo. Add pointers here when CI or hosting is introduced.
