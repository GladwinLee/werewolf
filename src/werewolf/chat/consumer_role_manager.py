from .role_manager import WEREWOLF, MIDDLE_1, MIDDLE_2, MIDDLE_3, SEPARATOR


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
            'role_count': data['role_count']
        }

    def get_known_roles(self, roles, player_name):
        if self.player_role == WEREWOLF:
            return {name: role for name, role in roles.items() if role == WEREWOLF}
        else:
            return {player_name: self.player_role}

    def handle_action(self, data, player_name, player_list):
        action = data['action']
        try:
            return getattr(ConsumerRoleManager, action)(
                self, data, player_name, player_list
            )
        except KeyError:
            print("Not a special type:", action)

    def seer(self, data, player_name, player_list):
        choices = player_list.copy()
        choices.remove(player_name)
        choices += [
            MIDDLE_1 + SEPARATOR + MIDDLE_2,
            MIDDLE_1 + SEPARATOR + MIDDLE_3,
            MIDDLE_2 + SEPARATOR + MIDDLE_3
        ]
        data['choices'] = choices
        data['choice_type'] = "pick1"
        return data

    def robber(self, data, player_name, player_list):
        choices = player_list.copy()
        choices.remove(player_name)
        data['choices'] = choices
        data['choice_type'] = "pick1"
        return data

    def troublemaker(self, data, player_name, player_list):
        choices = player_list.copy()
        choices.remove(player_name)
        data['choices'] = {choice: False for choice in choices}
        data['choice_type'] = "pick2"
        return data
