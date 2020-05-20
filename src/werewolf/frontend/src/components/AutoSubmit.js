import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

export default function AutoSubmit(props) {
    // const [timer, setTimer] = useState(null);
    const onSubmitRef = useRef()

    useEffect(() => {
            console.log("Changed onSubmit")
            onSubmitRef.current = props.onSubmit;
        },
        [props.onSubmit])

    useEffect(() => {
        // setTimer(setTimeout(props.onSubmit, props.submitAfter * 1000));
        const timer = setTimeout(() => {
            onSubmitRef.current()
        }, props.submitAfter * 1000);
        return () => clearTimeout(timer);
    }, [])

    return null
}

AutoSubmit.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submitAfter: PropTypes.number.isRequired,
}
