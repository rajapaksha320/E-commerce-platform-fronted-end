import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RbQlsFhUPsUsWN0daxG3BffoRy1XtMm6qtulHH5QrZm3fiHwNdmlp9C2AWs87gLlqkNCVA1BvUUu8g9Isk3o6fP00Wl4YNnum');

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <Elements stripe={stripePromise}>
          <App />
      </Elements>
  </StrictMode>
);
