from .role_manager import RoleManager


# Server side
class Game:
    def __init__(self):
        self.reset()

    def reset(self):
        self.player_names = []
        self.role_manager = RoleManager()
        self.player_to_vote_choice = {}
        self.action_order = []

    def add_player(self, name):
        self.player_names.append(name)
        return self.player_names

    def remove_player(self, name):
        self.player_names.remove(name)
        return self.player_names

    def get_player_names(self):
        return self.player_names

    def get_configurable_roles(self):
        return self.role_manager.get_configurable_roles()

    def configure_roles(self, roles):
        self.role_manager.configure_roles(roles)

    def start_game(self):
        self.role_manager.generate_roles(self.player_names)
        self.action_order = self.role_manager.get_role_order() + ['vote', 'end']

    def get_players_to_roles(self):
        return self.role_manager.get_players_to_roles()

    def get_full_roles_map(self):
        return self.role_manager.get_full_roles_map()

    def get_next_action(self):
        return self.action_order[0]

    def get_winner(self):
        return self.role_manager.get_winners(self.player_to_vote_choice)

    def is_role_action(self, action_type):
        return self.role_manager.is_role_action(action_type)

    def handle_role_action(self, action, player_name, choice):
        if action != self.get_next_action():
            return "ERROR", "Not expecting action %s" % action
        self.action_order.pop(0)
        return self.role_manager.handle_role_action(action, player_name, choice)

    def vote(self, voter, votee):
        self.player_to_vote_choice[voter] = votee
        voted_players = self.player_to_vote_choice.keys()
        non_voters = [player for player in self.player_names if
                      player not in voted_players]
        return non_voters

    def handle_action_timeout(self, action):
        if action != self.get_next_action():
            return
        self.action_order.pop(0)

    def get_action_log(self):
        action_log = self.role_manager.get_action_log().copy()
        for name, vote in self.player_to_vote_choice.items():
            action_log.append(f"{name} votes {vote}")
        return action_log

    def get_role_info(self):
        return self.role_manager.get_role_info()
