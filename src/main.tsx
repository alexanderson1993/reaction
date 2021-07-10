import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./tailwind.css";
import App from "./App";
import "@fontsource/teko";
import "@fontsource/teko/300.css";
import "@fontsource/teko/600.css";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
    console.log("Ready to work offline");
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
