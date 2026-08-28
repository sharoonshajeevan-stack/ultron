import logging
import os
import subprocess
import webbrowser
from datetime import datetime
from file_commands import open_folder, open_path
from file_search import search_files
from window_commands import (
    minimize_window,
    maximize_window,
    restore_window,
)

logger = logging.getLogger(__name__)


COMMAND_PERMISSIONS = {
    "shutdown": False,
    "restart": False,
    "launch_app": True,
    "open_url": True,
    "get_processes": True,
    "get_system_info": True,
    "lock": True,
    "sleep": True,
    "screenshot": True,
}


APPLICATIONS = {
    "notepad": "notepad.exe",
    "calculator": "calc.exe",
    "chrome": r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "explorer": "explorer.exe",
    "cmd": "cmd.exe",
}


def set_command_permission(command, enabled):
    if command not in COMMAND_PERMISSIONS:
        return {
            "status": "error",
            "message": f"Unknown permission: {command}",
        }

    COMMAND_PERMISSIONS[command] = bool(enabled)

    return {
        "status": "success",
        "command": command,
        "enabled": COMMAND_PERMISSIONS[command],
    }


def get_command_permissions():
    return {
        "status": "success",
        "permissions": COMMAND_PERMISSIONS.copy(),
    }


def execute_shutdown():
    if not COMMAND_PERMISSIONS["shutdown"]:
        return {
            "status": "error",
            "message": "Shutdown permission is disabled.",
        }

    return {
        "status": "confirmation_required",
        "action": "shutdown",
        "message": "Shutdown requested. Please confirm.",
    }


def execute_restart():
    if not COMMAND_PERMISSIONS["restart"]:
        return {
            "status": "error",
            "message": "Restart permission is disabled.",
        }

    return {
        "status": "confirmation_required",
        "action": "restart",
        "message": "Restart requested. Please confirm.",
    }


def execute_launch_app(app_name):
    app_name = str(app_name or "").strip().lower()

    app = APPLICATIONS.get(app_name)

    if app_name == "chrome" and not os.path.exists(app):
        app = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

    if not app:
        return {
            "status": "error",
            "message": f"Application not supported: {app_name}",
        }

    try:
        if os.path.isfile(app):
            subprocess.Popen([app])
        else:
            subprocess.Popen(app)

        return {
            "status": "success",
            "message": f"Opening {app_name}",
            "application": app_name,
        }

    except Exception as error:
        logger.exception("Application launch failed")

        return {
            "status": "error",
            "message": f"Failed to open {app_name}: {error}",
        }


def execute_open_url(url):
    try:
        url = str(url or "").strip()

        if not url:
            return {
                "status": "error",
                "message": "No URL provided.",
            }

        if not url.startswith(("http://", "https://")):
            url = "https://" + url

        opened = webbrowser.open(url)

        if not opened:
            return {
                "status": "error",
                "message": f"Could not open URL: {url}",
            }

        return {
            "status": "success",
            "message": f"Opening {url}",
            "url": url,
        }

    except Exception as error:
        logger.exception("URL opening failed")

        return {
            "status": "error",
            "message": f"URL opening failed: {error}",
        }


def execute_get_processes():
    if not COMMAND_PERMISSIONS["get_processes"]:
        return {
            "status": "error",
            "message": "Process access permission is disabled.",
        }

    try:
        result = subprocess.run(
            ["tasklist"],
            capture_output=True,
            text=True,
            timeout=10,
        )

        return {
            "status": "success",
            "processes": result.stdout,
        }

    except Exception as error:
        logger.exception("Process listing failed")

        return {
            "status": "error",
            "message": str(error),
        }


def execute_get_system_info():
    if not COMMAND_PERMISSIONS["get_system_info"]:
        return {
            "status": "error",
            "message": "System information permission is disabled.",
        }

    try:
        return {
            "status": "success",
            "system": {
                "platform": os.name,
                "computer": os.environ.get(
                    "COMPUTERNAME",
                    "Unknown",
                ),
                "user": os.environ.get(
                    "USERNAME",
                    "Unknown",
                ),
            },
        }

    except Exception as error:
        logger.exception("System information failed")

        return {
            "status": "error",
            "message": str(error),
        }


def execute_lock():
    if not COMMAND_PERMISSIONS["lock"]:
        return {
            "status": "error",
            "message": "Lock permission is disabled.",
        }

    try:
        import ctypes

        ctypes.windll.user32.LockWorkStation()

        return {
            "status": "success",
            "message": "Computer locked.",
        }

    except Exception as error:
        logger.exception("Computer lock failed")

        return {
            "status": "error",
            "message": f"Failed to lock computer: {error}",
        }


def execute_sleep():
    if not COMMAND_PERMISSIONS["sleep"]:
        return {
            "status": "error",
            "message": "Sleep permission is disabled.",
        }

    try:
        subprocess.Popen(
            [
                "powershell.exe",
                "-NoProfile",
                "-Command",
                "Add-Type -AssemblyName System.Windows.Forms; "
                "[System.Windows.Forms.Application]::SetSuspendState("
                "'Suspend', $false, $false)"
            ]
        )

        return {
            "status": "success",
            "message": "Computer entering sleep mode.",
        }

    except Exception as error:
        logger.exception("Computer sleep failed")

        return {
            "status": "error",
            "message": f"Failed to sleep computer: {error}",
        }


def confirm_shutdown():
    try:
        subprocess.Popen(
            ["shutdown", "/s", "/t", "5"],
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
        )

        return {
            "status": "success",
            "message": "System shutdown initiated.",
        }

    except Exception as error:
        logger.exception("Shutdown failed")

        return {
            "status": "error",
            "message": f"Shutdown failed: {error}",
        }


def confirm_restart():
    try:
        subprocess.Popen(
            ["shutdown", "/r", "/t", "5"],
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
        )

        return {
            "status": "success",
            "message": "System restart initiated.",
        }

    except Exception as error:
        logger.exception("Restart failed")

        return {
            "status": "error",
            "message": f"Restart failed: {error}",
        }


def cancel_power_action():
    try:
        subprocess.Popen(
            ["shutdown", "/a"],
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
        )

        return {
            "status": "success",
            "message": "Power action cancelled.",
        }

    except Exception as error:
        logger.exception("Power action cancellation failed")

        return {
            "status": "error",
            "message": f"Could not cancel power action: {error}",
        }


def execute_screenshot():
    if not COMMAND_PERMISSIONS["screenshot"]:
        return {
            "status": "error",
            "message": "Screenshot permission is disabled.",
        }

    try:
        from PIL import ImageGrab

        screenshot_dir = r"C:\Users\sharo\OneDrive\Pictures\Screenshots"
        os.makedirs(screenshot_dir, exist_ok=True)

        filename = datetime.now().strftime(
            "screenshot_%Y%m%d_%H%M%S.png"
        )

        filepath = os.path.join(
            screenshot_dir,
            filename,
        )

        image = ImageGrab.grab()
        image.save(filepath)

        return {
            "status": "success",
            "message": f"Screenshot saved: {filepath}",
            "path": filepath,
        }

    except Exception as error:
        logger.exception("Screenshot failed")

        return {
            "status": "error",
            "message": f"Screenshot failed: {error}",
        }


def open_application(name):
    return execute_launch_app(name)


def execute_system_command(action, target=None):
    if action == "open":
        return execute_launch_app(target)

    if action == "open_folder":
        return open_folder(target)

    if action == "open_path":
        return open_path(target)

    if action == "search_files":
        return search_files(target)

    if action == "minimize":
        return minimize_window()

    if action == "maximize":
        return maximize_window()

    if action == "restore":
        return restore_window()

    if action == "shutdown":
        return execute_shutdown()

    if action == "restart":
        return execute_restart()

    if action == "close":
        return {
            "status": "error",
            "message": "Application closing is not enabled yet.",
        }

    return {
        "status": "error",
        "message": "Unknown system command.",
    }