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
      <div className={`card ${props.active}`} onClick={handleActivate}>
        <div className="icon">
          <img src={props.thumbnail} alt="" />
        </div>
        <p className="title">{props.children}</p>
        <div className="text ">
          <div className="song-container">
            <div className="song-controls">
              {/* <div className="download-button">
                <a href={props.audioLink} target="_blank">
                  <ArrowDownCircleIcon />
                </a>
              </div> */}
              <div className="play-button" onClick={props.handleClick}>
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
