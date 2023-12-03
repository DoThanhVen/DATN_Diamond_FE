import Swal from "sweetalert2";
import { callAPI } from "./API";

const ModalAction = (
  title,
  status,
) => {
  Swal.fire({
    icon: status,
    title: "THÔNG BÁO!",
    text: title,
    showCancelButton: true,
    confirmButtonText: "Đồng Ý",
    confirmButtonColor: "green",
    cancelButtonText: "Từ Chối",
    cancelButtonColor: "red"
  }).then(async (result) => {
    if (result.isConfirmed) {
        return true;
    }else{return false;}
  });
};

export default ModalAction;
