import { Layout } from "antd";
import Head from "next/head";
const { Header } = Layout;

const Headings = ({headingName}) => {
  return (
    <>
    <Head >
      <title>{headingName}</title>
    </Head>
      <Header
        style={{
          backgroundColor: "##102e4b",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>{headingName}</h1>
      </Header>
    </>
  );
};

export default Headings;