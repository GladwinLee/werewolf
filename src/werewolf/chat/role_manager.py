# Server side

# import pandas as pd
# import numpy as np
import random

SEER = 'seer'
WEREWOLF = 'werewolf'
VILLAGER = 'villager'
ROBBER = 'robber'
TROUBLEMAKER = 'troublemaker'


class RoleManager:
    action_order = [SEER, ROBBER, TROUBLEMAKER]

    def __init__(self):
        self.players_to_roles = {}  # name to role
        self.selected_roles = []

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

        #
        # roles_matrix = {5: [VILLAGER, VILLAGER, VILLAGER, VILLAGER, VILLAGER,
        #                     SEER,
        #                     WEREWOLF, WEREWOLF],
        #                 6: [ROBBER, VILLAGER, VILLAGER, VILLAGER, VILLAGER, VILLAGER,
        #                     SEER,
        #                     WEREWOLF, WEREWOLF],
        #                 }

        random.shuffle(roles)
        self.players_to_roles = dict(zip(players + ['Middle 1', 'Middle 2', 'Middle 3'], roles))

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

    def handle_special(self, role, choice):
        try:
            return getattr(RoleManager, role)(self, choice)
        except KeyError:
            print("Not a special type:", role)

    def seer(self, target):
        return "role", {target: self.players_to_roles[target]}

    def troublemaker(self, player_1, player_2):
        player_2_new = self.players_to_roles[player_1]
        player_1_new = self.players_to_roles[player_2]
        self.players_to_roles[player_1] = player_1_new
        self.players_to_roles[player_2] = player_2_new

    def robber(self, target):
        players = list(self.players_to_roles.keys())
        roles = list(self.players_to_roles.values())
        old_robber = players[roles.index(ROBBER)]
        switch_role = self.players_to_roles[target]
        self.players_to_roles[target] = ROBBER
        self.players_to_roles[old_robber] = switch_role
        return "role", {old_robber: self.players_to_roles[old_robber]}

    def get_winner(self, vote_matrix):
        highest_voted = max(vote_matrix, key=vote_matrix.get)
        if self.get_roles()[highest_voted] == WEREWOLF:
            return VILLAGER
        else:
            return WEREWOLF

    def is_role_action(self, action_type):
        return action_type in self.action_order
