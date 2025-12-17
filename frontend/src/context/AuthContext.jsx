import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const login = async (username, password) => {
    const res = await axiosClient.post("/auth/login/", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: res.data.username,
        role: res.data.role,
      })
    );

    setUser({
      username: res.data.username,
      role: res.data.role,
    });

    if (res.data.role === "DOCTOR") navigate("/doctor");
    else navigate("/patient");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
