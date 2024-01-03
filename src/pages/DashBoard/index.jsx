import React, { useEffect, useRef, useState } from "react";
import Headings from "@/components/Headings";
import MyHeader from "@/components/MyHeader";
import { BiSolidUserCircle } from "react-icons/bi";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

const DashBoard = ({ data }) => {
  let { _id, firstName, blogs, picture } = data;
  const router = useRouter();
  const titleRef = useRef();
  const descriptionRef = useRef();

  const handleRefresh = () => {
    router.push("/DashBoard");
  };

  const Logout = async () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.replace('/allBlogs');
  };

  // const currentDate = new Date();

  // const options = {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  // };

  // const dateTime = currentDate.toLocaleDateString("en-US", options);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/blog/publish",
        {
          author: _id,
          title,
          description,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(data);

      titleRef.current.value = "";
      descriptionRef.current.value = "";
      handleRefresh();
      return;
    } catch (error) {
      toast.error(`Error Uploading Blog: ${error.response.data}`);
      // console.error(`Error Uploading Blog: ${error.response.data}`);
      return;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/blog/delete", {
        method: "DELETE",
        body: JSON.stringify({
          id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        handleRefresh();
        toast.success(`Blog deleted successfully.`);
        // close();
      } else {
        toast.error("Failed to delete Blog.");
      }
    } catch (error) {
      toast.error("Error deleting Blog: " + error.message);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000} />
      <MyHeader name={firstName}>
        <Link
          style={{
            marginRight: "8px",
            fontSize: "23px",
            alignSelf: "center",
          }}
          href={"/ProfilePage"}
        >
          <BiSolidUserCircle />
        </Link>
        <button
          onClick={async () => {
            await Logout();
          }}
        >
          Log Out
        </button>
      </MyHeader>
      <Headings headingName={"DASH BOARD"} />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-8 bg-white rounded-md shadow-lg border border-gray-300 m-6">
        <form
          className="space-y-6 py-50"
          method="POST"
          onSubmit={onSubmitHandler}
        >
          <div className="space-y-6">
            <div className="mt-2 py-1">
              <input
                id="title"
                name="title"
                type="title"
                ref={titleRef}
                placeholder="Title"
                required
                minLength="5"
                maxLength="30"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
              />
            </div>

            <div className="mt-2 py-1">
              <textarea
                id="discription"
                name="discription"
                ref={descriptionRef}
                placeholder="Description"
                required
                minLength="100"
                maxLength="3000"
                rows={4}
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex  justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Publsih blog
            </button>
          </div>
        </form>
        <br />
        <br />
      </div>

      {blogs.length > 0 ? (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6">
          <h1
            style={{
              fontSize: "16",
              fontWeight: "bolder",
            }}
          >
            My Blogs
          </h1>
        </div>
      ) : (
        ""
      )}

      {blogs
        .slice()
        .reverse()
        .map((blog) => (
          <div
            key={uuidv4()}
            className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Image
                  src={picture}
                  width={90}
                  height={100}
                  alt="Profile Picture"
                  style={{
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: "8px",
                }}
              >
                <h1
                  style={{
                    fontSize: "16px",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {blog.title}
                </h1>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "lighter",
                    paddingLeft: "10px",
                    textAlign: "center",
                  }}
                >
                  {firstName} <br /> {blog.date}
                </span>
              </div>
            </div>
            <br />
            <div
              style={{
                wordWrap: "break-word",
              }}
            >
              {blog.description}
            </div>
            <br />
            <div
              style={{
                display: "flex",
                fontSize: "25px",
                flexDirection: "row-reverse",
                marginRight: "15px",
              }}
            >
              <button onClick={() => handleDelete(blog._id)}>
                <MdDelete />
              </button>
              {/* onClick={() => handleEdit(blog.id)} */}
              {/* <button>
                <CiEdit />
              </button> */}
            </div>
          </div>
        ))}
    </>
  );
};

export default DashBoard;

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   if (!session || !session.user || !session.user.email) {
//     return {
//       redirect: {
//         destination: "/allBlogs",
//         permanent: false,
//       },
//     };
//   }

//   const userEmail = session.user.email;
//   const blogs = await userBlogs(userEmail);
//   const user = await getByEmail(userEmail);

//   return {
//     props: {
//       session,
//       blogs,
//       user,
//     },
//   };
// }

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
          data,
          token,
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
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
}
