from .hecksapp import HecksApp


def _jupyter_server_extension_paths():
    return [{"module": "hecks"}]


def _jupyter_server_extension_points():
    """
    Returns a list of dictionaries with metadata describing
    the extension.
    """
    return [{"module": "hecks", "app": HecksApp}]


def launch_instance():
    HecksApp.launch_instance()
