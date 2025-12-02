import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RouterCustom from "./router/Router";
import "./index.css";
import { UserAuthProvider } from "./user/context/UserAuthContext";
import { AuthProvider } from "./admin/context/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
      <UserAuthProvider>
        <AuthProvider>
          <RouterCustom />
        </AuthProvider>
      </UserAuthProvider>
    </BrowserRouter>
);
