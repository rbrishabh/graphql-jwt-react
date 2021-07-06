import React from 'react';
import Navbar from './Navbar';
import './style.css'


const Layout: React.FC = ({ children }) => {
    return (
        <div className="layout">
            <div className="navlayout">
                <Navbar />
            </div>
            <div className="bodylayout">
                {children}
            </div>
        </div>)
}
export default Layout;