    <?php $page = 'confirmation' ?>

    <?php $title = 'Confirmation | Checkout | Journi' ?>

    <?php include_once '../inc/layouts/global/header.php'; ?>

    <section class="notifications">

		<?php include_once '../inc/layouts/global/notifications.php'; ?>

	</section>

	<section class="search">

		<?php include_once '../inc/layouts/global/search.php'; ?>

	</section>

    <section class="breadcrumbs">

        <?php include_once '../inc/layouts/checkout/confirmation/breadcrumbs.php'; ?>

    </section>

    <section class="prompt">

        <?php include_once '../inc/layouts/checkout/confirmation/prompt.php'; ?>

    </section>

    <section class="bag">

        <?php include_once '../inc/layouts/global/bag.php'; ?>

    </section>

    <section class="reviews">

        <?php include_once '../inc/layouts/global/reviews.php'; ?>

    </section>

    <section class="concierge">

        <?php include_once '../inc/layouts/global/concierge.php'; ?>

    </section>

    <script>
        const DatesTemplate = `<?php include_once '../inc/layouts/global/dates.php'; ?>`;
    </script>

    <?php include_once '../inc/layouts/global/footer.php'; ?>

