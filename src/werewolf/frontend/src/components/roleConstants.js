export const roleInfo = {
    seer: "(Village Team)\nView another player's role, or 2 of roles from the middle",
    robber: "(Village Team)\nTrade roles with another player, and look at your new role",
    witch: "(Village Team)\nView a role in the middle. Then choose a player to swap with that role",
    troublemaker: "(Village Team)\nSwap the roles of 2 players",
    villager: "(Village Team)\nNo special ability",
    werewolf: "(Werewolf Team)\nKnow the identity of the other Werewolves",
    tanner: "(No Team)\nGet voted out to win",
    mason: "(Village Team)\nKnow the identity of the other Mason",
    minion: "(Werewolf Team)\nKnow the identity of the Werewolves. \n"
        + "Being voted out will not lead to Village victory",
    hunter: "(Village Team)\nVote to target a player. If voted out, shoot the target",
    bodyguard: "(Village Team)\nVote is protected from death. If target is voted out, next most votes dies instead",
    revealer: "(Village Team)\nView another player's role. If not a Werewolf or Tanner, reveal it to everyone",
    sentinel: "(Village Team)\nShield a player from any special night abilities, including their own",
    insomniac: "(Village Team)\nSee if own role changed when Day begins"
}

export const teamRoles = {
    werewolf: new Set(["werewolf", "minion"]),
    village: new Set(
        ["seer", "robber", "witch", "troublemaker", "villager", "mason",
            "hunter", "bodyguard", "revealer", "sentinel", "insomniac"]),
    tanner: new Set(["tanner"]),
}