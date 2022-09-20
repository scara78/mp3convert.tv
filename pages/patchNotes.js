// import { useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Script from "next/script";

const PatchNotes = () => {
  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search);
  // });

  return (
    <>
      <Head>
        <title>Patch Notes | mp3convert.tv</title>
        <meta name="theme-color" content="#009ece" />
        <meta
          name="description"
          content="mp3convert.tv is a website where you can download music from Youtube quickly, free and WITHOUT ADS!"
        />
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
        <meta property="og:title" content="Patch Notes | mp3convert.tv" />
        <meta
          property="og:description"
          content="mp3convert.tv is a website where you can download music from Youtube quick, free and WITHOUT ADS!"
        />
        <meta
          property="og:image"
          content="https://mp3convert.tv/android-chrome-512x512.png"
        />
      </Head>
      <Script src="https://arc.io/widget.min.js#JigZCYwQ" />

      <Navbar />
      <div className="patch-notes">
        <h2>Patch Notes</h2>
        <div className="update-list">
          <p>No updates yet.</p>
          {/* <div className="update">
            <h3>Update 21/06/2022</h3>
            <ul>
              <li>Implemented Client-Side Convertation(PC Users Only)</li>
              <li>Sponsored Content on the main page</li>
              <li>Advanced Mode has been removed</li>
              <li>
                Queue System for Server-Side Convertation(Mobile Users Only)
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default PatchNotes;
