import {useState} from 'react';
import {useNavigate} from "react-router-dom";

export default function Login({ setUser}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        const userData = {
            email: email,
            password: password,
        }
        try {
            const response = await fetch('http://localhost:5003/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            if(response.ok) {
                const data = await response.json();

                localStorage.setItem('token', data.token);
                setUser(data.user);
                console.log("Success:", data);
                navigate('/');
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-xs mx-auto bg-stone-50 flex flex-col justify-center items-center">
                <input type='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} className="border-slate-200 focus:border-amber-400  border-2 rounded-lg p-2 mb-6 mt-6 w-3xs outline-none transition-all"/>
                <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} className="border-slate-200 focus:border-amber-400  border-2 rounded-lg p-2 mb-6 w-3xs outline-none transition-all"/>
                <button onClick={handleLogin} className="bg-amber-400 text-white rounded-lg p-2 w-3xs mb-6 hover:bg-amber-500 font-bold transition-all">Login</button>
            </div>
        </div>
    )
};