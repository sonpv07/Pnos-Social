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
import CommentItem from "./CommentItem";

export default function Comments({ postID, commentData }) {
  const { user } = useContext(AuthContext);

  const [content, setContent] = useState("");

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    isLoading: uLoading,
    error: uError,
    data: uData,
  } = useQuery({
    queryKey: ["userComment"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

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
          <img src={`/upload/` + uData?.avatar} alt="" />
          <input
            type="text"
            placeholder="Write Your Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSubmit}>Comment</button>
        </div>
        <div className="user-comment-container">
          {commentData?.map((comment) => (
            <CommentItem comment={comment} uData={uData} />
          ))}
        </div>
      </div>
    </div>
  );
}
