import React from "react";
import "./PostOnly.scss";
import { useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
import Post from "../post/Post.jsx";

export default function PostOnly() {
  const currentPost = useParams();

  const { isLoading, error, data } = useQuery({
    // take one post by ID
    queryKey: ["onePost"],
    queryFn: () =>
      makeRequest.get("/posts/onePost?ID=" + currentPost.id).then((res) => {
        return res.data;
      }),
  });

  console.log(data);

  return (
    <div className="post-only">
      <div className="post-only-container">
        {data?.length > 0 ? (
          data?.map((post) => <Post post={post} key={post.id} />)
        ) : (
          <h2>This post is no longer exist</h2>
        )}
      </div>
    </div>
  );
}
