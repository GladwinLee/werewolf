import React from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    playerChip: {
        margin: theme.spacing(0.5),
    }
}));
export default function PlayersList({players, ...props}) {
    const classes = useStyles(props);
    return (
        <>
            <Typography variant="h4" align="center">Player List</Typography>
            <Grid container justify={"center"}>
                {players.map(p => <Chip
                    key={p}
                    label={p}
                    className={classes.playerChip}
                    variant={"outlined"}
                />)}
            </Grid>
        </>
    );
}

PlayersList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.node).isRequired,
}