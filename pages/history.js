import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const History = () => {
  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) {
          c_end = document.cookie.length;
        }
        return decodeURI(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }

  function createCookie(name, value, days) {
    let expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  const handleDelete = (e) => {
    // if (!getCookie("history") || getCookie("history").length < 1) return
    const history = JSON.parse(getCookie("history")).filter(
      (item) => item.id != e.target.getAttribute("cookie-position")
    );
    if (history.length < 1) {
      setVideos(null);
      return (document.cookie =
        "history= ; expires = Thu, 01 Jan 1970 00:00:00 GMT");
    } else {
      createCookie("history", JSON.stringify(history), 3652);
      setVideos(history);
    }
  };

  const copyLink = (e) => {
    navigator.clipboard.writeText(
      `https://youtube.com/watch?v=${e.target.getAttribute("cookie-id")}`
    );
  };

  const [isPending, setIsPending] = useState(false);
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    setIsPending(true);
    const cookie = getCookie("history");

    if (!cookie) return setIsPending(false);
    setVideos(JSON.parse(cookie));
    setIsPending(false);
  }, []);

  return (
    <>
      <Head>
        <title>History | mp3convert.tv</title>
        <meta
          name="description"
          content="mp3convert.tv is a website where you can download music from Youtube quickly, free and WITHOUT ADS!"
        />
        <meta name="theme-color" content="#009ece" />
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
        <meta property="og:title" content="Home | mp3convert.tv" />
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
      <div className="history">
        {isPending && <p>Loading...</p>}
        {!isPending && !videos && (
          <h2 style={{ color: "#009ece" }}>No videos have been downloaded</h2>
        )}

        {!isPending && videos && (
          <div className="videoList">
            {videos.map((video) => (
              <div className="listedVideo" key={video.id} data-nosnippet>
                <img
                  src={`https://img.youtube.com/vi/${video.video}/mqdefault.jpg`}
                  alt={video.title}
                />
                <h3>{video.title}</h3>
                <div className="buttons">
                  <a
                    className="downloadButton"
                    cookie-id={video.video}
                    onClick={(e) => copyLink(e)}
                  >
                    Copy Link
                  </a>
                  <a
                    className="downloadButton"
                    cookie-position={video.id}
                    onClick={(e) => handleDelete(e)}
                  >
                    Delete
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
