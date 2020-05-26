import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game'

const roomName = JSON.parse(document.getElementById('room_name').textContent);

const socket = new WebSocket(
    `ws://${window.location.host}/ws/werewolf/${roomName}/`
);

ReactDOM.render(
    <React.StrictMode>
        <Game roomName={roomName} socket={socket}/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
