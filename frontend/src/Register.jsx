
import {useState} from 'react';

export default function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleRegister = async () => {
        const userData = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        }
    try {
        const  response = await fetch('http://localhost:5003/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })

        if(response.ok) {
            const data = await response.json();
            console.log("Success:", data);
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
            <div className="max-w-xs mx-auto bg-stone-50 border-amber-500 border-0 rounded-xl flex flex-col justify-center items-center ">
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="username" className="border-slate-200 focus:border-amber-400  border-2 rounded-lg p-2 mb-6 mt-6 w-3xs outline-none transition-all"/>
                <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" className="border-slate-200 focus:border-amber-400  border-2 rounded-lg p-2 mb-6 w-3xs outline-none transition-all"/>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="border-slate-200 focus:border-amber-400  border-2 rounded-lg p-2 mb-6 w-3xs outline-none transition-all"/>
                <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="confirm password" className="border-slate-200 focus:border-amber-400 border-2 rounded-lg p-2 mb-6 w-3xs outline-none transition-all"/>
                <button onClick={() => handleRegister()} className="bg-amber-400 text-white rounded-lg p-2 w-3xs mb-6 hover:bg-amber-500 font-bold transition-all">Register</button>
            </div>
        </div>
    )
};

