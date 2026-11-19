# Documentation audit follow-up

Checked on 2026-11-19 in PR #186, after merging current main. This record is repository maintenance content and must remain excluded by `.mintignore`.

## Remaining findings addressed

| Findings | Resolution |
| --- | --- |
| G6-01 | Follow the file-content redirect with `curl -L`. |
| G6-02, G6-03, G6-05, G6-10 | Add typed chat messages, request controls, tools, structured output, streaming, typed decision questions/answers, audio, model/file/batch lists, timestamps, and errors. Model examples use current ids. The content download is a 302, not a JSON 200. |
| G6-04, G6-14 | Remove unverified blanket hosted context values; direct readers to Console for hosted limits. Identify the direct online inference endpoints covered by ZDR and distinguish stored batch files and other surfaces. Checked against current endpoint validation and capture behavior, without assuming native checkpoint limits apply to hosting. |
| G3-08 | Replace the undefined Unsloth dataset, obsolete trainer argument, and incorrect LoRA targets with a complete, pinned two-step example. Assert adapter coverage rather than silently training only a subset. |
| G3-09, G3-10 | Use Liquid Finetune's `envs/rocm` environment and actual `AGENTS.md` guidance. |
| G3-16, G3-19, G3-20, G3-23 | Use native vLLM 0.34.0 LFM3 support, modern quantization configuration and HF authentication, and preserve current-turn reasoning in tool history. |
| G3-21 | Remove the blanket internal-evaluation exemption that the license does not state. |
| G7-01, G7-02, G7-03, G7-05, G7-06, G7-07, G7-08, G7-10 | Correct browser training targets, transcript filename/download path, invoice watch options, dataset ownership setup, W&B secrets, working directories, and Modal volume paths. |
| G7-11, G7-12, G7-14, G7-16, G7-17, G7-18, G7-25 | Correct the home-assistant baseline repository, wildfire/browser/racer setup, the racing game's legacy model default, translation checkpoint defaults, and image/audio descriptions. Scope historical measurements to their original models. |
| G5-01–G5-10 | Use stable 0.10.9 pins/checksums, update Swift configuration/media factories, handle in-band Error events, use SKIE cloud streaming, correct bridged function types/call labels and sideloaded argument lists, and remove instructions to copy unpublished audio adapters. Distinguish API integration fragments from a complete sample app. |
| G5-05, G5-06 | Explicitly mark the LEAP catalog/auth/bundling service unavailable and point to current downloads or local sideloading. Preserve useful archived SDK documentation. |
| G8-10 | Add explicit redirects for the historical routes and their previously missing wildcard destinations. Restore the useful pre-trained LFM2.5 base checkpoint page without presenting Instruct conversions as base weights. |
| G1-10, G2-16 | Materialize shared quickstarts as literal Markdown code fences on 26 model pages. Keep template parameters in generation comments and check freshness in CI. |
| G4-08 | Replace the removed Python grammar helper with current server JSON-schema support and the C++ helper. |
| G1-01, G1-03, G2-03, G2-09 | Document d1 Omni video frames, include Extract models in the 128K summary, fix the 230M recommendation, and complete Japanese ASR/TTS. Decode Japanese text after collecting tokens to avoid split UTF-8 characters. |

These are the outstanding substantive findings from the comparison, plus related defects found while checking their sources. Findings already resolved in #183 or the earlier #186 commits are preserved. Intentional navigation choices and deprecated model coverage are not publication exclusions.

## Executed validation

- Unsloth on Modal H100: Python 3.12, Unsloth/Unsloth Zoo 2026.11.7, Torch 2.14.0, Transformers 5.17.0, TRL 1.15.0, PEFT 0.21.3. Two training steps completed, all eight requested module types received adapters, and the adapter was saved. This is a setup smoke test, not a quality benchmark.
- Restored LFM2.5 base example: Transformers 5.23.0 / Torch 2.15.0 in Modal; generated 32 completion tokens from a raw prompt.
- Japanese audio: liquid-audio 1.3.0 in Modal. Transcribed the model card's Japanese recording, retained the expected phrase without Unicode replacement characters, and generated a nonempty 24 kHz WAV. Tested the exact ASR/TTS code blocks with their shared initialization.
- d1 Omni video: Transformers 5.23.0 on Modal H100. Executed the exact video block against a two-second synthetic MP4, sampled two frames at 1 fps, and received a valid probability. This checks the video input API, not decision quality.
- Swift 6.2.3, macOS 15 SDK, released 0.10.9 XCFrameworks: type-checked configuration, throwing media conversion, all six response variants, function registration, cloud streaming/hybrid routing, provider configuration, and local text/vision/audio sideloading. No iOS device runtime test was performed.
- Invoice project: installed its dependencies and ran the real `watch --help`; `--output` is absent. Browser-control: dry-ran the documented Makefile target. Home-assistant and satellite dataset, secret, tracker, and checkpoint paths were checked against their current source/configs and Liquid Finetune's output-directory resolver. Full training/data publication jobs were not launched.
- OpenAPI 3.1 document validated with `openapi-spec-validator`; local references and deterministic supplements checked. No authenticated hosted inference/batch execution was performed in this follow-up.
- Ten publication/generation/schema regression tests, generated-snippet freshness, link snapshot, Python/shell syntax checks, Mintlify build validation, and internal link scan passed.

Preview HTTP routes, redirects, Markdown exports, and excluded internal files are checked after deployment. Full GPU framework/notebook checks from #183 and the speculative decoding tests from earlier #186 commits remain recorded in `lfm3-modernization.md` and the previous PR evidence.
