import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import capitalize from "@material-ui/core/utils/capitalize";
import Collapsible from "./Collapsible";
import TableBody from "@material-ui/core/TableBody";
import Tooltip from "@material-ui/core/Tooltip";

export default function RoleInfo(props) {
    if (!props.roleInfo) {
        return null;
    }

    const display = Object.entries(props.roleInfo).map(
        ([role, data]) => {
            return (
                <TableRow key={role}>
                    <TableCell>
                        <Tooltip title={data.info}>
                            <span>{capitalize(role)}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>{data.count}</TableCell>
                </TableRow>
            )
        })

    return (
        <Collapsible value={"Roles in play"}>
            <Table size={"small"}>
                <TableBody>
                    {display}
                </TableBody>
            </Table>
        </Collapsible>
    )
}