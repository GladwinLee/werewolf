import logging

from .role_constants import *

logger = logging.getLogger("consumer.consumer_role_manager")


class ConsumerRoleManager:
    def __init__(self):
        self.sentinel_target = None
        self.player_name = None
        self.player_role = None

    def is_player_role(self, role):
        return self.player_role == role

    def get_known_roles(self, roles):
        self.player_role = roles[self.player_name]
        if self.player_role == WEREWOLF:
            return {name: role for name, role in roles.items() if
                    role == WEREWOLF}
        elif self.player_role == MINION:
            return {name: role for name, role in roles.items() if
                    role in [WEREWOLF, MINION]}
        elif self.player_role == MASON:
            return {name: role for name, role in roles.items() if role == MASON}
        else:
            return {self.player_name: roles[self.player_name]}

    def get_role_action_data(self, action, **kwargs):
        try:
            msg = {
                "action": action,
                "choices": []
            }
            msg = getattr(ConsumerRoleManager, action)(
                self, msg, **kwargs
            )
            if self.sentinel_target in msg['choices']:
                msg['disabledChoices'] = {self.sentinel_target: True}
            return msg
        except KeyError:
            logger.error(f"Not a role action:", action)

    def seer(self, msg, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(self.player_name)
        choices += [
            MIDDLE_1 + SEPARATOR + MIDDLE_2,
            MIDDLE_1 + SEPARATOR + MIDDLE_3,
            MIDDLE_2 + SEPARATOR + MIDDLE_3
        ]
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg['help_text'] = "Reveal role(s) of selected"
        return msg

    def robber(self, msg, player_list, **kwargs):
        if self.sentinel_target == self.player_name:
            msg[
                'help_text'] = "The Sentinel shielded you. You cannot swap yourself with another player"
            return msg
        choices = player_list.copy()
        choices.remove(self.player_name)
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg['help_text'] = "Swap your role with selected"
        return msg

    def troublemaker(self, msg, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(self.player_name)
        msg['choices'] = {choice: False for choice in choices}
        msg['choice_type'] = "pick2"
        msg['help_text'] = "Swap the roles of the selected"
        return msg

    def witch(self, msg, **kwargs):
        msg['choices'] = [MIDDLE_1, MIDDLE_2, MIDDLE_3, NONE]
        msg['default'] = NONE
        msg['choice_type'] = "pick1"
        msg['help_text'] = "Reveal the role of selected"
        return msg

    def witch_part_two(self, msg, player_list, role_to_swap, target, **kwargs):
        msg['choices'] = player_list
        msg['default'] = self.player_name
        if self.sentinel_target == msg['default']:
            # Default as next in choices if sentinel blocked the default
            msg['default'] = player_list[
                (player_list.index(self.player_name) + 1) % len(player_list)]
        msg['choice_type'] = "pick1"
        msg[
            'help_text'] = f"Swap the role of selected with the {role_to_swap.capitalize()} role from {target}"
        return msg

    def revealer(self, msg, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(self.player_name)
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg[
            'help_text'] = "Reveal role of selected. If not Werewolf or Tanner, everyone sees it too"
        return msg

    def sentinel(self, msg, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(self.player_name)
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg['help_text'] = "Block abilities affecting selected"
        return msg

    def set_sentinel_target(self, target):
        self.sentinel_target = target

    def start_day(self, data):
        roles = data['roles']
        if self.player_role == INSOMNIAC:
            return "role", {self.player_name: roles[self.player_name]}
        return None, None
