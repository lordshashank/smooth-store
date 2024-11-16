import classes from "@/styles/Skeleton.module.css";

const Skeleton = () => {
  return (
    <a className={classes["card"]} id="card-link" target="_blank">
      <div className={classes["card__header"]}>
        <div
          className={`${classes["skeleton"]} ${classes["skeleton-btn"]}`}
          id="card-header"
        ></div>
        <div
          className={`${classes["skeleton"]} ${classes["skeleton-btn"]}`}
          id="card-header"
        ></div>
      </div>

      <div className={classes["card__body"]}>
        <div className={classes.files}>
          <div className={`${classes.skeleton} ${classes.heading}`}></div>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
        </div>
        <div className={classes.folders}>
          <div className={`${classes.skeleton} ${classes.heading}`}></div>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>

          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
          <h3
            className={`${classes["skeleton"]} ${classes["skeleton-text"]} ${classes["item"]}`}
          ></h3>
        </div>
      </div>
    </a>
  );
};

export default Skeleton;
