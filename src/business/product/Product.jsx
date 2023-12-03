import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import style from "../../css/business/product.module.css";
import AddProduct from "./AddProduct";
import ListAllProduct from "./ListAllProduct";
import ListProductActive from "./ListProductActive";
import ListProductUnactive from "./ListProductUnactive";

function Product() {
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
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Đang Hoạt Động"
                  value="2"
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Hết Hàng"
                  value="3"
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Thêm Sản Phẩm"
                  value="4"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ListAllProduct />
            </TabPanel>
            <TabPanel value="2">
              <ListProductActive />
            </TabPanel>
            <TabPanel value="3">
              <ListProductUnactive />
            </TabPanel>
            <TabPanel value="4">
              <AddProduct />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Product;