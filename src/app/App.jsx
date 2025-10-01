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
import Cart from '../pages/cart/Cart';

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState({cartItems: []});
  const [selectedItem, setSelectedItem] = useState({name: null});

  useEffect(() => {
    request("/api/product-group").then(homePageData => setProductGroups(homePageData.productGroups));
  }, []);

  const updateCart = () => {
    if(token != null)
    {
      request("/api/cart").then(data => {
          if(data != null) 
          { 
            setCart(data); 
          }
      });
    }
    else
    {
      setCart({cartItems: []}); 
    }
  };

  const request = (url, config) => new Promise((resolve, reject) => {
    if(url.startsWith('/'))
    {
      url = "https://localhost:7195" + url;
      // automatically passing token to all queries
      // if it is present and the query has no header
      if(token)
      {
        if(typeof config == 'undefined')
        {
          config = {};
        }
        if(typeof config.headers == 'undefined')
        {
          config.headers = {};
        }
        if(typeof config.headers['Authorization'] == 'undefined')
        {
          config.headers['Authorization'] = "Bearer " + token;
        }
      }
      
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
          reject(j);
        }
       });
  });



  

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    //console.log(u);
    setUser(u);
    updateCart();
  }, [token]);

  
  
  return <AppContext.Provider value={{cart, request, updateCart, selectedItem, setSelectedItem, count, setCount, user, token, setToken, productGroups}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="cart" element={<Cart />}/>
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
