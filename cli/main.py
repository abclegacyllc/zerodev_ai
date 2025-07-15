"""ZeroDev AI CLI.
Run:
  - `python -m zerodev_ai.cli.main init <project_name>`
  - `python -m zerodev_ai.cli.main generate <project_path>`
  - `python -m zerodev_ai.cli.main ci_cd <project_path>`
"""

import argparse
import asyncio
from pathlib import Path
from zerodev_ai.agents.scaffold_agent import scaffold_project
from zerodev_ai.agents.codegen_agent import generate_code_from_spec
from zerodev_ai.agents.ci_cd_agent import create_ci_cd_files
from zerodev_ai.models.spec_model import ProjectSpec
import yaml


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="zerodev", description="ZeroDev AI CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    # init
    p_init = sub.add_parser("init", help="Scaffold a new project directory")
    p_init.add_argument("project_name", help="Name of the project to generate")

    # generate
    p_gen = sub.add_parser("generate", help="Generate code from spec in given project path")
    p_gen.add_argument("project_path", help="Path to scaffolded project with config.yaml")

    # ci_cd
    p_ci = sub.add_parser("ci_cd", help="Add CI/CD + test + Docker setup to project")
    p_ci.add_argument("project_path", help="Path to the project")

    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    if args.command == "init":
        scaffold_project(Path.cwd() / args.project_name)

    elif args.command == "generate":
        project_dir = Path(args.project_path)
        with open(project_dir / "config.yaml", "r", encoding="utf-8") as f:
            raw = yaml.safe_load(f)
        spec = ProjectSpec(**raw)
        asyncio.run(generate_code_from_spec(spec, project_dir))

    elif args.command == "ci_cd":
        create_ci_cd_files(
            project_path=args.project_path,
            project_name=Path(args.project_path).name
        )


if __name__ == "__main__":
    main()
