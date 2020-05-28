import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Button from "@material-ui/core/Button";
import ActionLog from "./ActionLog";
import EndRolesInfo from "./EndRolesInfo";
import PageGrid from "./PageGrid";
import Grid from "@material-ui/core/Grid";

export default function EndPage({socket, serverMessage, master}) {
    const [initialMessage, setInitialMessage] = useState(serverMessage);
    let {
        winners,
        roles,
        action_log: actionLog,
    } = initialMessage;

    const resetSubmit = () => socket.send(JSON.stringify({'type': "reset",}));

    return (
        <PageGrid>
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h1">
                        {`${winners
                        .map(winner => capitalize(winner))
                        .join(" and ")} Victory!`
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <EndRolesInfo playersToRoles={roles} winners={winners}/>
                </Grid>
                <Grid item xs={12}>
                    <ActionLog actionLog={actionLog}/>
                </Grid>
            </Grid>
            {master && <Grid container item xs={12} justify="center">
                <Button onClick={resetSubmit}>Play Again</Button>
            </Grid>}
        </PageGrid>
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
