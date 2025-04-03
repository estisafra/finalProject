import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSelector } from 'react-redux';import { useSelector } from 'react-redux';
const  PhotographyOrders = () => {
    const[orders, setOrders] = useState([])
    const id = useSelector((state) => state.user.id); 
    useEffect(() => {

        if (id) { 
            axios.get("https://localhost:8080/Photography/getOrdersByPhotography/", {
                params: { phtographyId: id } 
            })
            .then(response => {
                setOrders(response.data); 
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
        }
    }, [id]); 
    return(
      
        <div>
            <h1>Photography Orders</h1>
            <ul>
                {orders.map((order, index) => (
                    <li key={index}>{order.name}</li>
                ))}
            </ul>
        </div>
    )
}
export default PhotographyOrders