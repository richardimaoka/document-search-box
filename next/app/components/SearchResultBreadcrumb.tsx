import styles from "./SearchResultBreadcrumb.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";

interface Props {
  breadcrumb: string[];
}

export function SearchResultBreadcrumb(props: Props) {
  return (
    <div className={styles.component}>
      {props.breadcrumb.map((x, index) => (
        <Fragment key={x}>
          <div className={styles.element} key={x}>
            {x}
          </div>
          {index < props.breadcrumb.length - 1 && (
            // if `index < last index` then draw a right angle
            <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
