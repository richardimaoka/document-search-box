import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./SearchInput.module.css";

interface Props {
  filterWord: string;
  setFilterWord: (s: string) => void;
  loading?: boolean;
}

export function SearchInput(props: Props) {
  return (
    <div className={styles.component}>
      <FontAwesomeIcon className={styles.icon} icon={faMagnifyingGlass} />
      <input
        className={styles.input}
        placeholder="search in documentation"
        onChange={(e) => props.setFilterWord(e.target.value)}
        value={props.filterWord}
      />
      {props.loading && (
        <FontAwesomeIcon className={styles.icon} icon={faSpinner} spin />
      )}
    </div>
  );
}
