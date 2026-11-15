import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("staynest_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("staynest_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("staynest_user");
    }
  }, [user]);

  // REGISTER
  const register = async (name, email, password) => {
    const response = await api.get("/users", {
      params: { email }
    });

    if (response.data.length > 0) {
      throw new Error("Email already registered");
    }

    const newUser = {
      name,
      email,
      password
    };

    await api.post("/users", newUser);

    return true;
  };

  // LOGIN
  const login = async (email, password) => {
    const response = await api.get("/users", {
      params: { email }
    });

    const foundUser = response.data.find(
      (item) => item.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    };

    setUser(safeUser);

    return true;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}