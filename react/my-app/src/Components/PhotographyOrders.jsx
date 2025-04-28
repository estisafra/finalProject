import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
const  PhotographyOrders = () => {
    const[orders, setOrders] = useState([])
    const id = useSelector((state) => state.user.id); 
   
    useEffect(() => {
       
        if (id) { 
            axios.get(`http://localhost:8080/Order/getOrdersByPhotography/${id}`)
            .then(response => {
                console.log(response.data);
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
            <ul>
           {orders.map((order, index) => (
           <li key={index}>
            Order User: {order.orderUser} <br />
            Order Date: {new Date(order.orderDate).toLocaleDateString()}
           </li>
    ))}
</ul>
            </ul>
        </div>
    )
}
export default PhotographyOrders