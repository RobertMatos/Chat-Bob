import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default App;
