import React from "react";
import AddStorge from "./AddStorge";
import ListStorge from "./ListStorge";
import HistoryAdd from "./HistoryAdd";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import style from "../../css/business/storge.module.css"

function Storge() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <AddStorge />
      <div className={style.card}>
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
                  label="Kho hàng"
                  value="1"
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    "&.Mui-selected": {
                      fontWeight: "bold"
                    }
                  }}
                  label="Lịch sử"
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <ListStorge />
            </TabPanel>
            <TabPanel value="2">
              <HistoryAdd />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Storge;