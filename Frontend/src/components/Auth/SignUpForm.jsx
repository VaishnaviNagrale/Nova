import React, { useState, useEffect } from "react";
import Input from "../utils/Input.jsx";
import { useForm } from "react-hook-form";
import Button from "../utils/Button.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignupMutation } from "../Hooks/useSignupMutation.jsx";
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue to reset form fields
  } = useForm({ reValidateMode: "onSubmit" });

  const { mutate, isPending, error, isError } = useSignupMutation(navigate);

  // Reset form fields when component unmounts
  useEffect(() => {
    return () => {
      setValue("fullName", "");
      setValue("username", "");
      setValue("email", "");
      setValue("password", "");
      setValue("avatar", null);
      setValue("coverImage", null);
    };
  }, [setValue]);

  const createAccount = async (data) => {
    const { avatar, coverImage, ...rest } = data;

    // Check if files were selected
    if (!avatar || !coverImage) {
      return;
    }

    mutate({
      ...rest,
      avatar: avatar[0],
      coverImage: coverImage[0],
    });
  };

  return (
    <>
      <div className={`container w-full  flex flex-auto justify-center mt-5 `}>
        <div
          className={`flex flex-col m-2 p-5 justify-center  bg-gray-700/30 rounded-xl ${
            isPending ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <div className="mb-2 flex mx-auto max-w-fit aspect-auto   ">
            <span className="inline-block centered w-full max-w-[100px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8e9f7ed166074f1b63f89c6d1a258945ffa6a02a0a5635fe2466e73d82e2a5f?apiKey=2a71bb6c876b4ac2af76de651fbd6a28&"
                alt="Logo"
                className="shrink-0 self-stretch aspect-square w-[63px]"
              />
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-center text-2xl font-semibold leading-tight">
              Sign up to create account
            </h2>
            <p className=" text-center text-base text-gray-200/60 mb-2">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="text-blue-600 transition-all duration-200 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          {isError && (
            <p className="text-red-600 mt-5 text-center">
              {error?.response?.data?.message || error?.message}
            </p>
          )}
          <form onSubmit={handleSubmit(createAccount)}>
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your name..."
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                errorMessage={errors.fullName?.message}
              />
              <Input
                label="Username"
                placeholder="Username..."
                {...register("username", {
                  required: "Username is required",
                })}
                errorMessage={errors.username?.message}
              />

              <Input
                label="Email"
                placeholder="ex@gmail.com"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value) ||
                      "Please enter a valid Gmail email address",
                  },
                })}
                errorMessage={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
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

              <Input
                label="Avatar Image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                className="cursor-pointer"
                {...register("avatar", {
                  required: "Avatar is required",
                  validate: {
                    fileType: (files) => {
                      if (files.length > 0) {
                        const file = files[0];
                        const allowedTypes = [
                          "image/png",
                          "image/jpg",
                          "image/jpeg",
                          "image/gif",
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          return "Please select a valid image file (PNG, JPG, JPEG, GIF)";
                        }
                      }
                      return true;
                    },
                  },
                })}
                errorMessage={errors.avatar?.message}
              />
              <Input
                label="Cover Image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("coverImage", {
                  required: "Cover Image is required",
                  validate: {
                    fileType: (files) => {
                      if (files.length > 0) {
                        const file = files[0];
                        const allowedTypes = [
                          "image/png",
                          "image/jpg",
                          "image/jpeg",
                          "image/gif",
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          return "Please select a valid image file (PNG, JPG, JPEG, GIF)";
                        }
                      }
                      return true;
                    },
                  },
                })}
                className="cursor-pointer"
                errorMessage={errors.coverImage?.message}
              />
              <Button
                type="submit"
                className="w-full bg-blue-700"
                isPending={isPending}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
