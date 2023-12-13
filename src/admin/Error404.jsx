import React from "react";
import style from "../css/admin/error.module.css";
import { Link } from "react-router-dom";
function Error404() {
  return (
    <React.Fragment>
      <div className={style.cardError}>
        <div className={style.title}>Không có kết quả</div>
        <div className={style.error404}>404</div>
        <div className={style.reason}>
          Không thấy nội dung tìm kiếm. Hãy thử tìm kiếm khác.
        </div>
        <div className={style.groupButton}>
          <Link className={style.link} to="/admin/accounts"><span className={style.buttonBack}><i className='bx bxs-left-arrow-alt me-1'></i>về trang chủ</span></Link>
          <Link className={style.link} to="/admin/accounts"><span className={style.buttonHelp}><i className='bx bx-envelope me-1'></i>liên hệ với chúng tôi</span></Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Error404;
