import logging
from datetime import datetime

from ai_engine import process_ai_command

logger = logging.getLogger(__name__)


class UltronController:
    def __init__(self):
        self.name = "ULTRON"
        self.state = "IDLE"

        logger.info("ULTRON Controller initialized")

    def process(self, command, params=None):
        command = str(command or "").strip()

        if not command:
            return {
                "status": "error",
                "response": "No command received.",
                "state": "IDLE",
            }

        self.state = "THINKING"

        try:
            result = process_ai_command(
                command,
                params or {},
            )

            self.state = result.get(
                "state",
                "IDLE",
            )

            result["controller"] = self.name
            result["timestamp"] = datetime.now().isoformat()

            return result

        except Exception as error:
            logger.exception("ULTRON controller error")

            self.state = "IDLE"

            return {
                "status": "error",
                "response": f"ULTRON controller error: {error}",
                "state": "IDLE",
                "controller": self.name,
                "timestamp": datetime.now().isoformat(),
            }

    def get_status(self):
        return {
            "name": self.name,
            "state": self.state,
            "status": "ACTIVE",
            "timestamp": datetime.now().isoformat(),
        }


ultron_controller = UltronController()


def process_ultron_command(command, params=None):
    return ultron_controller.process(
        command,
        params,
    )


def get_ultron_status():
    return ultron_controller.get_status()