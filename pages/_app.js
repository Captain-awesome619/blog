import React, {useEffect, useState} from 'react';
import Layout from "../components/Layout"
import { ThemeProvider } from 'next-themes';
import '../styles/globals.scss'
import Clarity from '@microsoft/clarity';

function MyApp({ Component, pageProps }) {
  const projectId = "rxff48maqm"
 
  useEffect(() => {
     Clarity.init(projectId);
  }, []);
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