import * as actionType from './actionType'

export const buyProduct = (product) => {
    return {
        type : actionType.BUY_PRODUCT,
        payload: product
    }
}

export const updateProduct = (product) => {
    return {
        type : actionType.UPDATE_PRODUCT,
        payload: product
    }
}

export const removeProduct = (product) => {
    return {
        type : actionType.REMOVE_PRODUCT,
        payload: product
    }
}

export const cartSelector = (state) => state.cart