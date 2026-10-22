# Agent instructions — iching-test

Claude Code loads this file through `.claude/CLAUDE.md`; project rules are in `.claude/rules/`.

**Project wiki:** read `wiki/index.md` before non-trivial work; open pages it points to only when relevant.
After a repeated failure, check `wiki/gotchas.md`. Writing to the wiki: follow `wiki/SCHEMA.md`.

## Working rules

1. **Think before coding.** State assumptions, surface tradeoffs, ask before guessing.
2. **Simplicity first.** Minimum code that solves the problem; no speculative abstractions.
3. **Surgical changes.** Touch only what the task needs. Match the existing style.
4. **Read before you write.** Read the file's exports and its caller before adding to it.
5. **Fail loud.** If you can't be sure it worked, say so. Never report skipped work as done.
6. **Check after every change.** Run the type check / lint from "Commands" after each edit.
7. **Behavior changes ship with tests**, where a test runner exists (see "What can be verified").
8. **Never ratchet a test to match current output.** Find why it changed; decide whether the code or the test is wrong.

## What this is

Vue 3 single-page app (package name `being`) for the I Ching, with three tabs: **Oracle** (cast a hexagram with three coins, yarrow stalks, or fast yarrow; `src/components/IChingOracle.vue`), **Browse** (one hexagram drawn uniformly at random), and **Patterns** (hexagram-math visualizations; `src/components/patterns/`). Hexagram data: `src/assets/hexagrams.json`. Pure I Ching logic (line scores, keys, casting, lookup) lives in `src/iching/`. Main UI: `src/App.vue`.

| Layer | Choice |
|--------|--------|
| Framework | Vue 3 (SFCs, Composition API) |
| UI | Vuetify 3 |
| Tooling | Vite 5, npm |
| Tests | Vitest, Vue Test Utils, jsdom |
| Lint | ESLint 9 flat config |
| Backend | None (static SPA) |

## Critical patterns

- Hexagram lookup uses **`src/assets/hexagrams.json`**; keep keys and shape stable for tests.
- Hexagram keys are six `0`/`1` characters, bottom line first (`1` = yang); line scores are 6/7/8/9, bottom first (`src/iching/hexagramMath.js`).
- Casting functions take an injectable `random01` (same contract as `Math.random`), so tests stay deterministic (`src/iching/cast.js`).
- Prefer **Vuetify** primitives for layout and a11y instead of ad-hoc CSS when possible.
- Definition of done: **`npm run verify`** (runs `.verify.sh`: `npm run lint`, `npm run test`, `npm run build`; it fails if any of them fails) passes, and you report its real output.

## Start of session — read first

1. **`AI_RUNBOOK.md`** — commands, layout, verification, env vars.
2. **`AI_SESSION_MEMORY.md`** — recent decisions and next steps (rolling).
3. Optionally query SimpleMem: `python3 simplemem_cli.py query --question "..."` (requires `.env`).
4. Wiki: `wiki/index.md` (pointer above). It is mostly I Ching scholarship; the app pages are `wiki/entities/being-app-hexagram-data.md`, `wiki/concepts/casting-methods.md` and `wiki/entities/patterns-lab.md`.

## Commands (tested)

Runtime: Node 22 (pinned in `.nvmrc`; `engines` says ≥ 18), npm 10.9; system Python 3.9 for SimpleMem; LanceDB venv Python 3.11. · Last verified: 2026-10-22

| Task | Command (run from root) | Notes |
|------|-------------------------|-------|
| Install | `npm ci` | Exit 0, 269 packages, ~3s. `npm audit`: 17 vulnerabilities (4 moderate, 11 high, 2 critical); not triaged. |
| Lint | `npm run lint` | Exit 0, clean. |
| Unit tests | `npm test` | Exit 0: 11 files, 100 tests, ~2s. No emulator, no network. |
| Production build | `npm run build` | Exit 0, ~1s, output in `dist/` (git-ignored). |
| Verify gate (lint + test + build) | `npm run verify` | PASS. |
| Dev server | `npm run dev` or `npm start` | Vite, default port 5173. Not started on 2026-10-22: 5173 was taken by another repo's Vite. Use `npm run dev -- --port <n>` if busy. |
| SimpleMem query | `SIMPLEMEM_ENABLED=true SIMPLEMEM_BACKEND=local SIMPLEMEM_LOCAL_DIR=docs/simplemem SIMPLEMEM_NAMESPACE=iching-test python3 simplemem_cli.py query --question "..."` | Exit 0 with the env inline (no `.env` needed). Keyword match over 5 committed memories. Deps (`requirements.txt`) were already in system Python. |
| LanceDB venv | `~/.local/bin/uv venv .venv-lancedb --python 3.11 && ~/.local/bin/uv pip install --python .venv-lancedb/bin/python -r requirements-lancedb.txt` | Exit 0. |
| Index docs | `env -u PYTHONPATH -u VIRTUAL_ENV .venv-lancedb/bin/python -u scripts/index_project_knowledge_lancedb.py --apply` | Exit 0, 86 chunks. |
| Search docs | `env -u PYTHONPATH -u VIRTUAL_ENV .venv-lancedb/bin/python -u scripts/search_project_knowledge_lancedb.py "<question>" --top-k 8` | Exit 0, relevant hits. |

## Known baseline

None: clean (lint, 100/100 tests, build on `origin/master` 28c525b, 2026-10-22).

## What can be verified

Lint, Vitest unit tests (I Ching logic in `src/iching/`, hexagram data, `App.vue` mount) and the build.
Layout and visuals have no automated check: look at them on the dev server.

## Running locally and logging in

No login, backend or env vars for the app. `npm run dev`, then http://localhost:5173.

## Rules and skills

- Project rules: `.claude/rules/simplemem.md`, `verify-before-done.md` and `pre-task-retrieval.md` are always on; `.claude/rules/llm-wiki.md` loads when you work in `wiki/`.
- Global rules live in the user’s **`~/.claude/CLAUDE.md`** and **`~/.claude/rules/`** (not in this repo).
- Skills are optional workflows; **this file is the primary project map**.
- Repo skills live in **`.agents/skills/`** and are linked from `.claude/skills/`: `context7` (current library docs), `deploy-to-vercel`, `vercel-cli-with-tokens`, and `web-design-guidelines`. The last three are vendored from `vercel-labs/agent-skills` and pinned in `skills-lock.json`.

## Session memory and close-out

- Rolling log: **`AI_SESSION_MEMORY.md`**.
- On **“mark where you are”** / **“close out”** (exact phrase), follow the global `closeout` skill: update `AI_SESSION_MEMORY.md`, `AI_RUNBOOK.md` as needed, SimpleMem CLI, then branch / PR / merge (do not push straight to default branch).

## SimpleMem

- Namespace: **`iching-test`**.
- Default backend in **`.env.example`**: **local** JSON under **`docs/simplemem/`** (committed). Cloud MCP remains available if you set `SIMPLEMEM_BACKEND=mcp` and a token.
- Import session file: `python3 simplemem_cli.py import-ai-session --path AI_SESSION_MEMORY.md`

## Context7 / current docs (libraries)

When behavior of a dependency is unclear, use the **Context7** MCP with library IDs from **`.cursor/context7-libraries.md`** (see **`.agents/skills/context7/SKILL.md`**). Quick links:

| Library | Notes |
|---------|--------|
| Vue 3 | https://vuejs.org/guide/introduction.html |
| Vuetify 3 | https://vuetifyjs.com/en/getting-started/installation/ |
| Vite | https://vite.dev/guide/ |

## Out of scope / do not assume

- No backend API or database in this repo; it is a static front-end + dev server.
- Do not commit **`.env`**, secrets, or tokens. Use **`.env.example`** only as a template.
- The wiki folder is **`wiki/`** (renamed from `iching-test wiki/` on 2026-10-19 to match the standard layout).

## Git and push safety

- Owner: personal (`noidsoup/iching-test`). Default branch **`master`**; `origin/main` also exists
  but is stale (last commit 5c11e4c, a merge of #9) — branch from and merge to `master`.
- Push to origin only with Nicholas's OK. Root `CLAUDE.md` is Origin's (git-excluded); commit with
  `git -c core.hooksPath=.git/hooks commit` to keep Origin's trailers out.
- The Vercel skills in `.agents/skills/` can deploy: don't run them without Nicholas's OK.
