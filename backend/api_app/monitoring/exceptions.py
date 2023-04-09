class ConditionResultError(Exception):
    """Raised when a condition result is invalid."""

    def __init__(self, message):
        super().__init__(f"Condition result is invalid: {message}")
