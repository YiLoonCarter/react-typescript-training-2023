import { useForm } from 'react-hook-form';
import { useState } from "react"
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth, storage } from '../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface CreateProductInvData {
    name: string;
    description: string;
    quantity: number;
    price: number;
}

export const ProductInventory = () => {
    const [user] = useAuthState(auth);
    const [photoUpload, setPhotoUpload] = useState<File|null>(null);
    const navigate = useNavigate();
    const schema = yup.object().shape({
        name: yup.string().required("You must add a product name."),
        description: yup.string().required("You must add a description."),
        quantity: yup.number().required("You must input number."),
        price: yup.number().required("You must input number."),
    });
    const {register, handleSubmit, formState: {errors}} = useForm<CreateProductInvData>({
        resolver: yupResolver(schema),
    })
    const productsRef = collection(db, "products");
    const onCreateProduct = async (data: CreateProductInvData) => {
        if (photoUpload == null) return;
        const imageRef = ref(storage,`products/${photoUpload.name + v4()}`);
        uploadBytes(imageRef, photoUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async (url) => {
                await addDoc(productsRef, {
                    ...data,
                    photo: url,
                    userId: user?.uid,
                  });
                  navigate("/prodlist");
            })        
          })
        
      }
    return (
        <div className='create-product'>
          <form onSubmit={handleSubmit(onCreateProduct)}>
            <input width={"300px"} placeholder='Product Name...' {...register("name")}/>
            <p style={{color: "red"}}>{errors.name?.message}</p>
            <textarea rows={4} style={{width: "280px"}} placeholder='Description...' {...register("description")}/>
            <p style={{color: "red"}}>{errors.description?.message}</p>
            <input width={"300px"} placeholder='Quantity...' {...register("quantity")}/>
            <p style={{color: "red"}}>{errors.quantity?.message}</p>
            <input width={"300px"} placeholder='Price...' {...register("price")}/>
            <p style={{color: "red"}}>{errors.price?.message}</p>
            <input 
              type="file"
              onChange={(event) => {
                if (!event.target.files) return;
                setPhotoUpload(event.target.files[0]);
              }} />
            <input type='Submit' />
          </form>
        </div>
      )
}