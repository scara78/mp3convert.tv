import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Modal from "../components/Modal";
import Link from "next/link";
import Portal from "../components/Portal";
import Script from "next/script";
import { getVideoID } from "ytdl-core";
import { v1 as uuid } from "uuid";
import {
  fetchFile,
  createFFmpeg,
} from "@ioannis05/ffmpeg.wasm-st-support/ffmpeg";

// let worker = null;
let wasmSupport = true;
let ffmpegVars = null;
let ffmpeg = null;

const Home = () => {
  const isMountedRef = useRef(null);
  const [loadError, setLoadError] = useState(["", false]);
  const [youtubeURL, setYoutubeURL] = useState("");
  const [videos, setVideos] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(true);
  const [format, setFormat] = useState("audio");
  const [error, setError] = useState("");
  const [bitrate, setBitrate] = useState(256);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(null);
  const [termsAgree, setTermsAgree] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [song, setSong] = useState("");
  const [progress, setProgress] = useState(null);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(async () => {
    // ReactGA.pageview(window.location.pathname + window.location.search);
    isMountedRef.current = true;

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
      wasmSupport = false;

    if (getCookie("ffmpeg")) wasmSupport = false;

    if (wasmSupport) {
      ffmpeg = createFFmpeg({
        corePath: "/ffmpeg-core.js",
        mainName: "main",
        log: false,
      });

      try {
        // Try to load the wasm version, if doesnt work, switch to ffmpeg.js
        await ffmpeg.load();
        console.log("ffmpeg.wasm loaded");
        setLoadingFFmpeg(false);
      } catch (error) {
        console.log(error);
        console.log("Using alternative");
        wasmSupport = false;
        createCookie("ffmpeg", "1", 3000);
        // worker = new Worker("/ffmpeg-worker-mp4.js");

        // worker.onmessage = function (e) {
        //   const msg = e.data;
        //   switch (msg.type) {
        //     case "ready":
        //       setLoadingFFmpeg(false);
        //       break;
        //     case "stdout":
        //       console.log(msg.data);
        //       break;
        //     case "stderr":
        //       console.log(msg.data);
        //       if (msg.data.includes("Duration")) {
        //         let p = msg.data.split(": ")[1].split(",")[0].split(":"),
        //           s = 0,
        //           m = 1;

        //         while (p.length > 0) {
        //           s += m * parseInt(p.pop(), 10);
        //           m *= 60;
        //         }

        //         ffmpegVars = [ffmpegVars[0], s];
        //       } else if (msg.data.includes("time=")) {
        //         let p = msg.data.split("time=")[1].split(" ")[0].split(":"),
        //           s = 0,
        //           m = 1;

        //         while (p.length > 0) {
        //           s += m * parseInt(p.pop(), 10);
        //           m *= 60;
        //         }
        //         setProgress(
        //           (s * 100) / ffmpegVars[1] < 100
        //             ? new Intl.NumberFormat("default", {
        //                 style: "percent",
        //                 minimumFractionDigits: 0,
        //                 maximumFractionDigits: 0,
        //               }).format(s / ffmpegVars[1])
        //             : null
        //         );
        //       }
        //       break;
        //     case "done":
        //       let data = msg.data;
        //       const url = URL.createObjectURL(
        //         new Blob([data.MEMFS[0].data], { type: "audio/mp3" })
        //       );
        //       setSong({ url, title: ffmpegVars[0] });
        //       setIsPending(false);
        //       break;
        //   }
        // };
      }
    } else {
      console.log("Using alternative");
      setLoadingFFmpeg(false);
      //   worker = new Worker("/ffmpeg-worker-mp4.js");

      //   worker.onmessage = function (e) {
      //     const msg = e.data;
      //     switch (msg.type) {
      //       case "ready":
      //         setLoadingFFmpeg(false);
      //         break;
      //       case "stdout":
      //         console.log(msg.data);
      //         break;
      //       case "stderr":
      //         console.log(msg.data);
      //         if (msg.data.includes("Duration")) {
      //           let p = msg.data.split(": ")[1].split(",")[0].split(":"),
      //             s = 0,
      //             m = 1;

      //           while (p.length > 0) {
      //             s += m * parseInt(p.pop(), 10);
      //             m *= 60;
      //           }

      //           ffmpegVars = [ffmpegVars[0], s];
      //         } else if (msg.data.includes("time=")) {
      //           let p = msg.data.split("time=")[1].split(" ")[0].split(":"),
      //             s = 0,
      //             m = 1;

      //           while (p.length > 0) {
      //             s += m * parseInt(p.pop(), 10);
      //             m *= 60;
      //           }
      //           setProgress(
      //             (s * 100) / ffmpegVars[1] < 100
      //               ? new Intl.NumberFormat("default", {
      //                   style: "percent",
      //                   minimumFractionDigits: 0,
      //                   maximumFractionDigits: 0,
      //                 }).format(s / ffmpegVars[1])
      //               : null
      //           );
      //         }
      //         break;
      //       case "done":
      //         let data = msg.data;
      //         const url = URL.createObjectURL(
      //           new Blob([data.MEMFS[0].data], { type: "audio/mp3" })
      //         );
      //         setSong({ url, title: ffmpegVars[0] });
      //         setIsPending(false);
      //         break;
      //     }
      //   };
    }

    return () => (isMountedRef.current = false);
  }, []);

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

  const convertSong = async (title, file, bitrate, exists) => {
    setProgress("Converting...");
    ffmpegVars = [title];

    if (exists) {
      setSong({ url: file, title });
      setIsPending(false), setProgress(null);
    } else {
      const id = file.substr(file.length - 11);
      if (wasmSupport) {
        try {
          const song = await fetchFile(`/api/download/stream?video=${id}`);
          if (song.byteLength <= 10000) {
            setIsPending(false);
            return setError("You're being rate limited");
          }

          ffmpeg.FS("writeFile", "input.webm", song);
          await ffmpeg.run(
            "-i",
            "input.webm",
            "-vn",
            "-ab",
            `${bitrate ? bitrate : 256}k`,
            "-f",
            "mp3",
            "output.mp3"
          );
          const data = ffmpeg.FS("readFile", "output.mp3");

          const url = URL.createObjectURL(
            new Blob([data.buffer], { type: "audio/mp3" })
          );

          setSong({ url, title });
          setProgress(null);
          try {
            // Try to load the wasm version, if doesnt work, switch to ffmpeg.js
            ffmpeg = createFFmpeg({
              corePath: "/ffmpeg-core.js",
              mainName: "main",
              log: false,
            });

            await ffmpeg.load();
            setLoadingFFmpeg(false);
            setIsPending(false);
          } catch (error) {
            console.log(error);
            console.log("Using alternative");
            wasmSupport = false;
            // worker = new Worker("/ffmpeg-worker-mp4.js");
            createCookie("ffmpeg", "1", 3000);
            setIsPending(false);

            // worker.onmessage = function (e) {
            //   const msg = e.data;
            //   switch (msg.type) {
            //     case "ready":
            //       setLoadingFFmpeg(false);
            //       break;
            //     case "stdout":
            //       console.log(msg.data);
            //       break;
            //     case "stderr":
            //       console.log(msg.data);
            //       if (msg.data.includes("Duration")) {
            //         let p = msg.data.split(": ")[1].split(",")[0].split(":"),
            //           s = 0,
            //           m = 1;

            //         while (p.length > 0) {
            //           s += m * parseInt(p.pop(), 10);
            //           m *= 60;
            //         }

            //         ffmpegVars = [ffmpegVars[0], s];
            //       } else if (msg.data.includes("time=")) {
            //         let p = msg.data.split("time=")[1].split(" ")[0].split(":"),
            //           s = 0,
            //           m = 1;

            //         while (p.length > 0) {
            //           s += m * parseInt(p.pop(), 10);
            //           m *= 60;
            //         }
            //         setProgress(
            //           (s * 100) / ffmpegVars[1] < 100
            //             ? new Intl.NumberFormat("default", {
            //                 style: "percent",
            //                 minimumFractionDigits: 0,
            //                 maximumFractionDigits: 0,
            //               }).format(s / ffmpegVars[1])
            //             : null
            //         );
            //       }
            //       break;
            //     case "done":
            //       let data = msg.data;
            //       const url = URL.createObjectURL(
            //         new Blob([data.MEMFS[0].data], { type: "audio/mp3" })
            //       );
            //       setSong({ url, title: ffmpegVars[0] });
            //       setIsPending(false);
            //       break;
            //   }
            // };
          }
        } catch (error) {
          console.log(error);
          console.log("Using alternative");
          wasmSupport = false;

          // worker = new Worker("/ffmpeg-worker-mp4.js");

          createCookie("ffmpeg", "1", 3000);

          setProgress("Converting...");
          // fetch(`/api/download/stream?video=${id}&bitrate=${bitrate}&side=1`)
          //   .then((res) => res.json())
          //   .then((data) => {
          //     setProgress(null);
          //     setIsPending();
          //     setSong({ url: data.file, title: ffmpegVars[0] });
          //   });

          setSong({
            url: `/api/download/stream?video=${id}&bitrate=${bitrate}&side=1`,
            title: ffmpegVars[0],
          });
          setProgress(null);
          setIsPending();

          // worker.onmessage = function (e) {
          //   const msg = e.data;
          //   switch (msg.type) {
          //     case "ready":
          //       setLoadingFFmpeg(false);
          //       break;
          //     case "stdout":
          //       console.log(msg.data);
          //       break;
          //     case "stderr":
          //       console.log(msg.data);
          //       if (msg.data.includes("Duration")) {
          //         let p = msg.data.split(": ")[1].split(",")[0].split(":"),
          //           s = 0,
          //           m = 1;

          //         while (p.length > 0) {
          //           s += m * parseInt(p.pop(), 10);
          //           m *= 60;
          //         }

          //         ffmpegVars = [ffmpegVars[0], s];
          //       } else if (msg.data.includes("time=")) {
          //         let p = msg.data.split("time=")[1].split(" ")[0].split(":"),
          //           s = 0,
          //           m = 1;

          //         while (p.length > 0) {
          //           s += m * parseInt(p.pop(), 10);
          //           m *= 60;
          //         }
          //         setProgress(
          //           (s * 100) / ffmpegVars[1] < 100
          //             ? new Intl.NumberFormat("default", {
          //                 style: "percent",
          //                 minimumFractionDigits: 0,
          //                 maximumFractionDigits: 0,
          //               }).format(s / ffmpegVars[1])
          //             : null
          //         );
          //       }
          //       break;
          //     case "done":
          //       let data = msg.data;
          //       const url = URL.createObjectURL(
          //         new Blob([data.MEMFS[0].data], { type: "audio/mp3" })
          //       );
          //       setSong({ url, title: ffmpegVars[0] });
          //       setIsPending(false);
          //       break;
          //   }
          // };

          // worker.postMessage({
          //   type: "run",
          //   arguments: [
          //     "-i",
          //     `input.webm`,
          //     "-c:a",
          //     "libmp3lame",
          //     "-vn",
          //     "-ab",
          //     `${bitrate ? bitrate : 256}k`,
          //     "-ar",
          //     "44100",
          //     "-f",
          //     "mp3",
          //     `output.mp3`,
          //   ],
          //   MEMFS: [
          //     {
          //       name: "input.webm",
          //       data: await fetchFile(`/api/download/stream?video=${id}`),
          //     },
          //   ],
          // });
        }
      } else {
        setProgress("Converting...");
        // fetch(`/api/download/stream?video=${id}&bitrate=${bitrate}&side=1`)
        //   .then((res) => res.json())
        //   .then((data) => {
        //     setProgress(null);
        //     setIsPending();
        //     setSong({ url: data.file, title: ffmpegVars[0] });
        //   });

        setSong({
          url: `/api/download/stream?video=${id}&bitrate=${bitrate}&side=1`,
          title: ffmpegVars[0],
        });
        setProgress(null);
        setIsPending();
      }
    }
  };

  const copyLink = (video) => {
    setYoutubeURL(`https://youtube.com/watch?v=${video.id}`);
    navigator.clipboard.writeText(`https://youtube.com/watch?v=${video.id}`);
    document.getElementById("topOfPage").scrollIntoView({ behavior: "smooth" });
  };

  const handlePlay = (e) => {
    if (!isPlaying) {
      const audioElement = e.target
        .closest(".searched-video")
        .querySelector("audio");
      setIsPlaying(audioElement);
      audioElement.play();
    } else {
      isPlaying.pause();
      isPlaying.currentTime = 0;
      setIsPlaying(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    setVideos([]);
    setIsPlaying(null);

    if (!navigator.onLine) {
      setError("Could not connect to the server");
      setIsPending(false);
      return;
    }

    fetch(`/api/getVideos?video=${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 429) {
          setIsPending(false);
          setError("You're being rate limited");
          throw new Error("Rate Limited");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setIsPending(false);
          return;
        }
        if (isMountedRef.current) {
          setVideos(data);
          setIsPending(false);
        }
      })
      .catch((error) => {
        if (error === "Rate Limited") return;
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    setVideoInfo(null);
    setSong("");

    if (!navigator.onLine) {
      setError("Could not connect to the server");
      setIsPending(false);
      return;
    }

    fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        url: youtubeURL,
        format,
        termsAgree,
      }),
    })
      .then((response) => {
        if (response.status === 429) {
          setIsPending(false);
          setError("You're being rate limited");
          throw new Error("Rate Limited");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setIsPending(false);
          return setError(data.error);
        }

        if (isMountedRef.current) {
          setVideoInfo([
            getVideoID(youtubeURL),
            data.title,
            Math.round(data.length / 60),
            data.length,
          ]);

          convertSong(data.title, data.file, bitrate, data.exists);
        }
      })
      .catch((error) => {
        if (error === "Rate Limited") return;
      });
  };

  return (
    <>
      <Head>
        <title>Home | mp3convert.tv</title>
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
      <div id="topOfPage" className="home">
        <header>
          <Navbar />
          {error && (
            <div data-nosnippet>
              <p className="error">{error}</p>
            </div>
          )}
          <div className="showcase">
            <div className="card">
              <div>
                <h2>Download the song</h2>
                <form onSubmit={handleFormSubmit} data-nosnippet>
                  <div className="inputs">
                    <input
                      placeholder="Paste the link"
                      type="text"
                      className="link-form"
                      value={youtubeURL}
                      onChange={(e) => setYoutubeURL(e.target.value)}
                    />

                    <input
                      id="termsAgree"
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) setTermsAgree(true);
                        else setTermsAgree(false);
                      }}
                    />

                    <select
                      id="formats"
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="audio">Audio</option>
                      <option disabled value="video">
                        Video
                      </option>
                    </select>
                  </div>
                  <p style={{ fontSize: ".8rem", marginBottom: "10px" }}>
                    By using our application you accept our{" "}
                    <Link href="/termsOfUse">Terms Of Use</Link>
                  </p>
                  <h4 style={{ margin: "15px 0" }}>Bitrate:</h4>
                  <div className="radio-container">
                    <label className="container">
                      128 KBPS
                      <input
                        type="radio"
                        checked={bitrate == 128}
                        onClick={() => setBitrate(128)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">
                      256 KBPS
                      <input
                        type="radio"
                        checked={bitrate == 256}
                        onClick={() => setBitrate(256)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">
                      320 KBPS
                      <input
                        type="radio"
                        checked={bitrate == 320}
                        onClick={() => setBitrate(320)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  {!isPending && !loadingFFmpeg && (
                    <button style={{ marginBottom: "15px" }} data-action="send">
                      Convert
                    </button>
                  )}
                  {isPending && (
                    <button style={{ marginBottom: "15px" }} disabled>
                      Please Wait...
                    </button>
                  )}
                  {!isPending && loadingFFmpeg && (
                    <button style={{ marginBottom: "15px" }} disabled>
                      Loading...
                    </button>
                  )}
                </form>

                {videoInfo && (
                  <div id="videoInfo">
                    <div className="videoInfo-flex">
                      <img
                        src={`https://img.youtube.com/vi/${videoInfo[0]}/mqdefault.jpg`}
                      />
                      <div>
                        <h4>
                          <span className="red">Video Information</span>
                        </h4>
                        <p>
                          <span className="red">Title:</span> {videoInfo[1]}
                        </p>
                        <p>
                          <span className="red">Video Length:</span>{" "}
                          {videoInfo[2]}m
                        </p>
                      </div>
                    </div>
                    <div id="download">
                      {song && (
                        <a
                          href={song.url}
                          download={`${song.title}.mp3`}
                          onClick={() => {
                            if (getCookie("history")) {
                              const history = JSON.parse(getCookie("history"));

                              // Prevent Doubles
                              if (history[0].video == videoInfo[0]) return;

                              // Prevent more than 15 items in history
                              if (history.length < 15) {
                                history.unshift({
                                  title: song.title.replaceAll(
                                    /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
                                    ""
                                  ),
                                  video: videoInfo[0],
                                  id: uuid(),
                                });
                              } else {
                                history.unshift({
                                  title: song.title.replaceAll(
                                    /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
                                    ""
                                  ),
                                  video: videoInfo[0],
                                  id: history.pop().id,
                                });
                              }
                              createCookie(
                                "history",
                                JSON.stringify(history),
                                3652
                              );
                            } else {
                              createCookie(
                                "history",
                                JSON.stringify([
                                  {
                                    title: song.title.replaceAll(
                                      /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
                                      ""
                                    ),
                                    video: videoInfo[0],
                                    id: uuid(),
                                  },
                                ]),
                                3652
                              );
                            }
                          }}
                        >
                          Download
                        </a>
                      )}
                      {progress && <p>{progress}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="donate-between" data-nosnippet>
              Do you enjoy our application?{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.paypal.com/donate/?hosted_button_id=QATLFYCGAMPKE"
              >
                Buy us a coffee!
              </a>{" "}
              (Paypal and Credit Cards are supported)
            </p>
            <div className="card">
              <div>
                <h2>Search for the song</h2>

                <form onSubmit={handleSearchSubmit} data-nosnippet>
                  <div className="inputs">
                    <input
                      placeholder="Enter the name"
                      type="text"
                      className="link-form"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {!isPending && <button data-action="send">Search</button>}
                  {isPending && <button disabled>Please Wait...</button>}
                </form>

                {videos.map((video) => (
                  <div className="searched-video" key={video.id} data-nosnippet>
                    <div className="audioContainer">
                      <img
                        src={video.thumbnail.thumbnails[0].url}
                        alt={video.title}
                      />
                      {!isPlaying && (
                        <button
                          className="play-stop-button"
                          onClick={(e) => handlePlay(e)}
                        >
                          <svg
                            fill="#FFFFFF"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                          </svg>
                        </button>
                      )}
                      {isPlaying && (
                        <button
                          className="play-stop-button"
                          onClick={(e) => handlePlay(e)}
                        >
                          <svg
                            fill="#FFFFFF"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <h3>{video.title}</h3>
                    <button onClick={(e) => copyLink(video)}>Copy Link</button>
                    <audio
                      type="audio/mpeg"
                      loop={true}
                      autostart="false"
                      preload="none"
                      src={`/api/download/stream?video=${video.id}&noDisposition=1`}
                    ></audio>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
        <Portal data-nosnippet>
          <Modal open={loadError[1]} onClose={() => setLoadError(["", false])}>
            <h3>An error occured</h3>
            <p>
              This exception has been logged. We apologize for the
              inconvenience.
            </p>
            <p>
              <b>Error:</b> {loadError[0]}
            </p>
          </Modal>
        </Portal>

        <p className="donate-bottom" data-nosnippet>
          Do you enjoy our application?{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.paypal.com/donate/?hosted_button_id=QATLFYCGAMPKE"
          >
            Buy us a coffee!
          </a>{" "}
          (Paypal and Credit Cards are supported)
        </p>

        {/* <div className="sponsor">
          <h3>Chaotic Destiny Hosting</h3>
          <div>
            <img src="https://cdn.discordapp.com/attachments/895716337941364796/912439447583354921/logo.gif" />
            <p>
              Stop wasting money on servers that have downtime and latency when
              you can have lag-free machines and 99.9% uptime hosting{" "}
              <b>for a fraction of a price!</b>
            </p>
          </div>
          <a href="https://chaoticdestiny.host" target="_blank">
            Check Them Out
          </a>
        </div> */}
      </div>
    </>
  );
};

export default Home;
