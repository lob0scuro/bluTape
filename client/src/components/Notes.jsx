import styles from "../style/RepairCard.module.css";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "../utils";

const Notes = ({ machine, deleteFn }) => {
  const contentRef = useRef(null);
  const printFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: "Machine Notes",
    onAfterPrint: () => console.log("Print Complete"),
  });

  return (
    <>
      <div>
        <h3 className={styles.notesBlockHeader}>
          Notes
          <button className={styles.printButton} onClick={() => printFn()}>
            Print
          </button>
        </h3>
        <ul className={styles.machineNotes} ref={contentRef}>
          {machine.notes?.map((note, index) => (
            <li key={index}>
              <div>
                <p>{note.content}</p>
                <p>
                  <small>{formatDate(note.created_on)}</small>
                </p>
              </div>
              <div>
                <button onClick={() => deleteFn(note.id)}>x</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notes;
