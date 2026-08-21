import React, { useState } from 'react'
import  '../auth.form.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth.context.jsx'



const Login = () => {
    const navigate = useNavigate();
    const { loading,handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await handleLogin(email, password);
            navigate("/");
        } catch (err) {
            console.error('Login failed', err);
            setError(err?.message || 'Login failed. Please check your credentials.');
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }
  return (
    
    <main className='form-container'>
        <div>
            <h1>Login</h1>

            {error && <p className='error' style={{ color: 'var(--danger, #b00020)', marginTop: 8 }}>{error}</p>}


            <form action="" onSubmit={handleSubmit} className='form'>

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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p> Don't have an account? <Link to="/register" className='link-button'>Register</Link></p>
        </div>
    </main>
  )
}

export default Login