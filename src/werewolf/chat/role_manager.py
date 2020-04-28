# Server side

# import pandas as pd
# import numpy as np
import random

SEER = 'seer'

WEREWOLF = 'werewolf'

VILLAGER = 'villager'

class RoleManager:
    def __init__(self):
        self.players_to_roles = {}  # name to role

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
        :param players: list of names
        Doesn't return anything, but changes players_to_roles dict to map player to roles
        """
        roles_matrix = {5:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           WEREWOLF],
                        6:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           SEER, WEREWOLF],
                        7:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           SEER, WEREWOLF, WEREWOLF],
                        8:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           VILLAGER, VILLAGER, SEER, WEREWOLF],
                        9:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           VILLAGER, SEER, WEREWOLF, WEREWOLF, WEREWOLF, ],
                        10:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            VILLAGER, VILLAGER, SEER, WEREWOLF, WEREWOLF, WEREWOLF],
                        11:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            VILLAGER, VILLAGER, SEER, WEREWOLF, WEREWOLF, WEREWOLF, WEREWOLF]
                        }

        player_count = len(players)
        roles = roles_matrix[player_count]
        random.shuffle(roles)

        self.players_to_roles = dict(zip(players, roles))

    def get_roles(self):
        return self.players_to_roles

    def get_werewolves(self):
        werewolf_roles = [WEREWOLF]
        werewolves = []
        for name, role in self.players_to_roles.items():
            if role in werewolf_roles:
                werewolves.append(name)
        return werewolves

    def handle_special(self, type, player1, player2):
        if type == seer:
            return self.seer(player1)
        elif type == werewolf:
            return self.get_werewolves()
        else:
            print("Not a special type")

    def seer(self, player):
        # check if it is seer's turn (later feature when added more)
        return self.players_to_roles[player]

    def get_werewolves(self):
