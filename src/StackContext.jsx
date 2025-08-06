import React, { createContext, useState } from "react";

export const StackContext = createContext();

export const StackProvider = ({ children }) => {
    const [selectedStack, setSelectedStack] = useState([]);

    return (
        <StackContext.Provider value={{ selectedStack, setSelectedStack }}>
            {children}
        </StackContext.Provider>
    );
};
