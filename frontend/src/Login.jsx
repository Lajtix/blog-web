import {useState} from 'react';
import {useNavigate} from "react-router-dom";


export default function Login({ setUser, handleLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-xs mx-auto bg-stone-50 flex flex-col justify-center items-center">
                <input type='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} className="border-slate-200 focus:border-blue-400  border-2 rounded-lg p-2 mb-6 mt-6 w-3xs outline-none transition-all"/>
                <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} className="border-slate-200 focus:border-blue-400  border-2 rounded-lg p-2 mb-6 w-3xs outline-none transition-all"/>
                <button onClick={() => handleLogin(email, password)} className="bg-blue-500 text-white rounded-lg p-2 w-3xs mb-6 hover:bg-blue-600 font-bold transition-all">Login</button>
            </div>
        </div>
    )
};