import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../_reducers/userReducer"
import postReducer from "../_reducers/postReducer"
import convoReducer from "../_reducers/convoReducer";
import searchReducer from "../_reducers/searchReducer";
import themeReducer from "../_reducers/themeReducer";
import otherUserReducer from "../_reducers/otherUserReducer";

const rootReducer = {
    userReducer,
    postReducer,
    convoReducer,
    searchReducer,
    themeReducer,
    otherUserReducer
};

const store = configureStore({
    reducer: rootReducer
})

export default store;