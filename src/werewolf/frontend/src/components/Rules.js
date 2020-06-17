import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from '@material-ui/icons/Help';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {teamColor} from "./roleConstants";

const useStyles = makeStyles(theme => ({
    button: {
        position: "absolute",
        bottom: "3px",
        right: "3px",
    },
    paper: {
        overflow: "hidden",
        padding: theme.spacing(3)
    },
}))
export default function Rules(props) {
    const classes = useStyles(props);

    const [open, setOpen] = useState(false);

    return <>
        <IconButton onClick={() => setOpen(true)} className={classes.button}>
            <HelpIcon/>
        </IconButton>
        <Dialog open={open} onClose={() => setOpen(false)} classes={{paper: classes.paper}}>
            <Typography style={{whiteSpace: 'pre-line'}} align={"left"}>
                {rules}
                <Link
                    href={"https://www.fgbradleys.com/rules/rules2/OneNightUltimateWerewolf-rules.pdf"}>
                    (Full Rules)
                </Link>
                <Link
                    href={"https://cdn.shopify.com/s/files/1/0740/4855/files/Daybreak_rules_for_BGG.pdf?338"}>
                    -(Daybreak Rules)
                </Link>
            </Typography>
        </Dialog>
    </>
}

const rules = <>
    <p>Players are assigned a role at the start of the game. Night begins. </p>
    <p>Some special roles will have actions during the night in a specific order.</p>
    <p>After the night ends, everyone votes to kill someone.</p>
    <p><span style={{color: teamColor["village"]}}>The Village</span> wins if a Werewolf is killed, or if there are no
        Werewolf players AND they vote not to kill anyone.</p>
    <p><span style={{color: teamColor["tanner"]}}>The Tanner</span> wins if they die.</p>
    <p><span style={{color: teamColor["werewolf"]}}>The Werewolf</span> win otherwise. Don't let any Werewolves die, and
        don't kill the Tanner!</p>
    <p>If there is a tie in votes, all of the highest voted will be killed except in the case where every
        player received 1 vote. In that case, no one is killed.
    </p>
</>