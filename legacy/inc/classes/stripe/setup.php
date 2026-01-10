<?php

    if ( ob_get_level() ) {

        ob_end_clean();

    }

    header( 'Content-Type: application/json' );
    header( 'Cache-Control: no-store' );

    if ( $_SERVER[ 'REQUEST_METHOD' ] !== 'POST' ) {

        http_response_code( 405 );

        echo json_encode( [

            'error' => 'Method not allowed.'

        ] );

        exit;

    }

    try {

        $sdkPath = dirname( __DIR__, 3 ) . '/assets/lib/stripe/init.php';

        if ( ! file_exists( $sdkPath ) ) {

            error_log( 'Stripe SDK not found at ' . $sdkPath . '.' );

            http_response_code( 500 );

            echo json_encode( [

                'error' => 'Server error.'

            ] );

            exit;

        }

        require $sdkPath;

        if ( ! class_exists( '\\Stripe\\Stripe' ) ) {

            error_log( 'Stripe SDK not loaded (\\Stripe\\Stripe missing).' );

            http_response_code( 500 );

            echo json_encode( [

                'error' => 'Server error.'

            ] );

            exit;

        }

        \Stripe\Stripe::setApiKey( $_ENV['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY') ?? 'sk_test_your_secret_key_here' );

        $raw = file_get_contents( 'php://input' );
        $json = json_decode( $raw, true );
        $data = is_array( $json ) ? $json : $_POST;

        $mode = (string) ( $data[ 'mode' ] ?? '' );

        if ( $mode !== 'create_payment_intent' ) {

            http_response_code( 400 );

            echo json_encode( [

                'error' => 'Invalid mode.'

            ] );

            exit;

        }

        $firstName = trim( (string) ( $data[ 'first_name' ] ?? '' ) );
        $surname = trim( (string) ( $data[ 'surname' ] ?? '' ) );
        $email = (string) ( $data[ 'email' ] ?? '' );
        $phone = (string) ( $data[ 'phone' ] ?? '' );
        $userRef = (string) ( $data[ 'user_ref' ] ?? 'guest' );
        $incomingCustomerId = trim( (string) ( $data[ 'customer_id' ] ?? '' ) );

        $customer = null;

        if ( $incomingCustomerId !== '' ) {

            try {

                $customer = \Stripe\Customer::retrieve( $incomingCustomerId );

                if ( isset( $customer->deleted ) && $customer->deleted ) {

                    $customer = null;

                }

            } catch ( \Stripe\Exception\ApiErrorException $e ) {

                $customer = null;

            }

        }

        if ( ! $customer ) {

            $customer = \Stripe\Customer::create( [

                'name' => trim( $firstName . ' ' . $surname ),
                'email' => $email ?: null,
                'phone' => $phone ?: null,
                'metadata' => [
                    'user_ref' => $userRef

                ]

            ] );

        }

        $pi = \Stripe\PaymentIntent::create( [

            'amount' => 50000,
            'currency' => 'gbp',
            'customer' => $customer->id,
            'capture_method' => 'manual',
            'automatic_payment_methods' => [
                'enabled' => true

            ],
            'description' => 'Booking',
            'metadata' => [
                'booking_total' => '500'

            ]

        ] );

        echo json_encode( [

            'clientSecret' => $pi->client_secret,
            'paymentIntentId' => $pi->id,
            'customerId' => $customer->id

        ] );

        exit;

    } catch ( \Stripe\Exception\ApiErrorException $e ) {

        error_log( 'Stripe API error: ' . $e->getMessage() . '.' );

        http_response_code( 500 );

        echo json_encode( [

            'error' => 'Payment error.'

        ] );

        exit;

    } catch ( \Throwable $e ) {

        error_log( 'PHP error: ' . $e->getMessage() . '.' );

        http_response_code( 500 );

        echo json_encode( [

            'error' => 'Server error.'

        ] );

        exit;

    }

?>
