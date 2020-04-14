# Server side
class RoleManager:
    def __init__(self):
        self.players_to_roles = {}  # name to role

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        pass

    def get_roles(self):
        return self.players_to_roles

    def handle_special(self, type, player1=None, player2=None):
        if type == 'seer':
            return self.seer(player1)
        else:
            print("ERROR: Invalid type")

    def seer(self, player):
        # check if it is seer's turn (later feature when added more)
        return self.players_to_roles[player]
