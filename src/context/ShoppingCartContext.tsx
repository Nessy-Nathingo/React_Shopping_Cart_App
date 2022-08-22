import { createContext, useContext, ReactNode, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import {useLocalStorage} from "../hooks/useLocalStorage";


type ShoppingCartProviderProps = {
    children: ReactNode;
}
type ShoppingCartContext = {
    openCart(): void,
    closeCart(): void,
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    cartQuantity: number
    cartItems: CartItem[];
}

type CartItem = {
    id: number;
    quantity: number;
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
    const cartQuantity = cartItems.reduce((quantity: any, item: { quantity: any; }) => quantity + item.quantity, 0);

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)


    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0;
    }


    function increaseCartQuantity(id: number) {
        setCartItems(currtItems => {
            if (currtItems.find(item => item.id === id) == null) {
                return [...currtItems, { id, quantity: 1 }];
            } else {
                return currtItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            }
        })
    }
    function decreaseCartQuantity(id: number) {
        setCartItems(currtItems => {
            if (currtItems.find(item => item.id === id)?.quantity === 1) {
                return currtItems.filter(item => item.id !== id);
            } else {
                return currtItems.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currtItems => currtItems.filter(item => item.id !== id));
    }


    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                openCart,
                closeCart, 
                cartItems,
                cartQuantity
            }}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
};