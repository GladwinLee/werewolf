import logging
import random

from .role_constants import *

logger = logging.getLogger("worker.game.role_manager")


class RoleManager:
    def __init__(self):
        self.full_roles_map = {}  # name to role, including middle
        self.selected_roles = []
        self.action_log = []
        self.witch_middle_target = ""  # store the target of the witch in its 1st part
        self.vote_counts = {}

    def get_configurable_roles(self):
        return all_special_roles

    def configure_roles(self, roles):
        self.selected_roles = [role for role, selected in roles.items() if
                               selected]

    def generate_roles(self, players):
        # fill players_to_roles map by RNG
        """
            :param players: list of names
            Returns list of roles selected by the players, according to number of players

            ROLES GUIDE: http://onenightultimate.com/?p=27
            """
        num_players = len(players)
        total_roles = num_players + 3
        num_werewolves = (num_players - 1) // 2

        roles = self.selected_roles.copy()

        if MASON in roles:
            roles.extend([MASON] * 1)

        if len(roles) + num_werewolves > total_roles:
            random.shuffle(roles)
            roles = roles[:(total_roles - num_werewolves)]

        roles.extend([WEREWOLF] * num_werewolves)
        if len(roles) < total_roles:
            roles.extend([VILLAGER] * (total_roles - len(roles)))

        random.shuffle(roles)
        self.full_roles_map = dict(
            zip(players + [MIDDLE_1, MIDDLE_2, MIDDLE_3], roles))

    def get_role_order(self):
        current_roles = set(self.full_roles_map.values())
        role_order = [role for role in action_order if role in current_roles]
        if WITCH in role_order:
            role_order.insert(role_order.index(WITCH) + 1, WITCH_PART_TWO)
        return role_order

    def get_players_to_roles(self):
        players_to_roles = self.full_roles_map.copy()
        players_to_roles.pop(MIDDLE_1)
        players_to_roles.pop(MIDDLE_2)
        players_to_roles.pop(MIDDLE_3)
        return players_to_roles

    def get_full_roles_map(self):
        return self.full_roles_map

    def handle_role_action(self, role, player_name, choice):
        return getattr(RoleManager, role)(self, player_name, choice)

    def seer(self, player_name, target):
        if target == NONE:
            self.log_append(
                f"The Seer {player_name} chooses not to see a role")
            return
        keys = target.split(SEPARATOR)
        result = {key: self.full_roles_map[key] for key in keys}
        log_msg = f"The Seer {player_name} sees:"
        log_msg += ",".join(
            [f" {key} as {role.capitalize()}" for key, role in result.items()])
        self.log_append(log_msg)
        return "role", result

    def robber(self, player_name, target):
        if target == NONE:
            self.log_append(
                f"The Robber {player_name} chooses not to rob anybody")
            return
        switch_role = self.full_roles_map[target]
        self.log_append(
            f"The Robber {player_name} robs {target}, and becomes a {switch_role.capitalize()}")
        self.full_roles_map[player_name] = switch_role
        self.full_roles_map[target] = ROBBER
        return "role", {player_name: self.full_roles_map[player_name],
                        target: ROBBER}

    def witch(self, player_name, target):
        if target == "None":
            self.log_append(
                f"The Witch {player_name} chooses not to act")
            return
        self.witch_middle_target = target
        target_role = self.full_roles_map[target]
        self.log_append(
            f"The Witch {player_name} looks at {target} and sees {target_role.capitalize()}.")
        return "witch", {target: target_role}

    def witch_part_two(self, player_name, target):
        middle_target = self.witch_middle_target
        middle_new = self.full_roles_map[target]
        target_new = self.full_roles_map[middle_target]
        self.log_append(
            f"The Witch {player_name} changes {target} to {target_new.capitalize()} "
            f"and {self.witch_middle_target} to {middle_new.capitalize()}"
        )

        self.full_roles_map[target] = target_new
        self.full_roles_map[self.witch_middle_target] = middle_new
        if target != player_name:
            middle_new = ""
        return "role", {middle_target: middle_new, target: target_new}

    def troublemaker(self, player_name, choice):
        choices = choice.split(SEPARATOR)
        if len(choices) != 2:
            self.log_append(
                f"The Troublemaker {player_name} chooses not to swap anybody")
            return
        player_1, player_2 = choices
        player_2_new = self.full_roles_map[player_1]
        player_1_new = self.full_roles_map[player_2]
        self.log_append(
            f"The Troublemaker {player_name} changes {player_1} to {player_1_new.capitalize()} "
            f"and {player_2} to {player_2_new.capitalize()}"
        )

        self.full_roles_map[player_1] = player_1_new
        self.full_roles_map[player_2] = player_2_new

    def revealer(self, player_name, target):
        if target == NONE:
            self.log_append(
                f"The Revealer {player_name} chooses not to see a role")
            return
        target_role = self.full_roles_map[target]
        result = {target: target_role}
        self.log_append(
            f"The Revealer {player_name} sees {target} as {target_role.capitalize()}")
        if target_role in [TANNER, WEREWOLF]:
            return "role", result
        else:
            return "role_for_all", result

    def sentinel(self, player_name, target):
        if target == NONE:
            self.log_append(
                f"The Sentinel {player_name} chooses not to shield anyone")
            return
        self.log_append(f"The Sentinel {player_name} shields {target}")
        return "sentinel", target

    def get_winners(self, player_to_vote_choice):
        self.vote_counts = self.get_vote_counts(player_to_vote_choice)
        dead_roles = self.get_dead_roles(player_to_vote_choice,
                                         self.vote_counts.copy())
        winners = self.calculate_winners(dead_roles)
        return ", ".join(winners), self.vote_counts

    def get_vote_counts(self, player_to_vote_choice):
        vote_counts = {}
        for vote in player_to_vote_choice.values():
            vote_counts[vote] = vote_counts.setdefault(vote, 0) + 1
        for name, vote in player_to_vote_choice.items():
            self.log_append(f"{name} votes {vote}")
        return vote_counts

    def get_dead_roles(self, player_to_vote_choice, vote_counts):
        dead_players_to_roles = self.get_village_vote_to_kill(vote_counts)

        special_choices = self.get_special_vote_choices(player_to_vote_choice)
        if BODYGUARD in special_choices:
            dead_players_to_roles = self.handle_bodyguard(
                dead_players_to_roles,
                special_choices,
                vote_counts
            )

        if HUNTER in dead_players_to_roles.values():
            dead_players_to_roles = self.handle_hunter(
                dead_players_to_roles,
                player_to_vote_choice,
                special_choices
            )

        for name, role in dead_players_to_roles.items():
            self.log_append(f"{name} the {role.capitalize()} dies")
        return dead_players_to_roles

    def handle_hunter(self, dead_players_to_roles, player_to_vote_choice,
        special_choices):
        hunter_name = special_choices[HUNTER]["name"]
        hunter_choice = special_choices[HUNTER]["choice"]
        dead_players_to_roles[hunter_choice] = self.full_roles_map[
            hunter_choice]
        self.log_append(
            f"The Hunter {hunter_name} shoots {hunter_choice} before they die")
        if BODYGUARD in special_choices:
            bodyguard_name = special_choices[BODYGUARD]["name"]
            bodyguard_choice = special_choices[BODYGUARD]["choice"]
            if bodyguard_choice == hunter_choice:
                dead_players_to_roles.pop(
                    player_to_vote_choice[bodyguard_name])
                self.log_append(
                    f"The Bodyguard {bodyguard_name} protects {bodyguard_choice} from the Hunter")
        return dead_players_to_roles

    def handle_bodyguard(self, dead_players_to_roles, special_choices,
        vote_counts):
        bodyguard_name = special_choices[BODYGUARD]["name"]
        bodyguard_choice = special_choices[BODYGUARD]["choice"]
        if dead_players_to_roles.pop(bodyguard_choice, None):
            self.log_append(
                f"The Bodyguard {bodyguard_name} protects {bodyguard_choice} from being voted off")
            if len(dead_players_to_roles) == 0:
                self.log_append(
                    f"There will be a recount with the next highest voted being killed")
                vote_counts.pop(bodyguard_choice)
                dead_players_to_roles = self.get_village_vote_to_kill(
                    vote_counts)
        return dead_players_to_roles

    def get_village_vote_to_kill(self, vote_counts):
        highest_vote = max(vote_counts.values())
        if highest_vote == 1:
            self.log_append(f"The village votes to kill no one")
            return {}
        dead_players_to_roles = {
            name: self.full_roles_map[name]
            for name, votes in vote_counts.items()
            if votes == highest_vote
        }
        self.log_append("The village votes to kill " + ", ".join(
            dead_players_to_roles.keys()))
        return dead_players_to_roles

    def get_special_vote_choices(self, player_to_vote_choice):
        special_choices = {}
        # only support 1 of each right now
        for special_vote in [HUNTER, BODYGUARD]:
            if special_vote in self.get_players_to_roles().values():
                name = [
                    name for name, role
                    in self.get_players_to_roles().items()
                    if role == special_vote
                ][0]
                choice = player_to_vote_choice[name]
                special_choices[special_vote] = {"name": name, "choice": choice}

        return special_choices

    def calculate_winners(self, dead_roles):
        if len(dead_roles) == 0:
            if WEREWOLF in self.get_players_to_roles().values():
                self.log_append(
                    f"The Werewolves infiltrated the village")
                return [WEREWOLF]
            else:
                self.log_append(
                    f"There were no Werewolves in the village. The village is safe")
                return [VILLAGER]

        winners = []
        if WEREWOLF in dead_roles:
            winners.append(VILLAGER)
        if TANNER in dead_roles:
            winners.append(TANNER)
        if len(winners) == 0:
            winners.append(WEREWOLF)
        return winners

    def is_role_action(self, action_type):
        return action_type in action_order

    def get_action_log(self):
        return self.action_log

    def get_role_info(self):
        role_count = {role: 0 for role in role_info_order}
        for role in self.full_roles_map.values():
            role_count[role] += 1
        return {
            role: {
                "count": count,
                "info": role_info[role]
            }
            for role, count in role_count.items() if count > 0
        }

    def log_append(self, msg):
        logger.info(msg)
        self.action_log.append(msg)
