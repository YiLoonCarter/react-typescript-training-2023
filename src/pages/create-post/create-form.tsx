import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
interface CreateFormData {
    title: string;
    description: string;
}
export const CreateForm = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const schema = yup.object().shape({
        title: yup.string().required("You must add a title."),
        description: yup.string().required("You must add a description."),
    });
    const {register, handleSubmit, formState: {errors}} = useForm<CreateFormData>({
        resolver: yupResolver(schema),
    })

    const postsRef = collection(db, "posts");

    const onCreatePost = async (data: CreateFormData) => {
      //console.log(data);
      await addDoc(postsRef, {
        //title: data.title,
        //description: data.description,
        ...data,
        username: user?.displayName,
        userId: user?.uid,
      });
      navigate("/");
    }
    return (
      <div className='create-post'>
        <form onSubmit={handleSubmit(onCreatePost)}>
          <input width={"300px"} placeholder='Title...' {...register("title")}/>
          <p style={{color: "red"}}>{errors.title?.message}</p>
          <textarea rows={4} style={{width: "280px"}} placeholder='Description...' {...register("description")}/>
          <p style={{color: "red"}}>{errors.description?.message}</p>
          <input type='Submit' />
        </form>
      </div>
    )
}