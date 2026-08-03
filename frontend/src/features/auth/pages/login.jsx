import React from 'react'

const Login = () => {
  return (
    <main>
        <div>
            <h1>Login</h1>


            <form action="">

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
        </div>
    </main>
  )
}

export default Login