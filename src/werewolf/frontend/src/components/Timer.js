import React, {useEffect, useRef, useState} from 'react';
import Typography from "@material-ui/core/Typography";

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

function Timer(props) {
    const [secondsLeft, setSecondsLeft] = useState(props.start);
    const intervalTimerRef = useRef();

    useEffect(() => {
        clearTimeout(intervalTimerRef.current);
        console.log("starting timer")
        setSecondsLeft(props.start);
        intervalTimerRef.current = setInterval(() => {
            setSecondsLeft((secondsLeft => {
                return (secondsLeft > 0) ? secondsLeft - 1 : secondsLeft
            }))
        }, 1000);

        return () => {
            console.log("stopping timer cleanup")
            clearTimeout(intervalTimerRef.current);
        }
    }, [props.start, props.timerKey])

    if (!secondsLeft || secondsLeft === 0) {
        return null;
    }

    if (props.timerKey == null) {
        return null;
    }
    return (
        <Typography>Time remaining: {fmtMSS(secondsLeft)}</Typography>
    )
}

export default Timer;