import React from "react";
import { Link, useLocation } from "react-router-dom";
import ListBill from "./ListBill";
import BillDetail from "./BillDetail";

function Bill() {
  const location = useLocation();
  const isActiveListOrder = location.pathname === "/admin/bills";
  const isActiveOrderDetail = location.pathname === "/admin/bills/billdetail";
  return (
    <React.Fragment>
        {isActiveListOrder ? <ListBill /> : null}
        {isActiveOrderDetail ? <BillDetail /> : null}
        </React.Fragment>
  );
}

export default Bill;
