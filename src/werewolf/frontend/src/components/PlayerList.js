import React from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import capitalize from "@material-ui/core/utils/capitalize";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

function PlayerList(props) {
    const playerList = props.players.slice()
    if (props.known_roles && props.known_roles["Middle 1"]) {
        playerList.push("Middle 1", "Middle 2", "Middle 3");
    }

    const players = playerList.map((p) => {
        let role;
        if (props.known_roles) role = props.known_roles[p];
        let votes;
        if (props.vote_results) votes = props.vote_results[p];
        return (
            <TableRow key={p}>
                <TableCell>{p}</TableCell>
                <TableCell>{role ? capitalize(role) : null}</TableCell>
                <TableCell>{votes}</TableCell>
            </TableRow>
        );
    });

    return (
        <div>
            <Typography variant="h5">Connected Players</Typography>
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Votes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players}
                </TableBody>
            </Table>
        </div>
    );
}

export default PlayerList;
