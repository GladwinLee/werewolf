import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";

function Timer(props) {
    const [time, setTime] = React.useState(props.start);
    useEffect(() => {
        setTimeout(() => {
            if (time > 0) {
                setTime(time - 1);
            }
        }, 1000);
    }, [time])

    if (!time || time === 0) {
        return null;
    }
    return (
        <Paper>
            Time remaining: {time}
        </Paper>
    )
}

export default Timer;