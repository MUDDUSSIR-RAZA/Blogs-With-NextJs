import Headings from "@/components/Headings";
import MyHeader from "@/components/MyHeader";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function allBlogs({ data }) {
  const handleRefresh = () => {
    router.push("/allBlogs");
  };
  return (
    <>
      <ToastContainer autoClose={1000} />
      <MyHeader>
        <Link
          style={{
            marginRight: "15px",
            alignSelf: "center",
          }}
          href={"/auth/signup"}
        >
          Sign up
        </Link>
        <Link
          style={{
            marginRight: "8px",
            alignSelf: "center",
          }}
          href={"/auth/login"}
        >
          Login
        </Link>
      </MyHeader>
      <Headings headingName={`All Blogs from ${data.firstName}`} />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6">
        <h1
          style={{
            fontSize: "16",
            fontWeight: "bolder",
          }}
        >
          <Link href={"/allBlogs"}>Back to All Blogs</Link>
        </h1>
      </div>

      {data.blogs
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
                  src={data.picture}
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
                  {data.firstName} <br /> {blog.date}
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
          </div>
        ))}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const { userId } = params;
  try {
    // Retrieve the token from the request cookie
    const token = req.headers.cookie
      ? req.headers.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      : null;

    if (token) {
      return {
        redirect: {
          destination: "/DashBoard",
          permanent: false,
        },
      };
    }

    const axios = require("axios");

    try {
      const { data } = await axios.post("http://localhost:5000/blog/findBlog",{userId});
      return {
        props: {
          data,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        // redirect: {
        //   destination: "/allBlogs",
        //   permanent: false,
        // },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {},
    };
  }
}
