import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './Store/UserSlice';
import App from './App.jsx'

const myStore = configureStore({
   reducer: {
   user:UserSlice,
  },
});

createRoot(document.getElementById('root')).render(
  <Provider store={myStore}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
)
