import { createSlice } from "@reduxjs/toolkit";
import Data from "../service/data.json";

const initialState = {
    data: null,
    loading: null,
    error: false,
}

export const Sneakers = createSlice({
    name: "Sneakers",
    initialState,
    /*
        C'est ici que les reducers sont définis. Les reducers sont des fonctions qui décrivent comment l'état de l'application change en réponse à des actions (envoyées au store).
    */
    reducers : {
        FETCH_START: (draft) => {
            draft.loading = true;
        },
        FETCH_SUCCESS: (draft, action) => {
            draft.loading = false;
            draft.data = action.payload;
        },
        FETCH_FAILURE: (draft) => {
            draft.loading = false;
            draft.error = true;
            console.log("error : " + draft.error);
        },
        ADD_CHAR: (draft, action) => {
            console.log(Data);
            action.payload.forEach((element) => {
                if(element.id){
                    console.log(element);
                    Data.push(element);
                }
            });
            console.log(Data);
        }
    }

})

export const { FETCH_START, FETCH_SUCCESS, FETCH_FAILURE, ADD_CHAR } = Sneakers.actions;

export default Sneakers.reducer;
