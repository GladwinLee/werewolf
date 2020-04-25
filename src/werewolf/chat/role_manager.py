# Server side

# import pandas as pd
# import numpy as np
import random

class RoleManager:
    def __init__(self):
        self.players_to_roles = None  # name to role

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
        :param players: list of names
        Doesn't return anything, but changes players_to_roles dict to map player to roles
        """
        roles_matrix = {5:['villager','villager','villager','villager',
                           'werewolf'],
                        6:['villager','villager','villager','villager',
                           'seer','werewolf'],
                        7:['villager','villager','villager','villager',
                           'seer','werewolf','werewolf'],
                        8:['villager','villager','villager','villager',
                           'villager','villager','seer','werewolf'],
                        9:['villager','villager','villager','villager',
                           'villager','seer','werewolf','werewolf','werewolf',],
                        10:['villager','villager','villager','villager',
                            'villager','villager','seer','werewolf','werewolf','werewolf'],
                        11:['villager','villager','villager','villager',
                            'villager','villager','seer','werewolf','werewolf','werewolf','werewolf']
                        }

        player_count = len(players)
        roles = roles_matrix[player_count]
        random.shuffle(roles)

        self.players_to_roles = dict(zip(players, roles))

    def get_roles(self):
        return self.players_to_roles

    def handle_special(self, type):
        if type == 'seer':
            return self.seer(player1)
        else:
            print("ERROR: Invalid type")

    def seer(self, player):
        # check if it is seer's turn (later feature when added more)
        return self.players_to_roles[player]

print(RoleManager().generate_roles(['a','b','c','d','e','f','g']))