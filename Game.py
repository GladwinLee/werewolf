# Server side
class Game:
    def __init__(self, players, role_manager):
        self.players = players
        self.role_manager = role_manager

    def add_player(self):
        pass

    def play(self):
        self.role_manager.night(self.players)
        self.role_manager.day(self.players)

        # find winner
        # self.role_manager.get_winner(self.players)
        pass
