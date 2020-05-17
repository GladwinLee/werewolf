SEER = 'seer'
WEREWOLF = 'werewolf'
VILLAGER = 'villager'
ROBBER = 'robber'
TROUBLEMAKER = 'troublemaker'
TANNER = 'tanner'
MASON = 'mason'

MIDDLE_1 = 'Middle 1'
MIDDLE_2 = 'Middle 2'
MIDDLE_3 = 'Middle 3'

SEPARATOR = ";"

action_order = [SEER, ROBBER, TROUBLEMAKER]
special_roles_no_action = [TANNER, MASON]
all_special_roles = action_order + special_roles_no_action

role_info_order = action_order + special_roles_no_action + [VILLAGER, WEREWOLF]

role_info = {
    SEER: "View another player's role, or 2 of the roles from the middle",
    ROBBER: "Trade roles with another player, and look at your new role",
    TROUBLEMAKER: "Swap the roles of 2 players",
    VILLAGER: "No special ability",
    WEREWOLF: "Knows the identity of the other werewolves",
    TANNER: "Wins if they are voted out",
    MASON: "Knows the identity of the other masons"
}
