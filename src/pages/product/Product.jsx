import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import ProductCard from "../Group/ui/ProductCard";

export default function Product()
{
    const {slug} = useParams();
    const {request} = useContext(AppContext);
    const [info, setInfo] = useState({
        slug: "",
        product: null,
        associations: []
    });

    useEffect(() => {
        request("/api/product/" + slug, {method: "GET"}).then(setInfo);
    }, []);
    useEffect(() => {
    }, [info.associations])

    console.log(info);

    return !info.product
    ? <>
        <i>Nope, nothing there</i>
    </>
    : <>
    <div className="container">
        <h1>Product's Page</h1>
        <div className="row">
            <div className="col col-3">
                <img className="w-100 h-auto" src={info.product.imageUrl} alt={info.product.name}/>
            </div>
            <div className="col col-6">
                <h2>{info.product.name}</h2>
                <p>{info.product.description}</p>
                <h3>£ {info.product.price.toFixed(2)}</h3>
                <button className="btn btn-success">Add to Cart</button>
            </div>
            <div className="col col-3">
                <img src="https://placehold.co/600x400?text=Your+Ad"/>
            </div>
        </div>

        <h3 className="mt-5">You might also like</h3>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
            {info.associations.map(product =>
                <ProductCard product={product} key={product.id} />
            ) }
        </div>
    </div>
        
    </>;
}