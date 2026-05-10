# CrewAI planner (optional)

Generates an implementation checklist at **`.cursor/plans/PLAN.md`** for the two-phase planner → implementer workflow (see global Cursor rule *two-phase-plan-implement*).

## Why a local `crewai/.venv`

The system `crewai` CLI can break when global `pydantic` / Python packages disagree. This repo keeps an isolated venv under `crewai/.venv`.

## Setup

```bash
cd crewai
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/pip install -e planner/
```

Copy `planner/.env.example` to `planner/.env` and set **`OPENAI_API_KEY`** (or provider vars your CrewAI install expects).

## Run

From `crewai/planner` (so output paths resolve correctly):

```bash
cd crewai/planner
../.venv/bin/python -m planner.main
```

Or with a task description:

```bash
export PLAN_TASK="Add keyboard shortcuts to the hexagram oracle."
cd crewai/planner
../.venv/bin/python -m planner.main
```

The final task writes **`../../.cursor/plans/PLAN.md`** (repository root).

### `crewai install` / `uv`

`crewai install` may call `uv sync` and fail on some macOS setups (for example missing `onnxruntime` wheels when `crewai[tools]` is used). This repo pins **`crewai==1.9.3`** without the `tools` extra and uses **`pip install -e planner/`** instead.

## Environment

- `planner/.env.example` — template for API keys (never commit `planner/.env`).
