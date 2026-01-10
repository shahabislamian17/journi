    <?php $page = 'home' ?>

    <?php $title = 'Journi | Coming Soon' ?>

    <?php include_once 'inc/layouts/global/header.php'; ?>

    <section class="notifications">

		<?php include_once 'inc/layouts/global/notifications.php'; ?>

	</section>

	<section class="search">

		<?php include_once 'inc/layouts/global/search.php'; ?>

	</section>

    <section class="banner">

        <?php include_once 'inc/layouts/home/banner.php'; ?>

    </section>

    <section class="experiences">

        <?php include_once 'inc/layouts/home/experiences.php'; ?>

    </section>

    <section class="stays">

        <?php include_once 'inc/layouts/home/stays.php'; ?>

    </section>

    <section class="cars">

        <?php include_once 'inc/layouts/home/cars.php'; ?>

    </section>

    <section class="bag">

        <?php include_once 'inc/layouts/global/bag.php'; ?>

    </section>

    <section class="reviews">

        <?php include_once 'inc/layouts/global/reviews.php'; ?>

    </section>

    <section class="concierge">

        <?php include_once 'inc/layouts/global/concierge.php'; ?>

    </section>

    <script>
        const DatesTemplate = `<?php include_once 'inc/layouts/global/dates.php'; ?>`;
    </script>

    <?php include_once 'inc/layouts/global/footer.php'; ?>
