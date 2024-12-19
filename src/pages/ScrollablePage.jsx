import React from "react";
import "../styles/ScrollablePage.css"; // 스타일을 별도 파일로 분리

const ScrollablePage = () => {
  return (
    <div className="scrollable-container">
      <div className="content-section">
        <h2>Section 1</h2>
        <p>This is a scrollable page section.</p>
      </div>
      <div className="content-section">
        <h2>Section 2</h2>
        <p>You can add as much content as you want here.</p>
      </div>
    </div>
  );
};

export default ScrollablePage;
