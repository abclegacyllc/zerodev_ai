"""ZeroDev AI — package root."""
__all__ = [
    "__version__",
]
__version__ = "0.1.0"

# ================================
# zerodev_ai/cli/__init__.py

# (empty)

# ================================
# zerodev_ai/cli/main.py

#!/usr/bin/env python3
"""Command-line interface for ZeroDev AI.
Run `python -m zerodev_ai.cli.main init my_project` to scaffold a project.
"""
from __future__ import annotations

import argparse
from pathlib import Path

from zerodev_ai.agents.scaffold_agent import scaffold_project


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="zerodev", description="ZeroDev AI CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init", help="Scaffold a new project directory")
    p_init.add_argument("project_name", help="Name of the project to generate")

    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    if args.command == "init":
        scaffold_project(Path.cwd() / args.project_name)


if __name__ == "__main__":
    main()
