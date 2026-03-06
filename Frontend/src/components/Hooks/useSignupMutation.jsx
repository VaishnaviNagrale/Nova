import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-toastify"
import apiClient from "../utils/apiClient"

export const useSignupMutation = (navigate) => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(`/api/v1/users/register`, data, {
             headers :  {
                "Content-Type": "multipart/form-data",
              },
            });
            return response.data;
          },
          onSuccess: (data) => {
            toast.success("Account created successfully",{
              autoClose: 300
            });
            navigate("/login");
          },
          onError: (error) => {
            toast.error("Failed to create account");
            // The error object has a response property
            if (error.response && error.response.status === 409) {
              throw new Error(error.response.data.message);
            } else {
              console.error("Error creating account:", error.response.data);
              throw new Error("Failed to create account");
            }
          },
    })
}