import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  const [credential, setcredential] = useState({
    email: "",
    name:"",
    password: "",
    cpassword:""
})
const onChange = (e) => {
    setcredential({ ...credential, [e.target.name]: e.target.value })
}
let navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:5000/api/auth/createuser";
        const {email,name,password,cpassword}=credential;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({email,name,password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //saving the auth token and redirecting
            localStorage.setItem('token',json.authToken);
            navigate("/");
            props.showAlert("Account created","success");
        }else{
          props.showAlert("Invalid details","danger");
        }
    }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" onChange={onChange} aria-describedby="emailHelp" name='email' />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" onChange={onChange} name='name' />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" onChange={onChange} name='password' />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" onChange={onChange} name='cpassword'/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
