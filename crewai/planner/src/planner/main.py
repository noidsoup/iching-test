#!/usr/bin/env python
import os
import sys
import warnings

from datetime import datetime

from planner.crew import Planner

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    default_task = (
        "Describe a small, concrete change for the iching-test Vue app "
        "(e.g. adjust copy, fix a test, tweak Vuetify layout)."
    )
    inputs = {
        "task_description": os.environ.get("PLAN_TASK", default_task),
        "current_year": str(datetime.now().year),
    }

    try:
        Planner().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "task_description": os.environ.get("PLAN_TASK", "Training placeholder task."),
        "current_year": str(datetime.now().year),
    }
    try:
        Planner().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Planner().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "task_description": os.environ.get("PLAN_TASK", "Test placeholder task."),
        "current_year": str(datetime.now().year),
    }

    try:
        Planner().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

def run_with_trigger():
    """
    Run the crew with trigger payload.
    """
    import json

    if len(sys.argv) < 2:
        raise Exception("No trigger payload provided. Please provide JSON payload as argument.")

    try:
        trigger_payload = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        raise Exception("Invalid JSON payload provided as argument")

    inputs = {
        "crewai_trigger_payload": trigger_payload,
        "task_description": trigger_payload.get("task_description", ""),
        "current_year": str(datetime.now().year),
    }

    try:
        result = Planner().crew().kickoff(inputs=inputs)
        return result
    except Exception as e:
        raise Exception(f"An error occurred while running the crew with trigger: {e}")
