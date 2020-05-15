import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { Redirect } from "react-router-dom";

class Checkout extends Component {

    constructor(props) {
        super(props)

        this.state = {
            product: {
                name: 'The Band Ticket',
                price: 1000,
                prodDesc: 'The Official Ticket of The Band Night'
            },
            paySuccess: false,
            payFailure: false
        }
    }

    makePayment = token => {
        const product = this.state.product;
        const body = {
            token,
            product
        }
        axios.post('/payment', body)
            .then((response) => {
                this.setState({
                    paySuccess: true
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        if (this.state.paySuccess) {
            return <Redirect to='/success' />;
        }
        if (this.state.payFailure) {
            return <Redirect to='/failure' />;
        }
        return (
            <div className="container  text-center">
                <p><code className="text-dark">Test Payment Gateway: Card number: 4242 4242 4242 4242  CSV: 123</code></p>
                <StripeCheckout
                    stripeKey={process.env.REACT_APP_STRIPE_PS_KEY}
                    token={this.makePayment}
                    name={this.state.product.name}
                    currency="INR"
                    billingAddress={true}
                    amount={this.state.product.price * 100} >
                    <button className="btn-large pink">Buy ticket RS {this.state.product.price}</button>
                </StripeCheckout>
            </div>
        )
    }
}

export default Checkout
