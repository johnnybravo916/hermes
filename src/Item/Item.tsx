import Button from "@material-ui/core/Button";

//exported in app so it can be reduced in other components
//Types
import { CartItemType } from "../App";
//Styles
import { Wrapper } from "./Item.styles";

// since it's typscript you need to type in props
type Props = {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
    //void since it will return nothing
};

//you can also use FC
const Item: React.FunctionComponent<Props> = ({
    //destructure Props
    item,
    handleAddToCart,
}) => {
    return (
        <Wrapper>
            <img src={item.image} alt={item.title} />
            <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <h3>${item.price}</h3>
            </div>
            {/* //pass item to handleAddtocart function */}
            <Button onClick={()=>{handleAddToCart(item)}}>Add to Cart</Button>
        </Wrapper>
    );
};

export default Item;
