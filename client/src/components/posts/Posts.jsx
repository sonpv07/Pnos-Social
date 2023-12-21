import React, { useContext } from "react";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";

import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext.js";

export default function Posts() {
  const { user } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts").then((res) => {
        return res.data;
      }),
  });

  const posts = data?.filter((data) => data.userID !== user.id);

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
      ) : posts?.length > 0 ? (
        posts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <p className="nothing"></p>
      )}
    </div>
  );
}
