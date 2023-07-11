import React, { useContext, useEffect, useRef, useState } from "react";
import "./comment.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../../context/authContext";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import moment from "moment";

import { makeRequest } from "../../axios.js";
import { useNavigate } from "react-router-dom";

export default function Comments({ postID }) {
  const { user } = useContext(AuthContext);

  const [content, setContent] = useState("");

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postID],
    queryFn: () =>
      makeRequest.get("/comments?postID=" + postID).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: uLoading,
    error: uError,
    data: uData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  const menu = useRef(null);

  const closeOpenMenus = (e) => {
    if (menu.current && isOptionOpen && !menu.current.contains(e.target)) {
      setIsOptionOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
  }, [closeOpenMenus]);

  const navigate = useNavigate();

  const mutationComment = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutationComment.mutate({ content, postID });
    setContent("");
  };

  return (
    <div className="comment">
      <div className="comment-container">
        <div className="write-comment">
          <img src={`/upload/` + uData.avatar} alt="" />
          <input
            type="text"
            placeholder="Write Your Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSubmit}>Comment</button>
        </div>
        <div className="user-comment-container">
          {error
            ? "Something went wrong"
            : isLoading
            ? "Loading..."
            : data.map((comment) => (
                <div className="user-comment" key={comment.id}>
                  <div className="left">
                    <img
                      src={`/upload/` + comment.avatar}
                      alt=""
                      onClick={() => navigate("/profile/" + comment.userID)}
                    />
                    <div className="user-info-container">
                      <div className="user-info">
                        <span
                          onClick={() => navigate("/profile/" + comment.userID)}
                        >
                          {`${comment.name}`}
                        </span>
                        <p>{comment.content}</p>
                      </div>
                      <div className="option-container">
                        <span
                          className="option"
                          onClick={() => setIsOptionOpen(comment.id)}
                        >
                          <MoreHorizIcon />
                        </span>
                        {isOptionOpen === comment.id && (
                          <ul ref={menu} className="options">
                            <li>Edit Comment</li>
                            <li>Remove Comment</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="date">
                    {moment(comment.createTime).fromNow()}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
