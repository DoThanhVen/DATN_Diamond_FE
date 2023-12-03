import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { allData } from "./service/Reducers";
import { idCategoryUpdate } from "./service/Reducers";
import { allDataCategory } from "./service/Reducers";
import { idCategoryItemUpdate } from "./service/Reducers";
import { allDataShop } from "./service/Reducers";
import { idShop } from "./service/Reducers";
import { getreloadPage } from "./service/Reducers";
import { idAccountAdmin } from "./service/Reducers";
import { idProductAdmin } from "./service/Reducers";
const allReducers = combineReducers({
  allData, idCategoryUpdate, allDataCategory, idCategoryItemUpdate, allDataShop, idShop, getreloadPage, idAccountAdmin, idProductAdmin
});

const store = createStore(allReducers);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);