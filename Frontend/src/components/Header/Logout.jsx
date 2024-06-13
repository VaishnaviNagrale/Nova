import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

function Logout() {
  const authStatus = useSelector(state => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {mutate, isPending, error, isError} = useMutation(
    {
      mutationFn: async  () => {
        const response =  await axios.post("/api/users/logout");
        return response.data;
      },
      onSuccess: (data) => {
        dispatch(logout())
        toast.success("Logout Successful",{
          autoClose: 300
        })
        navigate("/login")
        
        
      },
      onError: (error) => {
        console.log("error  :: ", error);
        toast.error("Failed to logout",{
          autoClose: 1000
        }
        );
        throw new Error("Failed to logout");
      }
    }
  );

  
  
  

  return (
    <>

    
    <button
    onClick={mutate}
    className="cursor-pointer text-white  text-sm font-medium outline-none hover:ring-2  hover:ring-blue-800 px-5 py-2  
    max-md:px-2 max-md:py-1 max-sm:px-0 max-sm:py-1 hover:rounded-lg hover:bg-gray-700/80"
  >
    Logout
  </button>
  </>

    
  )
}

export default Logout
