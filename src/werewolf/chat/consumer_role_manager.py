from .role_constants import *

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
            'known_roles': self.get_known_roles(roles, player_name),
            'role_info': data['role_info']
        }

    def get_known_roles(self, roles, player_name):
        if self.player_role == WEREWOLF:
            return {name: role for name, role in roles.items() if
                    role == WEREWOLF}
        elif self.player_role == MINION:
            return {name: role for name, role in roles.items() if
                    role in [WEREWOLF, MINION]}
        elif self.player_role == MASON:
            return {name: role for name, role in roles.items() if role == MASON}

        else:
            return {player_name: self.player_role}

    def get_role_action_data(self, action_data, **kwargs):
        try:
            msg = {
                "type": "action",
                "action": action_data["action"],
                "wait_time": action_data['wait_time']
            }
            msg = getattr(ConsumerRoleManager, action_data["action"])(
                self, msg, **kwargs
            )
            return msg
        except KeyError:
            print("Not a role action:", action_data["action"])

    def seer(self, msg, player_name, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(player_name)
        choices += [
            MIDDLE_1 + SEPARATOR + MIDDLE_2,
            MIDDLE_1 + SEPARATOR + MIDDLE_3,
            MIDDLE_2 + SEPARATOR + MIDDLE_3
        ]
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg['help_text'] = "Reveal role(s) of selection"
        return msg

    def robber(self, msg, player_name, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(player_name)
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg[
            'help_text'] = "Swap your role with selected player, and see your new role"
        return msg

    def troublemaker(self, msg, player_name, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(player_name)
        msg['choices'] = {choice: False for choice in choices}
        msg['choice_type'] = "pick2"
        msg['help_text'] = "Swap the roles of two players"
        return msg

    def witch(self, msg, **kwargs):
        msg['choices'] = [MIDDLE_1, MIDDLE_2, MIDDLE_3, NONE]
        msg['default'] = NONE
        msg['choice_type'] = "pick1"
        msg[
            'help_text'] = "Reveal the role of a middle card. You must swap it with a player role"
        return msg

    def witch_part_two(self, msg, player_name, player_list, role_to_swap,
        **kwargs):
        msg['choices'] = player_list
        msg['default'] = player_name
        msg['choice_type'] = "pick1"
        msg[
            'help_text'] = f"Swap the middle role ${role_to_swap} with the selected player's role"
        return msg
