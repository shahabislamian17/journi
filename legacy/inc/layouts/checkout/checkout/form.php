    <div class="blocks" data-blocks="1">

        <div class="block" data-block="1" style="display: none">

            <div class="title">

                <h1 class="one">Checkout</h1>

            </div>

        </div>

        <div class="block" data-block="2">

            <form class="form">

                <div class="fields">

                    <div class="fieldset">

                        <div class="blocks" data-blocks="2">

                            <div class="block" data-block="2A">

                                <div class="blocks" data-blocks="3">

                                    <div class="block" data-block="2AA">

                                        <div class="title">

                                            <h2 class="two">Account</h2>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="block" data-block="2B">

                                <div class="blocks" data-blocks="4">

                                    <div class="block" data-block="2BA" data-inputs="2">

                                        <div class="input">

                                            <label>First Name</label>

                                            <input type="text" name="first-name">

                                        </div>

                                        <div class="input">

                                            <label>Surname</label>

                                            <input type="text" name="surname">

                                        </div>

                                    </div>

                                    <div class="block" data-block="2BB" data-inputs="1">

                                        <div class="input">

                                            <label>Email Address</label>

                                            <input type="text" name="email-address" autocapitalize="none">

                                        </div>

                                    </div>

                                    <div class="block" data-block="2BC" data-inputs="1">

                                        <div class="input">

                                            <label>Phone Number</label>

                                            <input type="text" name="phone-number">

                                        </div>

                                    </div>

                                    <div class="block" data-block="2BD" data-inputs="1">

                                        <div class="blocks" data-blocks="5">

                                            <div class="block" data-block="2BDA">

                                                <div class="input">

                                                    <label>Password</label>

                                                    <input type="password" name="password">

                                                </div>

                                            </div>

                                            <div class="block" data-block="2BDB">

                                                <div class="toggle">

                                                    <div class="icons">

                                                        <div class="icon" data-icon="1">

                                                            <i class="icons8 icons8-eye"></i>

                                                        </div>

                                                        <div class="icon" data-icon="2">

                                                            <i class="icons8 icons8-eye-2"></i>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="fieldset">

                        <div class="blocks" data-blocks="6">

                            <div class="block" data-block="2A">

                                <div class="blocks" data-blocks="7">

                                    <div class="block" data-block="2AA">

                                        <div class="title">

                                            <h2 class="two">Payment</h2>

                                        </div>

                                    </div>

                                    <div class="block" data-block="2AB">

                                        <div class="logo">

                                            <div class="image">

                                                <a href="https://www.stripe.com" target="_blank">

                                                    <img src="<?=BASE_URL?>/assets/images/global/partners/stripe-1.png" width="100%">

                                                </a>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="block" data-block="2B">

                                <div class="blocks" data-blocks="8">

                                    <div class="block" data-block="2BA" data-inputs="1">

                                        <div class="input">

                                            <div class="stripe"></div>

                                            <script>
                                                document.addEventListener( 'DOMContentLoaded', () => {
                                                    const place = document.querySelector( '[data-button="1A"] a.action' );
                                                    let stripe = null;
                                                    let elements = null;
                                                    let paymentEl = null;
                                                    if ( place ) {
                                                        place.addEventListener( 'click', async ( e ) => {
                                                            e.preventDefault();
                                                            if ( ! stripe || ! elements || ! paymentEl ) {
                                                                alert( 'Payment not ready. Please wait a moment and try again.' );
                                                                return;
                                                            }
                                                            const r = await elements.submit();
                                                            if ( r && r.error ) {
                                                                alert( r.error.message );
                                                                return;
                                                            }
                                                            const res = await fetch( '<?=BASE_URL?>/inc/classes/stripe/setup.php', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Accept': 'application/json',
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify( {
                                                                    mode: 'create_payment_intent'
                                                                } )
                                                            } );
                                                            if ( ! res.ok ) {
                                                                alert( 'Setup error. Please try again.' );
                                                                return;
                                                            }
                                                            let payload = null;
                                                            try {
                                                                payload = await res.json();
                                                            } catch ( e2 ) {
                                                                alert( 'Invalid setup response.' );
                                                                return;
                                                            }
                                                            const clientSecret = payload && payload.clientSecret ? payload.clientSecret : null;
                                                            const paymentIntentId = payload && payload.paymentIntentId ? payload.paymentIntentId : null;
                                                            const customerId = payload && payload.customerId ? payload.customerId : null;
                                                            if ( paymentIntentId ) {
                                                                sessionStorage.setItem( 'stripe_payment_intent_id', paymentIntentId );
                                                            }
                                                            if ( customerId ) {
                                                                sessionStorage.setItem( 'stripe_customer_id', customerId );
                                                            }
                                                            if ( ! clientSecret ) {
                                                                alert( 'Missing client secret.' );
                                                                return;
                                                            }
                                                            const { error } = await stripe.confirmPayment( {
                                                                elements: elements,
                                                                clientSecret: clientSecret,
                                                                confirmParams: {
                                                                    return_url: '<?=BASE_URL?>/checkout/confirmation'
                                                                }
                                                            } );
                                                            if ( error ) {
                                                                alert( error.message );
                                                                return;
                                                            }
                                                        } );
                                                    }
                                                    try {
                                                        if ( typeof Stripe !== 'function' ) {
                                                            console.warn( 'Stripe.js not loaded.' );
                                                            return;
                                                        }
                                                        stripe = Stripe( 'pk_test_BLnoKVAwr7St6BhZK22vpgrA' );
                                                        const isMobile = document.documentElement.classList.contains( 'mobile' );
                                                        const appearance = {
                                                            theme: 'stripe',
                                                            variables: {
                                                                borderRadius: '11px',
                                                                colorBackground: '#FFFFFF',
                                                                colorDanger: '#101820',
                                                                colorPrimary: '#101820',
                                                                colorText: '#101820',
                                                                fontFamily: 'InterVariable, sans-serif',
                                                                fontSizeBase: '15px',
                                                                gridColumnSpacing: '12px',
                                                                gridRowSpacing: '12px'
                                                            },
                                                            rules: {
                                                                '.Input': {
                                                                    border: '1px solid #ECECEC',
                                                                    boxShadow: 'none',
                                                                    fontSize: '0.8625em',
                                                                    fontVariationSettings: '"opsz" 22',
                                                                    fontWeight: '450',
                                                                    letterSpacing: '-0.0125em',
                                                                    lineHeight: '1.3375em',
                                                                    paddingLeft: '14px',
                                                                    textTransform: 'capitalize'
                                                                },
                                                                '.Input:hover': {
                                                                    boxShadow: 'none'
                                                                },
                                                                '.Input:focus': {
                                                                    border: '1px solid #757576',
                                                                    boxShadow: 'none'
                                                                },
                                                                '.Input--invalid': {
                                                                    border: '1px solid #757576',
                                                                    boxShadow: 'none'
                                                                },
                                                                '.Input--disabled': {
                                                                    border: '1px solid #757576',
                                                                    boxShadow: 'none'
                                                                },
                                                                '.Label': {
                                                                    textTransform: 'capitalize'
                                                                },
                                                                '.Label--resting': {
                                                                    fontSize: '0.8625em',
                                                                    fontVariationSettings: '"opsz" 22',
                                                                    fontWeight: '425',
                                                                    letterSpacing: '-0.0125em'
                                                                },
                                                                '.Label--floating': {
                                                                    fontSize: '0.7em',
                                                                    fontVariationSettings: '"opsz" 22',
                                                                    fontWeight: '425',
                                                                    letterSpacing: '-0.0125em',
                                                                    top: '1px'
                                                                },
                                                                '.Error': {
                                                                    fontSize: '0.75em',
                                                                    fontVariationSettings: '"opsz" 22',
                                                                    fontWeight: '405',
                                                                    letterSpacing: '-0.01325em',
                                                                    margin: '8px 0 6px 1px'
                                                                },
                                                                '.TermsText': {
                                                                    color: '#101820',
                                                                    fontSize: '0',
                                                                    margin: '0',
                                                                    padding: '0'
                                                                }
                                                            },
                                                            labels: 'floating'
                                                        };
                                                        if ( isMobile ) {
                                                            appearance.variables.gridColumnSpacing = '10px';
                                                            appearance.variables.gridRowSpacing = '10px';
                                                            appearance.rules[ '.Input' ].fontSize = '16px';
                                                            appearance.rules[ '.Input' ].lineHeight = '1.3em';
                                                            appearance.rules[ '.Label--resting' ].fontSize = '0.975em';
                                                            appearance.rules[ '.Label--floating' ].fontSize = '0.775em';
                                                            appearance.rules[ '.Label--floating' ].top = '0.05em';
                                                            appearance.rules[ '.Error' ].fontSize = '0.8em';
                                                        }
                                                        elements = stripe.elements( {
                                                            mode: 'payment',
                                                            amount: 50000,
                                                            currency: 'gbp',
                                                            captureMethod: 'manual',
                                                            appearance: appearance,
                                                            fonts: [
                                                                {
                                                                    cssSrc: 'https://rsms.me/inter/inter.css'
                                                                }
                                                            ]
                                                        } );
                                                        paymentEl = elements.create( 'payment', {
                                                            fields: {
                                                                billingDetails: {
                                                                    email: 'auto',
                                                                    name: 'auto',
                                                                    address: {
                                                                        country: 'auto',
                                                                        postalCode: 'auto'
                                                                    }
                                                                }
                                                            }
                                                        } );
                                                        paymentEl.mount( '.stripe' );
                                                    } catch ( err ) {
                                                        console.error( err );
                                                    }
                                                } );
                                            </script>

                                        </div>

                                    </div>

                                    <div class="block" data-block="2BB">

                                        <div class="checkbox">

                                            <div class="blocks" data-blocks="9">

                                                <div class="block" data-block="2BBA">

                                                    <div class="icons">

                                                        <div class="icon" data-icon="1">

                                                            <i class="icons8 icons8-checkbox"></i>

                                                        </div>

                                                        <div class="icon" data-icon="2">

                                                            <i class="icons8 icons8-checked-checkbox"></i>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div class="block" data-block="2BBB">

                                                    <div class="text">I agree to Journi's <a class="link" href="#" target="_blank">Terms & Conditions</a> and <a class="link" href="#" target="_blank">Privacy Policy</a>.</div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="block" data-block="2BC">

                                        <div class="buttons">

                                            <div class="button medium" data-button="1A">

                                                <a class="action" href="#">

                                                    <div class="text">Place Bookings</div>

                                                </a>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </form>

        </div>

    </div>
