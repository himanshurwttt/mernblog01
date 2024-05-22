import React, { useState } from "react";
import { Alert, Button, Label, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    console.log(formData);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      formData.email === "" ||
      formData.password === ""
    ) {
      return dispatch(signInFailure(`All feilds are Required`));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      // setLoading(false);
      if (res.ok) {
        navigate("/");
        dispatch(signInSuccess(data));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className=" min-h-screen  ">
      <div className="flex flex-col  gap-5 md:flex-row md:items-center p-3 mx-auto max-w-3xl sm:pt-[10%] pt-[30%] ">
        <div className="flex-1 pb-5">
          <Link to="/" className="font-bold dark:text-white text-4xl ">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Sahand's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form
            className="flex flex-col gap-4 mt-4 sm:mt-0"
            onSubmit={handleOnSubmit}
          >
            <div>
              <Label value="Your Email" />
              <TextInput
                onChange={handleChange}
                placeholder="name@company.com"
                id="email"
                type="text"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                id="password"
                type="text"
                placeholder="**********"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Loading..</span>
                </>
              ) : (
                `Sign In`
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-4 text-sm mt-5">
            <span>Create new account ?</span>
            <Link to={"/sign-up"} className="text-blue-600 font-semibold">
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5 " color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
