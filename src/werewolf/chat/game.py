from .role_manager import RoleManager
from .role_manager import WEREWOLF
from .role_manager import VILLAGER

# Server side
class Game:
    def __init__(self):
        self.player_names = []
        self.role_manager = RoleManager()
        self.vote_results = {}
        self.vote_actions = {}

    def add_player(self, name):
        self.player_names.append(name)
        return self.player_names

    def remove_player(self, name):
        self.player_names.remove(name)
        return self.player_names

    def get_player_names(self):
        return self.player_names

    def start_game(self):
        self.role_manager.generate_roles(self.player_names)
        # setup vote system
        return self.role_manager.get_roles()

    def get_roles(self):
        return self.role_manager.get_roles()

    def get_werewolves(self):
        return self.role_manager.get_werewolves()

    def get_next_action(self):
        # return next action, "seer", "vote"?
        return "vote"  # replace this

    # vote to kill
    def vote(self, voter, votee):
        self.vote_actions[voter] = votee
        if votee in self.vote_results.keys():
            self.vote_results[votee] += 1
        else:
            self.vote_results[votee] = 1
        voted_players = self.vote_actions.keys()
        non_voters = [player for player in self.player_names if player not in voted_players]
        return non_voters

    def handle_special(self, type, player1=None, player2=None):
        self.role_manager.handle_special(type, player1, player2)

    def get_winner(self):
        return self.role_manager.get_winner(self.vote_results), self.vote_results, self.role_manager.get_roles()
