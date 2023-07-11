import React from "react";
import "./Story.scss";

export default function StoryItem({ story }) {
  return (
    <div className="story">
      <img src={story.img} alt="" />
      <p>{story.name}</p>
    </div>
  );
}
