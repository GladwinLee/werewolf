import React, {createContext} from "react";

const WebSocketContext = createContext({
    socket: {},
    serverMessage: null,
});

export const {Provider, Consumer} = WebSocketContext;
export default WebSocketContext;