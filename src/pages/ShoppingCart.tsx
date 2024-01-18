import { getDocs, updateDoc, deleteDoc, collection, doc, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
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
    const [user] = useAuthState(auth);
    const shopcartsRef = collection(db, "shoppingcart");
    const [shoppingCart, setshoppingCart] = useState<ShoppingCarts[] | null>(null);
    const getShopCarts = async () => {
        const data = await getDocs(shopcartsRef);
        setshoppingCart(
            data.docs.map((doc) => ({...doc.data()})) as ShoppingCarts[]
        );
    }
    const deleteShoppingCart = async (name:string) => {
        const prdToDeleteQuery = query(shopcartsRef, 
            where("name", "==", name),
            where("userId", "==", user?.uid)
        );
        const productData = await getDocs(prdToDeleteQuery);
        const prdId = productData.docs[0].id;
        const prdToDelete = doc(db, "shoppingcart", prdId);
        await deleteDoc(prdToDelete)
            .then((response) => {
                getShopCarts();
                //changeMessage("Shopping Cart Item Deleted Successfully");
            })
            .catch((error) => {
                //changeMessage(error.message);
            })
    }
    
    const updateShoppingCart = async (product:ShoppingCarts, requiredQuantity:number) => {
        const prdToUpdateQuery = query(shopcartsRef, 
            where("name", "==", product.name),
            where("userId", "==", user?.uid)
        );
        const productData = await getDocs(prdToUpdateQuery);
        const prdId = productData.docs[0].id;
        const prdToUpdate = doc(db, "shoppingcart", prdId);
        await updateDoc(prdToUpdate, {
            requiredQuantity: requiredQuantity,
            quantity: product.quantity - requiredQuantity
        })
            .then((response) => {
                getShopCarts();
                //changeMessage("Shopping Cart Item Updated Successfully");
            })
            .catch((error) => {
                //changeMessage(error);
            })
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
                                    no={index} key={index}
                                    deleteclick={ deleteShoppingCart }
                                    updateclick={ updateShoppingCart }/>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}