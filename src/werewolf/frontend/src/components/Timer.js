import React, {useEffect, useRef, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

export default function Timer(props) {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const intervalTimerRef = useRef();

    useEffect(() => {
        console.log(`New timer ${props.start}, ${props.timerKey}`)
        clearInterval(intervalTimerRef.current);
        setSecondsLeft(props.start);
        intervalTimerRef.current = setInterval(() => {
            setSecondsLeft((secondsLeft => {
                return (secondsLeft > 0) ? secondsLeft - 1 : secondsLeft
            }))
        }, 1000);

        return () => {
            console.log("Cleaned up timer")
            clearInterval(intervalTimerRef.current);
        }
    }, [props.start, props.timerKey])

    useEffect(() => {
        if (secondsLeft === 0 && props.start !== 0) {
            if (props.callback) {
                props.callback();
            }
        }
    }, [secondsLeft])

    if (!secondsLeft
        || secondsLeft === 0
        || props.timerKey == null
    ) {
        return null;
    }
    return (
        <Typography>Time remaining: {fmtMSS(secondsLeft)}</Typography>
    )
}

Timer.propTypes = {
    start: PropTypes.number,
    timerKey: PropTypes.any,
    callback: PropTypes.func,
}

Timer.defaultProps = {
    start: 0,
}
