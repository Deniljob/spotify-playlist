import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import SongCard from "../../components/SongCard";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  PlayCircleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

function Dashboard() {
  const accessToken = useAuth();

  const [songs, setSongs] = useState([]);
  const [playListUrl, setPlayListUrl] = useState("");
  const [youTubeLinks, setYouTubeLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  useEffect(() => {
    const storedAudioLinks = localStorage.getItem("audioLinks");
    if (storedAudioLinks) {
      const audioLinks = JSON.parse(storedAudioLinks);

      audioLinks.map((song) => {
        if (song.data.status === true) {
          setSongs((prev) => [...prev, song.data.data]);
        }
      });
    }
    return () => {
      setSongs([]);
    };
  }, []);

  async function getLinks() {
    try {
      if (playListUrl == null || playListUrl == "") return;

      setLoading(true);

      const links = await axios.post(
        `https://spotify-playlist-server.onrender.com/api/playList`,
        {
          link: playListUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (links.data.status === false) return;

      const dataLinks = links.data.data;

      const linkPromise = dataLinks.map(async (link) => {
        if (link != null) return await fetchAudio(link);
      });

      const audioLinks = await Promise.all(linkPromise);

      audioLinks.map((song) => {
        if (song.data.status === true) {
          setSongs((prev) => [song.data.data, ...prev]);
        }
      });

      const storedAudioLinks = localStorage.getItem("audioLinks");
      if (storedAudioLinks) {
        const storedLinks = JSON.parse(storedAudioLinks);
        const newSongs = [...audioLinks, ...storedLinks];
        localStorage.setItem("audioLinks", JSON.stringify(newSongs));
      } else {
        localStorage.setItem("audioLinks", JSON.stringify(audioLinks));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="logout" onClick={handleLogout}>
        <ArrowLeftEndOnRectangleIcon />
      </div>
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

      <div
        className="song-card"
        style={{ display: songs.length === 0 ? "none" : "flex" }}
      >
        {songs.map((song, key) => (
          <SongCard
            key={key}
            thumbnail={song.thumbnail}
            audioLink={song.audioLink}
            handleClick={() =>
              setCurrentSong((prev) => (prev === key ? prev : key))
            }
            active={currentSong === key ? "active" : ""}
          >
            {song.songName}
          </SongCard>
        ))}
      </div>
      <div
        className="audio-player"
        style={{ display: songs.length === 0 ? "none" : "block" }}
      >
        <p>{songs.length > 0 ? songs[currentSong].songName : ""}</p>
        <AudioPlayer
          autoPlayAfterSrcChange={songs[currentSong] === 0 ? false : true}
          onEnded={() => setCurrentSong((prev) => prev + 1)}
          src={songs.length > 0 ? songs[currentSong].audioLink : ""}
        />
      </div>
    </>
  );
}

async function fetchAudio(link) {
  try {
    const audio = await axios.post(
      "https://spotify-playlist-server.onrender.com/api/download-single-audio",
      {
        youtubeLink: link,
      }
    );

    return audio;
  } catch (error) {
    console.log(error);
  }
}

function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpiry");

  window.location = "/";
}

export default Dashboard;
