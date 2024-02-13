import React, { useEffect } from "react";
import "./Login.css";
import axios from "axios";

const URL =
  "https://accounts.spotify.com/authorize?client_id=3013bba738be4ae2ac755bec41b88e29&response_type=code&redirect_uri=https://spotify-playlist-server.onrender.com/&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private";

function Login() {
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      window.location = "/";
    }
  }, []);

  return (
    <>
      <section className="login-wrapper">
        <h1>Login to Spotify</h1>
        <a href={URL}>Login</a>
      </section>
    </>
  );
}

export default Login;
