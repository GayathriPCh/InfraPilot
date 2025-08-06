import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { StackContext } from "./StackContext";

const options = [
    { id: "db", label: "Database (Postgres, MySQL...)" },
    { id: "api", label: "Backend/API (Node.js, Python...)" },
    { id: "ci", label: "CI/CD (GitHub Actions, Jenkins)" },
    { id: "frontend", label: "Frontend (React, Vue...)" },
    { id: "cache", label: "Cache (Redis...)" },
    { id: "other", label: "Other/Just Compose Docker" }
];

export default function StackSelect() {
    const { setSelectedStack } = useContext(StackContext);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();
    function toggle(id) {
        setSelected((curr) =>
            curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
        );
    }

    function handleNext() {
        // For now, just alert selections, later pass to state/store/canvas
        // alert(`Selected: ${selected.join(", ")}`);  // Remove alert when ready
        setSelectedStack(selected);
        navigate('/canvas');
    }

    return (
        <div style={{
            minHeight:"100vh",
            background:"#f9fafb",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            padding:"2rem"
        }}>
            <h2 style={{
                fontSize:"2rem",
                fontWeight:"bold",
                margin:"2rem 0"
            }}>
                Select What You Want in Your Project
            </h2>

            <div style={{
                display:"grid",
                gridTemplateColumns:"1fr 1fr",
                gap:"2rem",
                marginBottom:"2rem",
                maxWidth:"450px"
            }}>
                {options.map((opt) => (
                    <label key={opt.id} style={{
                        display:"flex",
                        alignItems:"center",
                        padding:"1rem",
                        background:"#fff",
                        borderRadius:"8px",
                        boxShadow:"0 1px 3px rgba(0,0,0,0.10)",
                        cursor:"pointer",
                        fontWeight: selected.includes(opt.id) ? "bold" : "normal"
                    }}>
                        <input
                            type="checkbox"
                            checked={selected.includes(opt.id)}
                            onChange={() => toggle(opt.id)}
                            style={{marginRight:"1rem"}}
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
            <button
                style={{
                    background:"#4f46e5",
                    color:"#fff",
                    padding:"0.75rem 2rem",
                    borderRadius:"0.375rem",
                    border:"none",
                    fontSize:"1rem",
                    fontWeight:"600",
                    cursor: selected.length === 0 ? "not-allowed" : "pointer",
                    opacity: selected.length === 0 ? 0.5 : 1,
                    transition: "background-color 0.3s ease"
                }}
                disabled={selected.length === 0}
                onClick={handleNext}
            >
                Create Architecture
            </button>
        </div>
    );
}
