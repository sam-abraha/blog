export default function SigninPage() {
    return (
        <form className="block mt-24 max-w-md mx-auto text-center ">
            <h1 className="text-center text-lime-600 font-bold text-4xl mb-4">Sign in</h1>
            <input 
            type="email" 
            placeholder="Email" 
            className="block w-full p-4 border rounded-lg"/>
            <input 
            type="password" 
            placeholder="Password" 
            className="block w-full p-4 border rounded-lg"/>
            <button className="block w-full p-4 border rounded-lg text-white bg-lime-600 hover:bg-lime-700 mt-4">
                Sign in
            </button>
        </form>
    )
}