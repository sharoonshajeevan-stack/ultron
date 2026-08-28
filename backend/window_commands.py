import ctypes


user32 = ctypes.windll.user32

SW_MINIMIZE = 6
SW_MAXIMIZE = 3
SW_RESTORE = 9


def get_active_window():
    return user32.GetForegroundWindow()


def minimize_window():
    try:
        hwnd = get_active_window()

        if not hwnd:
            return {
                "status": "error",
                "message": "No active window found.",
            }

        user32.ShowWindow(hwnd, SW_MINIMIZE)

        return {
            "status": "success",
            "message": "Window minimized.",
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to minimize window: {error}",
        }


def maximize_window():
    try:
        hwnd = get_active_window()

        if not hwnd:
            return {
                "status": "error",
                "message": "No active window found.",
            }

        user32.ShowWindow(hwnd, SW_MAXIMIZE)

        return {
            "status": "success",
            "message": "Window maximized.",
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to maximize window: {error}",
        }


def restore_window():
    try:
        hwnd = get_active_window()

        if not hwnd:
            return {
                "status": "error",
                "message": "No active window found.",
            }

        user32.ShowWindow(hwnd, SW_RESTORE)

        return {
            "status": "success",
            "message": "Window restored.",
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to restore window: {error}",
        }


def close_window():
    try:
        hwnd = get_active_window()

        if not hwnd:
            return {
                "status": "error",
                "message": "No active window found.",
            }

        WM_CLOSE = 0x0010

        user32.PostMessageW(
            hwnd,
            WM_CLOSE,
            0,
            0,
        )

        return {
            "status": "success",
            "message": "Window close requested.",
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to close window: {error}",
        }

def request_close_window():
    return {
        "status": "confirmation_required",
        "action": "close_window",
        "message": "Close the active window? Please confirm.",
    }


def confirm_close_window():
    try:
        hwnd = get_active_window()

        if not hwnd:
            return {
                "status": "error",
                "message": "No active window found.",
            }

        WM_CLOSE = 0x0010

        user32.PostMessageW(
            hwnd,
            WM_CLOSE,
            0,
            0,
        )

        return {
            "status": "success",
            "message": "Window close requested.",
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to close window: {error}",
        }