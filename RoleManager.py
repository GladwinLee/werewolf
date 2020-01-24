# Server side
class RoleManager:
    def __init__(self, players):
        self.supported_roles = {"Villager", "Seer", "Werewolf"}
        self.roles = self.get_roles(players)

    def day(self, players):
        # TODO have voting
        # wait for everyones input
        # validate correct input
        # do the vote, show result
        pass

    def night(self, players):
        # TODO make an order for the supported roles, go through in that order
        # if werewolf, they know which other is werewolf, display that somehow (keep in mind of troublemaker)
        # wait for seer input, and reveal logic
        pass

    def get_winner(self, players):
        # TODO Change this for more roles
        current_roles = self.get_roles(players)
        if current_roles["Werewolf"] < self.roles["Werewolf"]:
            return "Village"
        return "Werewolf"

    def get_roles(self, players):
        roles = {role: 0 for role in self.supported_roles}
        for player in players:
            if player.role not in supported_roles:
                raise ValueError("{} role is not supported".format(player.role))
            roles[player.role] += 1
        return roles
