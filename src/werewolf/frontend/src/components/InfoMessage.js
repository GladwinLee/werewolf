import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {useSnackbar} from "notistack";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    }
}))

const InfoMessages = forwardRef(({id, message, ...props}, ref) => {
    const {closeSnackbar} = useSnackbar();

    const classes = useStyles(props);
    return (
        <Card ref={ref}>
            <CardActions>
                <Grid container alignItems={"center"} className={classes.icon}>
                    <Grid item xs={11}>
                        <Typography>
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