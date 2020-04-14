from .role_manager import RoleManager


# Server side
class Game:
    def __init__(self):
        self.num_players = 0
        self.player_names = []
        self.role_manager = RoleManager()

    def add_player(self, name):
        self.num_players += 1
        self.player_names.append(name)
        pass

    def start_game(self):
        self.role_manager.generate_roles(self.player_names)
        # setup vote system
        return self.role_manager.get_roles()

    def get_roles(self):
        return self.role_manager.get_roles()

    # vote to kill
    def vote(self, voter, votee):
        # add vote
        pass
        # return list of who did not vote

    def handle_special(self, type, player1=None, player2=None):
        self.role_manager.handle_special(type, player1, player2)

    # generate winning team based on voted out
    def get_winner(self):
        # check all voted
        pass
        # return Werewolf or Village
