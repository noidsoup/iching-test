---
description: Project wiki — read wiki/SCHEMA.md before any wiki operation
paths:
  - "wiki/**"
---

# Project wiki

The wiki lives in `wiki/` (an Obsidian vault). Start at `wiki/index.md`.

Before creating, updating, or querying wiki pages, read `wiki/SCHEMA.md` for conventions.
Pages use `[[wikilinks]]` and YAML frontmatter. Lint with
`python3 ~/.claude/skills/closeout/wiki-template/wiki_lint.py .`.

When the user says "ingest", "add to wiki", "lint wiki", or "query wiki", follow the operations in SCHEMA.md.
