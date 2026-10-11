---
name: context7
description: "Use when implementing or debugging Vue 3, Vite, Vuetify 3 or Vitest behavior where the API may differ from training data, or when checking config keys, migration steps or breaking changes: pick the library ID from .cursor/context7-libraries.md and query Context7."
---

# Context7 usage

## When to use

- Implementing or debugging **Vue**, **Vite**, **Vuetify**, or **Vitest** behavior where APIs may differ from training data.
- Verifying migration steps, config keys, or breaking changes.

## How to use

1. Open **`.cursor/context7-libraries.md`** and pick the best **library ID** for the question.
2. Call Context7 **query-docs** with that ID and a **specific** question (no secrets, no PII, no proprietary code dumps).
3. Cap at **~3** Context7 calls per assistant turn unless the user explicitly needs more.

## Tips

- Ask narrowly scoped questions (for example: "Vuetify 3 v-dialog persistent prop" not "how do I build an app").
- Cross-check answers against this repo (`vite.config.js`, `src/`, tests).
