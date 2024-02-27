"use client";

import { useEffect, useState } from "react";
import styles from "./SearchBox.module.css";
import { SearchInput } from "./SearchInput";
import { SearchResultList } from "./SearchResultList";
import { SearchResultItemProps } from "./SearchResultItem";
import { searchServerAction } from "../serverActions/search";

interface Props {}

type SearchResults = {
  items: SearchResultItemProps[];
  filterWord: string;
};

export function SearchBox(props: Props) {
  const [filterWord, setFilterWord] = useState("");
  const [items, setItems] = useState<SearchResultItemProps[]>([]);

  // Instead of immediately setting search results to `items`, store the results here temporarily,
  // and only update the `items` when `filterWord` matches (i.e. the most-recent callServer() attempt)
  const [tempResults, setTempResults] = useState<SearchResults>({
    items: [],
    filterWord: "",
  });

  // if tempResults.filterWord is 'behind' the current filterWord,
  // it must be still waiting for search attempts to finish
  const waitingLastSearchAttempt = filterWord !== tempResults.filterWord;

  async function callServer(newFilterWord: string) {
    const searchResults = await searchServerAction(newFilterWord);
    setTempResults({ items: searchResults, filterWord: newFilterWord });
  }

  async function updateFilter(newFilterWord: string) {
    setFilterWord(newFilterWord);

    // no await, fire and forget
    callServer(newFilterWord);
  }

  useEffect(() => {
    if (!waitingLastSearchAttempt) {
      setItems(tempResults.items);
    }
  }, [waitingLastSearchAttempt, tempResults]);

  return (
    <div className={styles.component}>
      <SearchInput
        filterWord={filterWord}
        setFilterWord={updateFilter}
        loading={waitingLastSearchAttempt}
      />
      <SearchResultList items={items} />
    </div>
  );
}
