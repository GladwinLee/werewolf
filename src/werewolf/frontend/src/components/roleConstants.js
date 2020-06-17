export const roleInfo = {
    sentinel: {
        help: "Shield a player from any special night abilities, including their own",
        team: "village",
    },
    seer: {
        help: "View another player's role, or 2 of roles from the middle",
        team: "village",
    },
    robber: {
        help: "Trade roles with another player, and look at your new role",
        team: "village",
    },
    witch: {
        help: "View a role in the middle. Then choose a player to swap with that role",
        team: "village",
    },
    troublemaker: {
        help: "Swap the roles of 2 players",
        team: "village",
    },
    revealer: {
        help: "View another player's role. If not a Werewolf or Tanner, reveal it to everyone",
        team: "village",
    },
    tanner: {
        help: "Get voted out to win",
        team: "tanner",
    },
    mason: {
        help: "Know the identity of the other Mason",
        team: "village",
    },
    minion: {
        help: "Know the identity of the Werewolves. \n"
            + "Being voted out will not lead to village victory",
        team: "werewolf"
    },
    hunter: {
        help: "Vote to target a player. If voted out, shoot the target",
        team: "village",
    },
    bodyguard: {
        help: "Vote is protected from death. If target is voted out, next most votes dies instead",
        team: "village",
    },
    insomniac: {
        help: "See if own role changed when day begins",
        team: "village",
    },
    villager: {
        help: "No special ability",
        team: "village",
    },
    werewolf: {
        help: "Know the identity of the other Werewolves. If there is no other Werewolf, they can look at one middle card",
        team: "werewolf",
    },
}

export const teamRoles = {
    'werewolf': new Set(),
    'village': new Set(),
    'tanner': new Set(),
};

Object.entries(roleInfo).map(([role, {team}]) => {
    teamRoles[team].add(role);
})

export const teamColor = {
    tanner: "#8d6d03",
    werewolf: "#760101",
    village: "#2b7bdc",
}