export const allData = (state = {}, action) => {
  switch (action.type) {
    case "GET_LOGIN_DATA":
      return action.payload;
    default:
      return state;
  }
};
export const idCategoryUpdate = (state = 0, action) => {
  switch (action.type) {
    case "GET_IDCATEGORY_UPDATE":
      return action.payload;
    default:
      return state;
  }
};
export const idCategoryItemUpdate = (state = 0, action) => {
  switch (action.type) {
    case "GET_IDCATEGORYITEM_UPDATE":
      return action.payload;
    default:
      return state;
  }
};
export const allDataCategory = (state = {}, action) => {
  switch (action.type) {
    case "GET_ALL_CATEGORY":
      return action.payload;
    default:
      return state;
  }
};
//Shop
export const allDataShop = (state = {}, action) => {
  switch (action.type) {
    case "GET_ALL_SHOP":
      return action.payload;
    default:
      return state;
  }
};
export const idShop = (state = 0, action) => {
  switch (action.type) {
    case "GET_ID_SHOP":
      return action.payload;
    default:
      return state;
  }
};
export const idAccountAdmin = (state = 0, action) => {
  switch (action.type) {
    case "GET_ID_ACCOUNT_ADMIN":
      return action.payload;
    default:
      return state;
  }
};
export const idProductAdmin = (state = 0, action) => {
  switch (action.type) {
    case "GET_ID_PRODUCT_ADMIN":
      return action.payload;
    default:
      return state;
  }
};
export const getreloadPage = (state = 0, action) => {
  switch (action.type) {
    case "RELOAD_PAGE":
      return action.payload;
    default:
      return state;
  }
};