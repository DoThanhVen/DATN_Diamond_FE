import {
  INCREASE_COUNT,
  DECREASE_COUNT,
  SET_SHOW_ALL_COMMENTS,
  SET_PRODUCT,
  SET_SHOP_NAME,
  SET_SHOP_ADDRESS,
  SET_CITY,
} from './constants';

const initialState = {
  count: parseInt(localStorage.getItem('count') || 14),
  showAllComments: false,
  product: null,
  shopName: null,
  shopAddress: null,
  city: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_COUNT:
      return { ...state, count: state.count + 1 };

    case DECREASE_COUNT:
      return { ...state, count: state.count > 1 ? state.count - 1 : state.count };

    case SET_SHOW_ALL_COMMENTS:
      return { ...state, showAllComments: action.payload };

    case SET_PRODUCT:
      return { ...state, product: action.payload };

    case SET_SHOP_NAME:
      return { ...state, shopName: action.payload };

    case SET_SHOP_ADDRESS:
      return { ...state, shopAddress: action.payload };

    case SET_CITY:
      return { ...state, city: action.payload };

    default:
      return state;
  }
};

export default reducer;
