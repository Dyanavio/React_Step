import { useEffect, useState } from "react";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import "./ui/Home.css";
import { Link } from "react-router-dom";


export default function Home()
{
    const {user} = useContext(AppContext);
    const [pageData, setPageData] = useState({productGroups: []});
    const [topPurchases, setTopPurchases] = useState([]);

    useEffect(() => {
       fetch("https://localhost:7195/api/product-group").then(r => r.json()).then(j => {
        if(j.status.isOk)
        {
            setPageData(j.data);
        }
        else
        {
            console.error(j);
        }
       });
       fetch("https://localhost:7195/api/product-group/top").then(r => r.json()).then(j =>
       {
            setTopPurchases(j.data.products);
       });
    }, [])

    return <div>
        <div className="page-title">
            <h1 className="display-4">{pageData.pageTitle}</h1>
            <img src={pageData.pageTitleImage} alt="pageTitleImage"/>
        </div>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
            {pageData.productGroups.map(group => <div key={group.slug} className="col">
                <div className="col h-100">    
                    <div className="card h-100">
                        <Link to={"/" + group.slug} className="nav-link">
                            <img src={group.imageUrl} className="card-img-top" alt={group.name}/>
                        </Link>
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text">{group.description}</p>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
        <div>
            <div className="border border-1 rounded-2 mt-5 mb-3 p-3">
                <h3>Top Items</h3>
                {topPurchases.map(product => <div key={product.name} className="mt-1 pb-2">
                    <div className="row mt-2">
                        <div className="col col-lg-1 col-md-3 col-sm-12 d-flex flex-column justify-content-center">
                            <Link to={"/" + product.slug}>
                                <img className="w-100 h-auto" src={product.imageUrl} alt={product.slug} />
                            </Link>
                        </div>
                        <div className="col col-lg-4 col-md-4 col-sm-12 d-flex flex-column justify-content-center">{product.name}<br />{product.description}</div>
                        <div className="col col-lg-2 offset-lg-0 col-md-3 offset-md-7 col-sm-3 d-flex flex-column justify-content-center">£ {product.price}</div>
                        <div className="col col-lg-1 col-md-2 col-sm-3 d-flex flex-column justify-content-center">
                            <div className="w-50">
                                <button data-cart-product-to-delete-id="@cartItem.Product.Id" className="btn btn-outline-danger">X</button>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    </div>;
}
