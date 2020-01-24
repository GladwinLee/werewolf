# Client side
class Villager(Player):
    def __init__(self):
        super().__init__()
        self.role = "Villager"

    def vote(self, player):
        # Choose player to vote for
        pass

    def night(self):
        # Villager does nothing at night
        pass
