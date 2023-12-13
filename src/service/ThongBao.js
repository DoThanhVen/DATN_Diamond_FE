import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPI } from "./API";

const ThongBao = (title, status) => {
  Swal.fire({
    icon: status,
    title: "THÔNG BÁO!",
    text: title,
    showCancelButton: false,
    confirmButtonText: "Đồng Ý",
    confirmButtonColor: "green"
  });
};

const Toastify = () => {
  toast("🦄 Wow so easy!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
  });
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export { ThongBao, Toastify };
