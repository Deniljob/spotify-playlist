import axios from "axios";
import React, { useEffect, useState } from "react";

export default function () {
  const [code, setCode] = useState(
    new URLSearchParams(window.location.search).get("code")
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [expiresIn, setExpiresIn] = useState(
    localStorage.getItem("accessTokenExpiry")
  );

  useEffect(() => {
    if (accessToken) return;

    axios
      .post("http://localhost:3000/callback", {
        code,
      })
      .then((res) => {
        window.history.pushState({}, null, "/");

        localStorage.setItem("accessToken", res.data.data.accessToken);

        localStorage.setItem("refreshToken", res.data.data.refreshToken);

        localStorage.setItem("accessTokenExpiry", res.data.data.expiresIn);
      })
      .catch(() => {
        window.location = "/login";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const timeOut = setInterval(() => {
      axios
        .post("http://localhost:3000/refresh", {
          refreshToken,
        })
        .then((res) => {
          localStorage.setItem("accessToken", res.data.data.accessToken);

          localStorage.setItem("accessTokenExpiry", res.data.data.expiresIn);
        })
        .catch(() => (window.location = "/"));
    }, (expiresIn - 61) * 1000);

    return () => clearInterval(timeOut);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
