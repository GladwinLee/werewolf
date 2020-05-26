import React from 'react';
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from 'prop-types';

export default function PlayersList({players}) {
    const tableRows = players.map((p) => {
        return <TableRow key={"players-list-" + p}>
            <TableCell>{p}</TableCell>
        </TableRow>
    });

    return (
        <div>
            <Typography variant="h4">Connected Players</Typography>
            <Table size={"small"}>
                <TableBody>
                    {tableRows}
                </TableBody>
            </Table>
        </div>
    );
}

PlayersList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.node).isRequired,
}

PlayersList.defaultTypes = {
    players: [],
}