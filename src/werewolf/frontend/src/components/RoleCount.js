import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import capitalize from "@material-ui/core/utils/capitalize";
import Collapsible from "./Collapsible";
import TableBody from "@material-ui/core/TableBody";

export default function RoleCount(props) {
    if (!props.roleCount) return null;

    const display = Object.entries(props.roleCount).map(([role, count]) => {
        return (
            <TableRow key={role}>
                <TableCell>{capitalize(role)}</TableCell>
                <TableCell>{count}</TableCell>
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