import React, { useState } from "react";
import "./SongCard.css";
import { ArrowDownCircleIcon, PlayIcon } from "@heroicons/react/24/solid";

function SongCard(props) {
  const [active, setActive] = useState("");

  function handleActivate() {
    if (active === "") {
      return setActive("active");
    } else {
      return setActive("");
    }
  }

  return (
    <>
      <div className={`card ${active}`} onClick={handleActivate}>
        <div className="icon">
          <img
            src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww"
            alt=""
          />
        </div>
        <p className="title">{props.children}</p>
        <div className="text ">
          {/* Download button and audio player */}
          <div className="song-container">
            {/* <audio controls className="audio-button">
              <source src="horse.ogg" type="audio/ogg" />
            </audio> */}
            <div className="song-controls">
              <div className="download-button">
                <ArrowDownCircleIcon />
              </div>
              <div className="play-button">
                <PlayIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SongCard;
