# Client side
class Player:
    def __init__(self):
        self.role = "abstract player"

    def day(self):
        # TODO VOTE
        pass

    def night(self):
        raise ValueError("override this")

    def die(self):
        pass
