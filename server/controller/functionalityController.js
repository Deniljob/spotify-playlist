const SpotifyApi = require("spotify-web-api-node");
const youtubeSearchApi = require("youtube-search-api");
const youtubeDl = require("youtube-dl-exec");
const fs = require("fs");

const spotifyApi = new SpotifyApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

exports.playList = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    const { link } = req.body;

    spotifyApi.setAccessToken(token);

    const first_iteration = link.split("?")[0];
    const second_iteration = first_iteration.split("/");
    const playListId = second_iteration[second_iteration.length - 1];

    const data = await spotifyApi.getPlaylist(playListId);

    const items = data.body.tracks.items;

    const songNamePromises = items.map(async (value) => {
      const trackName = value.track.name;

      const videoId = await youtubeSearch(trackName);

      if (videoId != false) return `https://www.youtube.com/watch?v=${videoId}`;
    });

    const youtubeLinks = await Promise.all(songNamePromises);

    return res.json({ status: true, data: youtubeLinks });
  } catch (err) {
    return res.json({ status: false, err });
  }
};

async function youtubeSearch(trackName) {
  try {
    const searchResult = await youtubeSearchApi.GetListByKeyword(
      trackName,
      false,
      2,
      [{ type: "video/channel/playlist/movie" }]
    );

    return searchResult.items[0].id;
  } catch (error) {
    return false;
  }
}

exports.downloadAudios = async (req, res) => {
  try {
    const { youtubeLinks } = req.body;

    if (youtubeLinks.length > 10)
      return res.status(500).json({ status: false, message: "Too much data" });

    const audioPromise = youtubeLinks.map(async (youtubeLink) => {
      if (youtubeLink == null) return;

      const videoDetails = await youtubeDl(`${youtubeLink}`, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ["referer:youtube.com", "user-agent:googlebot"],
      });

      const songName = videoDetails.title;
      const formats = videoDetails.formats;
      // const format = videoDetails.formats[10];

      const format = formats.filter(
        (data) =>
          data.resolution === "audio only" && data.manifest_url == undefined
      );

      const audioLinks = format[format.length - 1].url;

      return audioLinks;
    });

    const audio = await Promise.all(audioPromise);

    const result = audio.filter((audioLink) => audioLink != null);

    return res.json({ status: true, data: result });
  } catch (error) {
    throw new Error(`Error in downloadAudios: ${error.message}`);
  }
};

exports.downloadSingleAudio = async (req, res) => {
  try {
    const { youtubeLink } = req.body;

    if (youtubeLink == null)
      return res.status(400).json({ status: false, message: "Bad request" });

    const videoDetails = await youtubeDl(`${youtubeLink}`, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    const songName = videoDetails.title;
    const formats = videoDetails.formats;

    const format = formats.filter(
      (data) =>
        data.resolution === "audio only" && data.manifest_url == undefined
    );

    const audioLink = format[format.length - 1].url;

    const data = {
      songName,
      audioLink,
    };

    return res.json({ status: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", error: error });
  }
};
