from setuptools import find_packages, setup

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="bitnet-blockchain-forensics",
    version="0.1.0",
    author="BitNet Forensics Team",
    description="AI-powered blockchain forensic data review using BitNet b1.58",
    long_description=long_description,
    long_description_content_type="text/markdown",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.10",
    install_requires=[
        "numpy>=1.26",
        "pandas>=2.1",
        "scikit-learn>=1.4",
        "torch>=2.2",
        "transformers>=4.38",
        "web3>=6.15",
        "fastapi>=0.110",
        "pydantic>=2.6",
        "pydantic-settings>=2.2",
        "loguru>=0.7",
        "sqlalchemy>=2.0",
        "typer>=0.9",
        "rich>=13.7",
    ],
    extras_require={
        "dev": [
            "pytest>=8.0",
            "pytest-cov>=4.1",
            "pytest-asyncio>=0.23",
            "black>=24.2",
            "ruff>=0.3",
            "mypy>=1.8",
            "pre-commit>=3.6",
        ],
        "jupyter": [
            "jupyter>=1.0",
            "notebook>=7.0",
            "jupyterlab>=4.0",
            "ipykernel>=6.29",
        ],
        "gpu": [
            "torch>=2.2",
            "accelerate>=0.27",
            "xgboost>=2.0",
            "lightgbm>=4.3",
        ],
        "visualization": [
            "matplotlib>=3.8",
            "seaborn>=0.13",
            "plotly>=5.18",
            "pyvis>=0.3",
        ],
    },
)
