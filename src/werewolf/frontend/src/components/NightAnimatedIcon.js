import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = (props) => {
    const useStyles = makeStyles({
        icon: {
            animation: `$x ${props.time}s linear 1, 
        $y1 ${props.time / 2}s ease-out 1, 
        $y2 ${props.time / 2}s ease-in 1 ${props.time / 2}s`,
            position: "relative",
            fontSize: "xxx-large"
        },
        '@keyframes x': {
            from: {left: "-15vw"},
            to: {left: "115vw"}
        },
        '@keyframes y1': {
            from: {top: "0px"},
            to: {top: "-100px"}
        },
        '@keyframes y2': {
            from: {top: "-100px"},
            to: {top: "0px"}
        },
    })
    return useStyles(props);
};

export default function NightAnimatedIcon(props) {
    const [classes, setClasses] = useState({});
    useEffect(
        () => {
            setClasses(useStyles(props));
        },
        []
    )
    return (
        <div className={classes.icon}>&#x1F315;</div>
    )
}

NightAnimatedIcon.propTypes = {
    time: PropTypes.number.isRequired
}
