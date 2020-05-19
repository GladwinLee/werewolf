import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game'

const roomName = JSON.parse(document.getElementById('room_name').textContent);

ReactDOM.render(
    <React.StrictMode>
        <Game roomName={roomName}/>
    </React.StrictMode>,
    document.getElementById('root')
);

document.querySelector('#name-input').focus();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
