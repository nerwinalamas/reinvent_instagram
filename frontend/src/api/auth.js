import axios from "axios";
import { API } from "../constants/endpoints";

export const loginUser = async (email, password) => {
    return await axios.post(API.LOGIN, {
        email,
        password,
    });
};

export const registerUser = async (
    email,
    firstName,
    lastName,
    userName,
    password
) => {
    return await axios.post(API.REGISTER, {
        email,
        firstName,
        lastName,
        userName,
        password,
    });
};
