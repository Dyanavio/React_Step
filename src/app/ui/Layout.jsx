import { Link, Outlet } from "react-router-dom";
import './Layout.css';
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../features/context/AppContext";
import Base64 from "../../shared/base64/Base64";

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
        
        <main><Outlet/></main>

        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2025 - React - <Link to="privacy">Privacy</Link>
            </div>
        </footer>

        <AuthModal/>

    </>
}

function AuthModal()
{
    const [isLoading, setIsLoading] = useState(false);
    const {setToken} = useContext(AppContext);
    const closeModalRef = useRef();

    //const [login, setLogin] = useState("");
    //const [password, setPassword] = useState("");
    const [formState, setFormState] = useState({
        "login" : "",
        "password": ""
    });
    const [isFormValid, setFormValid] = useState(false);


    const credentials = Base64.encode(`${formState.login}:${formState.password}`);
    const authenticate = () => {
        console.log(formState.login, formState.password);
        setIsLoading(true);

        fetch("https://localhost:7195/user/login", {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        }).then(r => r.json()).then(j => {
            setIsLoading(false);
            if(j.status == 200)
            {
                const jwt = j.data;
                setToken(jwt);
                closeModalRef.current.click();
            }
            else
            {
                const alertDiv = document.getElementById('login-alert');
                if (!alertDiv) throw 'Element #login-alert was not found';
                alertDiv.innerText = j.data; 
                alertDiv.classList.remove('d-none');
            }
        });
        //setUser({
        //    name: "Dedede",
        //    email: "dedede@gmail.com"
        //});
        //closeModalRef.current.click();
    };


    useEffect(() => { 
        console.log("useEffect", formState.login, formState.password);
        setFormValid(formState.login.length > 2 && formState.password.length > 2);
    }, [formState]);

    return <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="authModalLabel">Log In</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="user-login-addon"><i className="bi bi-key"></i></span>
                                    <input onChange={e => {
                                        // THIS SOLUTION IS PROBLEMATICS
                                        //formState.login = e.target.value;
                                        //setFormState(formState); // !! This is reference and it does not change. The reference does not change and the state is not updated
                                        //console.log("event: ", formState.login);

                                        setFormState({...formState, login: e.target.value});
                                    }} value={formState.login} name="user-login" type="text" className="form-control" placeholder="Login" aria-label="Логін" aria-describedby="user-login-addon"/>
                                    <div className="invalid-feedback"></div>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="user-password-addon"><i className="bi bi-lock"></i></span>
                                <input onChange={e => {
                                        //formState.password = e.target.value;
                                        setFormState(state => {return {...state, password : e.target.value }; });
                                    }} value={formState.password} name="user-password" type="password" className="form-control" placeholder="Password" aria-label="Пароль" aria-describedby="user-password-addon"/>
                                <div className="invalid-feedback"></div>
                            </div>
                    </div>
                    <div className="modal-footer">
                        <div className="w-75 d-flex justify-content-start">
                            <div id="login-alert" className="alert alert-danger d-none" role="alert"></div>
                        </div>
                        <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button disabled={!isFormValid} type="button" className="btn btn-primary" id="sign-in-form-button" onClick={authenticate}>
                            {isLoading ? <span id="log-in-loader" className="spinner-border spinner-border-sm" aria-hidden="true" ></span> : ""}
                            <span>Log In</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>;
}