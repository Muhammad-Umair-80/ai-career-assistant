import React from 'react'
import '../auth.form.scss'
import {useNavigate,Link} from 'react-router'
const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
    }
  return (
    
    <main className='form-container'>
        <div>
            <h1>Login</h1>


            <form action="" onSubmit={handleSubmit} className='form'>

                <div className='input-group'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='enter email' />

                </div>

                <div className='input-group'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='enter password'   />
                </div>

                <button className='buton primary-button'>Login</button>
            </form>

            <p> Don't have an account? <Link to="/register" className='link-button'>Register</Link></p>
        </div>
    </main>
  )
}

export default Login