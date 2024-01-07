import React, { useState } from "react";
import "./Dashboard.css";
import SongCard from "../../components/SongCard";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

const SONGS = [];

function Dashboard() {
  const [songs, setSongs] = useState([12]);

  return (
    <>
      <div className="search-wrapper">
        <input type="text" placeholder="Playlist URL" />
        <button>Search</button>
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
        <SongCard>Heathens</SongCard>
        <SongCard>Heathens</SongCard>
        <SongCard>Heathens</SongCard>
        <SongCard>Heathens</SongCard>
        <SongCard>Heathens</SongCard>
      </div>
      <div className="audio-player">
        <AudioPlayer autoPlay src="http://example.com/audio.mp3" />
      </div>
    </>
  );
}

export default Dashboard;
