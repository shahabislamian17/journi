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
        $data = json_decode( $raw, true );

        if ( ! is_array( $data ) ) {

            http_response_code( 400 );

            echo json_encode( [

                'error' => 'Invalid JSON.'

            ] );

            exit;

        }

        $actions = isset( $data[ 'actions' ] ) && is_array( $data[ 'actions' ] ) ? $data[ 'actions' ] : [];
        $paymentIntentId = (string) ( $data[ 'paymentIntentId' ] ?? '' );
        $customerId = (string) ( $data[ 'customerId' ] ?? '' );

        if ( empty( $actions ) || $paymentIntentId === '' ) {

            http_response_code( 400 );

            echo json_encode( [

                'error' => 'Missing parameters.'

            ] );

            exit;

        }

        $accounts = [

            '1' => 'acct_1SFO2vLS7I7n2wbA',
            '2' => 'acct_1SFO5gLrbVq79EiY',
            '3' => 'acct_1SFO7qLueroixfhe',
            '4' => 'acct_1SFO9mL6S6fpd0u2',
            '5' => 'acct_1SFODgLnJq9425DI'

        ];

        $valid = [ '1', '2', '3', '4', '5' ];
        $filtered = [];

        foreach ( $actions as $a ) {

            $s = (string) $a;

            if ( in_array( $s, $valid, true ) && ! in_array( $s, $filtered, true ) ) {

                $filtered[] = $s;

            }

        }

        if ( empty( $filtered ) ) {

            http_response_code( 400 );

            echo json_encode( [

                'error' => 'No valid actions to capture.'

            ] );

            exit;

        }

        $unit = 10000;
        $total = count( $filtered ) * $unit;

        try {

            $pi = \Stripe\PaymentIntent::retrieve( $paymentIntentId );

        } catch ( \Stripe\Exception\ApiErrorException $e ) {

            http_response_code( 400 );

            echo json_encode( [

                'error' => 'Invalid PaymentIntent.'

            ] );

            exit;

        }

        if ( ! isset( $pi->status ) || $pi->status !== 'requires_capture' ) {

            http_response_code( 409 );

            echo json_encode( [

                'error' => 'Payment is not in an authorisation state.'

            ] );

            exit;

        }

        $chargeId = $pi->latest_charge ?: ( isset( $pi->charges->data[ 0 ]->id ) ? $pi->charges->data[ 0 ]->id : null );

        if ( ! $chargeId ) {

            http_response_code( 500 );

            echo json_encode( [

                'error' => 'Authorisation charge not found. Please complete checkout authentication and try again.'

            ] );

            exit;

        }

        try {

            $pi->capture( [

                'amount_to_capture' => $total

            ] );

        } catch ( \Stripe\Exception\ApiErrorException $e ) {

            http_response_code( 500 );

            echo json_encode( [

                'error' => 'Capture error: ' . $e->getMessage()

            ] );

            exit;

        }

        $transfers = [];
        $failed = [];

        foreach ( $filtered as $a ) {

            $dest = $accounts[ $a ] ?? null;

            if ( ! $dest ) {

                $failed[] = $a;

                continue;

            }

            try {

                $t = \Stripe\Transfer::create( [

                    'amount' => $unit,
                    'currency' => 'gbp',
                    'destination' => $dest,
                    'transfer_group' => 'booking:action:' . $a,
                    'metadata' => [
                        'action' => $a

                    ]

                ] );

                $transfers[] = [

                    'action' => $a,
                    'transfer' => $t->id

                ];

            } catch ( \Stripe\Exception\ApiErrorException $e ) {

                $failed[] = $a;

            }

        }

        echo json_encode( [

            'ok' => true,
            'captured' => $total,
            'transfers' => $transfers,
            'failed' => $failed

        ] );

        exit;

    } catch ( \Throwable $e ) {

        error_log( 'PHP error: ' . $e->getMessage() . '.' );

        http_response_code( 500 );

        echo json_encode( [

            'error' => 'Server error: ' . $e->getMessage()

        ] );

        exit;

    }

?>
