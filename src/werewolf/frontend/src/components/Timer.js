import React, {useEffect} from 'react';
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
        <Typography>Time remaining: {time}</Typography>
    )
}

export default Timer;