import styles from "../style/MenuBubble.module.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const MenuBubble = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.bubble}>
      <div className={styles.bubbleLinks}>
        <Link className={styles.bubbleLinkItem}></Link>
        <Link className={styles.bubbleLinkItem}></Link>
        <Link className={styles.bubbleLinkItem}></Link>
      </div>
    </div>
  );
};

export default MenuBubble;
