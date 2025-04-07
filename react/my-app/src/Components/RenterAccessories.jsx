import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
const  RenterAccessories = () => {
    const[accessories, setAccessories] = useState([])
    //  const id = useSelector((state) => state.user.id); 
     const id="67ea7200d3d21caf4dd0f6a2"
        useEffect(() => {
            if (id) {
                axios.get(`http://localhost:8080/Accessory/getAccessoryByRenter/${id}`)
                    .then(response => {
                        console.log("Response data:", response.data);
                        setAccessories(response.data); 
                    })
                    .catch(error => {
                        console.error("Error fetching rents:", error);
                    });
            }
        }, []);
    
    return(
        
        <div>
            <h1>Rener rents</h1>
            <ul>
            <ul>
           {accessories.map((accessory, index) => (
           <li key={index}>
             accessory Name: {accessory.accessoryName}  <br />
             accessory Price: {accessory. price} <br />
             {/* accesorry image: <img src={accessory.image} alt="accessory" /> <br /> */}
           </li>
    ))}
</ul>
            </ul>
        </div>
    )
}
export default RenterAccessories