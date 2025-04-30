import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const UserRents=()=>{
    const [rents, setRents] = useState([]);
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name); 
    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("token"); // קבלת ה-token מה-localStorage
            console.log("Token:", token); // הדפסת ה-token לבדיקה

            axios.get(`http://localhost:8080/Rent/getRentsByUser/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // הוספת ה-token בכותרות
                    },
                })
                .then((response) => {
                    console.log("Response data:", response.data);
                    setRents(response.data.rents); // גש למערך rents
                })
                .catch((error) => {
                    console.error("Error fetching rents:", error);
                });
        }
    }, [id]);
return(
<>
{rents.map((rent) => (
    <div key={rent._id} className="rent-card">
          <div key={rent._id} className="rent-card">
                    <h3>Rent ID: {rent._id}</h3>
                    <p>Renter ID: {rent.rentRenter ? rent.rentRenter._id : 'N/A'}</p>
                    <p>User ID: {rent.rentUser ? rent.rentUser._id : 'N/A'}</p>
                    <p>Start Date: {new Date(rent.rentDate).toLocaleDateString()}</p>
                    <p>End Date: {rent.rentReturnDate ? new Date(rent.rentReturnDate).toLocaleDateString() : 'N/A'}</p>
                </div>
    </div>
))}

</>
)
}
export default UserRents;