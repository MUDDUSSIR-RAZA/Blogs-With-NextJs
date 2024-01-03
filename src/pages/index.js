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
      return {
        redirect: {
          destination: "/DashBoard",
          permanent: false,
        },
      };
    }

    if (!token) {
      return {
        redirect: {
          destination: "/allBlogs",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
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
