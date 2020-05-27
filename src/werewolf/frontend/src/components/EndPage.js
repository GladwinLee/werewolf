import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Button from "@material-ui/core/Button";
import ActionLog from "./ActionLog";
import EndRolesInfo from "./EndRolesInfo";

export default function EndPage({socket, serverMessage, master}) {
    const [initialMessage, setInitialMessage] = useState(serverMessage);
    let {
        winners,
        roles,
        action_log: actionLog,
    } = initialMessage;

    const resetSubmit = () => socket.send(JSON.stringify({'type': "reset",}));

    return (
        <>
            <Typography variant="h3">
                {`${winners.map(winner => capitalize(winner)).join(
                    " and ")} Victory!`}
            </Typography>
            <ActionLog actionLog={actionLog}/>
            <EndRolesInfo playersToRoles={roles} winners={winners}/>
            {master && <Button onClick={resetSubmit}>Play Again</Button>}
        </>
    )
}

EndPage.propTypes = {
    socket: PropTypes.object,
    serverMessage: PropTypes.object,
    master: PropTypes.bool
}

EndPage.defaultProps = {
    master: false,
}

EndPage.defaultProps = {
    players: [],
    serverMessage: {},
}
