export const roleInfo = {
    seer: "(Village Team)\nView another player's role, or 2 of roles from the middle",
    robber: "(Village Team)\nTrade roles with another player, and look at your new role",
    witch: "(Village Team)\nView a role in the middle. If you do, you must then choose another player to swap with that role",
    troublemaker: "(Village Team)\nSwap the roles of 2 players",
    villager: "(Village Team)\nNo special ability",
    werewolf: "(Werewolf Team)\nKnows the identity of the other Werewolves",
    tanner: "(No Team)\nWins if they are voted out",
    mason: "(Village Team)\nKnows the identity of the other Masons",
    minion: "(Werewolf Team)\nKnows the identity of the Werewolves, but the Werewolves do not know the Minion\n"
        + "Being voted out will not lead to Village victory",
    hunter: "(Village Team)\nIf voted out, will kill whoever they voted as well",
    bodyguard: "(Village Team)\nThe person they vote will not be killed. Next most votes dies instead",
    revealer: "(Village Team)\nView another player's role. If it is not a Werewolf or Tanner, it is revealed to everyone",
    sentinel: "(Village Team)\nShield a player from any special night abilities, including their own",
    insomniac: "(Village Team)\nSee your own role when night ends"
}

export const teamRoles = {
    werewolf: new Set(["werewolf", "minion"]),
    village: new Set(
        ["seer", "robber", "witch", "troublemaker", "villager", "mason",
            "hunter", "bodyguard", "revealer", "sentinel", "insomniac"]),
    tanner: new Set(["tanner"]),
}