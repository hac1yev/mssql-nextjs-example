'use client';

import PaymentComponent from '../../components/Payment/PaymentComponent';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { convertToSubcurrency } from '../../lib/convertToSubcurrency';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
    const amount = 49.99;

    return (
        <div className='d-flex align-items-center justify-content-center my-3 py-0 bg-blue'>
            <Elements 
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubcurrency(amount),
                    currency: 'usd'
                }}
            >
                <PaymentComponent amount={amount} />
            </Elements>
        </div>
    );
};

export default PaymentPage;