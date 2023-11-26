import React from 'react'

export default function NewPass() {
  return (
    <div>
        <div className="container padding-bottom-3x mb-2">
    <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10  border p-4 " style={{marginTop: '120px', borderRadius: '10px'}}> 
            <h2>Mật khẩu mới</h2>
            <form className="card mt-4">
                <div className="card-body">
                    <div className="form-group">
                        <label for="pass">Vui lòng nhập mật khẩu mới:</label>
                        <input className="form-control" type="password" id="email-for-pass" required=""/>
                    </div>
                    <div className="form-group mt-4">
                        <label for="pass">Vui lòng nhập lại khẩu mới:</label>
                        <input className="form-control" type="password" id="email-for-pass" required=""/>
                    </div>
                </div>
                <div className="card-footer">
                    <button className="btn btn-success px-4"  type="submit">Đồng ý</button>
                </div>
            </form>
        </div>
    </div>
</div>
    </div>
  )
}
