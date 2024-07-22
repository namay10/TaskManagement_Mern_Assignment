import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header";
import Input from "../../components/common/MUI-themed/Input";
import "./Entry.css";
import { GoogleLogin } from '@react-oauth/google';

const Entry = ({ loginTabInitial = true }) => {
  const navigate = useNavigate();

  const [loginTab, setLoginTab] = useState(loginTabInitial);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  

  const responseMessage = async (response) => {
    try {
      
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`
      );
      
      localStorage.setItem('mern-task-management/user', JSON.stringify(data.user));
      localStorage.setItem('mern-task-management/token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

const errorMessage = (error) => {
    console.log(error);
};

  const loginUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/auth/login`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("mern-task-management/user", JSON.stringify(data));
      navigate("/");
    } catch (e) {
      console.log(e);
      if (e.response.status === 400) setErrorMsg(e.response.data.msg);
    }
    setLoading(false);
  };

  const registerUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/auth/register`,
        {
          username,
          password,
        }
      );
      console.log(data);
      setLoginTab(true);
    } catch (e) {
      console.log(e);
      if (e.response?.status === 400) setErrorMsg(e.response?.data?.msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    setErrorMsg("");
    const form = document.querySelector("form");
    form.reset();
    setLoading(false);
  }, [loginTab]);

  return (
    <>
      <Header loggedIn={false} loginTab={loginTab} setLoginTab={setLoginTab} />
      <div className="flex justify-center items-center page-template entry">
        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            if (loginTab) {
              loginUser();
            } else {
              registerUser();
            }
          }}
          autoComplete="off"
        >
          <h2 className="text-center mt-8 card-title">
            {loginTab ? "Log In" : "Sign Up"}
          </h2>
          <div className="card-body">
            <div className="mb-6">
              <Input
                label="Username"
                type="text"
                val={username}
                setVal={setUsername}
                className="w-full"
                required
              />
            </div>
            <div className="mb-6">
              <Input
                label="Password"
                type="password"
                val={password}
                setVal={setPassword}
                className="w-full"
                required
              />
            </div>
            {errorMsg && (
              <div className="text-red-500 text-end text-sm err-msg">
                {errorMsg}
              </div>
            )}
            <div>
              <button className="w-full btn-primary" disabled={loading}>
                {loginTab ? "Enter" : "Join"}
              </button>

            </div>
            
              <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            
            
          </div>
        </form>
      </div>
    </>
  );
};

export default Entry;
