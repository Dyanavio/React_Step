import { useContext } from "react";
import AppContext from "../../features/context/AppContext";

export default function Cart()
{
    const {cart} = useContext(AppContext);

    return <>
    {cart.cartItems.map(ci => <div key={ci.id}>
        {ci.product.name}
    </div>)}
    </>;
}