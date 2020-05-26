import React from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import Divider from "@material-ui/core/Divider";

export default function PlayersList({players}) {
    return (
        <div>
            <Typography>Players</Typography>
            <Divider/>
            {players.map((p) => (
                <Typography key={`players-list-${p}`}>
                    {p}
                </Typography>
            ))}
        </div>
    );
}

PlayersList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.node).isRequired,
}