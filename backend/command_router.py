import re


from system_commands import (
    execute_launch_app,
    execute_open_url,
    execute_get_processes,
    execute_get_system_info,
    execute_shutdown,
    execute_restart,
    execute_lock,
    execute_sleep,
    confirm_shutdown,
    confirm_restart,
    cancel_power_action,
    execute_screenshot,
)

from file_search import search_files, open_file

from window_commands import (
    minimize_window,
    maximize_window,
    restore_window,
    request_close_window,
    confirm_close_window,
)

from file_commands import open_folder



APP_ALIASES = {
    "notepad": "notepad",
    "notepad.exe": "notepad",

    "calculator": "calculator",
    "calc": "calculator",
    "calculator app": "calculator",

    "chrome": "chrome",
    "google chrome": "chrome",
    "chrome browser": "chrome",
    "google browser": "chrome",

    "explorer": "explorer",
    "file explorer": "explorer",
    "windows explorer": "explorer",

    "cmd": "cmd",
    "command prompt": "cmd",
}


FOLDER_ALIASES = {
    "open desktop": "desktop",

    "open document": "documents",
    "open documents": "documents",

    "open download": "downloads",
    "open downloads": "downloads",

    "open picture": "pictures",
    "open pictures": "pictures",

    "open video": "videos",
    "open videos": "videos",

    "open music": "music",

        "show desktop": "desktop",
    "show my desktop": "desktop",

    "show documents": "documents",
    "show my documents": "documents",

    "show downloads": "downloads",
    "show my downloads": "downloads",

    "show pictures": "pictures",
    "show my pictures": "pictures",

    "show videos": "videos",
    "show my videos": "videos",

    "show music": "music",
    "show my music": "music",
}

def normalize_command(text):
    text = text.strip().lower()
    text = re.sub(r"[.,!?;:]+$", "", text).strip()
    return text

    # Remove common punctuation from voice transcription
    text = re.sub(r"[.,!?;:]+$", "", text).strip()

    replacements = {
        "please ": "",
        "can you ": "",
        "could you ": "",
        "would you ": "",
        "i want you to ": "",
        "i need you to ": "",
    }

    for prefix, replacement in replacements.items():
        if text.startswith(prefix):
            text = text[len(prefix):]
            break
            
    return text.strip()

def route_command(command):
    text = normalize_command(str(command or ""))

    if not text:
        return None

    # ------------------------------------------------------------
    # OPEN URL
    # ------------------------------------------------------------

    url_match = re.match(
        r"^(open|go to|visit)\s+(.+)$",
        text,
    )

    if url_match:
        target = url_match.group(2).strip()

        url_aliases = {
            "youtube": "https://youtube.com",
            "youtube.com": "https://youtube.com",
            "google": "https://google.com",
            "google.com": "https://google.com",
            "github": "https://github.com",
            "github.com": "https://github.com",
        }

        if target in url_aliases:
            return execute_open_url(url_aliases[target])

        if target.startswith(("http://", "https://", "www.")):
            return execute_open_url(target)

    # ------------------------------------------------------------
    # OPEN APPLICATION
    # ------------------------------------------------------------

    app_patterns = [
        r"^open\s+(.+)$",
        r"^launch\s+(.+)$",
        r"^start\s+(.+)$",
    ]

    for pattern in app_patterns:
        match = re.match(pattern, text)

        if not match:
            continue

        app_name = match.group(1).strip()

        app_name = re.sub(
            r"^(the|my)\s+",
            "",
            app_name,
        )

        if app_name in APP_ALIASES:
            return execute_launch_app(
                APP_ALIASES[app_name]
            )

    # ------------------------------------------------------------
    # SCREENSHOT
    # ------------------------------------------------------------

    if text in {
        "take screenshot",
        "take a screenshot",
        "screenshot",
        "capture screen",
        "capture the screen",
        "capture screenshot",
        "capture a screenshot",
        "take screen shot",
        "take a screen shot",
    }:
        return execute_screenshot()

    # ------------------------------------------------------------
    # PROCESS LIST
    # ------------------------------------------------------------

    process_commands = {
        "show processes",
        "list processes",
        "get processes",
        "show running processes",
        "what processes are running",
    }

    if text in process_commands:
        return execute_get_processes()

    # ------------------------------------------------------------
    # SYSTEM INFORMATION
    # ------------------------------------------------------------

    system_commands = {
        "system information",
        "system info",
        "get system information",
        "show system information",
        "show system info",
    }

    if text in system_commands:
        return execute_get_system_info()

    # ------------------------------------------------------------
    # POWER CONTROLS
    # ------------------------------------------------------------

    if text in {
        "shutdown",
        "shut down",
        "shutdown computer",
        "shut down computer",
    }:
        return execute_shutdown()

    if text in {
        "restart",
        "restart computer",
        "reboot",
        "reboot computer",
    }:
        return execute_restart()

    if text in {
        "lock",
        "lock computer",
        "lock pc",
    }:
        return execute_lock()

    if text in {
        "sleep",
        "sleep computer",
        "sleep pc",
    }:
        return execute_sleep()

    # ------------------------------------------------------------
    # POWER CONFIRMATION
    # ------------------------------------------------------------

    if text in {
        "yes shutdown",
        "confirm shutdown",
        "shutdown confirmed",
    }:
        return confirm_shutdown()

    if text in {
        "yes restart",
        "confirm restart",
        "restart confirmed",
    }:
        return confirm_restart()

    if text in {
        "cancel shutdown",
        "cancel restart",
        "cancel power action",
        "no",
        "cancel",
    }:
        return cancel_power_action()

    # ------------------------------------------------------------
    # FOLDER COMMANDS
    # ------------------------------------------------------------

    if text in {
        "open desktop",
        "open document",
        "open documents",
        "open download",
        "open downloads",
        "open picture",
        "open pictures",
        "open video",
        "open videos",
        "open music",
    }:
        folder = text[5:].strip()
        return open_folder(folder)

    return None