import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
const  RenterRents = () => {
    const[rents, setRents] = useState([])
     const id = useSelector((state) => state.user.id); 
     
        useEffect(() => {
            if (id) {
                axios.get(`http://localhost:8080/Rent/getRentsByRenter/${id}`)
                    .then(response => {
                        console.log("Response data:", response.data);
                        setRents(response.data.rents); // גש למערך rents
                    })
                    .catch(error => {
                        console.error("Error fetching rents:", error);
                    });
            }
        }, [id]);
    
    return(
        
        <div>
            
            <h1>Rener rents</h1>
            <ul>
            <ul>
           {rents.map((rent, index) => (
           <li key={index}>
            Rent User: {rent.rentUser?.userName || "Unknown User"}  <br />
            rent Date: {new Date(rent.rentDate).toLocaleDateString()}
           </li>
         
    ))}
            </ul>
            </ul>
        </div>
    )
}
export default RenterRents