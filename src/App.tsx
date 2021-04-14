import { useState } from "react";
import { useQuery } from "react-query";

//Components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";

//Styles
import { Wrapper, StyledButton } from "./App.styles";
//Types
export type CartItemType = {
    id: number;
    category: string;
    description: string;
    image: string;
    price: number;
    title: string;
    amount: number;
};

///////NOTES it's outside the app because no need to recreate on each render
//we're using a promise because of async and await
const getProducts = async (): Promise<CartItemType[]> =>
    ///////NOTES await twice, (await) is for the api call and await is for when you convert it to json
    //same as
    // const response = await fetch(url)
    // const cart = await response.json()
    await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);
    const { data, isLoading, error } = useQuery<CartItemType[]>(
        "products",
        getProducts
    );
    console.log(data);

    const getTotalItems = (items: CartItemType[]) => {
        return items.reduce((acc: number, item) => {
            return acc + item.amount;
        }, 0);
    };

    const handleAddToCart = (clickedItem: CartItemType) => {
        //implicit return
        setCartItems((prev) => {
            //Is the item in the card?
            const isItemInCart = prev.find(
                (item) => item.id === clickedItem.id
            );
            if (isItemInCart) {
                return prev.map((item) =>
                    item.id === clickedItem.id
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }
            //first time it's added
            return [...prev, { ...clickedItem, amount: 1 }];
        });
    };

    const handleRemoveFromCart = (id: number) => {
        return setCartItems((prev) => {
            return prev.reduce((acc, item) => {
                if (item.id === id) {
                    //returns and deletes it
                    if (item.amount === 1) return acc;
                    //removes one from amount
                    return [...acc, { ...item, amount: item.amount - 1 }];
                } else {
                    //returns as it is
                    return [...acc, item]
                }
            }, [] as CartItemType[]);
        });
    };

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) return <div>Something went wrong</div>;

    return (
        <Wrapper>
            <Drawer
                anchor="right"
                open={cartOpen}
                onClose={() => setCartOpen(false)}
            >
                <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                />
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color="error">
                    <AddShoppingCartIcon />
                </Badge>
            </StyledButton>
            <Grid container spacing={3}>
                {/* //use questionmark so it will just return undefined if it can't find the data */}
                {data?.map((item) => {
                    return (
                        <Grid item key={item.id} xs={12} sm={4}>
                            <Item
                                item={item}
                                handleAddToCart={handleAddToCart}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Wrapper>
    );
};

export default App;
