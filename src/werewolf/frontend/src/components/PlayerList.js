import React from 'react';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

function PlayerList(props) {
    const playerList = [...new Set(
        [...props.players, ...Object.keys(props.known_roles)])];

    const players = playerList.map((p) => {
        let role;
        if (props.known_roles) {
            role = props.known_roles[p];
        }
        let votes;
        if (props.vote_results) {
            votes = props.vote_results[p];
        }
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
