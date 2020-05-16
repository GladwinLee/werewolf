import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapsible from "./Collapsible";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";

export default function ActionLog(props) {
    if (!props.actionLog || props.actionLog.length === 0) return null;

    const display = props.actionLog.map((s, i) => {
        return (
            <TableRow key={`actionLog-${i}`}>
                <TableCell>{s}</TableCell>
            </TableRow>
        )
    })

    return (
        <Collapsible value={"Action Log"}>
            <Table size={"small"}>
                <TableBody>
                    {display}
                </TableBody>
            </Table>
        </Collapsible>
    )
}

ActionLog.propTypes = {
    actionLog: PropTypes.arrayOf(PropTypes.string),
}