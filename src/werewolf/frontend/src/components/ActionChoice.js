import React from 'react';

function ActionChoice (props) {
    const choices = props.choices.map((p) => {
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
                {choices}
            </ul>
        </div>
    );
}

export default ActionChoice;