import React from "react";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";

import { makeRequest } from "../../axios.js";

export default function Posts() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts").then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "Loading..."
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          Don't have any activites yet
        </div>
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
}
