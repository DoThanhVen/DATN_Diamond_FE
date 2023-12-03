export const getDataLogin = (data) => {
  return {
    type: "GET_LOGIN_DATA",
    payload: data
  };
}
export const getIdcategoryUpdate = (id) => {
  return {
    type: "GET_IDCATEGORY_UPDATE",
    payload: id
  };
}
export const getIdcategoryItemUpdate = (id) => {
  return {
    type: "GET_IDCATEGORYITEM_UPDATE",
    payload: id
  };
}
export const getAllCategory = (data) => {
  return {
    type: "GET_ALL_CATEGORY",
    payload: data
  };
}
//Shop
export const getAllShop = (data) => {
  return {
    type: "GET_ALL_SHOP",
    payload: data
  };
}
export const getIdShop = (id) => {
  return {
    type: "GET_ID_SHOP",
    payload: id
  };
}
export const getIdAccountAdmin = (id) => {
  return {
    type: "GET_ID_ACCOUNT_ADMIN",
    payload: id
  };
}
export const getIdProductAdmin = (id) => {
  return {
    type: "GET_ID_PRODUCT_ADMIN",
    payload: id
  };
}

export const reloadPage = (load) => {
  return {
    type: "RELOAD_PAGE",
    payload: load
  };
}