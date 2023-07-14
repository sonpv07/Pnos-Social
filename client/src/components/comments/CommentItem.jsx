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
import EditComment from "../EditComment/EditComment";

export default function CommentItem({ comment, uData }) {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);

  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);

  const menu = useRef(null);

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const closeOpenMenus = (e) => {
    if (menu.current && isOptionOpen && !menu.current.contains(e.target)) {
      setIsOptionOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
  }, [closeOpenMenus]);
  const navigate = useNavigate();
  const mutationRemoveComment = useMutation({
    mutationFn: (ID) => {
      return makeRequest.delete("/comments?commentID=" + ID);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleRemove = (ID) => {
    mutationRemoveComment.mutate(ID);
  };

  console.log(uData);

  return (
    <div className="user-comment">
      <div className="left">
        <img
          src={`/upload/` + comment.avatar}
          alt=""
          onClick={() => navigate("/profile/" + comment.userID)}
        />
        <div className="user-info-container">
          <div className="user-info">
            <span onClick={() => navigate("/profile/" + comment.userID)}>
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
            {isOptionOpen === comment.id && comment.userID === user.id && (
              <ul ref={menu} className="options">
                <li onClick={() => setIsEditCommentOpen(true)}>Edit Comment</li>
                <li onClick={() => handleRemove(comment.id)}>Remove Comment</li>
              </ul>
            )}

            {isOptionOpen === comment.id && comment.userID !== user.id && (
              <ul ref={menu} className="options">
                <li>Report Comment</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {isEditCommentOpen ? (
        <EditComment
          uData={uData}
          comment={comment}
          setIsEditCommentOpen={setIsEditCommentOpen}
        />
      ) : (
        ""
      )}

      <span className="date">{moment(comment.createTime).fromNow()}</span>
    </div>
  );
}
