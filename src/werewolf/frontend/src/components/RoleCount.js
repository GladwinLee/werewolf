import React from "react";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Card from "@material-ui/core/Card";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Grid from "@material-ui/core/Grid";

export default function RoleCount(props) {
    const [open, setOpen] = React.useState(false);

    if (!props.roleCount) return null;

    const display = Object.entries(props.roleCount).map(([role, count]) => {
        return (
            <TableRow key={role}>
                <TableCell>{role}</TableCell>
                <TableCell>{count}</TableCell>
            </TableRow>
        )
    })

    return (
        <Card>
            <Grid container direction="row" alignItems="center">
                <Grid item>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography>Roles in play: </Typography>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <Table size={"small"}>
                    {display}
                </Table>
            </Collapse>
        </Card>
    )
}