import Swal from "sweetalert2";

const ModalAction = (title, status) => {
  return new Promise((resolve) => {
    Swal.fire({
      icon: status,
      title: "THÔNG BÁO!",
      text: title,
      showCancelButton: true,
      confirmButtonText: "Đồng Ý",
      confirmButtonColor: "green",
      cancelButtonText: "Từ Chối",
      cancelButtonColor: "red"
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default ModalAction;
