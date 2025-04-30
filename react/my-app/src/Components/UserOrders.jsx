import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const UserOrders=()=>{
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const [Orders,setOrders] = useState([]);
    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("token"); // קבלת ה-token מה-localStorage
            console.log("Token:", token); // הדפסת ה-token לבדיקה
            axios.get(`http://localhost:8080/Order/getOrdersByUser/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // הוספת ה-token בכותרות
                    },
                })
                .then((response) => {
                    console.log("Response data:", response.data);
                    setOrders(response.data); // גש למערך orders
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [id]);

    return(
        <>
        <div>
            <h2>User Orders</h2>
            {Orders.length > 0 ? (
                Orders.map((order) => (
                    <div key={order._id} className="rent-card">
                        <h3>Order ID: {order._id}</h3>
                        <p>User ID: {order.orderUser}</p>
                        <p>Photography ID: {order.orderPhotography}</p>
                        <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    </>
    )
}
export default UserOrders;