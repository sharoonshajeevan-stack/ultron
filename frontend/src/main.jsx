import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AIStateProvider from "./context/AIStateProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AIStateProvider>
      <App />
    </AIStateProvider>
  </React.StrictMode>
);