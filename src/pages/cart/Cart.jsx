import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import './ui/Cart.css'
import { Link, useNavigate } from "react-router-dom";

export default function Cart()
{
    const {cart, request, updateCart} = useContext(AppContext);
    const isEmpty = cart.cartItems.length == 0;
    const navigate = useNavigate();
    let cartInfo = `You are about to delete your cart and all items in it: ${cart.cartItems.reduce((acc, current) => acc + current.quantity, 0)} items for ${cart.price}. Do you want to proceed?`

    const deleteCart = () => 
    {
        request('/api/cart', {
            method: "DELETE"
        }).then(r => {
            alert("Cart deleted");
            updateCart();
            navigate("/");
        }).catch(console.error);
    }

    return <>
        <div className="container mb-3">
            <div className="row">
                <div className="col col-11 text-center"><span className="h2 display-2">Your Cart</span></div>
                {!isEmpty && 
                <div className="col col-1">
                    <button className="btn btn-light" onClick={() => { (new bootstrap.Modal('#delete-cart-modal')).show() }}><i className="bi bi-x-lg"></i></button>
                </div>}
            </div>
            {isEmpty && <div className="alert alert-dark" role="alert">
                Wow, such emptiness. Consider adding items to your cart.&nbsp;
                <Link to="/">Store</Link>
                </div>}
            {!isEmpty && <>
                <div className="row cart-table-header mb-2 text-body-secondary">
                    <div className="col col-lg-5 col-md-7 col-sm-12 text-center">Product</div>
                    <div className="col col-lg-2 col-md-2 col-sm-3">Price</div>
                    <div className="col col-lg-2 col-md-2 col-sm-3">Quantity</div>
                    <div className="col col-lg-2 offset-lg-0 col-md-3 offset-md-7 col-sm-3">Cost</div>
                    <div className="col col-lg-1 col-md-2 col-sm-3"></div>
                </div>
                {cart.cartItems.map(ci => <CartItem key={ci.id} cartItem={ci}/>)}
                <div className="py-3">
                    <div className="row py-2 border-0 rounded-1" style={{ backgroundColor: "slategray" }}>
                        <div className="col offset-5 col-2 d-flex flex-column justify-content-center fw-bold ps-2">
                            Total:
                        </div>
                        <div id="total-quantity" className="col col-2 d-flex flex-column justify-content-center fw-bold ps-2">
                            {cart.cartItems.reduce((acc, current) => acc + current.quantity, 0)}
                        </div>
                        <div id="total-price" className="col col-2 d-flex flex-column justify-content-center fw-bold">
                            £ {cart.price}
                        </div>
                    </div>
                </div>
            </>}
        </div>

        	

         <div className="modal" id="delete-cart-modal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="d-flex align-items-start delete-cart-modal-header modal-header justify-content-center">
                        <div style={{ width: "99%" }}>
                            <div className="icon-box">
                                <i className="bi bi-trash-fill"></i>
                            </div>
                        </div>
                        <div style={{ width: "1%" }}>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div className="modal-body text-center">
                        <h4>Cancelling purchase?</h4>
                        <p id="delete-cart-items-message">{cartInfo}</p>
                        <button onClick={deleteCart} id="discard-cart-button" className="btn btn-danger mx-2" data-bs-dismiss="modal">Delete</button>
                        <button className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

function CartItem({cartItem})
{
    const {alarm, request, updateCart} = useContext(AppContext);
    const changeQuantity = (count) =>
    {
        if(count + cartItem.quantity <= 0)
        {
            alarm();
        }
        else
        {
             request("/api/cart/" + cartItem.productId + "?increment=" + count, {
                method: "PATCH"
             }).then(updateCart).catch(alert)
        }
    }

    return <div className="item-cart-container mt-1 pt-2 ps-4 ">
        <div className="row mt-2">
            <div className="col col-lg-1 col-md-3 col-sm-12 d-flex flex-column justify-content-center border border-dark border-3 rounded">
                <a>
                    <img className="w-100 h-auto" src={cartItem.product.imageUrl} alt={cartItem.product.name} />
                </a>
            </div>
            <div className="col col-lg-4 col-md-4 col-sm-12 d-flex flex-column justify-content-center">{cartItem.product.name}<br /><span className="text-body-secondary">{cartItem.product.description}</span></div>
            <div className="col col-lg-2 col-md-2 col-sm-3 d-flex flex-column justify-content-center">£ {cartItem.product.price.toFixed(2)}</div>
            <div className="col col-lg-2 col-md-2 col-sm-3 d-flex flex-column justify-content-center">
                <div>
                    <button onClick={() => changeQuantity(-1)} className="btn btn-outline-secondary me-2">-</button>
                    {cartItem.quantity}
                    <button onClick={() => changeQuantity(+1)} className="btn btn-outline-secondary ms-2">+</button>
                </div>
            </div>
            <div className="col col-lg-2 offset-lg-0 col-md-3 offset-md-7 col-sm-3 d-flex flex-column justify-content-center">£ {cartItem.price.toFixed(2)}</div>
            <div className="col col-lg-1 col-md-2 col-sm-3 d-flex flex-column justify-content-center">
                <div className="w-50">
                    <button onClick={() => changeQuantity(-cartItem.quantity)} className="btn btn-outline-danger"><i className="bi bi-x-lg"></i></button>
                </div>
            </div>
        </div>
    </div>

    //return <div className="row border-bottom pb-2 mb-2">
    //            <div className="col col-2 v-center">
    //                <img src={cartItem.product.imageUrl} className="col col-2 col-lg-1 offset-lg-1 w-100" alt={cartItem.product.name} />
    //            </div>
    //            <div className="col col-4 v-center">
    //                    {cartItem.product.name}<br/>
    //                    {cartItem.product.description}
    //            </div>
    //            <div className="col col-1 v-center">£ {cartItem.product.price.toFixed(2)}</div>
    //            <div className="col col-3 col-lg-2  text-center v-center">
    //                <div>
    //                    <button className="btn btn-outline-warning me-2">-</button>
    //                    {cartItem.quantity}
    //                    <button className="btn btn-outline-success ms-2">+</button>
    //                </div>
    //            </div>
    //                <div className="col col-1 v-center">£ {cartItem.price.toFixed(2)}</div>
    //                <div className="col col-1 v-center">
    //                <div>
    //                    <button className="btn btn-outline-danger"><i className="bi bi-x-lg"></i></button>
    //                </div>                
    //            </div>
    //        </div>;
}