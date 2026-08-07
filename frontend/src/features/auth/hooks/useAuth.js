import { useState } from "react";

import { AuthContext } from "../auth.context.jsx";
import {loginUser , registerUser, logoutUser, getMe} from "../auth.service.jsx";


export const useAuth = () => {

    const context = useState(AuthContext);
    const {user, setUser, loading, setLoading} = context[0];


    const handleLogin = async (email, password) => {

        setLoading(true);
        try {
            const data = await loginUser({email, password});
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await registerUser({username, email, password});
            setUser(data.user);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const handleGetMe = async () => {
        setLoading(true);
        try {
            const data = await getMe();
            setUser(data.user);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            throw error;
        }
    };

     useEffect(()=>{
            const fetchAndSetUser = async () => {
                try {
                    const data = await getMe();
                    // Support APIs that return { user } or the user object directly
                    const userData = data?.user ?? data;
                    setUser(userData ?? null);
                } catch (err) {
                    console.error('Failed to fetch current user', err);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchAndSetUser();
        }, [])  

        
    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    };
}
