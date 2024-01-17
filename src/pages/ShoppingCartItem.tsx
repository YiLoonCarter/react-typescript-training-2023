import { useState } from "react";
export const ShoppingCartItem = (props:any) => {
    
    const [requiredQuantity, setRequiredQuantity] = 
        useState(props.item.requiredQuantity)

    return (
        <tr>
            <td>{ props.no + 1 }</td>
            <td>
                <img src={ props.item.photo } className="img-thumbnail"
                    width="150" alt={ props.item.name }/>
            </td>
            <td>
                <h4 className="card-title">{ props.item.name }</h4>
                <p className="card-text">{ props.item.description }</p>
            </td>
            <td><h6>{ props.item.quantity }</h6></td>
            <td><h6>{ props.item.price }</h6></td>
            <td>
                <input type="text" name="requiredQuantity" 
                    size={3} maxLength={3} value={ requiredQuantity } 
                    onChange={(event) => {
                        setRequiredQuantity(parseInt(event.target.value))
                    }}/>&nbsp;
                <button className="btn btn-primary">Update</button>&nbsp;
                <button className="btn btn-danger">Delete</button>
            </td>
        </tr>
    )
}