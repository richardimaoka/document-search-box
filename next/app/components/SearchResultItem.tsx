import Link from "next/link";
import { SearchResultBreadcrumb } from "./SearchResultBreadcrumb";
import styles from "./SearchResultItem.module.css";

interface Props {
  title: string;
  description: string;
  breadcrumb: string[];
}

export type SearchResultItemProps = Props;

export function SearchResultItem(props: Props) {
  return (
    <Link className={styles.link} href="/documents">
      <li className={styles.component}>
        <div className={styles.title}>{props.title}</div>
        <SearchResultBreadcrumb breadcrumb={props.breadcrumb} />
        <div className={styles.description}>{props.description}</div>
      </li>
    </Link>
  );
}
