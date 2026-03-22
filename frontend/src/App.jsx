import Home from './Home'
import Register from './Register'
import Login from './Login'
import {Routes, Route, Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
function App() {

    const [user, setUser] = useState(null);

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
                                <Link to="/register" className="text-slate-600 hover:text-blue-600">Register</Link>
                                <Link to="/login" className="text-slate-600 hover:text-blue-600">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUser={setUser}/>} />
            </Routes>
        </div>
    )
}

export default App;
