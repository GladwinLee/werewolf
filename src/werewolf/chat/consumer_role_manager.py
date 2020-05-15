from .role_manager import SEER, WEREWOLF, ROBBER, MIDDLE_1_2, MIDDLE_1_3, MIDDLE_2_3

class ConsumerRoleManager:
    def __init__(self):
        self.player_role = ""

    def is_player_role(self, role):
        print("ROLE", self.player_role, role)
        return self.player_role == role

    def handle_start(self, data, player_name):
        roles = data['roles']
        self.player_role = roles[player_name]

        return {
            'type': data['type'],
            'player_role': self.player_role,
            'known_roles': self.get_known_roles(roles, player_name),
            'role_count': data['role_count']
        }

    def get_known_roles(self, roles, player_name):
        if self.player_role == WEREWOLF:
            return {name: role for name, role in roles.items() if role == WEREWOLF}
        else:
            return {player_name: self.player_role}

    def handle_action(self, data, player_name, player_list):
        action = data['action']
        if action == SEER:
            choices = player_list.copy()
            choices.remove(player_name)
            choices += [MIDDLE_1_2, MIDDLE_1_3, MIDDLE_2_3]
            data['choices'] = choices
            return data
        elif action == ROBBER:
            choices = player_list.copy()
            choices.remove(player_name)
            data['choices'] = choices
            return data
