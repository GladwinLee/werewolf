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
import capitalize from "@material-ui/core/utils/capitalize";
import Collapsible from "./Collapsible";

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
        <Collapsible value={"Roles in play:"}>
            <Table size={"small"}>
                {display}
            </Table>
        </Collapsible>
    )
}