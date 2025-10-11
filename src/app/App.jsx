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
  const [toastData, setToastData] = useState({});
  

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
  
  const toast = (data) =>
  {
    setToastData(data);
  }

  return <AppContext.Provider value={{alarm, cart, toast, request, updateCart, selectedItem, setSelectedItem, count, setCount, user, token, setToken, productGroups}}>
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
    <Toast toastData={toastData}/>
  </AppContext.Provider>
}

function Toast({toastData})
{
  const toastShowTime = 2500;   // ms -- total time on screen
  const fadeTime = 500;         // ms -- transition time (either fade in or fade out)
  const [isToastVisible, setToastVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [queue, setQueue] = useState([]);
  const [visibleData, setVisibleData] = useState({});
  const [timeout1, setTimeout1] = useState(null);
  const [timeout2, setTimeout2] = useState(null);
  let forceCancel = false;

  const executeTimeoutOpacity = () => setOpacity(0);
  const executeTimeoutQueueSlice = () =>
  {
    setToastVisible(false);
    setQueue(q => q.length == 0 ? q : q.slice(1));
    //forceCancel = false;
  }


  useEffect(() => {
    if(toastData.message)
    {
      let flag = false;
      const tempQueue = [...queue, toastData];
      if(tempQueue.length > 1)
      {
        if(tempQueue[0].message == toastData.message)
        {
          flag = true;
          console.log(flag);
          [tempQueue[1], tempQueue[tempQueue.length - 1]] = [tempQueue[tempQueue.length - 1], tempQueue[1]];

          if(timeout1 && timeout2)
          {
            setTimeout1(null);
            setTimeout2(null);
          }
        }
      }
      flag ? setTimeout(setQueue(tempQueue), fadeTime + 4000) : setQueue(tempQueue);
    }
  }, [toastData]);

  useEffect(() => {
    console.log(queue);
    if(!isToastVisible && queue.length > 0 /*&& !forceCancel*/)
    {
      setVisibleData(queue[0]);
      setToastVisible(true);
      let id1 = (setTimeout(executeTimeoutOpacity, toastShowTime - fadeTime));
      let id2 = (setTimeout(executeTimeoutQueueSlice, toastShowTime));
      setTimeout1(id1);
      setTimeout2(id2);
    }
  }, [queue]);

  useEffect(() => {
    if(timeout1 == null)
    {
      clearTimeout(timeout1);
      executeTimeoutOpacity();
    }
    if(timeout2 == null)
    {
      clearTimeout(timeout2);
      executeTimeoutQueueSlice();
    }

  }, [timeout1, timeout2]);


  //useEffect(() => {
  //  if(toastData.message)
  //  {
  //    setToastVisible(true);
  //    setTimeout(() => setOpacity(0), toastShowTime - fadeTime);
  //    setTimeout(() => {console.log(500); setToastVisible(false); }, toastShowTime + fadeTime);
  //  }
  //}, [toastData]);

  useEffect(() => {
    if(isToastVisible)
    {
      setOpacity(1);
    }
  }, [isToastVisible]);

  return <div style={{
      position: "absolute",
      bottom: "20px",
      left: "45vw",
      minWidth: '15vw',
      maxWidth: '25wv',
      padding: '5px 10px',
      borderRadius: "10px",
      width: "10vw",
      backgroundColor: "#888888",
      display: isToastVisible ? "block" : "none",
      opacity: opacity,
      transitionProperty: 'opacity',
      transitionDuration: `${fadeTime}ms`
    }}>{visibleData.message}</div>
}

export default App;


/*
Capture
Reason: function is created in the region that will be erased. For example:
let x = 20;
function f1(
  let x = 10;
  setTimeout(
    () => pring(x),  !! new function is declared that addresses the region
    1000             !! that is local for f1. In other words, the variable x is 
                     !! not accessible at the time of execution of print
                     !! !! // Output: 10, even though there is x = 20;
    );
  )
  Solution: at the moment of contex ruin where the function is declared there is a copying (capture)
  of the region that is erased into scope (лексикографическое окружение) of the new function

  let x = 20;
  function f1(
  let x = 10;
  setTimeout(
    function() { pring(x) },  !! function syntax does not launch capture
    1000              
                              !! // Output: 20;
    );
  )
*/