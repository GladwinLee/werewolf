import React, {useEffect, useRef, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

export default function Timer(props) {
    const [secondsLeft, setSecondsLeft] = useState();
    const intervalTimerRef = useRef();

    useEffect(() => {
        clearInterval(intervalTimerRef.current);
        setSecondsLeft(props.start);
        intervalTimerRef.current = setInterval(() => {
            setSecondsLeft((secondsLeft => {
                return (secondsLeft > 0) ? secondsLeft - 1 : secondsLeft
            }))
        }, 1000);

        return () => clearInterval(intervalTimerRef.current);
    }, [props.start, props.timerKey])

    useEffect(() => {
        if (secondsLeft === 0 && props.start !== 0) props.callback();
    }, [secondsLeft])

    if (!secondsLeft) return null;
    return (
        <Typography>
            {`${props.preText}${fmtMSS(secondsLeft)}${props.postText}`}
        </Typography>
    )
}

Timer.propTypes = {
    start: PropTypes.number.isRequired,
    preText: PropTypes.string,
    postText: PropTypes.string,
    timerKey: PropTypes.any,
    callback: PropTypes.func,
}

Timer.defaultProps = {
    start: 0,
    preText: "",
    postText: "",
    callback: () => {},
}
