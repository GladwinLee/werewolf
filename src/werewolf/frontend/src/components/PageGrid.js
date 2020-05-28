import React from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(props => ({
    mainGrid: props => ({
        alignSelf: "center",
        alignContent: "space-between",
        justify: "center",
        height: "90%",
        ...props,
    }),
}))

export default function PageGrid({children, ...props}) {
    const classes = useStyles(props);
    return (
        <Grid container
              className={classes.mainGrid}
        >
            {children}
        </Grid>
    )
}

PageGrid.propTypes = {}

PageGrid.defaultProps = {}