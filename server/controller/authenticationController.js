const SpotifyApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

exports.login = (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
  ];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
};

exports.callback = (req, res) => {
  const code = req.body.code;

  if (!code)
    return res.status(400).json({ status: false, message: "bad request" });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const accessToken = data.body["access_token"];
      const refreshToken = data.body["refresh_token"];
      const expiresIn = data.body["expires_in"];

      return res.json({
        status: true,
        data: { accessToken, expiresIn, refreshToken },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: false,
        message: "Failed to authenticate. Please try again later.",
      });
    });
};

exports.refresh = (req, res) => {
  const { refreshToken } = req.body;
  console.log("refreshing");

  if (!refreshToken) {
    return res
      .status(400)
      .json({ status: false, message: "Refresh token is missing" });
  }

  const spotifyApi = new SpotifyApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((response) => {
      const data = {
        accessToken: response.body["access_token"],
        expiresIn: response.body["expires_in"],
      };

      return res.json({ status: true, data });
    })
    .catch((err) => {
      console.log("Server Error: ", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Errro" });
    });
};
