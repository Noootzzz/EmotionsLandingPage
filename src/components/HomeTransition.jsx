import { useState, useEffect, useRef } from "react";
import "../css/homeTransition.css";

export default function HomeTransition() {
    const [filterValue, setFilterValue] = useState(0);
    const [counterValue, setCounterValue] = useState(2025); // Valeur initiale du compteur
    const counterRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            // Calcul de la progression du filtre
            const scrollY = window.scrollY / 3;
            const maxScroll = window.innerHeight;
            const percentage = Math.min(scrollY / maxScroll, 1); // Clamp entre 0 et 1
            setFilterValue(percentage);

            // Calcul de la progression du compteur en fonction du scroll
            const newCounterValue = 2025 - percentage * 25; // Réduit la valeur du compteur selon le pourcentage du scroll
            setCounterValue(newCounterValue);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className="homeTransition">
                <h2 ref={counterRef} className="counter">
                    {Math.floor(counterValue)} {/* Affiche la valeur du compteur */}
                </h2>
                <img
                    src="/img/family.png"
                    alt=""
                    style={{ filter: `grayscale(${filterValue * 100}%)` }}
                />
            </div>
            <div style={{ height: "200vh" }}></div> {/* Allonge la page pour le scroll sticky */}
        </>
    );
};
