import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faHouse,
  faGear,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const MenuBubble = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bubble">
      <button onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
        {open ? (
          <FontAwesomeIcon icon={faXmark} style={{ color: "red" }} />
        ) : (
          <FontAwesomeIcon icon={faHouse} />
        )}
      </button>
      {open && (
        <div className="bubbleLinks">
          <Link to="/start" className="bubbleLinkItem">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
          <Link to="/active" className="bubbleLinkItem">
            <FontAwesomeIcon icon={faGear} />
          </Link>
          <Link to="/finished" className="bubbleLinkItem">
            <FontAwesomeIcon icon={faCheck} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuBubble;
