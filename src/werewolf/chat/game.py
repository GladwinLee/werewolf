from .role_manager import RoleManager

# Server side
class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        self.player_names = []
        self.role_manager = RoleManager()
        self.vote_results = {}
        self.vote_actions = {}
        self.action_order = []

    def add_player(self, name):
        self.player_names.append(name)
        return self.player_names

    def remove_player(self, name):
        self.player_names.remove(name)
        return self.player_names

    def get_player_names(self):
        return self.player_names

    def configure_roles(self, roles):
        self.role_manager.configure_roles(roles)

    def start_game(self):
        self.role_manager.generate_roles(self.player_names)
        self.action_order = self.role_manager.get_action_order()

    def get_roles(self):
        return self.role_manager.get_roles()

    def get_werewolves(self):
        return self.role_manager.get_werewolves()

    def get_next_action(self):
        return self.action_order[0]

    def get_winner(self):
        return self.role_manager.get_winner(self.vote_results), self.vote_results

    def is_role_action(self, action_type):
        return self.role_manager.is_role_action(action_type)

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

    def handle_special(self, role, choice):
        if role != self.get_next_action():
            return "ERROR", "Not expecting action %s" % role
        self.action_order.pop(0)
        return self.role_manager.handle_special(role, choice)

    def handle_special_timeout(self, action):
        if action != self.get_next_action():
            return False

        self.action_order.pop(0)
        return True
