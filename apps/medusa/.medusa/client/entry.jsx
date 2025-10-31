import App from "@medusajs/dashboard";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import plugin0 from "@alphabite/medusa-paypal/admin"
import plugin1 from "@lambdacurry/medusa-product-reviews/admin"

let root = null

if (!root) {
  root = ReactDOM.createRoot(document.getElementById("medusa"))
}


root.render(
  <React.StrictMode>
    <App plugins={[plugin0, plugin1]} />
  </React.StrictMode>
)


if (import.meta.hot) {
    import.meta.hot.accept()
}