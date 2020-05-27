import React from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Timer from "./Timer";

export default function NightWait({currentRole, roles, waitTime}) {
    return (
        <>
            <Typography variant="h3" gutterBottom>
                Night time
            </Typography>
            {roles.map((role) => (
                <div key={"night-wait-" + role}>
                    <Typography
                        color={(currentRole === role) ? "primary"
                            : "textSecondary"}
                    >
                        {capitalize(role)}
                    </Typography>
                </div>
            ))}
            <Timer start={waitTime}
                   preText={`Waiting for ${capitalize(currentRole)}: `}
                   timerKey={currentRole}/>
        </>
    )
}

NightWait.propTypes = {
    currentRole: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    waitTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
}

NightWait.defaultProps = {}