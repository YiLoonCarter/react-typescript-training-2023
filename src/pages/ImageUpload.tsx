import { useEffect, useState } from "react"
import { storage } from "../config/firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
export const ImageUpload = () => {
    const [imageUpload, setImageUpload] = useState<File|null>(null);
    const [imageList, setImageList] = useState<string[]>([]);

    const imageListRef = ref(storage, "images/");
    const uploadImage = () => {
      if (imageUpload == null) return;
      const imageRef = ref(storage,`images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        //alert("image Uploaded");
        getDownloadURL(snapshot.ref).then((url) => {
          setImageList((prev) => [...prev,url]);
        })        
      })
    };

    useEffect(() => {
      listAll(imageListRef).then((response) => {
        //console.log(response);
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageList((prev) => [...prev,url] );
          });
        })
      })
    }, [])

    return (
        <>
        <div>
            <input 
              type="file"
              onChange={(event) => {
                if (!event.target.files) return;
                setImageUpload(event.target.files[0]);
            }} />
            <button onClick={uploadImage}>Upload Image</button>
        </div>
        <div>
            {imageList.map((url) => {
                return <img className="imgupload" src={url} />
            })}
        </div>
        </>
    )
}