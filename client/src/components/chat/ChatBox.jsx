import "./ChatBox.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../context/authContext";
import InputEmoji from "react-input-emoji";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

export default function ChatBox() {
  const { user } = useContext(AuthContext);

  const {
    isOpenChat,
    setIsOpenChat,
    receiver,
    setReceiver,
    onlineUsers,
    isMinimize,
    setIsMinimize,
    currentChatBox,
    messageNoti,
    setMessageNoti,
  } = useContext(ChatContext);

  const [isReceiverOnline, setIsReceiverOnline] = useState(null);

  const [messages, setMessage] = useState("");

  const queryClient = useQueryClient();

  const scroll = useRef();

  // scroll to last message

  useEffect(() => {
    let checkUserOnline = onlineUsers?.find(
      (data) => data.userID === receiver?.id
    );
    setIsReceiverOnline(checkUserOnline);
  }, [receiver, onlineUsers]);

  // get Messages
  const {
    isLoading: messageLoading,
    error: messageError,
    data: messageData,
  } = useQuery({
    enabled: currentChatBox !== null,
    queryKey: ["messages", currentChatBox],
    queryFn: () =>
      makeRequest.get(`/messages/${currentChatBox}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData]);

  // send Messages
  const mutationMessage = useMutation({
    mutationFn: (newMessage) => {
      return makeRequest.post("/messages", newMessage);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
      setMessageNoti({
        senderID: user.id,
        receiverID: receiver.id,
      });
    },
  });

  const handleSendMessage = () => {
    mutationMessage.mutate({
      text: messages,
      senderID: user.id,
      receiverID: receiver?.id,
      boxchatID: currentChatBox,
      isRead: false,
    });
    setMessage("");
  };

  return (
    <div className="chat-box">
      {isOpenChat && (
        <div className="container">
          <div className="upper">
            <div className="user-info">
              <img src={`/upload/${receiver?.avatar}`} alt="" />
              <span>{receiver?.name}</span>{" "}
              {isReceiverOnline && <span className="online"></span>}
            </div>

            <div className="button">
              <RemoveOutlinedIcon
                className="icon minimize"
                onClick={() => {
                  setIsOpenChat(false);
                  setIsMinimize(true);
                }}
              />

              <CloseOutlinedIcon
                className="icon close"
                onClick={() => {
                  setIsOpenChat(false);
                  setReceiver(null);
                }}
              />
            </div>
          </div>

          <div className="chat-content">
            {messageLoading ? (
              <p>Loading messages...</p>
            ) : messageData?.length > 0 ? (
              messageData?.map((data) => (
                <div className="message-container" key={data.id} ref={scroll}>
                  <div
                    className={
                      data?.senderID === user.id
                        ? "message-item owner"
                        : "message-item"
                    }
                  >
                    {data?.senderID === user.id ? (
                      <img src={`/upload/${user?.avatar}`} alt="" />
                    ) : (
                      <img src={`/upload/${receiver?.avatar}`} alt="" />
                    )}
                    <p className="text">{data.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="nothing">Start your chat now!!</p>
            )}
          </div>

          <div className="input-place">
            <InputEmoji
              className="input"
              fontFamily="nunito"
              value={messages}
              onChange={setMessage}
            />
            <SendIcon className="send" onClick={() => handleSendMessage()} />
          </div>
        </div>
      )}
      {isMinimize && (
        <div className="minimize-chat">
          <img
            src={`/upload/${receiver?.avatar}`}
            alt=""
            onClick={() => {
              setIsMinimize(false);
              setIsOpenChat(true);
            }}
          />
          <div className="close">
            <CloseOutlinedIcon
              className="icon"
              onClick={() => {
                setIsMinimize(false);
                setReceiver(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
