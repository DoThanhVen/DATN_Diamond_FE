import { configureStore } from '@reduxjs/toolkit'

import cartSlice from '../Reducer/cartSilce';

const store = configureStore({
    reducer: {
        cart : cartSlice.reducer,
    }
});
export default store
