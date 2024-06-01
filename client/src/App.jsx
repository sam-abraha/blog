
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SigninPage from './pages/SigninPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Layout from './components/Layout.jsx'
import IndexPage from './pages/IndexPage.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import CreatePostPage from './pages/CreatePostPage.jsx'
import PostPage from './pages/PostPage.jsx'
import EditPostPage from './pages/EditPostPage.jsx'

function App() {

  return (
    <UserContextProvider>
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="/edit-post/:id" element={<EditPostPage />} />
    </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
