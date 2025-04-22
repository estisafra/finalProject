import { Link } from "react-router-dom";

const RenterHome = () => {
    return (
        <>
            <h1>Renter Home</h1>
            <Link to="/renteraccessories">
                <button>Go to Renter Accessories</button>
            </Link>
            <Link to="/renterrents">
                <button>Go to Renter Rents</button>
            </Link>
        </>
    );
};

export default RenterHome;