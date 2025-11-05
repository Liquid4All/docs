---
sidebar_position: 4
---

# Changelog

## `v0.6.0` - 2025-11-05

**New features**

- Support latest `LFM2-VL` model.

**Improvements**

- Move model type validation to server side for faster new model support in the future.

## `v0.5.1` - 2025-10-06

**Bug fixes**

- Add validation to reject Liquid audio model submissions.
  - Liquid audio models are not supported by the bundle service yet.
  - They will be in a future release.

## `v0.5.0` - 2025-09-24

**New features**

- Add `--quantization` option for the `create` command to specify the quantization type.
  - Supported quantization types: `8da4w_output_8da8w`, `8da8w_output_8da8w`.
  - Default quantization: `8da4w_output_8da8w`.

## `v0.4.0` - 2025-09-16

**New features**

- Add `resume` command to resume an interrupted or failed upload.

**Improvements**

- Add parallel upload support for faster upload speed.
  - Users can choose between `--parallel` and `--sequential` upload modes for `create` and `resume` commands.
  - By default, `--parallel` upload is used. If it fails, upload will fall back to `--sequential` mode.
- Add `--json` option to `create`, `resume`, and `list` commands to output the final results in JSON for easy parsing.
- Add `--last` option to `list` command to show only the last request.
- Show user-friendly information when upload fails.

**Fixes**

- Fix `--output-path` option for `download` command.
  - Previously this option was ignored and the bundle file would always be downloaded to the current directory.

## `v0.3.0` - 2025-08-26

**New features**

- Support `lfm2-vl` models.

**Improvements**

- Show user-friendly information and error messages.
- Fix minor bugs.

## `v0.2.0` - 2025-08-12

**New features**

- Add `validate` command.

**Improvements**

- Add `Notes` columns in request table.
- Validate input model path before creating a request.
- Update and add processing error message.
- Show download URL and link to doc page.

## `v0.1.1` - 2025-07-30

**Improvements**

- Test and report network connectivity before model upload.

## `v0.1.0` - 2025-07-25

Initial release of the [`leap-bundle` package](https://pypi.org/project/leap-bundle).
