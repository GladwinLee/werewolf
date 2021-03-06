SEER = 'seer'
WEREWOLF = 'werewolf'
VILLAGER = 'villager'
ROBBER = 'robber'
TROUBLEMAKER = 'troublemaker'
TANNER = 'tanner'
MASON = 'mason'
MINION = 'minion'
HUNTER = 'hunter'
WITCH = 'witch'
WITCH_PART_TWO = 'witch_part_two'
BODYGUARD = "bodyguard"
REVEALER = "revealer"
SENTINEL = "sentinel"
INSOMNIAC = "insomniac"

NONE = "None"

MIDDLE_1 = 'Middle 1'
MIDDLE_2 = 'Middle 2'
MIDDLE_3 = 'Middle 3'

SEPARATOR = ";"

action_order = [SENTINEL, WEREWOLF, SEER, ROBBER, WITCH, TROUBLEMAKER, REVEALER]
special_roles_no_action = [TANNER, MASON, MINION, HUNTER, BODYGUARD, INSOMNIAC]

role_info_order = action_order + special_roles_no_action + [VILLAGER]

configurable_roles = action_order.copy() + special_roles_no_action
configurable_roles.remove(WEREWOLF)
