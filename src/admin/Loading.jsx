import React from "react";
import style from "../css/admin/loading.module.css";
function Loading() {
  return (
    <React.Fragment>
      <div className={style.cardLoading}>
        {/* <div className={style.loading1}>
          <label className={style.label}>L</label>
          <label className={style.label}>O</label>
          <label className={style.label}>A</label>
          <label className={style.label}>D</label>
          <label className={style.label}>I</label>
          <label className={style.label}>N</label>
          <label className={style.label}>G</label>
          <label className={style.label}>.</label>
          <label className={style.label}>.</label>
          <label className={style.label}>.</label>
        </div> */}
        <div className={style.loading2}>
          <label className={style.label} />
          <label className={style.label} />
          <label className={style.label} />
          <label className={style.label} />
          <label className={style.label} />
        </div>
        {/* <div className={style.loading3} />
        <div className={style.loading4}>
          <div className={style.row}>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
            <div className={style.label}>.</div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
}

export default Loading;
