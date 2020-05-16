import React, {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

function Timer(props) {
    const [time, setTime] = React.useState(props.start);
    useEffect(() => {
        const to = setTimeout(() => {
            if (time > 0) {
                setTime(time - 1);
            }
        }, 1000);
        return () => clearTimeout(to);
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