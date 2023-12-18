import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import style from "../../css/business/bill.module.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AllBill from "./AllBill";
import CanceledBill from "./CanceledBill"
import UnpaidBill from "./UnpaidBill"

function Bill() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <div className={`${style.card}`}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Tất cả"
                  value="1"
                />
                {/* <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Chờ xác nhận"
                  value="2"
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Đã hủy"
                  value="6"
                /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <AllBill />
            </TabPanel>
            <TabPanel value="2">
              <UnpaidBill />
            </TabPanel>
            <TabPanel value="6">
              <CanceledBill />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Bill;
