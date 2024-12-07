import { Route, Routes } from 'react-router-dom'
import FaceValidationForm from './components/validate/ValidateFace'
import RegisterForm from './components/form/RegisterFrom'
import DniValidationForm from './components/dniValidate/DniValidate'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterForm/>}/>
        <Route path="/validate-face" element={<FaceValidationForm/>}/>
        <Route path="/validate-dni" element={<DniValidationForm/>}/>
      </Routes>
    </>
  )
}

export default App
