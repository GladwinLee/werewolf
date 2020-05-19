import React, {useEffect, useRef, useState} from 'react';
import Typography from "@material-ui/core/Typography";

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

function Timer(props) {
    const [secondsLeft, setSecondsLeft] = useState(props.start);
    const timeLeftRef = useRef();
    const intervalTimerRef = useRef();

    useEffect(() => {
        clearTimeout(intervalTimerRef.current);
        timeLeftRef.current = props.start
        console.log("starting timer")
        intervalTimerRef.current = setInterval(() => {
            if (timeLeftRef.current > 0) {
                timeLeftRef.current -= 1;
                setSecondsLeft(timeLeftRef.current)
            }
        }, 1000);

        return () => {
            console.log("stopping timer cleanup")
            clearTimeout(intervalTimerRef.current);
        }
    }, [props.start, props.timerKey])

    if (!secondsLeft || secondsLeft === 0) {
        return null;
    }

    return (
        <Typography>Time remaining: {fmtMSS(secondsLeft)}</Typography>
    )
}

export default Timer;