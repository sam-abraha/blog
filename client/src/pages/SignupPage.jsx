export default function SignupPage() {
    return (
        <form className="block mt-24 max-w-md mx-auto text-center ">
        <h1 className="text-center text-lime-600 font-bold text-4xl mb-4">Sign up</h1>
        <input 
        type="name"
        placeholder="Name"
        className="block w-full p-4 border rounded-lg" />
        <input 
        type="email" 
        placeholder="Email" 
        className="block w-full p-4 border rounded-lg"/>
        <input 
        type="password" 
        placeholder="Password" 
        className="block w-full p-4 border rounded-lg "/>
        <button className="block w-full p-4 border rounded-lg text-white bg-lime-600 hover:bg-lime-700 mt-4">
            Sign up
        </button>
    </form>
    )
}