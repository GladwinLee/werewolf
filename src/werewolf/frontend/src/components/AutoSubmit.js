import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

export default function AutoSubmit({onSubmit, submitAfter}) {
    if (onSubmit == null || submitAfter == null) {
        return null;
    }
    const onSubmitRef = useRef()

    useEffect(() => {
            onSubmitRef.current = onSubmit;
        },
        [onSubmit])

    useEffect(() => {
        // setTimer(setTimeout(props.onSubmit, props.submitAfter * 1000));
        const timer = setTimeout(() => {
            onSubmitRef.current()
        }, submitAfter * 1000);
        return () => clearTimeout(timer);
    }, [])

    return null
}

AutoSubmit.propTypes = {
    onSubmit: PropTypes.func,
    submitAfter: PropTypes.number,
}