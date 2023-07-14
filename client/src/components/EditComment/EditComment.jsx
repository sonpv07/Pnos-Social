import React, { useState } from "react";
import "./EditComment.scss";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
export default function EditComment({ uData, comment, setIsEditCommentOpen }) {
  const queryClient = useQueryClient();

  const [data, setData] = useState(comment);

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.put("/comments?commentID=" + comment.id, newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ content: data.content });
    setIsEditCommentOpen(false);
  };

  return (
    <div className="edit-comment">
      <div className="edit-comment-container">
        <div className="write-comment">
          <img src={`/upload/` + uData?.avatar} alt="" />
          <input
            type="text"
            placeholder="Write Your Comment"
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
          />
          <button onClick={handleSubmit}>Comment</button>
        </div>
      </div>
    </div>
  );
}
