
import './style.css';
import { useNavigate } from 'react-router-dom';

function Teaser() {
  const navigate = useNavigate();
    return (
        <div className="signup-container">
            <p className="welcome-section">
                <img src='images/managemrent.jpg' alt="Loan Management" className="welcome-image" />
            </p>
            <div className="form-section">
                <h1 className="welcome-text">Welcome to Agricreds</h1>
                    <h2>Track your loan fast and quick</h2>
                    <button type="submit" className="button1" onClick={() => navigate('/signin')}>Get Started</button>
            </div>
        </div>
    );
};
export default Teaser;
