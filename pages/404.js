// import { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

const NotFound = () => {
  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search);
  // });

  return (
    <>
      <Head>
        <title>404 | mp3convert.tv</title>
        <meta
          name="description"
          content="mp3convert.tv is a website where you can download music from Youtube quickly, free and WITHOUT ADS!"
        />
        <meta name="theme-color" content="#009ece" />
        <script async src="https://arc.io/widget.min.js#JigZCYwQ"></script>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="yt2mp3, mp3convert.tv, youtube downloader, youtube2mp3, youtube to mp3"
        />
        <meta property="og:title" content="404 | mp3convert.tv" />
        <meta
          property="og:description"
          content="mp3convert.tv is a website where you can download music from Youtube quick, free and WITHOUT ADS!"
        />
        <meta
          property="og:image"
          content="https://mp3convert.tv/android-chrome-512x512.png"
        />
      </Head>
      <div className="not-found">
        <h2>404</h2>
        <p>That page cannot be found</p>
        <Link href="/">Back to Home...</Link>
      </div>
    </>
  );
};

export default NotFound;
