class ConditionResultError(Exception):
    """Raised when a condition result is invalid."""

    def __init__(self, message):
        super().__init__(f"Condition result is invalid: {message}")


class ABINotFoundError(Exception):
    """Raised when ABI is not found."""

    def __init__(self, message):
        super().__init__(f"ABI not found for smart contract: {message}")


class ContractFunctionError(Exception):
    """Raised when a contract function is invalid."""

    def __init__(self, message):
        super().__init__(f"Contract function is invalid: {message}")
