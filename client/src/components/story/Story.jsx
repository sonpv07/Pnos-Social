import React from "react";
import "./Story.scss";
import { useNavigate } from "react-router-dom";

export default function StoryItem({ story }) {
  const navigate = useNavigate();

  return (
    <div className="story" onClick={() => navigate("/story/" + story.id)}>
      <img src={`/upload/${story.image}`} alt="" />
      <p>{story.name}</p>
    </div>
  );
}
