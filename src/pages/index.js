export default function Home() {
  return <></>;
}

export async function getServerSideProps({ req }) {
  try {
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
        return {
          redirect: {
            destination: "/allBlogs",
            permanent: false,
          },
        };
      }
    }

    if (!token) {
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
