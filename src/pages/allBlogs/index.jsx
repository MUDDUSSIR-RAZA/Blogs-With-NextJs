import Headings from "@/components/Headings";
import MyHeader from "@/components/MyHeader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function allBlogs({ data }) {
  const allBlogs = data;
  console.log(allBlogs);
  // const [isNoBlogsToastShown, setIsNoBlogsToastShown] = useState(false);

  // const [blogs, setBlogs] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/blogs/allBlogsApi");
  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       if (data.length === 0 && !isNoBlogsToastShown) {
  //         toast.info("No blogs to display.", {
  //           position: toast.POSITION.BOTTOM_CENTER,
  //         });
  //         setIsNoBlogsToastShown(true);
  //         setBlogs(data);
  //       }

  //       setBlogs(data);
  //     } catch (error) {
  //       console.error("Error fetching blogs:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const parseDate = (dateString) => {
  //   const months = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];
  //   const parts = dateString.split(" ");

  //   const month = months.indexOf(parts[0]);
  //   const day = parseInt(parts[1].replace(",", ""));
  //   const year = parseInt(parts[2]);

  //   const timeParts = parts[4].split(":");
  //   let hour = parseInt(timeParts[0]);
  //   const minutes = parseInt(timeParts[1]);

  //   if (parts[5] === "PM" && hour !== 12) {
  //     hour += 12;
  //   }

  //   return new Date(year, month, day, hour, minutes).getTime();
  // };

  // let allBlogs = [];
  // blogs.forEach((author) => {
  //   author.blogs.forEach((blog) => {
  //     allBlogs.push({
  //       userId: author.id,
  //       userFirstName: author.firstName,
  //       blogTitle: blog.title,
  //       blogDescription: blog.description,
  //       timeCheck: parseDate(blog.dateTime),
  //       blogDateTime: blog.dateTime,
  //       userPicture: author.picture,
  //     });
  //   });
  // });

  // allBlogs.sort((a, b) => b.timeCheck - a.timeCheck);
  return (
    <>
      <ToastContainer autoClose={2000} />
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
      <Headings headingName={"All BLOGS"} />
      <div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6">
          <h1
            style={{
              fontSize: "16",
              fontWeight: "bolder",
            }}
          >
            All Blogs
          </h1>
        </div>
        {allBlogs.length === 0 ? (
          // Display this section if there are no blogs
          <div
            className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6"
            style={{
              textAlign: "center",
            }}
          >
            <p>No blogs to display.</p>
          </div>
        ) : (
          allBlogs.map((blog) => (
            <div
              key={uuidv4()}
              className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl p-3 bg-white rounded-md shadow-lg border border-gray-300 m-6"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Image
                    src={blog.author.picture}
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
                    {blog.author.firstName} <br /> {blog.date}
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
                  marginRight: "15px",
                  color: "blue",
                }}
              >
                <Link href={`/allBlogs/${blog.author._id}`}>
                  See all from this user
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const axios = require("axios");
  try {
    // Retrieve the token from the request cookie
    const token = req.headers.cookie
      ? req.headers.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      : null;

    if (token) {
      try {
        await axios.get("http://localhost:5000/blog/userBlogs", {
          headers: {
            Cookie: token,
          },
        });
        return {
          redirect: {
            destination: "/DashBoard",
            permanent: false,
          },
        };
      } catch (error) {
        try {
          const { data } = await axios.get(
            "http://localhost:5000/blog/allBlogs"
          );
          return {
            props: { data },
          };
        } catch (error) {
          console.error(error);
          return {
            props: {},
          };
        }
      }
    }
    try {
      const { data } = await axios.get(
        "http://localhost:5000/blog/allBlogs"
      );
      return {
        props: { data },
      };
    } catch (error) {
      console.error(error);
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {},
    };
  }
}
