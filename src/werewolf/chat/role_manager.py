# Server side

# import pandas as pd
# import numpy as np
import random

seer = 'seer'

werewolf = 'werewolf'

VILLAGER = 'villager'

class RoleManager:
    def __init__(self):
        self.players_to_roles = None  # name to role

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
        :param players: list of names
        Doesn't return anything, but changes players_to_roles dict to map player to roles
        """
        roles_matrix = {5:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           werewolf],
                        6:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            seer, werewolf],
                        7:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           seer, werewolf, werewolf],
                        8:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           VILLAGER, VILLAGER, seer, werewolf],
                        9:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                           VILLAGER, seer, werewolf, werewolf, werewolf, ],
                        10:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            VILLAGER, VILLAGER, seer, werewolf, werewolf, werewolf],
                        11:[VILLAGER, VILLAGER, VILLAGER, VILLAGER,
                            VILLAGER, VILLAGER, seer, werewolf, werewolf, werewolf, werewolf]
                        }

        player_count = len(players)
        roles = roles_matrix[player_count]
        random.shuffle(roles)

        self.players_to_roles = dict(zip(players, roles))

    def get_roles(self):
        return self.players_to_roles

    def handle_special(self, type, player1, player2):
        if type == 'seer':
            return self.seer(player1)
        else:
            print("ERROR: Invalid type")

    def seer(self, player):
        # check if it is seer's turn (later feature when added more)
        return self.players_to_roles[player]
