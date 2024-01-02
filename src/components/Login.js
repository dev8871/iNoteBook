import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Login = (props) => {
    let navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:5000/api/auth/login";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({email:credential.email,password: credential.password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //saving the auth token and redirecting
            localStorage.setItem('token',json.authToken);
            navigate("/");
            props.showAlert("Logged in","success");
        }else{
            props.showAlert("Invalid Credentials","danger");
        }
    }
    const [credential, setcredential] = useState({
        email: "",
        password: ""
    })
    const onChange = (e) => {
        setcredential({ ...credential, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={credential.email} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={credential.password} />
                </div>
                <button type="submit" className="btn btn-primary"  >Submit</button>
            </form>
        </div>
    )
}

export default Login
