import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { makeRequest } from "../axios";
import { useQuery } from "@tanstack/react-query";

export const useFetchReceiver = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);

  const { currentChat } = useContext(ChatContext);

  // find recipient User
  const recipientID = chat?.members?.find((id) => {
    return id !== user?._id;
  });

  const { isLoading, error, data } = useQuery({
    enabled: currentChat !== null,
    queryKey: ["receiver", recipientID],
    queryFn: () =>
      makeRequest.get(`/messages/getLatest/${data.id}`).then((res) => {
        return res.data;
      }),
  });
  console.log(data);
  setRecipientUser(data);

  return { recipientUser };
};
