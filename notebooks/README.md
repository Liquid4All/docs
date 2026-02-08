# Notebooks

This directory contains example notebooks for LFM2 models demonstrating inference and fine-tuning.

## Running Quality Checks

We use automated checks to ensure notebooks don't have basic issues like syntax errors, undefined variables, or import errors.

**Prerequisites**

```bash
cd notebooks

uv sync --extra dev
```

**Running Checks**

```bash
cd notebooks

uv run nbqa ruff .
uv run nbqa mypy .
```

**Auto-fixing Issues**

Ruff can automatically fix some issues:

```bash
uv run nbqa ruff . --fix
```

## CI Integration

These checks run automatically in CI on every pull request. See `.github/workflows/notebooks-check.yaml` for details.

## Troubleshooting

**"Module not found" errors:**
- This is expected if you haven't installed notebook dependencies
- The check verifies the import syntax is correct, not that packages are installed

**mypy type errors:**
- Type checking errors are informational and won't block CI
- You can ignore them for exploratory notebooks
- Consider fixing them for production code

**False positives:**
- You can ignore specific lines with comments:
  ```python
  import rarely_used  # ruff: noqa: F401
  x = expensive_computation()  # ruff: noqa: F841
  ```
