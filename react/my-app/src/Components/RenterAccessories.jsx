import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import AddAccessory from "./AddAccessory";
const  RenterAccessories = () => {
    const[accessories, setAccessories] = useState([])
    const [showAddAccessory, setShowAddAccessory] = useState(false);
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
        if (showAddAccessory) {
          
           return <AddAccessory/>
        }
    
    return(
        
        <div>
           <button onClick={() => setShowAddAccessory(true)}>to add accessory</button>
        
            <h1>Rener Accessories</h1>
            <ul>
            <ul>
           {accessories.map((accessory, index) => (
           <li key={index}>
             accessory Name: {accessory.accessoryName}  <br />
             accessory Price: {accessory. price} <br />
             <img src={`http://localhost:8080${accessory.image}`} alt="accessory" style={{ width: "100px", height: "auto" }}/>
           </li>
    ))}
</ul>
            </ul>
        </div>
    )
}
export default RenterAccessories