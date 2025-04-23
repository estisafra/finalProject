
import { Link } from "react-router-dom";
import { Toolbar } from 'primereact/toolbar';
import 'primereact/resources/themes/saga-blue/theme.css';  // אפשר לשנות את הנושא
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Home = () => {
    const start = (
        <Link to="/login">
            <button className="p-button p-component" style={{ backgroundColor: '#007bff', color: '#fff' }}>Go to Login</button>
        </Link>
    );

    return (
        <div style={{ height: '100vh', backgroundImage: 'url("C:\\Users\\This User\\Desktop\\pexels-artempodrez-6941444.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Toolbar left={start} style={{ backgroundColor: '#343a40' }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h1 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Welcome to the Home Page</h1>
            </div>
        </div>
    );
};

export default Home;