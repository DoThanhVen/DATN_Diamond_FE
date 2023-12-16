import {
  INCREASE_COUNT,
  DECREASE_COUNT,
  SET_SHOW_ALL_COMMENTS,
  SET_PRODUCT,
  SET_SHOP_NAME,
  SET_SHOP_ADDRESS,
  SET_CITY,
  SET_COUNT,
} from './constants';

export const increaseCount = () => ({
  type: INCREASE_COUNT,
});

export const decreaseCount = () => ({
  type: DECREASE_COUNT,
});

export const setShowAllComments = (value) => ({
  type: SET_SHOW_ALL_COMMENTS,
  payload: value,
});

export const setProduct = (data) => ({
  type: SET_PRODUCT,
  payload: data,
});

export const setShopName = (name) => ({
  type: SET_SHOP_NAME,
  payload: name,
});

export const setShopAddress = (address) => ({
  type: SET_SHOP_ADDRESS,
  payload: address,
});

export const setCity = (city) => ({
  type: SET_CITY,
  payload: city,
});

export const setCount = (count) => ({
  type: SET_COUNT,
  payload: count,
});