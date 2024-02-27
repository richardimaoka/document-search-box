"use client";

import { useState } from "react";
import styles from "./SearchBox.module.css";
import { SearchInput } from "./SearchInput";

interface Props {}

export function SearchBox(props: Props) {
  const [filterWord, setFilterWord] = useState("");

  return (
    <div className={styles.component}>
      <SearchInput filterWord={filterWord} setFilterWord={setFilterWord} />
    </div>
  );
}
