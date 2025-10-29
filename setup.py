from setuptools import setup

try:
    with open("README.md", "r", encoding="utf-8") as fh:
        long_description = fh.read()
except FileNotFoundError:
    long_description = "Flask application with OpenAI integration and JFrog repository management"

try:
    with open("requirements.txt", "r", encoding="utf-8") as fh:
        requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]
except FileNotFoundError:
    requirements = []

setup(
    name="try-open-ai",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="Flask application with OpenAI integration and JFrog repository management",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/try_open_ai",
    py_modules=["open_ai", "repository_manager"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.9",
    install_requires=requirements,
    include_package_data=True,
    package_data={
        "": ["templates/*.html", "static/css/*.css", "static/js/*.js"],
    },
)

