import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyHeader from "@/components/MyHeader";
import Link from "next/link";
import Headings from "@/components/Headings";
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

export default function signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  // const router = useRouter();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();

  // const { data } = useSession();
  // if (data) {
  //   router.replace('/DashBoard')
  // }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const repeatPassword = repeatPasswordRef.current.value;

    // const passwordValidationMessage = validatePassword(password);
    // if (password !== repeatPassword || passwordValidationMessage) {
    //   toast.error(passwordValidationMessage || "Both passwords do not match.");
    //   return;
    // }

    try {
      const { data } = await axios.post("http://localhost:5000/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      window.location.replace("/auth/login");
      return;
    } catch (error) {
      console.error(`Sign up failed: ${error.response.data}`);
      return;
    }
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
          href={"/allBlogs"}
        >
          All Blogs
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
      <Headings headingName={"SIGNUP"} />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Signup for new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-8 bg-white rounded-md shadow-lg border border-gray-300">
          <form className="space-y-6" onSubmit={onSubmitHandler}>
            <div>
              <div className="mt-2 py-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  ref={firstNameRef}
                  placeholder="First Name"
                  autoComplete="given-name"
                  required
                  minLength="3"
                  maxLength="20"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
                />
              </div>

              <div className="mt-2 py-1">
                <input
                  id="lastName"
                  name="last-name"
                  type="text"
                  ref={lastNameRef}
                  placeholder="Last Name"
                  autoComplete="family-name"
                  required
                  minLength="1"
                  maxLength="20"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
                />
              </div>

              <div className="mt-2 py-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  ref={emailRef}
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
                />
              </div>

              <div className="mt-2 py-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  placeholder="Password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 py-2"
                />
              </div>

              <div className="mt-2 py-1">
                <input
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  ref={repeatPasswordRef}
                  placeholder="Repeat Password"
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
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
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
          props: {},
        };
      }
    }

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {},
    };
  }
}
