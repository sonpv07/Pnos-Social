import React, { useContext, useReducer, useState } from "react";
import "./Home.scss";
import Stories from "../../components/stories/Stories";
import Comments from "../../components/comments/comments";
import CreatePost from "../../components/createPost/createPost";
import { AuthContext } from "../../context/authContext";
import Posts from "../../components/posts/Posts";
import ChatBox from "../../components/chat/ChatBox";
export default function Home() {
  const [post, setPost] = useState([]);
  // const [render, setRender] = useState(false);
  // const [checkUpdate, forceUpdate] = useReducer((x) => x + 1, 0);
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      <Stories />
      <CreatePost user={user} />
      <Posts />
    </div>
  );
}
