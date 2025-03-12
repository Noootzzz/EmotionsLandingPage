import { useState, useEffect } from 'react';
import '../css/loader.css';

const Loader = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
  

    useEffect(() => {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onFinish();
        }, 5000); 
    
        return () => clearTimeout(timer);
      }, [onFinish]);
    
      if (!isVisible) return null;
    
      return (
        <div className="loader-container">
          <p className="loader-text">Be ready to leave an experience...
            <span className="blood-drop"></span>
            <span className="blood-drop second"></span>
            <span className="blood-drop third"></span>
          </p>
        <div>

        </div>

          <div className="horror-animation">
            <div className="static-effect"></div>
            <div className="flicker-light"></div>
          </div>
        </div>
      );
    };
  
  export default Loader;