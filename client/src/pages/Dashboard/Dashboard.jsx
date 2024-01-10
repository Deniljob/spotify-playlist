import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import SongCard from "../../components/SongCard";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const SONGS = [];

function Dashboard() {
  const [songs, setSongs] = useState([]);
  const [playListUrl, setPlayListUrl] = useState("");
  const [youTubeLinks, setYouTubeLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessTokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    if (!accessTokenCookie) window.location.href = "/login";
  }, []);

  async function getLinks() {
    try {
      setLoading(true);

      const links = await axios.post(
        `http://localhost:3000/api/playList`,
        {
          link: playListUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split("=")[1]}`,
          },
        }
      );

      if (links.data.status === false) return;

      setYouTubeLinks((prevLinks) => [...prevLinks, ...links.data.data]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Playlist URL"
          onChange={(e) => {
            setPlayListUrl(e.target.value);
          }}
        />
        <button onClick={getLinks} disabled={loading}>
          {loading ? "loading..." : "search"}
        </button>
      </div>

      <div className="download-all-button-container">
        <button className="download-all-button">Download all</button>
      </div>

      <div
        className="song-card"
        style={{ display: songs.length === 0 ? "none" : "flex" }}
      >
        <SongCard>Heathens</SongCard>
        <SongCard>Heathens</SongCard>
      </div>
      <div
        className="audio-player"
        style={{ display: songs.length === 0 ? "none" : "block" }}
      >
        <AudioPlayer autoPlay src="http://example.com/audio.mp3" />
      </div>
    </>
  );
}

export default Dashboard;
