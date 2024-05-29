import { useState } from "react"
import axios from "axios"

export default function SigninPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function signin(e) {
        e.preventDefault()
        const response = await fetch("http://localhost:3000/signin", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
          });
        if(response.ok) {
            alert("Registration successful")
        }else {
            alert("Registration failed")
        }
    }

    return (
        <form className="block mt-24 max-w-md mx-auto text-center" onSubmit={signin}>
            <h1 className="text-center text-lime-600 font-bold text-4xl mb-4">Sign in</h1>
            <input 
            type="name" 
            placeholder="Name" 
            className="block w-full p-4 border rounded-lg"
            value={username}
            onChange={e => setUsername(e.target.value)}/>
            <input 
            type="password" 
            placeholder="Password" 
            className="block w-full p-4 border rounded-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}/>
            <button className="block w-full p-4 border rounded-lg text-white bg-lime-600 hover:bg-lime-700 mt-4">
                Sign in
            </button>
        </form>
    )
}