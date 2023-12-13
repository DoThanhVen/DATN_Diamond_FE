import React, { useEffect, useState } from "react";
import style from "../css/admin/character.module.css";

function Character() {
  const [actionCharacter, setActionCharacter] = useState("");
  const [positionXCharacter, setPositionX] = useState(0);
  const [positionYCharacter, setPositionY] = useState(0);
  const imageUrl = "/images/character.png";
  const width = 100;
  const characterStyleX = {
    ArrowLeft: {
      transform: "scaleX(-1)",
      left: `${positionXCharacter}px`
    },
    ArrowRight: {
      left: `${positionXCharacter}px`
    }
  };
  const characterStyleY = {
    ArrowUp: {
      bottom: `${positionYCharacter}px`
    },
    ArrowDown: {
      bottom: `${positionYCharacter}px`
    }
  };

  const CharacterStyle = {
    ...characterStyleX[actionCharacter],
    ...characterStyleY[actionCharacter]
  };
  const maxWidth = window.innerWidth - 340 - width;
  const maxHeight = window.innerHeight - 173;

  const handleKeyPress = event => {
    // if (event.key === "ArrowUp") {
    //   setActionCharacter("ArrowUp");
    //   setPositionY(
    //     prevPosition =>
    //       prevPosition + 80 >= maxHeight ? maxHeight : prevPosition + 80
    //   );
    // } else if (event.key === "ArrowDown") {
    //   setActionCharacter("ArrowDown");
    //   setPositionY(
    //     prevPosition => (prevPosition - 80 <= 0 ? 0 : prevPosition - 80)
    //   );
    // } else
     if (event.key === "ArrowLeft") {
      setActionCharacter("ArrowLeft");
      setPositionX(
        prevPosition => (prevPosition - 20 <= 0 ? 0 : prevPosition - 20)
      );
    } else if (event.key === "ArrowRight") {
      setActionCharacter("ArrowRight");
      setPositionX(
        prevPosition =>
          prevPosition + 20 >= maxWidth ? maxWidth : prevPosition + 20
      );
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={style.container}>
      <div className={style.character}>
        <img
          className={`${style.image} ${style[actionCharacter]}`}
          style={{ width: `${width}px`, ...CharacterStyle }}
          src={imageUrl}
          alt="Character"
        />
      </div>
    </div>
  );
}

export default Character;
