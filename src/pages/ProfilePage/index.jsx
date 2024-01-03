import React, { useRef, useState } from "react";
import Headings from "@/components/Headings";
import MyHeader from "@/components/MyHeader";
import Image from "next/image";
import { BsPen } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import { GrUpdate } from "react-icons/gr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";

const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password must have at least 8 characters.";
  }

  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasSmallLetter = /[a-z]/.test(password);

  if (!hasCapitalLetter || !hasSmallLetter) {
    return "Password must contain both capital and small letters.";
  }

  return null;
};

const ProfilePage = ({ user }) => {
  let { email, firstName, picture } = user;
  const router = useRouter();

  const Logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/allBlogs");
  };

  const handleRefresh = () => {
    router.push("/ProfilePage");
  };

  // const close = () => {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1000);
  // };

  const [selectedPicture, setSelectedPicture] = useState(null);
  const [updatePic, setUpdatePic] = useState("");

  const handlePictureChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedPicture(selectedFile);

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = event.target.result;
      setUpdatePic(dataUrl);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpdatePicture = async () => {
    if (selectedPicture) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/auth/updatePicture",
          {
            email,
            updatePic,
          },
          {
            withCredentials: true,
          }
        );
        handleRefresh();
        return;
      } catch (error) {
        console.error(`Error Updating Picture: ${error.response.data}`);
        return;
      }
    }
  };

  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    const passwordValidationMessage = validatePassword(password);
    if (password !== confirmPassword || passwordValidationMessage) {
      toast.error(passwordValidationMessage || "Both passwords do not match.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/updatePassword",
        {
          email,
          oldPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      return;
    } catch (error) {
      console.error(`Error Updating Password: ${error.response.data}`);
      return;
    }
  };

  const nameButton = async () => {
    const name = nameChange.value;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/updateName",
        {
          email,
          name,
        },
        {
          withCredentials: true,
        }
      );
      return;
    } catch (error) {
      console.error(`Error Updating Name: ${error.response.data}`);
      return;
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000} />
      <MyHeader name={user.firstName}>
        <Link
          style={{
            marginRight: "8px",
            fontSize: "23px",
            alignSelf: "center",
          }}
          href={"/DashBoard"}
        >
          <RxDashboard />
        </Link>
        <button
          onClick={async () => {
            await Logout();
          }}
        >
          Log Out
        </button>
      </MyHeader>
      <Headings headingName={"PROFILE PAGE"} />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-8 bg-white rounded-md shadow-lg border border-gray-300">
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "90%",
              left: "40%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              cursor: "pointer",
            }}
          >
            <label htmlFor="profilePictureInput">
              <BsPen />
            </label>
            <input
              id="profilePictureInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePictureChange}
            />
          </div>

          <Image
            src={user.picture}
            width={150}
            height={120}
            alt="Profile Picture"
            style={{
              borderRadius: "10px",
            }}
          />
        </div>

        {selectedPicture && (
          <button
            onClick={handleUpdatePicture}
            style={{
              backgroundColor: "#007bff", // Blue background color
              color: "#fff", // White text color
              border: "none",
              borderRadius: "5px",
              padding: "8px 8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              marginTop: "14px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <GrUpdate />
          </button>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            padding: "12px 0px 0px 0px",
          }}
        >
          <div className="mt-2 py-1">
            <input
              id="nameChange"
              name="nameChange"
              type="text"
              placeholder="Change Name"
              autoComplete="fisrt-name"
              required
              width={"50px"}
              minLength="3"
              maxLength="20"
              defaultValue={user.firstName}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
            />
          </div>
          <button
            onClick={nameButton}
            style={{
              marginLeft: "6px",
            }}
          >
            <BsPen />
          </button>
        </div>
        <br />
        <h1>PASSWORD</h1>
        <form className="space-y-6" onSubmit={onSubmitHandler}>
          <div>
            <div className="mt-2 py-1">
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                ref={oldPasswordRef}
                placeholder="Old Password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
              />
            </div>

            <div className="mt-2 py-1">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                ref={passwordRef}
                placeholder="New Password"
                autoComplete="newPassword"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
              />
            </div>

            <div className="mt-2 py-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                ref={confirmPasswordRef}
                placeholder="Confirm Password"
                autoComplete="confirmPassword"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;

export async function getServerSideProps({ req }) {
  try {
    // Retrieve the token from the request cookie
    const token = req.headers.cookie
      ? req.headers.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      : null;

    if (!token) {
      return {
        redirect: {
          destination: "/allBlogs",
          permanent: false,
        },
      };
    }

    const axios = require("axios");

    try {
      const { data } = await axios.post("http://localhost:5000/blog/userBlogs", {
        headers: {
          Cookie: token,
        },
      });
      return {
        props: {
          user: data,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: {
          destination: "/allBlogs",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: "/allBlogs",
        permanent: false,
      },
    };
  }
}
