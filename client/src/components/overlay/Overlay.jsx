import React, { Fragment } from "react";
import "./overlay.scss";

export default function Overlay({ isOpen, children, onClose }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
        </div>
      )}
    </Fragment>
  );
}
