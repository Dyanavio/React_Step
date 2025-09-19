import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './ui/Layout';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import { useState } from 'react';
import AppContext from '../features/context/AppContext';

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  
  return <AppContext.Provider value={{count, setCount, user, setUser}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="privacy" element={<Privacy/>}/>
          <Route path="about" element={<About/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>
}

export default App;
