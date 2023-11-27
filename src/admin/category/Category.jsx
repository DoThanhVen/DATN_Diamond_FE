import React, { useEffect, useRef, useState } from "react";
import ListCategory from "./ListCategory";
import EditCategory from "./EditCategory";

function Category() {
  return (
    <React.Fragment>
      <EditCategory />
      <ListCategory />
    </React.Fragment>
  );
}

export default Category;