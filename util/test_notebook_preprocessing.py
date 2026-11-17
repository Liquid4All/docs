import ast
import unittest

import util.run_notebook_test as runner


class NotebookInstallTest(unittest.TestCase):
    def test_kernel_pip_becomes_image_dependency(self):
        source = '%pip install "transformers==5.23.0" torch accelerate\n'
        groups, setup = runner.parse_packages_from_cell(source)
        self.assertEqual(groups, [["transformers==5.23.0", "torch", "accelerate"]])
        self.assertEqual(setup, [])
        self.assertEqual(runner.strip_pip_lines(source), "")

    def test_continuation_does_not_reach_python_script(self):
        source = "%pip install transformers \\\n    accelerate\nanswer = 42\n"
        combined, setup = runner.combine_cells(
            [
                {"index": 0, "source": runner.strip_pip_lines(source)},
            ]
        )
        ast.parse(combined)
        self.assertIn("answer = 42", combined)
        self.assertNotIn("accelerate", combined)
        self.assertEqual(setup, [])

    def test_existing_install_forms_remain_supported(self):
        for prefix in ["!pip", "!uv pip", "pip"]:
            with self.subTest(prefix=prefix):
                source = f"{prefix} install torch\nanswer = 42"
                groups, _ = runner.parse_packages_from_cell(source)
                self.assertEqual(groups, [["torch"]])
                self.assertEqual(runner.strip_pip_lines(source), "answer = 42")


if __name__ == "__main__":
    unittest.main()
