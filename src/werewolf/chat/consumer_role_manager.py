from .role_manager import SEER, WEREWOLF

class ConsumerRoleManager:
    def __init__(self):
        self.player_role = ""

    def is_player_role(self, role):
        return self.player_role == role

    def handle_start(self, data, player_name):
        roles = data['roles']
        self.player_role = roles[player_name]

        return {
            'type': data['type'],
            'player_role': self.player_role,
            'known_roles': self.get_known_roles(roles, player_name),
        }

    def get_known_roles(self, roles, player_name):
        if self.player_role == WEREWOLF:
            return {name: role for name, role in roles.items() if role == WEREWOLF}
        else:
            return {player_name: self.player_role}

    def handle_action(self, content, player_name, player_list):
        action = content['action']
        if action == SEER:
            choices = player_list.copy()
            choices.remove(player_name)
            choices += ["Middle 1,2", "Middle 1,3", "Middle 2,3"]
            content['choices'] = choices
            return content
