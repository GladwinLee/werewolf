import React from 'react';
import PropTypes from "prop-types";
import {Transition} from "react-transition-group";
import Typography from "@material-ui/core/Typography";

const transitionStyles = {
    entering: {
        top: "15vh",
        left: "50vw",
        transitionTimingFunction: "linear,ease-out",
    },
    entered: {
        top: "15vh",
        left: "50vw",
    },
    exiting: {
        top: "30vh",
        left: "115vw",
        transitionTimingFunction: "linear,ease-in",
    },
    exited: {
        top: "30vh",
        left: "-15vw",
        transitionDuration: `0ms`,
    },
}

const defaultTransition = {
    top: "30vh",
    left: "-15vw",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    fontSize: "xxx-large",
    transitionProperty: "left,top",
    transitionTimingFunction: "linear,ease-out",
    transitionDelay: "0ms",
};

export default function NightAnimatedIcon({time, in: propIn, endDelay: propEndDelay}) {
    defaultTransition.transitionDuration = `${time}ms`;
    // transitionStyles.exiting.transitionDelay = `${propEndDelay-time}ms`
    return (
        <>
            <Transition
                in={propIn}
                timeout={time}
            >
                {state => (
                    <Typography align="center" style={{
                        ...defaultTransition,
                        ...transitionStyles[state]
                    }}>
                        &#x1F315;
                    </Typography>
                )}
            </Transition>
        </>
    )
}

NightAnimatedIcon.propTypes = {
    time: PropTypes.number.isRequired,
    endDelay: PropTypes.number.isRequired,
    in: PropTypes.bool.isRequired,
}
