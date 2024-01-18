import { useEffect, useState } from "react";
import { addDoc, getDocs, collection } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ProductList } from "./ProductList";
export interface ProductItems {
    name: string;
    description: string;
    quantity: number;
    price: number;
    photo: string;
    userId: string;
    idx: number;
}
export interface ShoppingCarts {
    name: string;
    description: string;
    quantity: number;
    price: number;
    photo: string;
    userId: string;
    idx: number;
    requiredQuantity: number;
}
export const Products = () => {
    const [user] = useAuthState(auth);
    const [productsList, setProductsList] = useState<ProductItems[] | null>(null);
    const [message, setMessage] = useState("");
    const [searchkeyword, setsearchkeyword] = useState("");
    const [requiredQuantity, setrequiredQuantity] = useState(0);
    const [searchResult, setsearchResult] = useState<ProductItems[] | null>(null);
    const [shoppingCart, setshoppingCart] = useState<ShoppingCarts[] | null>(null);
    const productsRef = collection(db, "products");
    const shopcartsRef = collection(db, "shoppingcart");
    const getProducts = async () => {
        const data = await getDocs(productsRef);
        setProductsList(
            data.docs.map((doc,idx) => ({...doc.data(), idx: idx})) as ProductItems[]
        );
    }
    const doSearch = () => {
        if (searchkeyword === "") {
            setsearchResult([]);
        } else {
            let expression = new RegExp('^' + searchkeyword, 'i')
            let results = productsList?.filter((product) => {
                return expression.test(product.name)
            })
            if (results != null) setsearchResult(results);
        }
    }
    const addToCart = async (product: ProductItems, requiredQuantity:number) => {
        await addDoc(shopcartsRef, {
            ...product,
            requiredQuantity: requiredQuantity,
            userId: user?.uid,
          })
          .then(() => {
                getShopCarts();
                setMessage("Product added to the shopping cart successfully");
          }).catch((error:any) => {
                setMessage(error);
          })
    }
    const getShopCarts = async () => {
        const data = await getDocs(shopcartsRef);
        setshoppingCart(
            data.docs.map((doc) => ({...doc.data()})) as ShoppingCarts[]
        );
    }
    useEffect(() => {
        getProducts();
        getShopCarts();
    }, []);
    return (
        <div className="container">
        {
            (message) &&
            <div className="alert alert-info">
                { message }
            </div>
        }
        <div className="row" style={ {paddingBottom: "15px", paddingTop:"20px"} }>
            <div className="col-10">
                <input type="text" className="form-control"
                    onChange={(event) => {
                        setsearchkeyword(event.target.value);
                        doSearch(); 
                    } }/>
                <div className="searchResults">
                    <table className="table table-bordered">
                        <tbody>
                {
                    searchResult?.map((product, index) => {
                        return (
                            <ProductList product={product} 
                                no={index} key={index}
                                click={ addToCart }/>
                        )
                    })
                }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-1">
                <Link to="/shoppingcart">
                    <button type="button" className="btn btn-primary position-relative">
                        &nbsp;&nbsp;&nbsp;Cart&nbsp;&nbsp;&nbsp;
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        { shoppingCart?.length }
                        </span>
                    </button>
                </Link>
            </div>
        </div>
        <div className="row">
        {
            productsList?.map((product,index) => {
                return (
                    <div key={index} className="col-md-4" style={{ paddingBottom:"20px", paddingTop:"20px" }}>
                        <div className="card">
                            <img src={ product.photo } className="card-img-top" 
                                alt={ product.name }/>
                            <div className="card-body">
                                <h4 className="card-title">{ product.name }</h4>
                                <p className="card-text">{ product.description }</p>
                                <h6 className="card-text">
                                    Quantity: { product.quantity }</h6>
                                <h6 className="card-text">
                                    Price: { product.price }</h6>
                                <input type="text" name="requiredQuantity" 
                                size={3} maxLength={3} onChange={(event) => {
                                    setrequiredQuantity(parseInt(event.target.value));
                                }}/>&nbsp;
                                <button className="btn btn-primary" 
                                onClick={() => addToCart(product, 
                                requiredQuantity) }>Add to Cart</button>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        </div>
        </div>
    )
}