import React, { createContext, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAsyncDetails } from "../store/asyncSlice";
import { retreiveData, saveMessage } from "../store/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-simple-toast";

const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const dispatch = useDispatch();
  const { language, mobileNum } = useSelector((state) => state.asyncDataSlice);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    connectWebSocket();
  }, [language, mobileNum]);

  useEffect(() => {
    dispatch(getAsyncDetails());
    connectWebSocket();
    return () => {
      console.log("Unmouting web socket");
      if (socket) {
        socket.close();
      }
    };
  }, []);
  const connectWebSocket = async () => {
    const asyncUsername = await AsyncStorage.getItem("username");
    const asyncLanguage = await AsyncStorage.getItem("language");
    const asyncMobileNum = await AsyncStorage.getItem("mobileNum");
    ws.current = new WebSocket(
      encodeURI(
        "wss://bableon-django-1193e2d277c3.herokuapp.com/ws/" +
          asyncMobileNum +
          "/?lang=" +
          asyncLanguage
      )
    );
    setSocket(ws.current);
    // const connectSocket = async () => {
    const webToken = await AsyncStorage.getItem("websocket_token");
    // console.log("websocket state", ws.current.readyState);
    if (ws.current) {
      ws.current.onopen = () => {
        const initiateSocket = {
          type: "token",
          content: webToken,
        };
        sendData(JSON.stringify(initiateSocket));
        if (ws.current.readyState === WebSocket.OPEN) {
        }
        setInterval(function () {
          const getChats = {
            type: "get_chats",
          };
          sendData(JSON.stringify(getChats));
        }, 5000);
        const checkMsg = {
          type: "check_messages",
        };
        sendData(JSON.stringify(checkMsg));
      };
      ws.current.onclose = (e) => {
        console.warn("web socket connection closed", e);
      };
      ws.current.onerror = (e) => {
        console.warn("web socket error occured", e);
      };
      ws.current.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg?.type == "invalid_user") {
        }
        if (msg?.type == "token") {
        } else if (msg?.type == "user_chats") {
        } else if (msg?.type == "message") {
          if (msg?.message.from == mobileNum) {
          } else {
          }
          if (msg?.message?.request_id) {
            const payload = {
              roomId: msg.message?.request_id,
              content: msg.message?.content,
              chatType: "single",
            };
            dispatch(saveMessage(payload));
          } else if (msg?.message?.group_id) {
            if (msg?.message.from == mobileNum) {
            } else {
              const payload = {
                roomId: msg.message?.group_id,
                content: msg.message?.content,
                chatType: "group",
              };
              dispatch(saveMessage(payload));
            }
          }
        }
      };
    }
  };
  const sendData = (data) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
    }
  };

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
