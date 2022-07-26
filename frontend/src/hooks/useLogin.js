import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (data) => {
    setIsLoading(true);
    setError(null);
    console.log(data);
    axios
      .post("/api/auth/login", data)
      .then((res) => {
        console.log(res);
        localStorage.setItem(
          "user",
          JSON.stringify({ user: res.data.email, token: res.data.token })
        );
        dispatch({
          type: "LOGIN",
          payload: { user: res.data.email, token: res.data.token },
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setIsLoading(false);
        setError(err.message);
      });
  };

  return { login, isLoading, error };
};