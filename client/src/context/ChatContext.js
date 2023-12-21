import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { io } from "socket.io-client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../axios";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState(null);

  const [isOpenChat, setIsOpenChat] = useState(false);

  const [receiver, setReceiver] = useState(null);

  const [isMinimize, setIsMinimize] = useState(false);

  const [currentChatBox, setCurrentChatBox] = useState(null);

  const [messageNoti, setMessageNoti] = useState(false);

  const queryClient = useQueryClient();

  // Initialize socket server
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Get realtime online user
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?.id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // get unread message,

  // const { data: unReadData } = useQuery({
  //   queryKey: ["latestMessage", currentChatBox],
  //   queryFn: () =>
  //     makeRequest.get(`/messages/getLatest/${data.boxchatID}`).then((res) => {
  //       return res.data;
  //     }),
  // });

  const mutationChat = useMutation({
    mutationFn: (newChat) => {
      return makeRequest.post("/chats/createChat", newChat);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  // create Box Chat
  const createBoxChat = useCallback((firstUserID, secondUserID) => {
    mutationChat.mutate({ firstUserID, secondUserID });
  });

  const openChatBox = useCallback((data) => {
    let check = false;
    outerloop: for (let i = 0; i < data?.length - 1; i++) {
      for (let j = 1; j < data?.length; j++) {
        if (data[i]?.boxchatID === data[j]?.boxchatID) {
          check = data[i]?.boxchatID;
          break outerloop;
        }
      }
    }

    if (check) {
      setIsOpenChat(true);
      setCurrentChatBox(check);
      if (isMinimize) {
        setIsMinimize(false);
      }
    } else if (!check && receiver !== null) {
      createBoxChat(user?.id, receiver?.id);
    }
  });

  return (
    <ChatContext.Provider
      value={{
        onlineUsers,
        isOpenChat,
        setIsOpenChat,
        receiver,
        setReceiver,
        isMinimize,
        setIsMinimize,
        createBoxChat,
        currentChatBox,
        setCurrentChatBox,
        openChatBox,
        messageNoti,
        setMessageNoti,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
