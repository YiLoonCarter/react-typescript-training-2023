import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { ShoppingCartItem } from './ShoppingCartItem';
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
export const ShoppingCart = () => {
    const shopcartsRef = collection(db, "shoppingcart");
    const [shoppingCart, setshoppingCart] = useState<ShoppingCarts[] | null>(null);
    const getShopCarts = async () => {
        const data = await getDocs(shopcartsRef);
        setshoppingCart(
            data.docs.map((doc) => ({...doc.data()})) as ShoppingCarts[]
        );
    }
    useEffect(() => {
        getShopCarts();
    }, [])
    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th colSpan={2}>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        shoppingCart?.map((item, index) => {
                            return (
                                <ShoppingCartItem item={item} 
                                    no={index} key={index}/>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}