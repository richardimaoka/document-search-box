"use client";

import { useState } from "react";
import styles from "./SearchBox.module.css";
import { SearchInput } from "./SearchInput";
import { SearchResultList } from "./SearchResultList";
import { SearchResultItemProps } from "./SearchResultItem";
import { searchServerAction } from "../serverActions/search";

interface Props {}

export function SearchBox(props: Props) {
  const [filterWord, setFilterWord] = useState("");
  const [items, setItems] = useState<SearchResultItemProps[]>([]);

  async function updateFilter(newFilterWord: string) {
    setFilterWord(newFilterWord);
    const results = await searchServerAction(newFilterWord);
    setItems(results);
  }

  return (
    <div className={styles.component}>
      <SearchInput filterWord={filterWord} setFilterWord={updateFilter} />
      <SearchResultList items={items} />
    </div>
  );
}
