import { useState } from 'react'
import './App.css'
import Preparation from './pages/preparation'
import Combat from './pages/combat'
import { Outlet, Routes, Route } from 'react-router-dom';
import Header from './components/header';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='preparation' element={<Preparation />} />
          <Route path='combat' element={<Combat />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
