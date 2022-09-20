// import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname + window.location.search);
  // });

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setIsPending(true);

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, message }),
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
        if (data.success) {
          setIsPending(false);
          return setSuccess(true);
        }
      })
      .catch((error) => {
        if (error === "Rate Limited") return;
      });
  };

  return (
    <>
      <Head>
        <title>Contact | mp3convert.tv</title>
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
        <meta property="og:title" content="Contact | mp3convert.tv" />
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
      <div className="contact">
        <h2>Contact</h2>

        {error && (
          <div data-nosnippet>
            <p className="error">{error}</p>
          </div>
        )}

        {success && (
          <div data-nosnippet>
            <p className="success">
              Our Support Team will look into your message shortly!
            </p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} data-nosnippet>
          <div className="inputs">
            <input
              placeholder="Enter your email"
              type="email"
              className="email-form"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <textarea
              required
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          {!isPending && (
            <button style={{ marginBottom: "15px" }} data-action="send">
              Submit
            </button>
          )}
          {isPending && (
            <button style={{ marginBottom: "15px" }} disabled>
              Please Wait...
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Contact;
