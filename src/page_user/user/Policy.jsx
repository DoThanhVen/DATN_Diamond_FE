import React, { useState } from 'react';
import "../css/user/policy.css"
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Policy() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <>
    <MainNavbar />
        <div className="container mt-4">
      <div className="row">
      <h3 className="mb-4">Chính sách</h3>
        <div className="col-md-6">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeItem === 0 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setActiveItem(activeItem === 0 ? null : 0)}
                >
                  Chính sách đổi trả sản phẩm
                </button>
              </h2>
              <div className={`accordion-collapse ${activeItem === 0 ? 'show' : 'collapse'}`}>
                <div className="accordion-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                        <td  className="left-column">Thời hạn đổi trả sản phẩm</td>
                        <td className="left-column">7 ngày kể từ ngày mua hàng thành công.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Điều kiện đổi trả sản phẩm</td>
                        <td className="left-column">Sản phẩm còn nguyên vẹn, chưa qua sử dụng, có hóa đơn.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Quy trình đổi trả sản phẩm</td>
                        <td className="left-column">Liên hệ với chúng tôi qua email hoặc số điện thoại.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Chí phí đổi trả</td>
                        <td className="left-column">Khách hàng chịu trách nhiệm về chi phí gửi lại sản phẩm, trừ khi sản phẩm bị lỗi hoặc không đúng mô tả.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Điều khoản về sản phẩm bị hỏng hoặc không đáp ứng yêu cầu đổi trả</td>
                        <td className="left-column">Nếu sản phẩm bị hỏng do lỗi của chúng tôi, chúng tôi sẽ đổi trả hoặc hoàn tiền theo yêu cầu của khách hàng.</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeItem === 1 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setActiveItem(activeItem === 1 ? null : 1)}
                >
                  Điều khoản sử dụng
                </button>
              </h2>
              <div className={`accordion-collapse ${activeItem === 1 ? 'show' : 'collapse'}`}>
                <div className="accordion-body">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                        <td  className="left-column">Điều kiện sử dụng dịch vụ</td>
                        <td className="left-column">Người mua phải tuân thủ các điều khoản và điều kiện khi mua sắm trên trang web.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Quyền sở hữu trang web</td>
                        <td className="left-column">Trang web và nội dung trên đó là tài sản của chúng tôi và được bảo vệ bởi bản quyền.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Quy định về hủy đơn hàng</td>
                        <td className="left-column">Bạn có thể hủy đơn hàng nếu đơn hàng chưa được xử lý. </td>
                      </tr>
                      <tr>
                        <td className="left-column">Quyền từ chối trách nhiệm</td>
                        <td className="left-column">Chúng tôi từ chối trách nhiệm đối với mọi tổn thất hoặc hậu quả do việc bạn không tuân thủ các điều khoản sử dụng hoặc do thay đổi của chúng tôi.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Đình chỉ tài khoản</td>
                        <td className="left-column">Chúng tôi có quyền đình chỉ tài khoản của bạn hoặc từ chối truy cập của bạn vào trang web bất kỳ lúc nào nếu bạn vi phạm các điều khoản sử dụng này.</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeItem === 2 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setActiveItem(activeItem === 2 ? null : 2)}
                >
                  Chính sách giải quyết khiếu nại
                </button>
              </h2>
              <div className={`accordion-collapse ${activeItem === 2 ? 'show' : 'collapse'}`}>
                <div className="accordion-body">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                        <td  className="left-column">Cách nộp khiếu nại</td>
                        <td className="left-column">Khách hàng có thể nộp khiếu nại qua biểu mẫu trực tuyến hoặc liên hệ qua email hoặc số điện thoại.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Quy trình xử lý khiếu nại</td>
                        <td className="left-column">Chúng tôi xem xét khiếu nại trong vòng 48 giờ và thông báo kết quả qua email hoặc điện thoại.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Thời gian giải quyết khiếu nại</td>
                        <td className="left-column">Chúng tôi cam kết giải quyết khiếu nại trong vòng 10 ngày làm việc.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Liên hệ thông tin khiếu nại</td>
                        <td className="left-column">Liên hệ thông tin sẽ được cung cấp rõ ràng để khách hàng có thể nộp khiếu nại một cách dễ dàng.</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeItem === 3 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setActiveItem(activeItem === 3 ? null : 3)}
                >
                  Chính sách bảo mật thông tin cá nhân
                </button>
              </h2>
              <div className={`accordion-collapse ${activeItem === 3 ? 'show' : 'collapse'}`}>
                <div className="accordion-body">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                        <td  className="left-column">Loại thông tin cá nhân được thu thập và lý do thu thập</td>
                        <td className="left-column">Chúng tôi thu thập tên, địa chỉ, địa chỉ email và thông tin thanh toán để xử lý đơn đặt hàng của bạn.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Bảo vệ thông tin cá nhân</td>
                        <td className="left-column">Chúng tôi sử dụng các biện pháp bảo mật để bảo vệ thông tin của bạn và không chia sẻ nó với bất kỳ ai ngoài công ty chúng tôi.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Chia sẻ thông tin với bên thứ ba (nếu có)</td>
                        <td className="left-column">Chúng tôi chỉ chia sẻ thông tin với bên thứ ba (ví dụ: dịch vụ vận chuyển) để thực hiện đơn đặt hàng của bạn.</td>
                      </tr>
                      <tr>
                        <td className="left-column">Quyền của người mua về quyền riêng tư và cách họ có thể điều chỉnh thông tin cá nhân của họ</td>
                        <td className="left-column">Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất kỳ lúc nào.</td>
                      </tr>
                     

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <img src="images/policy.jpg" alt="" style={{ width: '100%' }} />
        </div>
      </div>
    </div>

    <div id="footer">
        <Footer />
      </div>
    </>

  );
}
