import random

SEER = 'seer'
WEREWOLF = 'werewolf'
VILLAGER = 'villager'
ROBBER = 'robber'
TROUBLEMAKER = 'troublemaker'

MIDDLE_1 = 'Middle 1'
MIDDLE_2 = 'Middle 2'
MIDDLE_3 = 'Middle 3'

SEPARATOR = ";"


class RoleManager:
    action_order = [SEER, ROBBER, TROUBLEMAKER]

    def __init__(self):
        self.players_to_roles = {}  # name to role
        self.selected_roles = []
        self.action_log = []

    def configure_roles(self, roles):
        self.selected_roles = [role for role, selected in roles.items() if selected]

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
        :param players: list of names
        Returns list of roles selected by the players, according to number of players

        ROLES GUIDE: http://onenightultimate.com/?p=27
        """
        num_players = len(players)
        total_roles = num_players + 3
        num_werewolves = (num_players - 1) // 2

        roles = self.selected_roles.copy()
        if len(roles) + num_werewolves > total_roles:
            random.shuffle(roles)
            roles = roles[:(total_roles - num_werewolves)]

        roles.extend([WEREWOLF] * num_werewolves)
        if len(roles) < total_roles:
            roles.extend([VILLAGER] * (total_roles - len(roles)))

        random.shuffle(roles)
        self.players_to_roles = dict(zip(players + [MIDDLE_1, MIDDLE_2, MIDDLE_3], roles))

    def get_action_order(self):
        current_roles = set(self.players_to_roles.values())
        return [role for role in self.action_order if role in current_roles] + ["vote"]

    def get_roles(self):
        return self.players_to_roles

    def get_werewolves(self):
        werewolf_roles = [WEREWOLF]
        werewolves = []
        for name, role in self.players_to_roles.items():
            if role in werewolf_roles:
                werewolves.append(name)
        return werewolves

    def handle_special(self, role, player_name, choice):
        return getattr(RoleManager, role)(self, player_name, choice)

    def seer(self, player_name, target):
        # TODO add validation so cheaters can't enter multiple names that aren't middle
        keys = target.split(SEPARATOR)
        result = {key: self.players_to_roles[key] for key in keys}
        log_msg = f"The Seer {player_name} sees:"
        log_msg += ",".join([f" {key} as {role}" for key, role in result.items()])
        self.action_log.append(log_msg)

        return "role", result

    def troublemaker(self, player_name, choice):
        player_1, player_2 = choice.split(SEPARATOR)
        player_2_new = self.players_to_roles[player_1]
        player_1_new = self.players_to_roles[player_2]
        self.action_log.append(
            f"The Troublemaker {player_name} switches role for {player_1}'s to {player_1_new} "
            f"and {player_2} to {player_2_new}"
        )

        self.players_to_roles[player_1] = player_1_new
        self.players_to_roles[player_2] = player_2_new

    def robber(self, player_name, target):
        switch_role = self.players_to_roles[target]
        self.action_log.append(f"The Robber {player_name} robs {target}, and becomes a {switch_role}")

        self.players_to_roles[player_name] = switch_role
        self.players_to_roles[target] = ROBBER
        return "role", {player_name: self.players_to_roles[player_name]}

    def get_winner(self, vote_matrix):
        highest_voted = max(vote_matrix, key=vote_matrix.get)
        if self.get_roles()[highest_voted] == WEREWOLF:
            return VILLAGER
        else:
            return WEREWOLF

    def is_role_action(self, action_type):
        return action_type in self.action_order

    def get_action_log(self):
        return self.action_log