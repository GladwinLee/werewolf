import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import capitalize from "@material-ui/core/utils/capitalize";
import Collapsible from "./Collapsible";
import TableBody from "@material-ui/core/TableBody";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from '@material-ui/icons/Info';
import Grid from "@material-ui/core/Grid";

const roleInfoText = <Grid container spacing={1}>
    <Grid item>Roles in play </Grid>
    <Grid item>
        <Tooltip arrow title={"Hover over a role for more info"}>
            <InfoIcon color={"disabled"} fontSize={"small"}/>
        </Tooltip>
    </Grid>
</Grid>

export default function RoleInfo(props) {
    if (!props.roleInfo) {
        return null;
    }

    const display = Object.entries(props.roleInfo).map(
        ([role, data]) => {
            return (
                <TableRow key={role}>
                    <TableCell>
                        <Tooltip arrow title={data.info}>
                            <span>{capitalize(role)}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>{data.count}</TableCell>
                </TableRow>
            )
        })

    return (
        <Collapsible value={roleInfoText}>
            <Table size={"small"}>
                <TableBody>
                    {display}
                </TableBody>
            </Table>
        </Collapsible>
    )
}