import styles from "../style/MenuBubble.module.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEllipsisVertical,
  faGear,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const MenuBubble = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.bubble}>
      <button onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
      <div className={styles.bubbleLinks}>
        <Link to="/start" className={styles.bubbleLinkItem}>
          <FontAwesomeIcon icon={faPlus} />
        </Link>
        <Link to="/active" className={styles.bubbleLinkItem}>
          <FontAwesomeIcon icon={faGear} />
        </Link>
        <Link to="/finished" className={styles.bubbleLinkItem}>
          <FontAwesomeIcon icon={faCheck} />
        </Link>
      </div>
    </div>
  );
};

export default MenuBubble;
