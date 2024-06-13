import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import Input from '../utils/Input.jsx';
import Button from '../utils/Button.jsx';
import { useLoginMutation } from '../Hooks/useLoginMutation.jsx';

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { mutate, isPending, isError, error } = useLoginMutation(dispatch, navigate);

  const memoizedValidateEmail = useCallback(validateEmail, []);

  const loginUser = (data) => {
   
    mutate( {
      ...(memoizedValidateEmail(data.usernameOremail) ? { email: data.usernameOremail } : { username: data.usernameOremail }),
      password: data.password,
    });
  };

  return (
    <div className="container w-full flex flex-auto  min-h-[550px]  justify-center items-center">
      <div className={`flex  h-fit flex-col p-6 align-center justify-center bg-gray-700/30 rounded-xl ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <div className="flex mx-auto max-w-fit aspect-auto">
          <span className="inline-block centered w-full max-w-[100px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8e9f7ed166074f1b63f89c6d1a258945ffa6a02a0a5635fe2466e73d82e2a5f?apiKey=2a71bb6c876b4ac2af76de651fbd6a28&"
              alt="Logo"
              className="shrink-0 self-stretch aspect-square w-[63px]"
            />
          </span>
        </div>

        <div className="flex flex-col gap-1 mb-1.5">
          <h2 className="text-center text-xl font-semi leading-tight">Login</h2>
          <p className="text-center text-base text-gray-400/60">
            Don't have an account?&nbsp;
            <Link to="/signup" className="text-blue-500/100 transition-all duration-200 hover:underline">
              SignUp
            </Link>
          </p>
        </div>

        {isError && (
          <p className="text-red-600 mt-3 text-sm text-center">
            {error?.response?.data?.message || error?.message}
          </p>
        )}

        <form onSubmit={handleSubmit(loginUser)}>
          <div className="space-y-5">
            <Input
              label="username or email"
              placeholder="username or email"
              {...register("usernameOremail", {
                required: "username or email is required",
              })}
              errorMessage={errors.usernameOremail?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "password is required",
                })}
                errorMessage={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-7 right-0 pr-3 transform t"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button type="submit" className="w-full bg-blue-700" isPending={isPending}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;