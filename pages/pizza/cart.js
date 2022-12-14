import Image from "next/image";
import Layouts from "../../Components/Layouts";
import { urlFor } from "../../lib/client";
import { useStore } from "../../Store/store";
import toast, {Toaster} from 'react-hot-toast'
import css from '../../styles/Cart.module.css'
import { useState } from "react";
import OrderModal from "../../Components/OrderModal";
import { useRouter } from "next/router";

export default function Cart() {
    const [paymentMethod , setPaymentMethod] = useState(null)
    const router = useRouter();
    const [order , setOrder] = useState(
        typeof window !== 'undefined' && localStorage.getItem('order')
    )
    const CartData = useStore(state => state.cart)
    const removePizza = useStore(state => state.removePizza)
    const handleRemoving = (i) => {
        removePizza(i)
        toast.error('Item Remove')
    }

    const total = () => CartData.pizzas.reduce((a, b) => a+b.quantity * b.price , 0);

    const handleOnDelivery = () => {
        setPaymentMethod(0);
        typeof window !== 'undefined' && localStorage.setItem('total' , total())
    }

    const handleCheckout = async () => {
        typeof window !== 'undefined' && localStorage.setItem('total' , total())
        setPaymentMethod(1);
        const response = await fetch('/api/stripe' , {
            method:'POST' ,
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(CartData.pizzas)
        });

        if(response.status === 500) return;
        const data = await response.json();
        toast.loading('Redirecting....');
        router.push(data.url)
    }

    return (
        <Layouts>
            {
                CartData.pizzas.length === 0 ? 
                <span className={css.pizzas}>Please Order a pizzas</span>
                :
                <div className={css.container}>
                {/* Details  */}
                <div className={css.details}>
                    <table className={css.table}>
                        <thead>
                            <th>Pizza</th>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </thead>
                        <tbody className={css.tbody}>
                            {
                                CartData.pizzas.length > 0 &&
                                CartData.pizzas.map((pizza, i) => {
                                    const src = urlFor(pizza.image).url()
                                    return (
                                        <tr key={i}>
                                            <td 
                                             className={css.imageTd}
                                            >
                                                <Image
                                                    loader={() => src}
                                                    src={src}
                                                    alt=''
                                                    objectFit="cover"
                                                    width={85}
                                                    height={85}
                                                />
                                            </td>
                                            <td>
                                                {pizza.name}
                                            </td>
                                            <td>
                                                {
                                                    pizza.size === 0 ?
                                                    "Small":
                                                    pizza.size === 1 ?
                                                    "Medium" :
                                                    "Large"
                                                }
                                            </td>
                                            <td>
                                                {pizza.price}
                                            </td>
                                            <td>
                                                {pizza.quantity}
                                            </td>
                                            <td>
                                                {pizza.price * pizza.quantity}
                                            </td>
                                            <td
                                            style={{
                                                color:'var(--themeRed)',
                                                cursor:'pointer'
                                            }}
                                            onClick={() => handleRemoving(i)}
                                            >x</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {/* Cart */}
                <div className={css.cart}>
                    <span>Cart</span>
                    <div className={css.CartDetails}>
                            <div>
                                <span>Items</span>
                                <span>{CartData.pizzas.length}</span>
                            </div>
                            <div>
                                <span>Total</span>
                                <span>${total()}</span>
                            </div>
                    </div>

                    {
                        !order && CartData.pizzas.length > 0 ? (
                            <div className={css.buttons}>
                            <button className="btn" onClick={handleOnDelivery}>Pay on Delivery</button>
                            <button className="btn" onClick={handleCheckout}>Pay Now</button>
                    </div>
                        ) :
                        <p className={css.cartBtn}>All ready order one item</p>
                    }
                    
                </div>
                <Toaster />
            </div>
            }
            {/* Modal */}
            <OrderModal 
            opened = {paymentMethod === 0}
            setOpened={setPaymentMethod}
            paymentMethod={paymentMethod}
            />
        </Layouts>
    )
};
