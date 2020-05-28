import React from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

export default function PlayersList({players}) {
    return (
        <Grid container item spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4" align="center">Player List</Typography>
            </Grid>
            <Divider/>
            {players.map((p) => (
                <Grid item xs={6} key={`players-list-${p}`}>
                    <Typography align={"center"}>
                        {p}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}

PlayersList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.node).isRequired,
}