<?php

define( 'BASE_URL', 'http://185.65.239.219/plesk-site-preview/journi.to/https/185.65.239.219' );

$scriptPath = $_SERVER[ 'SCRIPT_NAME' ];
$file       = basename( $scriptPath );
$folder     = basename( dirname( $scriptPath ) );

?>

<!DOCTYPE html>

<html>

<head>

	<?php define( 'VERSION', time() ); ?>

	<title><?php echo $title; ?></title>

	<link rel="icon" type="image/ico" href="<?=BASE_URL?>/assets/images/global/favicon/favicon.png">

	<meta charset="utf-8">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#FEFEFE">

	<link rel="profile" href="http://gmpg.org/xfn/11">

	<script type="text/javascript" src="<?=BASE_URL?>/assets/js/device.js?<?php echo VERSION; ?>"></script>

	<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/assets/css/style.css?<?php echo VERSION; ?>">
	<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/assets/css/icons.css?<?php echo VERSION; ?>">
	<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/assets/css/dates.css?<?php echo VERSION; ?>">
	<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/assets/css/events.css?<?php echo VERSION; ?>">

	<?php if ( ! ( ( $file === 'index.php' && $folder === '' ) || ( $file === 'index.php' && $folder === 'sightseeing' ) || ( $file === 'wishlist.php' ) ) ) { ?>

		<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/assets/css/calendar.css?<?php echo VERSION; ?>">

	<?php } ?>

	<link rel="preconnect" href="https://rsms.me/">
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css">

	<link rel="stylesheet" type="text/css" href="https://use.fontawesome.com/releases/v6.6.0/css/all.css" crossorigin="anonymous">

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"></script>

	<script type="text/javascript" src="<?=BASE_URL?>/assets/js/swiper.js"></script>

	<script src="https://js.stripe.com/v3"></script>

	<!--[if lte 9]>
		<style type="text/css">
			.ie {
				display: block !important;
			}
		</style>
    <![endif]-->

</head>

<body class="<?php echo $page; ?>">

	<?php if ( $file === 'index.php' && $folder === 'checkout' ) { ?>

		<section class="announcements">

			<div class="container">

		        <div class="content">

		            <div class="sections">

		                <div class="section">

		                    <div class="blocks" data-blocks="1">

		                        <div class="block" data-block="1">

		                            <div class="slider">

		                                <div class="slides">

		                                    <div class="slide">

		                                        <div class="blocks" data-blocks="2">

		                                            <div class="block" data-block="1A">

		                                                <div class="title">100% Secure Checkout</div>

		                                            </div>

		                                            <div class="block" data-block="1B">

		                                                <div class="text">Powered by Stripe.</div>

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

		    </div>

	    </section>

	<?php } else { ?>

		<section class="announcements">

			<div class="container">

				<div class="content">

					<div class="sections">

						<div class="section">

							<div class="blocks" data-blocks="1">

								<div class="block" data-block="1">

									<div class="slider">

										<div class="slides">

											<div class="slide">

												<div class="blocks" data-blocks="2">

													<div class="block" data-block="1A">

														<div class="title">Welcome</div>

													</div>

													<div class="block" data-block="1B">

														<div class="text">Your adventure planned in three simple steps.</div>

													</div>

												</div>

											</div>

											<div class="slide">

												<div class="blocks" data-blocks="2">

													<div class="block" data-block="1A">

														<div class="title">Step 1<span>:</span> Explore</div>

													</div>

													<div class="block" data-block="1B">

														<div class="text">Search for unique activities at your destination.</div>

													</div>

												</div>

											</div>

											<div class="slide">

												<div class="blocks" data-blocks="2">

													<div class="block" data-block="1A">

														<div class="title">Step 2<span>:</span> Plan</div>

													</div>

													<div class="block" data-block="1B">

														<div class="text">Add experiences to your personal travel calendar.</div>

													</div>

												</div>

											</div>

											<div class="slide">

												<div class="blocks" data-blocks="2">

													<div class="block" data-block="1A">

														<div class="title">Step 3<span>:</span> Book & Share</div>

													</div>

													<div class="block" data-block="1B">

														<div class="text">Confirm your activities and share the plan.</div>

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

			</div>

		</section>

	<?php } ?>

	<header>

		<div class="container">

			<div class="content">

				<div class="sections">

					<div class="section one">

						<div class="blocks" data-blocks="1">

							<div class="block" data-block="1">

								<div class="logo">

									<div class="image">

										<a href="<?=BASE_URL?>">

											<img src="<?=BASE_URL?>/assets/images/global/logo/logo.png">

										</a>

									</div>

								</div>

							</div>

						</div>

					</div>

					<div class="section two">

						<div class="blocks" data-blocks="1">

							<div class="block" data-block="1">

								<div class="view">

									<div class="links">

										<ul>

											<li data-link="view">

												<div class="text">View As</div>

											</li>

											<li class="active" data-link="list">

												<div class="icon">

													<i class="icons8 icons8-index"></i>

												</div>

												<div class="text">List</div>

											</li>

											<li data-link="calendar">

												<div class="icon">

													<i class="icons8 icons8-schedule"></i>

												</div>

												<div class="text">Calendar</div>

											</li>

										</ul>

									</div>

								</div>

							</div>

						</div>

					</div>

					<div class="section three">

						<div class="blocks" data-blocks="1">

							<div class="block" data-block="1">

								<div class="icons">

									<div class="icon one">

										<div class="lines">

											<div class="line"></div>
											<div class="line"></div>

										</div>

									</div>

									<div class="icon two">

										<div class="action">

											<div class="number">1</div>

											<div class="icon">

												<i class="icons8 icons8-bag"></i>

											</div>

										</div>

									</div>

									<div class="icon three">

										<div class="action">

											<div class="number">1</div>

											<div class="icon">

												<i class="icons8 icons8-megaphone"></i>

											</div>

										</div>

									</div>

									<div class="icon four">

										<a href="#" class="action">

											<div class="icon">

												<i class="icons8 icons8-account"></i>

											</div>

										</a>

									</div>

									<div class="icon five">

										<a href="#" class="action">

											<div class="icon">

												<i class="icons8 icons8-heart"></i>

											</div>

										</a>

									</div>

								</div>

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	</header>
