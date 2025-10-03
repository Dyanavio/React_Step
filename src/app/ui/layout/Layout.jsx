import { Link, Outlet } from "react-router-dom";
import './Layout.css';
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../features/context/AppContext";
import Base64 from "../../../shared/base64/Base64";
import AuthModal from "./AuthModal";

export default function Layout()
{
    const {selectedItem, cart, setToken, user} = useContext(AppContext);
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
                            {!!user && <>
                            <Link className="btn btn-dark mx-2 me-3" to="/cart">
                                <i className="bi bi-cart"></i>
                                <span>{cart.cartItems.length}</span>
                            </Link>
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

        <div className="position-absolute toast align-items-center text-bg-dark border-0 end-0 bottom-0 my-3" id="item-added-toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex w-100 justify-content-center">
                <div className="toast-body">
                    <span>{selectedItem.name} added to your cart</span>
                    <div className="mt-2 pt-2 border-top">
                        <Link to="/cart" data-bs-hide="toast" type="button" className="btn btn-success btn-sm mx-2">To Cart</Link>
                        <button type="button" className="btn btn-light btn-sm mx-2" data-bs-dismiss="toast">Dismiss</button>
                    </div>
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>    

        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2025 - React - <Link to="privacy">Privacy</Link>
            </div>
        </footer>

        <AuthModal/>

        <div className="modal" id="auth-error-modal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="d-flex align-items-start error-modal-header modal-header justify-content-center">
                        <div className="error-modal-icon">
                            <div className="icon-box">
                                <i className="bi bi-database-lock"></i>
                            </div>
                        </div>
                        <div className="error-modal-close">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div className="modal-body text-center">
                        <h4>Unauthorized</h4>
                        <p>You cannot use your cart unauthorized</p>
                        <button className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>      
    </>
}


