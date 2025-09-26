import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './ui/layout/Layout';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import { useEffect, useState } from 'react';
import AppContext from '../features/context/AppContext';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/intro';

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    console.log(u);
    setUser(u);
  }, [token]);
  
  return <AppContext.Provider value={{count, setCount, user, token, setToken}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="intro" element={<Intro/>}/>
          <Route path="privacy" element={<Privacy/>}/>
          <Route path="about" element={<About/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>
}

export default App;
