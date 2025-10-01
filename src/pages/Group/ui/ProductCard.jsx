import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";

export default function ProductCard({product})
{
    const {token, setSelectedItem, cart, request, updateCart} = useContext(AppContext);
    const navigate = useNavigate();
    const isInCart = cart.cartItems.some(ci => ci.productId == product.id);
    const addToCartClick = e =>
    {
        e.preventDefault();
        console.log(product.id);
        setSelectedItem(product);

        const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('item-added-toast'));
        const modal = new bootstrap.Modal("#auth-error-modal");
        if(token == null)
        {
            modal.show();
        }
        else
        {
            request("/api/cart/" + product.id, {
                method: 'POST'
                }).then(() => {
                    toast.show();
                    updateCart();
                })
                .catch(_ => {});
        }
    };
    const goToCartClick  = e =>
    {
        e.preventDefault();
        toast.hide();
        navigate("/cart");
    };

    return <div className="col">
                <div className="card h-100">
                    <Link to={"/product/" + (product.slug || product.id)} className="nav-link h-100">
                        <img src={product.imageUrl} className="card-img-top" alt={product.name}/>
                        <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                        </div>
                            <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                            <span>£ {product.price.toFixed(2)}</span>
                            <div data-in-cart={isInCart ? "1" : "0"}>
                                <button onClick={goToCartClick} className="in-cart btn btn-success" ><i className="bi bi-cart-check"></i></button>
                                <button onClick={addToCartClick} data-product-id={product.id} className="not-in-cart btn btn-outline-success"><i className="bi bi-cart"></i></button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>;
}