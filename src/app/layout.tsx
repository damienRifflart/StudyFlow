import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Sidebar } from "../components/Sidebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-row gap-5">
      <Sidebar nav="notes"/>
      <App />
    </div>
  </React.StrictMode>,
);
