import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './ui/layout/Layout';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import { useEffect, useRef, useState } from 'react';
import AppContext from '../features/context/AppContext';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/intro';
import Group from '../pages/Group/Group';
import Cart from '../pages/cart/Cart';
import Product from '../pages/product/Product';
import Alarm from './ui/Alarm';

const tokenStorageKey = "react-token";

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState({cartItems: []});
  const [selectedItem, setSelectedItem] = useState({name: null});
  const alarmRef = useRef();
  const [alarmData, setAlarmData] = useState({buttons: []});

  useEffect(() => {
    const storedToken = localStorage.getItem(tokenStorageKey);
    if(storedToken)
    {
      const payload = Base64.jwtDecodePayload(storedToken);
      const exp = new Date(payload.Exp.toString().length == 13 ? Number(payload.Exp) : Number(payload.Exp) * 1000);
      const now = new Date();
      if(exp < now)
      {
        localStorage.removeItem(tokenStorageKey);
      }
      else
      {
        console.log("Token left:", (exp - now) / 1000);
        setToken(storedToken);
      }
    }
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
          else
          {
            setCart({cartItems: []});
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
    if(token == null)
    {
      setUser(null);
      localStorage.removeItem(tokenStorageKey);
    }
    else
    {
      localStorage.setItem(tokenStorageKey, token);
      setUser(Base64.jwtDecodePayload(token));
    }
    updateCart();
  }, [token]);

  const alarm = (data) => new Promise((resolve, reject) => 
  {
    data.resolve = resolve;
    data.reject = reject;
    setAlarmData(data);
    alarmRef.current.click();
  });
  
  return <AppContext.Provider value={{alarm, cart, request, updateCart, selectedItem, setSelectedItem, count, setCount, user, token, setToken, productGroups}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="cart" element={<Cart />}/>
          <Route path="group/:slug" element={<Group />}/>
          <Route path="intro" element={<Intro/>}/>
          <Route path="privacy" element={<Privacy/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="product/:slug" element={<Product/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    <i style={{display: 'block', width: 0, height: 0, position: 'absolute'}} ref={alarmRef} data-bs-toggle="modal" data-bs-target="#alarmModal"></i>
    <Alarm alarmData={alarmData}/>
  </AppContext.Provider>
}


export default App;
