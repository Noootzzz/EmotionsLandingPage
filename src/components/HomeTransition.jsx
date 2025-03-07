import { useState, useEffect, useRef } from "react";
import "../css/homeTransition.css";

export default function HomeTransition() {
    const [filterValue, setFilterValue] = useState(0); // Valeur pour l'effet grayscale
    const [counterValue, setCounterValue] = useState(2025); // Valeur initiale du compteur
    const [blurValue, setBlurValue] = useState(20); // Valeur initiale du blur
    const counterRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            // Calcul de la progression du filtre (grayscale)
            const scrollY = window.scrollY / 3;
            const maxScroll = window.innerHeight;
            const percentage = Math.min(scrollY / maxScroll, 1); // Clamp entre 0 et 1
            setFilterValue(percentage);

            // Calcul de la progression du compteur en fonction du scroll
            const newCounterValue = 2025 - percentage * 25; // Réduit la valeur du compteur selon le pourcentage du scroll
            setCounterValue(newCounterValue);

            // Réduit le flou selon le pourcentage du scroll
            const newBlurValue = 20 - (percentage * 20) * 4; // Réduit le flou de 20 à 0
            setBlurValue(newBlurValue);

            // Met à jour les variables CSS pour le flou et le filtre
            document.documentElement.style.setProperty('--blur-value', `${newBlurValue}px`);
            document.documentElement.style.setProperty('--grayscale-value', `${percentage * 100}%`);
            
            // Met à jour les variables CSS pour les valeurs avant et après le compteur
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
                        {Math.floor(counterValue) - 1} {/* Valeur avant le compteur */}
                    </span>
                    <h2 ref={counterRef} className="counter">
                        {Math.floor(counterValue)} {/* Affiche la valeur du compteur */}
                    </h2>
                    <span className="h2-after">
                        {Math.floor(counterValue) + 1} {/* Valeur après le compteur */}
                    </span>
                </div>
                <img
                    src="/img/family.png"
                    alt="Photo de famille classique en portrait."
                    style={{ filter: `grayscale(${filterValue * 100}%)` }}
                />
            </div>
            <div style={{ height: "200vh" }}></div> {/* Allonge la page pour le scroll sticky */}
        </>
    );
};
