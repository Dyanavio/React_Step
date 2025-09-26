import { useContext, useRef, useState, useEffect } from "react";
import Base64 from "../../../shared/base64/Base64";
import AppContext from "../../../features/context/AppContext";

export default function AuthModal()
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
                                        // THIS SOLUTION IS PROBLEMATIC
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