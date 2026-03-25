import modal
import subprocess, sys, os, tempfile

app = modal.App("ci-runner")

@app.function(
    gpu="A10G",
    timeout=600,
    secrets=[modal.Secret.from_name("huggingface")],
    image=modal.Image.debian_slim(python_version="3.12")
        .apt_install("curl", "wget", "zstd", "git")
        .pip_install("uv", "typing_extensions>=4.14.0", "huggingface_hub"),
)
def run_code(code: str, pip_packages: list[list[str]] = [], setup_commands: list[str] = []) -> dict:

    # Disable vLLM v1 multiprocessing (incompatible with containers)
    os.environ["VLLM_ENABLE_V1_MULTIPROCESSING"] = "0"

    # Restore real stdout/stderr — Modal wraps them with objects that
    # lack fileno(), which breaks subprocesses and libraries like vLLM.
    real_stdout = open("/dev/stdout", "w")
    real_stderr = open("/dev/stderr", "w")
    sys.stdout = real_stdout
    sys.stderr = real_stderr

    for group in pip_packages:
        print(f"[ci-runner] Installing: {group}")
        subprocess.check_call(
            ["uv", "pip", "install", "--system", *group],
            stdout=real_stdout, stderr=real_stderr,
        )

    for cmd in setup_commands:
        print(f"[ci-runner] Setup: {cmd}")
        subprocess.run(cmd, shell=True, check=True, stdout=real_stdout, stderr=real_stderr)

    # Remove Modal's bundled deps from sys.path to prevent shadowing
    clean_path = [p for p in sys.path if "/__modal/deps" not in p]

    # Prepend HF login if token is available
    hf_token = os.environ.get("HF_TOKEN")
    if hf_token:
        code = (
            "from huggingface_hub import login as _hf_login\n"
            f"_hf_login(token={hf_token!r})\n"
            "print('[ci-runner] HuggingFace login successful')\n"
            "del _hf_login\n\n"
        ) + code
    else:
        print("[ci-runner] WARNING: No HF_TOKEN found, skipping HuggingFace login")

    # Write code to a temp file and run as a subprocess so that
    # stdout/stderr are real file descriptors (required by vLLM, etc.)
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(code)
        script_path = f.name

    env = os.environ.copy()
    env["PYTHONPATH"] = ":".join(clean_path)

    proc = subprocess.run(
        [sys.executable, script_path],
        capture_output=True,
        text=True,
        timeout=540,
        env=env,
    )

    os.unlink(script_path)

    return {
        "success": proc.returncode == 0,
        "stdout": proc.stdout,
        "stderr": proc.stderr,
        "error": None if proc.returncode == 0 else f"Exit code {proc.returncode}\n{proc.stderr[-2000:] if proc.stderr else ''}",
    }
