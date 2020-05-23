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

NONE = "None"

MIDDLE_1 = 'Middle 1'
MIDDLE_2 = 'Middle 2'
MIDDLE_3 = 'Middle 3'

SEPARATOR = ";"

action_order = [SEER, ROBBER, WITCH, TROUBLEMAKER, REVEALER]
special_roles_no_action = [TANNER, MASON, MINION, HUNTER, BODYGUARD]
all_special_roles = action_order + special_roles_no_action

role_info_order = action_order + special_roles_no_action + [VILLAGER, WEREWOLF]

role_info = {
    SEER: "(Village Team) View another player's role, or 2 of the roles from the middle",
    ROBBER: "(Village Team) Trade roles with another player, and look at your new role",
    WITCH: "(Village Team) View a role in the middle. If you do, you must then choose another player to swap with that role",
    TROUBLEMAKER: "(Village Team) Swap the roles of 2 players",
    VILLAGER: "(Village Team) No special ability",
    WEREWOLF: "(Werewolf Team) Knows the identity of the other werewolves",
    TANNER: "(No Team) Wins if they are voted out",
    MASON: "(Village Team) Knows the identity of the other masons",
    MINION: "(Werewolf Team) Knows the identity of the Werewolves, but the Werewolves do not know the Minion"
            " Being voted out will not lead to Village victory",
    HUNTER: "(Village Team) If voted out, will kill whoever they voted as well",
    BODYGUARD: "(Village Team) The person they vote will not be killed. Next most votes dies instead",
    REVEALER: "(Village Team) View another player's role. If it is not a Werewolf or Tanner, it is revealed to everyone",
}
