import React from "react";
import "./PreviewImage.scss";

export default function PreviewImage({ image, setIsOpenPreviewImage }) {
  return (
    <div className="preview-img" onClick={() => setIsOpenPreviewImage(false)}>
      <div className="preview-img-container">
        <img src={`/upload/${image}`} alt="" />
      </div>
    </div>
  );
}
