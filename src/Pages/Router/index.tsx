import { App } from "Pages/App";
import { Confirmation } from "Pages/Confirmation";
import { Login } from "Pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const Router = () => {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route
          path="/home"
          element={
            isAuthenticated() ? <App /> : <Navigate replace to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
