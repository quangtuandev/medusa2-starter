import App from "@medusajs/dashboard";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import plugin0 from "@medusajs/draft-order/admin"
import plugin1 from "@alphabite/medusa-paypal/admin"
import plugin2 from "@alphabite/medusa-reviews/admin"

let root = null

if (!root) {
  root = ReactDOM.createRoot(document.getElementById("medusa"))
}


root.render(
  <React.StrictMode>
    <App plugins={[plugin0, plugin1, plugin2]} />
  </React.StrictMode>
)


if (import.meta.hot) {
    import.meta.hot.accept()
}