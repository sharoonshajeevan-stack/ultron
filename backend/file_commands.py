import os
from pathlib import Path


def get_special_folders():
    home = Path.home()

    folders = {
        "desktop": home / "Desktop",
        "documents": home / "Documents",
        "downloads": home / "Downloads",
        "pictures": home / "Pictures",
        "videos": home / "Videos",
        "music": home / "Music",
    }

    # Windows OneDrive folders
    one_drive = os.environ.get("OneDrive")

    if one_drive:
        one_drive = Path(one_drive)

        folders["desktop"] = one_drive / "Desktop"
        folders["documents"] = one_drive / "Documents"
        folders["pictures"] = one_drive / "Pictures"
        folders["videos"] = one_drive / "Videos"
        folders["music"] = one_drive / "Music"

        # Downloads normally remains outside OneDrive
        downloads = home / "Downloads"

        if downloads.exists():
            folders["downloads"] = downloads
        elif (one_drive / "Downloads").exists():
            folders["downloads"] = one_drive / "Downloads"

    return folders


SPECIAL_FOLDERS = get_special_folders()


ALIASES = {
    "desktop": "desktop",

    "document": "documents",
    "documents": "documents",

    "download": "downloads",
    "downloads": "downloads",

    "picture": "pictures",
    "pictures": "pictures",

    "video": "videos",
    "videos": "videos",

    "music": "music",
}


def open_folder(folder_name):
    name = str(folder_name or "").strip().lower()

    if name.startswith("open "):
        name = name[5:].strip()

    key = ALIASES.get(name)

    if not key:
        return {
            "status": "error",
            "message": f"Folder not supported: {folder_name}",
        }

    folder = SPECIAL_FOLDERS.get(key)

    if not folder:
        return {
            "status": "error",
            "message": f"Folder path not configured: {name}",
        }

    folder = Path(folder)

    if not folder.exists():
        return {
            "status": "error",
            "message": f"Folder not found: {folder}",
        }

    try:
        os.startfile(str(folder))

        return {
            "status": "success",
            "message": f"Opening {folder.name}.",
            "path": str(folder),
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to open folder: {error}",
        }


def open_path(path):
    path = str(path or "").strip()

    if not path:
        return {
            "status": "error",
            "message": "No path provided.",
        }

    try:
        target = Path(path).expanduser()

        if not target.exists():
            return {
                "status": "error",
                "message": f"Path not found: {target}",
            }

        os.startfile(str(target))

        return {
            "status": "success",
            "message": f"Opening {target.name}.",
            "path": str(target),
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to open path: {error}",
        }