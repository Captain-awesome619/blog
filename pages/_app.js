import React, {useEffect, useState} from 'react';
import Layout from "../components/Layout"
import { ThemeProvider } from 'next-themes';
import '../styles/globals.scss'


function MyApp({ Component, pageProps }) {
  return (
<div className=' dark:bg-[url("/back1.jpg")] bg-[url("/bg.jpg")] transition duration-1000 ease-in-out'>
<ThemeProvider attribute="class">
<Layout >
      <Component {...pageProps} />
      </Layout>
      </ThemeProvider>
</div>
  );
}

export default MyApp;