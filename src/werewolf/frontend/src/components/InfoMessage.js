import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {useSnackbar} from "notistack";

// const useStyles = makeStyles((theme) => ({
// }))

const InfoMessages = forwardRef(({id, message}, ref) => {
    const {closeSnackbar} = useSnackbar();

    // const classes = useStyles();
    return (
        <Card ref={ref}>
            <CardActions>
                <Grid container alignItems={"center"}>
                    <Grid item xs={11}>
                        <Typography variant="subtitle2">
                            {message}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={() => closeSnackbar(id)}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )
});

InfoMessages.propTypes = {
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
}

export default InfoMessages;