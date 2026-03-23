import Home from './Home'
import Register from './Register'
import Login from './Login'
import Test from './Test'
import TestCard from './TestCard'
import {Routes, Route, Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
function App() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            const savedToken = localStorage.getItem('token');

            if(savedToken) {
                try {
                    const response = await fetch('http://localhost:5003/verify', {
                        method: 'GET',
                        headers: {
                            'Authorization': savedToken
                        }}
                    )
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData.user);
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error verifying token:", error);
                }
            }
        };
        checkUser();

    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        // We will add "localStorage.removeItem" here later for JWT!
    };

    const handleLogin = async (email, password) => {
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
        <div className="min-h-screen bg-slate-50">
            {/* NAVIGATION BAR */}
            <div className="bg-white border-b border-slate-200 p-4 mb-8">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-slate-900">Fox Blog 🦊</Link>
                    <div className="space-x-4">
                        {/* CONDITIONAL LINKS */}
                        {user ? (
                            <>
                                <span className="text-slate-900 font-medium">Hi, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/testcard" className="text-slate-600 hover:text-blue-600">testcard</Link>
                                <Link to="/register" className="text-slate-600 hover:text-blue-600">Register</Link>
                                <Link to="/login" className="text-slate-600 hover:text-blue-600">Login</Link>
                                <Link to="/test" className="text-slate-600 hover:text-blue-600">Test</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <Routes>
                <Route path="/testcard" element={<TestCard />} />
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Home user={user} />} />
                <Route path="/register" element={<Register handleLogin={handleLogin}/>} />
                <Route path="/login" element={<Login setUser={setUser} handleLogin={handleLogin}/>} />

            </Routes>
        </div>
    )
}

export default App;
