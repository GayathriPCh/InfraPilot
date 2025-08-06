import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StackProvider } from './StackContext';    // <-- add this import!
import App from './App';
import StackSelect from './StackSelect';
import Canvas from './Canvas';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <StackProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/stack" element={<StackSelect />} />
                    <Route path="/canvas" element={<Canvas />} />
                </Routes>
            </StackProvider>
        </BrowserRouter>
    </React.StrictMode>
);
