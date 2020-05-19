import random

from .role_constants import *


class RoleManager:
    def __init__(self):
        self.full_roles_map = {}  # name to role, including middle
        self.selected_roles = []
        self.action_log = []

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
        return [role for role in action_order if role in current_roles]

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
        keys = target.split(SEPARATOR)
        result = {key: self.full_roles_map[key] for key in keys}
        log_msg = f"The Seer {player_name} sees:"
        log_msg += ",".join(
            [f" {key} as {role.capitalize()}" for key, role in result.items()])
        self.action_log.append(log_msg)

        return "role", result

    def troublemaker(self, player_name, choice):
        player_1, player_2 = choice.split(SEPARATOR)
        player_2_new = self.full_roles_map[player_1]
        player_1_new = self.full_roles_map[player_2]
        self.action_log.append(
            f"The Troublemaker {player_name} changes {player_1} to {player_1_new} "
            f"and {player_2} to {player_2_new}"
        )

        self.full_roles_map[player_1] = player_1_new
        self.full_roles_map[player_2] = player_2_new

    def robber(self, player_name, target):
        switch_role = self.full_roles_map[target]
        self.action_log.append(
            f"The Robber {player_name} robs {target}, and becomes a {switch_role.capitalize()}")

        self.full_roles_map[player_name] = switch_role
        self.full_roles_map[target] = ROBBER
        return "role", {player_name: self.full_roles_map[player_name]}

    def get_winners(self, player_to_vote_choice):
        dead_roles, vote_counts = self.get_dead_roles(player_to_vote_choice)
        winners = self.calculate_winners(dead_roles)
        return ", ".join(winners), vote_counts

    def get_dead_roles(self, player_to_vote_choice):
        vote_counts = {}
        for vote in player_to_vote_choice.values():
            vote_counts[vote] = vote_counts.setdefault(vote, 0) + 1
        highest_vote = max(vote_counts.values())
        if highest_vote > 1:
            dead_roles = {
                self.full_roles_map[name]: name
                for name, votes in vote_counts.items()
                if votes == highest_vote
            }
        else:
            dead_roles = {}
        if HUNTER in dead_roles:
            hunter_name = dead_roles[HUNTER]
            hunter_choice = player_to_vote_choice[hunter_name]
            dead_roles[self.full_roles_map[hunter_choice]] = hunter_name
            self.action_log.append(
                f"The Hunter {hunter_name} is voted off. They shoot {hunter_choice} before they die.")
        if len(dead_roles) == 0:
            self.action_log.append(f"The village votes to kill no one.")
        for role, name in dead_roles:
            self.action_log.append(f"{name} the {role} dies.")
        return dead_roles, vote_counts

    def calculate_winners(self, dead_roles):
        if len(dead_roles) == 0:
            if WEREWOLF not in self.get_players_to_roles():
                return [VILLAGER]
            else:
                return [WEREWOLF]

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
