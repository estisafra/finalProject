import { createSlice } from "@reduxjs/toolkit";
const initialValue={
    name:"User",
    id:"",
    role:"",
    address:"",
    phone:"",
    email:""
}

const UserSlice= createSlice({
    name:"User",
    initialState: initialValue,
    reducers:{
        saveUser:(state,action)=>{
            state.name= action.payload.name
            state.id= action.payload.id
            state.role=action.payload.role
            state.address=action.payload.address
            state.phone=action.payload.phone
            state.email=action.payload.email
        }
    }

})
export const {saveUser} = UserSlice.actions
export default UserSlice.reducer