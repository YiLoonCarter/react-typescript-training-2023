import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
export interface Products {
    name: string;
    description: string;
    quantity: number;
    price: number;
    photo: string;
    userId: string;
    idx: number;
}
export const Products = () => {
    const [productsList, setProductsList] = useState<Products[] | null>(null);
    const productsRef = collection(db, "products");
    const getProducts = async () => {
        const data = await getDocs(productsRef);
        setProductsList(
            data.docs.map((doc,idx) => ({...doc.data(), idx: idx})) as Products[]
        );
    }
    useEffect(() => {
        getProducts();
    }, []);
    return (
        <div className="container">
        <div className="row">
        {
            productsList?.map((product) => {
                return (
                    <div className="col-md-4" style={{ paddingBottom:"20px", paddingTop:"20px" }}>
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
                                <button className="btn btn-primary">Add to Cart</button>
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