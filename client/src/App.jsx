
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SigninPage from './pages/SigninPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Layout from './components/Layout.jsx'
import IndexPage from './pages/IndexPage.jsx'

function App() {

  return (
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Route>
    </Routes>
  )
}

export default App
