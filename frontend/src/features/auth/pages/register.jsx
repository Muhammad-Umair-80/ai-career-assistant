import React from 'react'
import {useNavigate,Link} from 'react-router'



const Register  = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
        e.preventDefault();
    }
  return (
    
    <main className='form-container'>
        <div>
            <h1>Register</h1>


            <form action="" onSubmit={handleSubmit} className='form'>

                <div className='input-group'>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder='enter username' />
                </div>
                <div className='input-group'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='enter email' />

                </div>

                <div className='input-group'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='enter password'   />
                </div>

                <button className='button primary-button'>Register </button>
            </form>

            <p> already have an account? <Link to="/login" className='link-button'>Login</Link></p>
        </div>
    </main>
  )
}

export default Register