# Notebooks

This directory contains example notebooks for LFM2 models.

## Quality checks

We use automated checks to ensure notebooks don't have basic issues like syntax errors, undefined variables, or import errors. These checks run automatically in CI on every pull request. See `.github/workflows/notebooks-check.yaml` for details.

**Run local checks**

```bash
cd notebooks

# install dependencies (only needs to be done once)
uv sync --extra dev

## run checks:
uv run nbqa ruff .
uv run nbqa mypy .
```

**Auto-fix issues**

Ruff can automatically fix some issues:

```bash
uv run nbqa ruff . --fix
```

## Troubleshooting

**"Module not found" errors:**
- This is expected if you haven't installed notebook dependencies
- The check verifies the import syntax is correct, not that packages are installed

**mypy type errors:**
- Sometimes mypy cannot correctly infer types in notebooks. You can add explicit type annotations, or ignore specific lines with `# type: ignore`.
- If a mypy rule is too strict, you can also disable it in `pyproject.toml` under the `[tool.mypy]` section.

**Ruff false positives:**
- You can ignore specific lines with comments:
  ```python
  import rarely_used  # ruff: noqa: F401
  x = expensive_computation()  # ruff: noqa: F841
  ```
