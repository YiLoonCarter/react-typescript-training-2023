import { useState } from "react";
export const ProductList = (props:any) => {
    const [requiredQuantity, setRequiredQuantity] = useState(0);
    return (
        <tr>
            <td>{ props.no + 1 }</td>
            <td>
                <img src={ props.product.photo } className="img-thumbnail"
                    width="150" alt={ props.product.name }/>
            </td>
            <td>
                <h4 className="card-title">{ props.product.name }</h4>
                <p className="card-text">{ props.product.description }</p>
            </td>
            <td><h6>{ props.product.quantity }</h6></td>
            <td><h6>{ props.product.price }</h6></td>
            <td>
                <input type="text" name="requiredQuantity" 
                    size={3} maxLength={3} onChange={(event) => {
                        setRequiredQuantity(parseInt(event.target.value))
                    }}/>&nbsp;
                <button className="btn btn-primary"
                    onClick={ props.click.bind(null, props.product, 
                        requiredQuantity) }>Add to Cart</button>                
            </td>
        </tr>
    )
}