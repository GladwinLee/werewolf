import React, {useEffect, useState} from "react";
import {Provider} from "./WebSocketContext";

export default function WebSocketProvider({socket, children}) {
    const [serverMessage, setMessage] = useState({});

    useEffect(
        () => {
            socket.onclose = () => console.error('socket closed unexpectedly');
            socket.onmessage = (e) => {
                console.log("Provider received")
                setMessage(JSON.parse(e.data));
                console.log(JSON.parse(e.data))
            }
        },
        []
    )

    return <Provider value={{
        socket: socket,
        serverMessage: serverMessage
    }}>{children}</Provider>
}