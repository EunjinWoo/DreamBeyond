import Home from "./pages/Main";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden", // 스크롤바 제거
      }}
    >
      <Home />
    </div>
  );
}

export default App;
