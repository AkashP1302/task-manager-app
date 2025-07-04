import { useState } from "react";
import axios from "axios";
import useNotification from "./useNotification";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const request = async ({
    url,
    method = "get",
    data = null,
    headers = {},
    successMessage = "",
    errorMessage = "Something went wrong",
    responseType = "json",
  }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await api({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        responseType,
      });

      if (successMessage) showNotification(successMessage, "success");

      return res.data;
    } catch (error) {
      console.error("API Error:", error);
      showNotification(error?.response?.data?.message || errorMessage, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading };
};

export default useApi;
