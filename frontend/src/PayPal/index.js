// import { CLIENT_ID } from '../Config/Config'
import { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";  

// This values are the props in the UI
const amount = "20";
const currency = "USD";
const style = {"layout":"vertical",marginTop:'3px'};

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);


    return (<>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, currency, style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount,
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                }}
                onApprove={function (data, actions) {
                    return actions.order.capture().then(function () {
                        // Your code here after capture the order
                    });
                }}
            />
        </>
    );
}


export default function PayPal() {
    return (
       
        <div style={{ maxWidth: "750px", height: "130px" }}>
        <PayPalScriptProvider
            options={{
                "client-id": "AWq7QcUQz0CjnQHngb-HnkjP4-dTyFbq9EulfksGGO3G84NJbHxJMGbSUV4ZBKR44jyIeNVjJMSOwbHz",
                // components: "buttons",
                currency: "USD"
            }}
        >
            <ButtonWrapper
                currency={currency}
                showSpinner={false}
            />
        </PayPalScriptProvider>
    </div>
    );
}
