import { createSlice } from "@reduxjs/toolkit";
const initialValue={
    name:"User",
    id:""
}

const UserSlice= createSlice({
    name:"User",
    initialState: initialValue,
    reducers:{
        saveUser:(state,action)=>{
            state.name= action.payload.name
            state.id= action.payload.id
        }
    }

})
export const {saveUser} = UserSlice.actions
export default UserSlice.reducer