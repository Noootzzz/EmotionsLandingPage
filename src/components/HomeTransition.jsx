import { useState, useEffect, useRef } from "react";
import "../css/homeTransition.css";

export default function HomeTransition() {
    const [filterValue, setFilterValue] = useState(0);
    const [counterValue, setCounterValue] = useState(2025);
    const [blurValue, setBlurValue] = useState(20); 
    const counterRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY / 3;
            const maxScroll = window.innerHeight;
            const percentage = Math.min(scrollY / maxScroll, 1);
            setFilterValue(percentage);

            const newCounterValue = 2025 - percentage * 25;
            setCounterValue(newCounterValue);

            const newBlurValue = 20 - (percentage * 20) * 4;
            setBlurValue(newBlurValue);

            document.documentElement.style.setProperty('--blur-value', `${newBlurValue}px`);
            document.documentElement.style.setProperty('--grayscale-value', `${percentage * 100}%`);
            
            document.documentElement.style.setProperty('--counter-before', `${Math.floor(newCounterValue) - 1}`);
            document.documentElement.style.setProperty('--counter-after', `${Math.floor(newCounterValue) + 1}`);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className="homeTransition">
                <div className="counter-container">
                    <span className="h2-before">
                        {Math.floor(counterValue) - 1}
                    </span>
                    <h2 ref={counterRef} className="counter">
                        {Math.floor(counterValue)}
                    </h2>
                    <span className="h2-after">
                        {Math.floor(counterValue) + 1}
                    </span>
                </div>
                <img
                    src="/img/family.png"
                    alt="Photo de famille classique en portrait."
                    style={{ filter: `grayscale(${filterValue * 100}%)` }}
                />
            </div>
            <div style={{ height: "200vh" }}></div>
        </>
    );
};
