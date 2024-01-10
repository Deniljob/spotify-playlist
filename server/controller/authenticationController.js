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
  const err = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (err)
    return res.status(500).json({ status: false, message: "server error" });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const accessToken = data.body["access_token"];
      const refreshToken = data.body["refresh_token"];
      const expiresIn = data.body["expires_in"];

      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      const expiresInMs = expiresIn * 1000;

      const cookieOptions = {
        httpOnly: false,
        expires: new Date(Date.now() + expiresInMs),
        path: "/", // Set the cookie for the root path
      };

      res.cookie("access_token", accessToken, cookieOptions);

      return res.redirect(`http://localhost:5173/`);
    })
    .catch((err) => {
      return res.json({ status: false, message: err });
    });
};
