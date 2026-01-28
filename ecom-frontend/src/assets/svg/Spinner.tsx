import styles from "./Spinner.module.css";

const Spinner = () => (
  <span className={styles.spinner} aria-hidden="true">
    <svg
      className={styles.spinnerCircle}
      viewBox="0 0 24 24"
      width="28"
      height="28"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        strokeDasharray="56.5"
        strokeDashoffset="28"
      />
    </svg>
  </span>
);

export default Spinner;
