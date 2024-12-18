import React, { useRef } from "react";
import Home from "./pages/Main";

function App() {
  const iframeContainerRef = useRef(null);

  return (
    <div>
      <Home iframeContainerRef={iframeContainerRef} />
      {/* iframeContainer 추가 */}
      <div
        ref={iframeContainerRef}
        id="iframeContainer"
        style={{
          display: "none",
          position: "absolute",
          pointerEvents: "all",
        }}
      >
        <iframe
          id="infoIframe"
          src="https://esthrelar.notion.site/Portfolio-Eunjin-Woo-116d6dfcfc9e806cb876c0bae653ef53?pvs=4"
          width="400"
          height="300"
          frameBorder="0"
          title="iframe-content"
        ></iframe>
      </div>
    </div>
  );
}

export default App;
