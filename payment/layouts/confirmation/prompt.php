    <div class="container">

        <div class="content">

            <div class="sections">

                <div class="section one">

                    <div class="blocks" data-blocks="1">

                        <div class="block" data-block="1">

                            <div class="title">

                                <h1 class="one">Ibiza is calling.</h1>

                            </div>

                        </div>

                        <div class="block" data-block="2">

                            <div class="text">

                                <p>Duis aute irure dolor in officia reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sinte.</p>

                            </div>

                        </div>

                        <div class="block" data-block="3">

                            <div class="buttons">

                                <div class="button medium" data-button="1A" data-action="1">

                                    <a class="action" href="#">

                                        <div class="text">€100</div>

                                    </a>

                                </div>

                                <div class="button medium" data-button="1A" data-action="2">

                                    <a class="action" href="#">

                                        <div class="text">€100</div>

                                    </a>

                                </div>

                                <div class="button medium" data-button="1A" data-action="3">

                                    <a class="action" href="#">

                                        <div class="text">€100</div>

                                    </a>

                                </div>

                                <div class="button medium" data-button="1A" data-action="4">

                                    <a class="action" href="#">

                                        <div class="text">€100</div>

                                    </a>

                                </div>

                                <div class="button medium" data-button="1A" data-action="5">

                                    <a class="action" href="#">

                                        <div class="text">€100</div>

                                    </a>

                                </div>

                                <div class="button medium" data-button="1A" data-action="6">

                                    <a class="action" href="#">

                                        <div class="text">Capture</div>

                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="section two">

                    <div class="blocks" data-blocks="1">

                        <div class="block" data-block="1">

                            <div class="images">

                                <div class="image" style="background-image: url('<?=BASE_URL?>/assets/images/global/banners/banner-1.jpg')"></div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <script>
            document.addEventListener( 'DOMContentLoaded', async () => {
                const params = new URLSearchParams( window.location.search );
                const piSecret = params.get( 'payment_intent_client_secret' );
                const buttons = document.querySelectorAll( '[data-button="1A"][data-action]' );
                let paymentIntentId = sessionStorage.getItem( 'stripe_payment_intent_id' );
                const customerId = sessionStorage.getItem( 'stripe_customer_id' );
                if ( ! paymentIntentId && piSecret ) {
                    const stripe = Stripe( 'pk_test_BLnoKVAwr7St6BhZK22vpgrA' );
                    const { paymentIntent, error } = await stripe.retrievePaymentIntent( piSecret );
                    if ( ! error && paymentIntent && paymentIntent.id ) {
                        paymentIntentId = paymentIntent.id;
                        sessionStorage.setItem( 'stripe_payment_intent_id', paymentIntentId );
                    }
                }
                if ( ! paymentIntentId ) {
                    console.warn( 'PaymentIntent not found.' );
                    return;
                }
                const UNIT_AMOUNT = 10000;
                const selectable = new Set( [ '1', '2', '3', '4', '5' ] );
                const selected = new Set();
                buttons.forEach( ( button ) => {
                    const action = button.getAttribute( 'data-action' );
                    const link = button.querySelector( 'a.action' );
                    if ( ! link ) {
                        return;
                    }
                    if ( selectable.has( action ) ) {
                        link.addEventListener( 'click', ( e ) => {
                            e.preventDefault();
                            if ( link.getAttribute( 'aria-disabled' ) === 'true' ) {
                                return;
                            }
                            if ( selected.has( action ) ) {
                                selected.delete( action );
                                button.classList.remove( 'selected' );
                                button.querySelector( '.text' ).textContent = '€100';
                            } else {
                                selected.add( action );
                                button.classList.add( 'selected' );
                                button.querySelector( '.text' ).textContent = 'Charge €100';
                            }
                        } );
                        return;
                    }
                    if ( action === '6' ) {
                        link.addEventListener( 'click', async ( e ) => {
                            e.preventDefault();
                            if ( selected.size === 0 ) {
                                alert( 'Please select at least one booking.' );
                                return;
                            }
                            const payload = {
                                actions: Array.from( selected ),
                                paymentIntentId: paymentIntentId,
                                customerId: customerId
                            };
                            const res = await fetch( '<?=BASE_URL?>/inc/classes/stripe/payment.php', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify( payload )
                            } );
                            const data = await res.json();
                            if ( data.error ) {
                                alert( data.error );
                                return;
                            }
                            selected.forEach( ( a ) => {
                                const btn = document.querySelector( `[data-button="1A"][data-action="${a}"]` );
                                if ( btn ) {
                                    const aEl = btn.querySelector( 'a.action' );
                                    btn.querySelector( '.text' ).textContent = 'Charged €100';
                                    if ( aEl ) {
                                        aEl.setAttribute( 'aria-disabled', 'true' );
                                        aEl.style.pointerEvents = 'none';
                                    }
                                    btn.classList.remove( 'selected' );
                                    btn.classList.add( 'disabled' );
                                }
                            } );
                            selected.clear();
                        } );
                    }
                } );
            } );
        </script>

    </div>

