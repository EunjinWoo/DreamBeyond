import React from "react";

function LoadingOverlay({ progress }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "2rem",
        zIndex: 1000,
      }}
    >
      Loading... {progress}%
    </div>
  );
}

export default LoadingOverlay;
