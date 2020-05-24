import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Link from "@material-ui/core/Link";
import React from "react";

export default function () {
    return <ExpansionPanel>
        <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>Rules</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <Typography
                style={{whiteSpace: 'pre-line'}}>
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
        </ExpansionPanelDetails>
    </ExpansionPanel>
}

const rules = "Players are assigned a role at the start of the game. The game starts at night. "
    + "Some special roles will have actions during the night, in a specific order. "
    + "After the night ends, everyone votes to kill someone. "
    + "\nIf there is a tie, all of the highest voted will "
    + "be killed except in the case where every player received 1 vote. In that case, no one is killed."
    + "\nThe Village wins if: "
    + "\n  - a Werewolf is killed"
    + "\n  - they vote not to kill anyone when there are no Werewolf players. "
    + "\nThe Tanner wins if they die. "
    + "\nThe Werewolves win otherwise. \n"
