import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
        table: {
            padding: theme.spacing(3),
        },
        title: {
            fontWeight: "bold",
        }
    }
));
export default function ActionLog(props) {
    const classes = useStyles(props);
    if (props.actionLog.length === 0) return null;

    const display = props.actionLog.map((s, i) => {
        return (
            <TableRow key={`actionLog-${i}`}>
                <TableCell>
                    <Typography align={"left"} style={{whiteSpace: 'pre-line'}}>
                        {s}
                    </Typography>
                </TableCell>
            </TableRow>
        )
    })

    return (
        <>
            <Typography align={"center"} className={classes.title}>Action
                Log</Typography>
            <Table size={"small"} className={classes.table}>
                <TableBody>
                    {display}
                </TableBody>
            </Table>
        </>
    )
}

ActionLog.propTypes = {
    actionLog: PropTypes.arrayOf(PropTypes.string).isRequired,
}