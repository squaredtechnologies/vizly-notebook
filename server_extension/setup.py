from setuptools import setup, find_packages

setup(
    name="hecks",
    version="0.0.1",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "jupyter-server>=2.0",
        "jupyter",
    ],
    entry_points={
        "console_scripts": [
            "jupyter-hecks = hecks:launch_instance",
            "hecks = hecks:launch_instance",
        ]
    },
)
