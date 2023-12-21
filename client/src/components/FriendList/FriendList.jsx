import React, { useEffect, useRef, useState } from "react";
import "./FriendList.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
import { useNavigate } from "react-router-dom";

export default function FriendList() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const menu = useRef(null);

  const closeOpenMenus = (e) => {
    if (menu.current && isOptionOpen && !menu.current.contains(e.target)) {
      setIsOptionOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
  }, [closeOpenMenus]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["friendList"],
    queryFn: () =>
      makeRequest.get("/relationships/friendList").then((res) => {
        return res.data;
      }),
  });

  const mutationRemoveFollower = useMutation({
    mutationFn: (userID) => {
      return makeRequest.delete(
        "/relationships/removeFollower?userID=" + userID
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleRemoveFollower = (userID) => {
    mutationRemoveFollower.mutate(userID);
  };

  const mutationRemoveFollow = useMutation({
    mutationFn: (userID) => {
      return makeRequest.delete("/relationships?currentProfile=" + userID);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleRemoveFollow = (userID) => {
    mutationRemoveFollow.mutate(userID);
  };

  return (
    <div className="friend-list">
      <div className="friend-list-container">
        <h2>Friend List</h2>
        <div className="list">
          {data?.map((info) => (
            <div className="item" key={info.id}>
              <div
                className="left"
                onClick={() => navigate("/profile/" + info.id)}
              >
                <img src={`/upload/${info.avatar}`} alt="" />
                <div className="info">
                  <p className="name">{info.name}</p>
                </div>
              </div>
              <div className="right">
                <span
                  className="option"
                  onClick={() => setIsOptionOpen(info.id)}
                >
                  <MoreHorizIcon />
                </span>
                {isOptionOpen === info.id ? (
                  <ul ref={menu} className="options">
                    <li
                      onClick={() => {
                        handleRemoveFollower(info.id);
                        setIsOptionOpen(false);
                      }}
                    >
                      Remove Follower
                    </li>
                    <li
                      onClick={() => {
                        handleRemoveFollow(info.id);
                        setIsOptionOpen(false);
                      }}
                    >
                      Unfollow
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
