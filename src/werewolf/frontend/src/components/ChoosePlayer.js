import React from 'react';

function ChoosePlayer (props) {
    const players = props.choices.map((p) => {
        return (
            <li key={props.choiceType + "-" + p}>
                <button onClick={() => props.onChoice(p)}>{p}</button>
            </li>
        )
    });
    return (
        <div>
            <h2>{props.children}</h2>
            <ul>
                {players}
            </ul>
        </div>
    );
}

export default ChoosePlayer;