import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { login } from '../../store/authSlice.js';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient.jsx';

export const useLoginMutation = (dispatch, navigate) => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/users/login`, data, {
        headers: {
          "Content-Type": "Application/json"
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data) dispatch(login(data));
      const token = data.data.accessToken;
      localStorage.setItem("accessToken", token);
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
      console.log(token)
      navigate("/");
      console.log("USER GOT LOGGIN", data)
      toast.success("Login Successful",{
        autoClose: 300
      });
    },
    onError: (error) => {
        toast.error("Failed to login");
      if (error.response && error.response.status === 404) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to login");
    },
  });
};