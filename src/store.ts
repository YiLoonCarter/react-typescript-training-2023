import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit"; 
interface UserStateValue {
    username: string;
    age: number;
}
interface UserState {
    value: UserStateValue;
}
const initialState = {value: {username: "", age: 0}} as UserState;
const userSlice = createSlice({
    name: "user",
    initialState,
    //initialState: {value: {username: ""}},
    reducers: {
        login: (state: UserState, action: PayloadAction<UserStateValue>) => {
            state.value = action.payload;
        },
        logout: (state: UserState) => {
            state.value = initialState.value;
        },
    }
});

export const {login, logout} = userSlice.actions;

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});