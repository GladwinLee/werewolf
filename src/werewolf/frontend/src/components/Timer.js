import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
            <Typography>Time remaining: {time}</Typography>
        </Paper>
    )
}

export default Timer;