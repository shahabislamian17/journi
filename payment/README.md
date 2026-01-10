# Payment/Checkout Files

This folder contains all the checkout and Stripe payment-related files from the Journi project.

## Directory Structure

```
payment/
├── checkout/
│   ├── index.php              # Main checkout page
│   └── confirmation.php        # Confirmation page after payment
├── layouts/
│   ├── checkout/
│   │   ├── payment.php         # Checkout page wrapper
│   │   ├── form.php            # Checkout form with Stripe integration
│   │   └── bag.php             # Shopping bag/cart display
│   └── confirmation/
│       ├── prompt.php          # Confirmation page content with payment capture
│       └── breadcrumbs.php     # Breadcrumb navigation
├── classes/
│   └── stripe/
│       ├── setup.php           # Creates PaymentIntent and Customer
│       ├── payment.php         # Handles payment capture and transfers
│       └── transfer.php       # Alternative transfer utility
├── assets/
│   └── images/
│       └── stripe-1.png        # Stripe logo image
└── README.md                   # This file
```

## Important Configuration

### Stripe API Keys

You need to update the following Stripe API keys in these files:

1. **Public Key (pk_test_...)** - Update in:
   - `layouts/checkout/form.php` (line 261)
   - `layouts/confirmation/prompt.php` (line 133)

2. **Secret Key (sk_test_...)** - Update in:
   - `classes/stripe/setup.php` (line 64)
   - `classes/stripe/payment.php` (line 64)
   - `classes/stripe/transfer.php` (line 57)

### Base URL

The `BASE_URL` constant is used throughout. Make sure it's defined in your project's header file or configuration.

### Stripe SDK Path

The Stripe PHP SDK path is referenced in:
- `classes/stripe/setup.php` (line 28)
- `classes/stripe/payment.php` (line 28)
- `classes/stripe/transfer.php` (line 39)

Update the path to match your project structure:
```php
$sdkPath = dirname( __DIR__, 3 ) . '/assets/lib/stripe/init.php';
```

## Dependencies

1. **Stripe.js** - Must be included in your header:
   ```html
   <script src="https://js.stripe.com/v3"></script>
   ```

2. **Stripe PHP SDK** - Server-side SDK required for backend processing

3. **Global Layout Files** - These files reference global layout files:
   - `inc/layouts/global/header.php`
   - `inc/layouts/global/footer.php`
   - `inc/layouts/global/notifications.php`
   - `inc/layouts/global/search.php`
   - `inc/layouts/global/bag.php`
   - `inc/layouts/global/reviews.php`
   - `inc/layouts/global/concierge.php`
   - `inc/layouts/global/dates.php`

## Payment Flow

1. **Checkout** (`checkout/index.php`)
   - User fills out account and payment form
   - Stripe Elements is initialized
   - On submit, creates PaymentIntent via `setup.php`
   - Redirects to confirmation page

2. **Confirmation** (`checkout/confirmation.php`)
   - Retrieves PaymentIntent from URL or sessionStorage
   - Allows selecting bookings to capture
   - Calls `payment.php` to capture payment and create transfers

## Notes

- Payment amounts are hardcoded (50000 = £500.00, 10000 = £100.00)
- Uses manual capture method for payment intents
- Session storage is used to persist PaymentIntent and Customer IDs
- Transfer accounts are configured in `payment.php` (lines 101-109)

