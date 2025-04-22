import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page!</p>
            <Link to="/login">
                <button>Go to Login</button>
            </Link>
        </div>
    );
};

export default Home;