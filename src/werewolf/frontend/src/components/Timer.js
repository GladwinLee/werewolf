import React, {useEffect} from 'react';

function Timer(props) {
    const [time, setTime] = React.useState(props.start);
    useEffect(() => {
        setTimeout(() => {
            if (time > 0) {
                setTime(time - 1);
            }
        }, 1000);
    }, [time])

    if (time === 0) {
        return null;
    }
    return (
        <div>
            Time remaining: {time}
        </div>
    )
}

export default Timer;