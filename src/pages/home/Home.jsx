import { useState } from "react";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import Calc from "../../widgets/calc/Calc";


export default function Home()
{
    const {user} = useContext(AppContext);
    const {count, setCount} = useContext(AppContext);
    // hook
    //const [count, setCount] = useState(0); // Create a new 'cell' in state and let the setter be setCount
    const onCountClickPositive = () => {
        setCount(count + 1); // Reload Home function. Within a single run of a function count is a constant
        // onClick triggers setState (here: setCount). setState restarts the function
    };
    const onCountClickNegative = () =>
    {
        setCount(count - 1);
    };

    return <div className="text-center">
        <h1 className="display-4">Store</h1>
        <div className="row">
            <div className="col">
                <button className="btn btn-dark" onClick={onCountClickPositive}>+1</button>
                <button className="btn btn-outline-dark mx-2" onClick={onCountClickNegative}>-1</button>
                <h3>Count: {count}</h3>
                {!!user && <p>Greetings, {user.name}</p>}
                <hr/>
                <CountWidget count={count} setCount={setCount}/> {/* Prop Drilling (passiong by reference) */}
            </div>
            <div className="col">
                <Calc/>
            </div>
        </div>
        
    </div>;
}

function CountWidget(props)
{
    // Prop Drilling
    return <div className="border p-2 m-3 border-2 rounded-2">
        Total: {props.count}<br/>
        <button className="btn btn-outline-danger" onClick={() => props.setCount(0)}>Reset</button>
    </div>
}