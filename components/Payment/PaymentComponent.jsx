'use client';

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { convertToSubcurrency } from "../../lib/convertToSubcurrency";

const PaymentComponent = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage,setErrorMessage] = useState("");
    const [clientSecret,setClientSecret] = useState("");
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/payment", {
            method: 'POST',
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!stripe || !elements) return; 

        const { error: submitError } = await elements.submit();

        if(submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            }
        });
        
        if(error) {
            setErrorMessage(error.message)
            console.log(error);
            
        }else{

        }
        setLoading(false);
    };

    if(!stripe || !clientSecret || !elements) {
        return (
            <div className="flex align-items-center justify-content-center">
                <span>Loading...</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-50">
            {clientSecret && <PaymentElement options={{
                layout: {
                    type: "tabs",
                },
            }} />}
            {errorMessage && <div>{errorMessage}</div>}
            <button disabled={!stripe || loading} className="text-white w-100 bg-black border-0 outline-0 p-3 mt-2">
                {!loading ? `Pay ${amount}$` : "Processing..."}            
            </button>
        </form>
    );
};

export default PaymentComponent;