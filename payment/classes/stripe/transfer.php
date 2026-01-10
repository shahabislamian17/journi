<?php

    if ( ob_get_level() ) {

        ob_end_clean();

    }

    header( 'Content-Type: application/json' );

    $pi = $_GET[ 'pi' ] ?? '';
    $acts = isset( $_GET[ 'actions' ] ) ? explode( ',', $_GET[ 'actions' ] ) : [];
    $amounts = isset( $_GET[ 'p' ] ) ? explode( ',', $_GET[ 'p' ] ) : [];

    if ( $pi === '' || empty( $acts ) ) {

        http_response_code( 400 );

        echo json_encode( [

            'error' => 'Missing parameters. Example: ?pi=pi_123&actions=1,2,3,4&p=10000'

        ] );

        exit;

    }

    $accounts = [

        '1' => 'acct_1SG7NWPxXcrR8Ejm',
        '2' => 'acct_1SG7PjLVII2WowkF',
        '3' => 'acct_1SG7RfLxZ0lUT9f2',
        '4' => 'acct_1SG7UNLIFB2vZdmJ',
        '5' => 'acct_1SG7VnLP9vMseA8n'

    ];

    $sdk = dirname( __DIR__, 3 ) . '/assets/lib/stripe/init.php';

    if ( ! file_exists( $sdk ) ) {

        http_response_code( 500 );

        echo json_encode( [

            'error' => 'Stripe SDK missing.'

        ] );

        exit;

    }

    require $sdk;

    \Stripe\Stripe::setApiKey( $_ENV['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY') ?? 'sk_test_your_secret_key_here' );

    $ok = [];
    $fail = [];
    $idx = 0;

    foreach ( $acts as $a ) {

        $a = trim( $a );

        $dest = $accounts[ $a ] ?? null;

        if ( ! $dest ) {

            $fail[] = $a;

            $idx++;

            continue;

        }

        $unit = isset( $amounts[ $idx ] ) ? (int) trim( $amounts[ $idx ] ) : 10000;

        if ( $unit <= 0 ) {

            $fail[] = [

                'action' => $a,
                'error' => 'Invalid amount.'

            ];

            $idx++;

            continue;

        }

        $idKey = hash( 'sha256', implode( ':', [
            $pi,
            $a,
            $unit,
            $dest
        ] ) );

        try {

            $t = \Stripe\Transfer::create( [

                'amount' => $unit,
                'currency' => 'gbp',
                'destination' => $dest,
                'transfer_group' => 'booking:action:' . $a,
                'metadata' => [
                    'action' => $a,
                    'payment_intent_id' => $pi
                ]

            ], [

                'idempotency_key' => $idKey

            ] );

            $ok[] = [

                'action' => $a,
                'transfer' => $t->id,
                'amount' => $unit

            ];

        } catch ( \Throwable $e ) {

            $fail[] = [

                'action' => $a,
                'error' => $e->getMessage()

            ];

        }

        $idx++;

    }

    echo json_encode( [

        'ok' => true,
        'payment_intent_id' => $pi,
        'transfers' => $ok,
        'failed' => $fail

    ] );

    exit;

?>

