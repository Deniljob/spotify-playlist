import axios from "axios";
import React, { useEffect, useState } from "react";

export default function () {
  const [code, setCode] = useState(
    new URLSearchParams(window.location.search).get("code")
  );
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3000/callback", {
        code,
      })
      .then((res) => {
        window.history.pushState({}, null, "/");
        setAccessToken(res.data.data.accessToken);

        setRefreshToken(res.data.data.refreshToken);

        setExpiresIn(res.data.data.expiresIn);
      })
      .catch(() => {
        window.location = "/login";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const timeOut = setTimeout(() => {
      axios
        .post("http://localhost:3000/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.data.accessToken);

          setExpiresIn(res.data.data.expiresIn);
        })
        .catch(() => (window.location = "/"));
    }, (expiresIn - 60) * 1000);

    return () => clearTimeout(timeOut);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
