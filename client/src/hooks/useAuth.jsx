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
        setAccessToken(res.data.data.accessToken);
        setRefreshToken(res.data.data.refreshToken);
        setExpiresIn(res.data.data.expiresIn);

        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/login";
      });
  }, [code]);

  return accessToken;
}
