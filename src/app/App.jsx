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
import Group from '../pages/Group/Group';

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);

  useEffect(() => {
    request("/api/product-group").then(homePageData => setProductGroups(homePageData.productGroups));
  }, []);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    //console.log(u);
    setUser(u);
  }, [token]);

  const request = (url, config) => new Promise((resolve, reject) => {
    if(url.startsWith('/'))
    {
      url = "https://localhost:7195" + url;
    }
    fetch(url, config)
      .then(r => r.json())
      .then(j => {
        if(j.status.isOk)
        {
          resolve(j.data);
        }
        else
        {
          console.error(j);
          reject(j);
        }
       });
  });
  
  return <AppContext.Provider value={{request, count, setCount, user, token, setToken, productGroups}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="group/:slug" element={<Group />}/>
          <Route path="intro" element={<Intro/>}/>
          <Route path="privacy" element={<Privacy/>}/>
          <Route path="about" element={<About/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>
}

export default App;
