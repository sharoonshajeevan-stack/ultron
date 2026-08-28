def format_action_result(result):
    if not result:
        return None

    status = result.get("status", "error")
    message = result.get(
        "message",
        result.get("response", "Command completed."),
    )

    return {
        "status": status,
        "response": message,
        "source": "system",
        "state": (
            "RESPONDING"
            if status in {"success", "confirmation_required"}
            else "IDLE"
        ),
    }