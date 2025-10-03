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

function App() 
{
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState({cartItems: []});
  const [selectedItem, setSelectedItem] = useState({name: null});
  const alarmRef = useRef();

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
    const u = token == null ? null : Base64.jwtDecodePayload(token);
    //console.log(u);
    setUser(u);
    updateCart();
  }, [token]);

  const alarm = () =>
  {
    alarmRef.current.click();
  }
  
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
        </Route>
      </Routes>
    </BrowserRouter>
    <i style={{display: 'block', width: 0, height: 0, position: 'absolute'}} ref={alarmRef} data-bs-toggle="modal" data-bs-target="#alarmModal"></i>
    <Alarm/>
  </AppContext.Provider>
}

function Alarm()
{
  return <div className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="alarmModalLabel">Modal title</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">...</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>;
}

export default App;
