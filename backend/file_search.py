import os
from pathlib import Path


SEARCH_ROOTS = [
    Path.home() / "Desktop",
    Path.home() / "Documents",
    Path.home() / "Downloads",
    Path.home() / "Pictures",
    Path.home() / "Videos",
    Path.home() / "Music",
]


def search_files(query, max_results=20):
    query = str(query or "").strip().lower()

    if not query:
        return {
            "status": "error",
            "message": "No search query provided.",
            "results": [],
        }

    results = []

    for root in SEARCH_ROOTS:
        if not root.exists():
            continue

        try:
            for path in root.rglob("*"):
                if len(results) >= max_results:
                    break

                if not path.is_file():
                    continue

                if query in path.name.lower():
                    results.append({
                        "name": path.name,
                        "path": str(path),
                        "folder": path.parent.name,
                    })

        except (PermissionError, OSError):
            continue

        if len(results) >= max_results:
            break

    if not results:
        return {
            "status": "success",
            "message": f"No files found for '{query}'.",
            "results": [],
        }

    return {
        "status": "success",
        "message": f"Found {len(results)} file(s).",
        "results": results,
        "count": len(results),
    }
def open_file(path):
    path = str(path or "").strip()

    if not path:
        return {
            "status": "error",
            "message": "No file path provided.",
        }

    try:
        file_path = Path(path)

        if not file_path.exists():
            return {
                "status": "error",
                "message": f"File not found: {path}",
            }

        if not file_path.is_file():
            return {
                "status": "error",
                "message": "The specified path is not a file.",
            }

        os.startfile(str(file_path))

        return {
            "status": "success",
            "message": f"Opening {file_path.name}.",
            "path": str(file_path),
        }

    except Exception as error:
        return {
            "status": "error",
            "message": f"Failed to open file: {error}",
        }