import { Link, useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import { useContext, useEffect, useState } from "react";
import "./ui/Group.css"
import ProductCard from "./ui/ProductCard";

export default function Group()
{
    const {slug} = useParams();
    const {request, productGroups} = useContext(AppContext);
    const [pageData, setPageData] = useState({products: []});

    //const toast = bootstrap.Toast.getOrCreateInstance((document.getElementById('item-added-toast')));
    //if(toast) toast.show();

    useEffect(() => {
        request("/api/product-group/" + slug).then(setPageData);
    }, [slug]); // If effect's body has a variable, it has to be added to the list of dependencies

    return <> 
        <h1>Category: {pageData.name}</h1>
        <h4>{pageData.description}</h4>
        <div className="w-100 d-flex justify-content-center">
            <div className="border border-2 rounded-2 m-3 p-2 d-flex w-75 h-auto">
                {productGroups.map(group => <div title={group.description} key={group.id}  className="col m-1">
                    <div className="col h-100">
                        <div className="card h-100">
                            <Link className="nav-link" to={"/group/" + group.slug}>
                                <img src={group.imageUrl} className="cart-img-top w-100 h-auto" alt={group.name}/>
                            </Link>
                            <div className="card-body">
                                <span className="card-text">{group.name}</span>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
        
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 mt-4">
            {pageData.products.map(product => <ProductCard key={product.id} product={product}/>)}
        </div>
    </>;
}
