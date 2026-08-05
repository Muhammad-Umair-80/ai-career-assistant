import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {useAuth} from '../auth.context.jsx'


const Register  = () => {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await handleRegister({ username, email, password });
          if (res && res.user) {
            // registration successful
            navigate('/');
          } else {
            // backend returned an error-like response
            alert(res?.message || 'Registration failed')
          }
        } catch (err) {
          console.error('Register error', err)
          alert(err?.response?.data?.message || err.message || 'Registration failed')
        }
    }

    if(loading) {
        return <p>Loading...</p>
    }
  return (
    
    <main className='form-container'>
        <div>
            <h1>Register</h1>


            <form action="" onSubmit={handleSubmit} className='form'>

                <div className='input-group'>
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e)=> {setUsername(e.target.value)}}
                    type="text" name="username" id="username" placeholder='enter username' />
                </div>
                <div className='input-group'>
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=> {setEmail(e.target.value)}}
                    type="email" name="email" id="email" placeholder='enter email' />

                </div>

                <div className='input-group'>
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e)=> {setPassword(e.target.value)}}
                    type="password" name="password" id="password" placeholder='enter password'   />
                </div>

                <button className='button primary-button' disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p> already have an account? <Link to="/login" className='link-button'>Login</Link></p>
        </div>
    </main>
  )
}

export default Register