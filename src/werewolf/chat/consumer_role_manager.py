import logging

from .role_constants import *

logger = logging.getLogger("consumer.consumer_role_manager")


class ConsumerRoleManager:
    def __init__(self):
        self.sentinel_target = ""
        self.revealer_target = None
        self.player_name = None
        self.player_role = None
        self.num_werewolves = None

    def is_player_role(self, role):
        return self.player_role == role

    def get_known_roles(self, roles):
        roles.pop(MIDDLE_1)
        roles.pop(MIDDLE_2)
        roles.pop(MIDDLE_3)
        self.player_role = roles[self.player_name]
        if self.player_role == WEREWOLF:
            werewolves = {name: role for name, role in roles.items() if
                          role == WEREWOLF}
            self.num_werewolves = len(werewolves)
            return werewolves
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

    def werewolf(self, msg, **kwargs):
        if self.num_werewolves != 1:
            msg['help_text'] = "You are not a Lone Wolf. No Night action"
            return msg
        msg['choices'] = [MIDDLE_1, MIDDLE_2, MIDDLE_3, NONE]
        msg['default'] = NONE
        msg['choice_type'] = "pick1"
        msg['help_text'] = "Reveal the role of selected"
        return msg

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
            msg['help_text'] = \
                "The Sentinel shielded you. You cannot swap yourself with another player"
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
        msg['help_text'] = \
            f"Swap the role of selected with the {role_to_swap.capitalize()} role from {target}"
        return msg

    def revealer(self, msg, player_list, **kwargs):
        choices = player_list.copy()
        choices.remove(self.player_name)
        choices.append(NONE)
        msg['choices'] = choices
        msg['choice_type'] = "pick1"
        msg['default'] = NONE
        msg['help_text'] = \
            "Reveal role of selected. If not Werewolf or Tanner, everyone sees it too"
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

    def get_day_role_info(self, data):
        roles = data['roles']
        msg = {}
        player_labels = {}
        if self.player_role == INSOMNIAC:
            msg["info_message"] = \
                f"You wake up and see you are a {roles[self.player_name].capitalize()}"
        if self.sentinel_target != "":
            player_labels[self.sentinel_target] = "shielded"
        if self.revealer_target:
            player_labels[self.revealer_target] = roles[self.revealer_target]
        if len(player_labels) > 0:
            msg["player_labels"] = player_labels

        return msg

    @staticmethod
    def get_role_count(roles):
        role_count = {role: 0 for role in role_info_order}
        for role in roles.values():
            role_count[role] += 1
        return {
            role: count
            for role, count in role_count.items()
            if count > 0
        }

    @staticmethod
    def is_revealable(role):
        return role not in [TANNER, WEREWOLF]

    def get_info_message(self, role_action, result):
        message = ""
        if role_action in [SEER, WEREWOLF]:
            message = "You see "
            message += ", ".join(
                [f"{name} is a {role.capitalize()}"
                 for name, role in result.items()]
            )

        elif role_action == ROBBER:
            message = f"You swap roles. You are now a {result.capitalize()}"

        elif role_action == WITCH_PART_TWO:
            middle_target, player_target, target_role = result
            if player_target == self.player_name:
                message = f"You swap roles. You are now a {result.capitalize()}"
            else:
                message = f"Swapped roles for {middle_target} and {player_target}." \
                          f" {player_target} is now a {target_role.capitalize()}"

        elif role_action == TROUBLEMAKER:
            player_1, player_2 = result
            message = f"Swapped {player_1} and {player_2}"

        elif role_action == REVEALER:
            target, target_role = result
            if self.is_revealable(target_role):
                message = f"Revealer announcement: {target} is a {target_role.capitalize()}. "
            else:
                message = f"You see {target} is a {target_role.capitalize()}. You do not announce it."

        elif role_action == SENTINEL:
            message = f"The Sentinel shields {result}"

        return message
