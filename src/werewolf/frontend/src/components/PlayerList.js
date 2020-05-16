import React from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import capitalize from "@material-ui/core/utils/capitalize";

function PlayerList(props) {
    const playerList = props.players.slice()
    if (props.known_roles && props.known_roles["Middle 1"]) {
        playerList.push("Middle 1", "Middle 2", "Middle 3");
    }

    const players = playerList.map((p) => {
        let text = p;
        let role;
        if (props.known_roles) {
            role = props.known_roles[p];
        }
        if (props.vote_results) {
            const votes = props.vote_results[p];
            if (votes) {
                text += " " + votes + " votes";
            }
        }
        return <ListItem key={p}>
            <ListItemText
                primary={text}
                secondary={role ? capitalize(role) : null}
            />
        </ListItem>;
    });

    return (
        <div>
            <Typography variant="h5">Connected Players</Typography>
            <List dense={true}>
                {players}
            </List>
        </div>
    );
}

export default PlayerList;
