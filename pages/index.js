import Head from "next/head";
import Hero from "../Components/Hero";
import Layouts from "../Components/Layouts";
import Services from "../Components/Services";
import { client } from "../lib/client";
import css from '../styles/Home.module.css'
export default function Home(pizzas) {
  // console.log(pizzas);
  return (
    <Layouts>
      <div className={css.container}>
        <Head>
          <title>FUDO</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/Logo.png" />
        </Head>
        {/* body */}
        <main>
          <Hero />
          <Services />
        </main>
      </div>
    </Layouts>
  );
}


export const getServerSideProps = async() => {
  const query = '*[_type == "pizza"]';
  const pizzas = await client.fetch(query)
  return {
    props: {
      pizzas
    }
  }
}
