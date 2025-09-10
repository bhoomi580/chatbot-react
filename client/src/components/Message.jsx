import React from "react";

export default function Message({ from, text }) {
  return (
    <div className={`message ${from}`}>
      <p>{text}</p>
    </div>
  );
}
