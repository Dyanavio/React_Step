import { Link, Outlet } from "react-router-dom";
import './Layout.css';
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../features/context/AppContext";
import Base64 from "../../../shared/base64/Base64";
import AuthModal from "./AuthModal";

export default function Layout()
{
    const {count, user, setToken} = useContext(AppContext);
    // Outlet is like RenderBody from ASP. It renders child route
    return <>
        <header>
            <nav name="top" className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <a className="navbar-brand" asp-area="" asp-controller="Home" asp-action="Index">ASP</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/">Home</Link>
                            </li>
                             <li className="nav-item">
                                <Link className="nav-link text-dark" to="/intro">Intro</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/privacy">Privacy</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/about">About</Link>
                            </li>
                        </ul>
                        <div>
                            <button className="btn btn-info disabled mx-2" ><i className="bi bi-cart"></i> {count}</button>
                        </div>
                        <div>
                            {!!user && <>
                                <button onClick={() => setToken(null)} type="button" className="btn btn-outline-danger"><i className="bi bi-box-arrow-in-left"></i></button>
                            </>}
                            {!user && <>
                                <a className="btn btn-outline-secondary" asp-controller="User" asp-action="SignUp"><i className="bi bi-person-circle "></i></a>
                                <button type="button" className="btn btn-outline-secondary mx-2" data-bs-toggle="modal" data-bs-target="#authModal"><i className="bi bi-box-arrow-in-right"></i></button>
                            </>}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        
        <main>
            <div className="container">                   
                <Outlet/>
            </div>
        </main>

        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2025 - React - <Link to="privacy">Privacy</Link>
            </div>
        </footer>

        <AuthModal/>

    </>
}

