import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.5rem"
    },
    header: {
        width: "100%",
        maxWidth: "64rem",
        padding: "1.5rem 0",
        marginBottom: "2.5rem",
        borderBottom: "1px solid #d1d5db",
        textAlign: "center"
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "700",
        color: "#4f46e5"
    },
    subtitle: {
        marginTop: "0.5rem",
        color: "#6b7280"
    },
    main: {
        width: "100%",
        maxWidth: "64rem"
    },
    section: {
        marginBottom: "3rem"
    },
    sectionTitle: {
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1rem"
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem"
    },
    card: {
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.375rem",
        padding: "1rem",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease"
    },
    cardHover: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)"
    },
    cardTitle: {
        fontWeight: "600",
        marginBottom: "0.5rem"
    },
    cardDesc: {
        color: "#6b7280",
        fontSize: "0.875rem"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center"
    },
    button: {
        backgroundColor: "#4f46e5",
        color: "#fff",
        padding: "0.75rem 2rem",
        borderRadius: "0.375rem",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "600",
        transition: "background-color 0.3s ease"
    },
    buttonHover: {
        backgroundColor: "#4338ca"
    }
};

export default function App() {
    const [hoveredCard, setHoveredCard] = React.useState(null);
    const [hoveredButton, setHoveredButton] = React.useState(false);
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>InfraPilot</h1>
                <p style={styles.subtitle}>Design, visualize, and export infrastructure like a pro.</p>
            </header>

            <main style={styles.main}>
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Example Architectures</h2>
                    <div style={styles.cardGrid}>
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                style={hoveredCard === item ? {...styles.card, ...styles.cardHover} : styles.card}
                                onMouseEnter={() => setHoveredCard(item)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <h3 style={styles.cardTitle}>Example {item}</h3>
                                <p style={styles.cardDesc}>Brief description here...</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={styles.buttonContainer}>
                    <button
                        style={hoveredButton ? {...styles.button, ...styles.buttonHover} : styles.button}
                        onMouseEnter={() => setHoveredButton(true)}
                        onMouseLeave={() => setHoveredButton(false)}
                        onClick={() => navigate('/stack')}
                    >npm
                        Start Designing
                    </button>
                </div>
            </main>
        </div>
    );
}
