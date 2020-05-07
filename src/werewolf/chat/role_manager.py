# Server side

# import pandas as pd
# import numpy as np
import random

SEER = 'seer'
WEREWOLF = 'werewolf'
VILLAGER = 'villager'
ROBBER = 'robber'

class RoleManager:
    def __init__(self):
        self.players_to_roles = {}  # name to role
        self.action_order = [SEER]

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
        :param players: list of names
        Returns list of roles selected by the players, according to number of players

        ROLES GUIDE: http://onenightultimate.com/?p=27
        """
        player_count = len(players)

        roles_matrix = {5: [VILLAGER, VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            SEER,
                            WEREWOLF, WEREWOLF],
                        6: [ROBBER, VILLAGER, VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            SEER,
                            WEREWOLF, WEREWOLF],
                        }

        roles = roles_matrix[player_count]
        random.shuffle(roles)

        self.players_to_roles = dict(zip(players + ['Middle 1', 'Middle 2', 'Middle 3'], roles))

    def get_action_order(self):
        current_roles = {role for _, role in self.players_to_roles.items()}
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

    def handle_special(self, role, player1, player2=None):
        if role == SEER:
            result_type = "role"
            return result_type, self.seer(player_1)
        else:
            print("Not a special type:", role)
            return None, None

    def seer(self, player):
        # check if it is seer's turn (later feature when added more)
        return {player: self.players_to_roles[player]}

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

    def get_winner(self, vote_matrix):
        highest_voted = max(vote_matrix, key=vote_matrix.get)
        if self.get_roles()[highest_voted] == WEREWOLF:
            return VILLAGER
        else:
            return WEREWOLF

# test = RoleManager()
# test.generate_roles(['a', 'b', 'c', 'd', 'e', 'f'])
# print(test.get_roles())
# test.troublemaker('a','b')
# test.robber('a')
# print(test.get_roles())


