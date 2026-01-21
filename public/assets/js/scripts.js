    $(function() {
        const $html = $( 'html' );
        $(window).on( 'scroll', function(event) {
            const classes   = 'scroll',
                  target    = 'html',
                  winWidth  = 3860,
                  offset    = 65,
                  scrollTop = $(window).scrollTop();
            if ( window.innerWidth <= winWidth ) {
                if ( scrollTop > offset ) {
                    if ( $(window).innerWidth() < 3860 ) {
                        $( "meta[name='theme-color']" ).attr( 'content', '#FEFEFE' );
                    };
                    $html.addClass(classes);
                } else {
                    if ( $(window).innerWidth() < 3860 ) {
                        $( "meta[name='theme-color']" ).attr( 'content', '#FEFEFE' );
                    };
                    $html.removeClass(classes);
                }
            }
        });
    });

    document.documentElement.style.setProperty( '--height', `${ document.body.scrollHeight }px` );

    $(function() {

        const swiperGlobalOneElement = document.querySelector( '.announcements .slider' );
        const slideGlobalOneCount = swiperGlobalOneElement ? swiperGlobalOneElement.querySelectorAll( '.slides .slide' ).length : 0;

        let swiper = null;

        // Only initialize if not already initialized and has more than 1 slide
        if ( slideGlobalOneCount > 1 && swiperGlobalOneElement && !swiperGlobalOneElement.swiper ) {
            const swiperGlobalOne = new Swiper( '.announcements .slider', {
                containerModifierClass: 'slide-',
                slideActiveClass: 'active',
                slideBlankClass: 'blank',
                slideClass: 'slide',
                slideNextClass: 'next',
                slidePrevClass: 'previous',
                slideVisibleClass: 'visible',
                wrapperClass: 'slides',
                autoHeight: true,
                loop: slideGlobalOneCount > 1, // Only loop if more than 1 slide
                centeredSlides: false, // Changed to false to prevent all slides showing
                speed: 1250,
                spaceBetween: 0,
                direction: 'horizontal',
                slidesPerView: 1,
                effect: 'slide', // Explicitly set slide effect
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },
                // Prevent multiple initializations
                observer: true,
                observeParents: true
            });
        }

        const swiperGlobalTwo = new Swiper( '.reviews .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            speed: 750,
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.reviews .slider .navigation .buttons .button.one',
                nextEl: '.reviews .slider .navigation .buttons .button.two',
            },
            pagination: {
                bulletClass: 'icon',
                bulletActiveClass: 'active',
                el: '.reviews .slider .pagination .icons',
                dynamicBullets: true,
            },
            breakpoints: {
                0: {
                    spaceBetween: 12,
                    slidesPerView: 1,
                },
                600: {
                    spaceBetween: 16,
                    slidesPerView: 2,
                },
                900: {
                    spaceBetween: 1,
                    slidesPerView: 2,
                },
                1025: {
                    spaceBetween: 16,
                    slidesPerView: 3,
                }
            }
        });

        const swiperGlobalThree = new Swiper( '.calendar .dates .labels .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            speed: 500,
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.calendar .buttons .button[data-action="previous"]',
                nextEl: '.calendar .buttons .button[data-action="next"]',
            },
            breakpoints: {
                0: {
                    spaceBetween: 5,
                    slidesPerView: 4,
                },
                900: {
                    spaceBetween: 10,
                    slidesPerView: 4,
                },
                1250: {
                    spaceBetween: 10,
                    slidesPerView: 6,
                },
                1375: {
                    spaceBetween: 10,
                    slidesPerView: 7,
                }
            }
        });

        const swiperGlobalFour = new Swiper( '.calendar .dates .days .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            speed: 500,
            breakpoints: {
                0: {
                    spaceBetween: 5,
                    slidesPerView: 4,
                },
                900: {
                    spaceBetween: 10,
                    slidesPerView: 4,
                },
                1250: {
                    spaceBetween: 10,
                    slidesPerView: 6,
                },
                1375: {
                    spaceBetween: 10,
                    slidesPerView: 7,
                }
            }
        });

        swiperGlobalThree.controller.control = swiperGlobalFour;
        swiperGlobalFour.controller.control = swiperGlobalThree;

        const swiperStaysOne = new Swiper( '.stays .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            speed: 750,
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.stays .slider .navigation .buttons .button.one',
                nextEl: '.stays .slider .navigation .buttons .button.two',
            },
            breakpoints: {
                0: {
                    spaceBetween: 12,
                    slidesPerView: 1.5,
                },
                600: {
                    spaceBetween: 16,
                    slidesPerView: 2,
                },
                900: {
                    spaceBetween: 16,
                    slidesPerView: 4,
                },
                1250: {
                    spaceBetween: 16,
                    slidesPerView: 4,
                }
            }
        });

        const swiperCarsOne = new Swiper( '.cars .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            speed: 750,
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.cars .slider .navigation .buttons .button.one',
                nextEl: '.cars .slider .navigation .buttons .button.two',
            },
            breakpoints: {
                0: {
                    spaceBetween: 12,
                    slidesPerView: 1.5,
                },
                600: {
                    spaceBetween: 16,
                    slidesPerView: 2,
                },
                900: {
                    spaceBetween: 16,
                    slidesPerView: 4,
                },
                1250: {
                    spaceBetween: 16,
                    slidesPerView: 4,
                }
            }
        });

        const swiperExperienceOne = new Swiper( '.experience .banner .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.experience .banner .slider .navigation .buttons .button.one',
                nextEl: '.experience .banner .slider .navigation .buttons .button.two',
            },
            pagination: {
                bulletClass: 'icon',
                bulletActiveClass: 'active',
                el: '.experience .banner .slider .pagination .icons',
                dynamicBullets: true,
            },
            breakpoints: {
                0: {
                    speed: 625,
                    spaceBetween: 12,
                    slidesPerView: 1,
                },
                600: {
                    speed: 625,
                    spaceBetween: 16,
                    slidesPerView: 1,
                },
                900: {
                    speed: 625,
                    spaceBetween: 16,
                    slidesPerView: 1,
                },
                1025: {
                    speed: 750,
                    spaceBetween: 16,
                    slidesPerView: 2,
                }
            }
        });

        const swiperExperienceTwo = new Swiper( '.experience .experiences .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            navigation: {
                disabledClass: 'disabled',
                prevEl: '.experience .experiences .slider .navigation .buttons .button.one',
                nextEl: '.experience .experiences .slider .navigation .buttons .button.two',
            },
            breakpoints: {
                0: {
                    speed: 625,
                    spaceBetween: 12,
                    slidesPerView: 2,
                },
                600: {
                    speed: 625,
                    spaceBetween: 16,
                    slidesPerView: 3,
                },
                900: {
                    speed: 625,
                    spaceBetween: 16,
                    slidesPerView: 4,
                },
                1025: {
                    speed: 750,
                    spaceBetween: 16,
                    slidesPerView: 5,
                },
                1250: {
                    speed: 750,
                    spaceBetween: 16,
                    slidesPerView: 5,
                }
            }
        });

    });

    $(function() {
        $(document).on( 'change', '.home .select, .category .select', function() {
            const $mirror = $( '.home .sort .select .value, .category .sort .select .value' );
            const $selectedOption = $( '.home .select option:selected, .category .select option:selected', this );
            const selectedText = $selectedOption.text();
            $mirror.text( selectedText );
            // Removed inline width style - let CSS handle width
            // CSS should handle select width automatically

        });

        // Handle experiences sort select display, width adjustment, and sorting
        $( document ).on( 'change', '.experiences .sort select', function() {
            const $select = $( this );
            const $sort = $select.closest( '.sort' );
            const $mirror = $sort.find( '.select .option' );
            const selectedText = $select.find( 'option:selected' ).text();
            $mirror.text( selectedText );
            
            // Fixed widths for each option
            const widthMap = {
                'relevance': 142,
                'popular': 128,
                'newest': 127,
                'price-low': 188,
                'price-high': 188
            };
            
            const selectedValue = $select.val();
            const width = widthMap[selectedValue] || 142; // Default to 142 if value not found
            
            $select.css({
                width: width + 'px'
            });
            
            // Sort and re-render experiences
            if ( window.__API_EXPERIENCES__ && Array.isArray( window.__API_EXPERIENCES__ ) ) {
                let sortedExperiences = [...window.__API_EXPERIENCES__];
                
                // Sort based on selected value
                switch( selectedValue ) {
                    case 'popular':
                        sortedExperiences.sort( ( a, b ) => {
                            const ratingA = parseFloat( a.rating ) || 0;
                            const ratingB = parseFloat( b.rating ) || 0;
                            const reviewsA = a._count?.reviews || a.reviews?.length || 0;
                            const reviewsB = b._count?.reviews || b.reviews?.length || 0;
                            
                            if ( ratingB !== ratingA ) {
                                return ratingB - ratingA;
                            }
                            return reviewsB - reviewsA;
                        } );
                        break;
                        
                    case 'newest':
                        sortedExperiences.sort( ( a, b ) => {
                            const dateA = a.createdAt ? new Date( a.createdAt ).getTime() : 0;
                            const dateB = b.createdAt ? new Date( b.createdAt ).getTime() : 0;
                            return dateB - dateA;
                        } );
                        break;
                        
                    case 'price-low':
                        sortedExperiences.sort( ( a, b ) => {
                            const priceA = parseFloat( a.price ) || 0;
                            const priceB = parseFloat( b.price ) || 0;
                            return priceA - priceB;
                        } );
                        break;
                        
                    case 'price-high':
                        sortedExperiences.sort( ( a, b ) => {
                            const priceA = parseFloat( a.price ) || 0;
                            const priceB = parseFloat( b.price ) || 0;
                            return priceB - priceA;
                        } );
                        break;
                        
                    case 'relevance':
                    default:
                        // Keep original order
                        break;
                }
                
                // Map sorted experiences to render format
                const mappedExperiences = sortedExperiences.map( experience => {
                    const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                    return {
                        id: experience.id,
                        slug: experience.slug,
                        title: experience.title,
                        duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                        rating: experience.rating || '0',
                        price: experience.price || '0',
                        image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                               '/assets/images/experiences/experience-1a.jpg',
                        featured: experience.featured || false,
                        new: experience.isNew || false,
                        inWishlist: false
                    };
                } );
                
                // Re-render sorted experiences
                renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                    console.error( 'Error rendering sorted experiences:', error );
                } );
            }
        }).trigger( 'change' );

    });

    document.querySelectorAll( '.input input, .input textarea, .select select' ).forEach( input => {
        input.addEventListener( 'focus', () => {
            input.parentElement.dataset.input = 'focus';
        });
        input.addEventListener( 'blur', () => {
            if ( input.value.trim() !== '' ) {
                input.parentElement.dataset.input = 'focus';
            } else {
                input.parentElement.dataset.input = '';
            }
        });
        if ( input.value.trim() !== '' ) {
            input.parentElement.dataset.input = 'focus';
        }
    });

    $( 'header .content .sections .section.two .blocks .block .view .links ul li[data-link="list"]' ).click(function() {
        $( 'body' ).removeClass( 'alt' );
    });

    $( 'header .content .sections .section.two .blocks .block .view .links ul li[data-link="calendar"]' ).click(function() {
        $( 'body' ).addClass( 'alt' );
    });

    $( 'header .content .sections .section.three .blocks .block .icons .icon.three' ).click(function() {
        $( 'html' ).attr( 'data-modal', 'notifications' );
    });

    $( '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="destination"]' ).click(function() {
        $( 'html' ).attr( 'data-modal', 'destination' );
    });

    $( '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="dates"]' ).click(function() {
        $( 'html' ).attr( 'data-modal', 'dates' );
        Search.showDates = true;
    });

    $( '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="guests"]' ).click(function() {
        $( 'html' ).attr( 'data-modal', 'guests' );
    });

    $( 'footer ~ .overlay' ).click(function() {
        $( 'html' ).removeAttr( 'data-modal' );
    });

    // Wishlist toggle handler for heart icons
    // This handles dynamically-rendered experiences (not React components)
    // React components handle their own clicks via WishlistButton component
    $( document ).on( 'click', '.experience .banner .icons, .experiences .experience .banner .icons .icon', function( e ) {
        // Skip if this is a React-rendered component (React components handle their own clicks)
        const $icons = $( this ).closest( '.icons' );
        if ( $icons.data( 'react-component' ) || $icons.closest( '[data-reactroot]' ).length > 0 ) {
            return; // Let React handle it
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const $experience = $( this ).closest( '.experience' );
        let experienceId = $experience.attr( 'data-experience-id' ) || 
                          $experience.find( '[data-experience-id]' ).attr( 'data-experience-id' );
        
        // Try to get ID from the icons element if not found on experience
        if ( !experienceId ) {
            experienceId = $icons.attr( 'data-experience-id' );
        }
        
        // Validate experience ID - can be a number or UUID string
        if ( !experienceId || experienceId === '' || experienceId === 'null' || experienceId === 'undefined' ) {
            console.error( 'Experience ID is missing or invalid:', { 
                experienceId, 
                experience: $experience[0],
                icons: $icons[0]
            } );
            if ( typeof window.showNotification === 'function' ) {
                window.showNotification( 'Error: Experience ID is missing. Please refresh the page and try again.', 'error' );
            } else {
                console.error( 'Error: Experience ID is missing. Please refresh the page and try again.' );
            }
            return;
        }
        
        // Validate ID format - can be a number or UUID string
        // Check if it's a valid number
        const expIdNum = parseInt( experienceId, 10 );
        const isNumeric = !isNaN( expIdNum ) && expIdNum > 0;
        
        // Check if it's a valid UUID format (basic check: has dashes and is 36 chars)
        const isUUID = typeof experienceId === 'string' && 
                      experienceId.length === 36 && 
                      experienceId.includes( '-' );
        
        if ( !isNumeric && !isUUID ) {
            console.error( 'Invalid experience ID format:', experienceId );
            if ( typeof window.showNotification === 'function' ) {
                window.showNotification( 'Error: Invalid experience ID format. Please refresh the page and try again.', 'error' );
            } else {
                console.error( 'Error: Invalid experience ID format. Please refresh the page and try again.' );
            }
            return;
        }
        
        // Use the ID as-is (number or UUID string)
        const validExpId = isNumeric ? expIdNum : experienceId;
        
        // Check if user is authenticated - check both localStorage and cookies
        let token = typeof localStorage !== 'undefined' ? localStorage.getItem( 'token' ) : null;
        
        // If not in localStorage, check cookies
        if ( !token && typeof document !== 'undefined' ) {
            const cookies = document.cookie.split( ';' );
            const tokenCookie = cookies.find( cookie => cookie.trim().startsWith( 'token=' ) );
            if ( tokenCookie ) {
                token = tokenCookie.split( '=' )[1];
            }
        }
        
        if ( !token ) {
            if ( typeof window.showNotification === 'function' ) {
                window.showNotification( 'Please log in to add items to your wishlist', 'warning' );
            }
            if ( typeof window !== 'undefined' ) {
                setTimeout( () => {
                    window.location.href = '/account/log-in';
                }, 2000 );
            }
            return;
        }
        
        // Get API URL
        let apiUrl = '';
        if ( typeof window !== 'undefined' ) {
            apiUrl = document.querySelector( 'meta[name="api-url"]' )?.getAttribute( 'content' ) ||
                     window.__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL ||
                     window.NEXT_PUBLIC_API_URL ||
                     'http://localhost:4000';
        }
        
        // Check if already in wishlist (icons container has active class)
        const isInWishlist = $icons.hasClass( 'active' );
        const endpoint = isInWishlist 
            ? `${apiUrl}/api/wishlist/${validExpId}`
            : `${apiUrl}/api/wishlist`;
        const method = isInWishlist ? 'DELETE' : 'POST';
        const body = isInWishlist ? null : JSON.stringify( { experienceId: validExpId } );
        
        console.log( 'Wishlist API call:', { endpoint, method, body, validExpId, experienceId, isNumeric, isUUID, isInWishlist } );
        
        // Show loading state
        $icons.css( 'opacity', '0.6' );
        $icons.css( 'pointer-events', 'none' );
        
        fetch( endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: body
        } )
        .then( response => {
            if ( !response.ok ) {
                return response.json().then( err => { throw new Error( err.error || 'Failed to update wishlist' ); } );
            }
            return response.json();
        } )
        .then( data => {
            // Show success notification
            if ( typeof window.showNotification === 'function' ) {
                const message = isInWishlist ? 'Removed from wishlist' : 'Added to wishlist';
                window.showNotification( message, 'success' );
            }
            
            // Toggle visual state on the icons container
            $icons.toggleClass( 'active' );
            
            // If removing from wishlist page, remove the experience element
            if ( isInWishlist && $( 'body' ).hasClass( 'wishlist' ) ) {
                const $experience = $icons.closest( '.experience' );
                const $block = $experience.closest( '.block[data-block]' );
                $block.fadeOut( 300, function() {
                    $( this ).remove();
                    // Check if wishlist is now empty
                    const remainingExperiences = $( '.wishlist .experiences .blocks .block' ).length;
                    if ( remainingExperiences === 0 ) {
                        // Show empty message
                        const emptyHTML = '<div class="blocks" data-blocks="1"><div class="block"><div class="experiences"><p>Your wishlist is empty. Start adding experiences you love!</p></div></div></div>';
                        $( '.wishlist .experiences .content .sections .section.three .container .content .blocks .block .experiences' ).html( emptyHTML );
                    }
                } );
            }
        } )
        .catch( error => {
            console.error( 'Error updating wishlist:', error );
            if ( typeof window.showNotification === 'function' ) {
                window.showNotification( error.message || 'Failed to update wishlist. Please try again.', 'error' );
            }
        } )
        .finally( () => {
            // Remove loading state
            $icons.css( 'opacity', '1' );
            $icons.css( 'pointer-events', 'auto' );
        } );
    });

    $( 'header .content .sections .section.two .blocks .block .view .links ul li' ).click(function() {
        $( this ).addClass( 'active' );
    });

    $( '.home .experiences .content .sections .section.two .blocks .block .blocks .block .view .buttons .button.circle.alt[data-link="list"]' ).click(function() {
        $( 'body' ).removeClass( 'alt' );
    });

    $( '.home .experiences .content .sections .section.two .blocks .block .blocks .block .view .buttons .button.circle.alt[data-link="calendar"]' ).click(function() {
        $( 'body' ).addClass( 'alt' );
    });

    $( '.home .experiences .content .sections .section.four .blocks .block .buttons .button.medium' ).click(function() {
        $( '.home .experiences .content .sections .section.three .calendar' ).addClass( 'delay' );
        setTimeout(function() {
            $( '.home .experiences .content .sections .section.three .calendar' ).addClass( 'active' );
        }, 100 );
    });

    $( '.home .experiences .content .sections .section.three .calendar .blocks .block .blocks .block .blocks .block .close, .home .experiences .content .sections .section.three .calendar .overlay' ).click(function() {
        setTimeout(function() {
            $( '.home .experiences .content .sections .section.three .calendar' ).removeClass( 'delay' );
        }, 750 );
        $( '.home .experiences .content .sections .section.three .calendar' ).removeClass( 'active' );
    });

    $( 'header .content .sections .section.three .blocks .block .icons .icon.two' ).click(function() {
        $( '.bag' ).addClass( 'delay' );
        setTimeout(function() {
            $( '.bag' ).addClass( 'active' );
        }, 100 );
    });

    // Handle user icon click - redirect based on login status
    $( document ).on( 'click', 'header .content .sections .section.three .blocks .block .icons .icon.four .action', function( e ) {
        e.preventDefault();
        if ( typeof window === 'undefined' ) return;

        // Try to read token from cookies
        var token = null;
        try {
            var cookies = document.cookie ? document.cookie.split(';') : [];
            for (var i = 0; i < cookies.length; i++) {
                var c = cookies[i].trim();
                if (c.indexOf('token=') === 0) {
                    token = c.substring('token='.length, c.length);
                    break;
                }
            }
        } catch (err) {
            token = null;
        }

        // If no token, go directly to login page
        if ( !token ) {
            window.location.href = '/account/log-in';
            return;
        }

        // If token exists, go to profile
        window.location.href = '/account/profile';
    });

    $( '.bag .content .sections .section.one .blocks .block .close, .bag .overlay' ).click(function() {
        setTimeout(function() {
            $( '.bag' ).removeClass( 'delay' );
        }, 750 );
        $( '.bag' ).removeClass( 'active' );
    });

    $( '.checkout .payment .content .sections .section .blocks .block .form .fields .fieldset .blocks .block .blocks .block .blocks .block[data-block="2BDB"] .icons' ).click(function() {
        const $wrapper = $( this ).closest( '.blocks' );
        const $input = $wrapper.find( '.input input' );
        if ( $input.attr( 'type' ) === 'password' ) {
            $input.attr( 'type', 'text' );
        } else {
            $input.attr( 'type', 'password' );
        }
        $( this ).toggleClass( 'active' );
    });

    $( 'footer .content .sections .section.three .blocks .block .buttons .button.medium' ).click(function() {
        $( '.calendar' ).addClass( 'delay' );
        setTimeout(function() {
            $( '.calendar' ).addClass( 'active' );
        }, 100 );
    });

    $( '.calendar .blocks .block .blocks .block .blocks .block .close, .calendar .overlay' ).click(function() {
        setTimeout(function() {
            $( '.calendar' ).removeClass( 'delay' );
        }, 750 );
        $( '.calendar' ).removeClass( 'active' );
    });

    $( '.home .experiences .content .sections .section.three .calendar .blocks .block .blocks .block .buttons .blocks .block:first-child .button.small, .calendar .blocks .block .dates .blocks .block .labels .label .blocks .block .button.circle.alt' ).click(function() {
        $( this ).toggleClass( 'active' );
    });

    $( document ).on( 'click', '.calendar .dates .days .experiences .experience[data-availability="1"]', function( e ) {
        // Don't open sidebar if drag was performed
        if ( isDragging || dragEnabled ) {
            return false;
        }
        $( '.availability' ).addClass( 'delay' );
        setTimeout(function() {
            $( '.availability' ).addClass( 'active' );
        }, 100 );
    });

    // Drag and drop functionality for calendar experiences with long press
    let longPressTimer = null;
    let isDragging = false;
    let dragEnabled = false;
    let pressStartX = 0;
    let pressStartY = 0;
    let currentDraggingElement = null;
    const LONG_PRESS_DURATION = 500; // milliseconds

    function initCalendarDragDrop() {
        // Remove existing event handlers and draggable
        $( '.calendar .dates .days .experiences .experience' ).off( 'mousedown touchstart' );
        $( '.calendar .dates .days .experiences .experience' ).off( 'mouseup touchend' );
        $( '.calendar .dates .days .experiences .experience' ).off( 'mousemove touchmove' );
        
        // Destroy draggable only if it exists
        $( '.calendar .dates .days .experiences .experience' ).each(function() {
            const $el = $( this );
            if ( $el.data( 'ui-draggable' ) || $el.data( 'draggable' ) ) {
                $el.draggable( 'destroy' );
            }
        });
        
        // Destroy droppable only if it exists
        $( '.calendar .dates .days .slider .slides .slide .day' ).each(function() {
            const $el = $( this );
            if ( $el.data( 'ui-droppable' ) || $el.data( 'droppable' ) ) {
                $el.droppable( 'destroy' );
            }
        });

        // Initialize all experiences as draggable but disabled
        $( '.calendar .dates .days .experiences .experience' ).each(function() {
            const $experience = $( this );
            
            // Destroy existing draggable if it exists
            if ( $experience.data( 'ui-draggable' ) || $experience.data( 'draggable' ) ) {
                $experience.draggable( 'destroy' );
            }
            
            $experience.draggable({
                disabled: true, // Start disabled
                helper: function() {
                    return $( this ).clone().css({
                        'opacity': '0.8',
                        'z-index': '1000',
                        'position': 'fixed'
                    });
                },
                revert: 'invalid',
                zIndex: 1000,
                cursor: 'move',
                appendTo: 'body',
                start: function( event, ui ) {
                    $( this ).css( 'opacity', '0.5' );
                    isDragging = true;
                },
                    stop: function( event, ui ) {
                        $( this ).css( 'opacity', '1' );
                        isDragging = false;
                        dragEnabled = false;
                        currentDraggingElement = null;
                        // Disable again after drag
                        if ( $experience.data( 'ui-draggable' ) || $experience.data( 'draggable' ) ) {
                            $experience.draggable( 'option', 'disabled', true );
                        }
                    }
            });
        });

        // Handle long press to enable dragging
        $( document ).on( 'mousedown touchstart', '.calendar .dates .days .experiences .experience', function( e ) {
            const $experience = $( this );
            isDragging = false;
            dragEnabled = false;
            currentDraggingElement = $experience;
            
            // Get initial position
            const touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
            pressStartX = touch.pageX;
            pressStartY = touch.pageY;
            
            // Clear any existing timer
            if ( longPressTimer ) {
                clearTimeout( longPressTimer );
            }
            
            // Set timer for long press
            longPressTimer = setTimeout(function() {
                if ( ! currentDraggingElement || ! currentDraggingElement.is( $experience ) ) {
                    return;
                }
                
                dragEnabled = true;
                
                // Enable dragging for this experience
                if ( $experience.data( 'ui-draggable' ) || $experience.data( 'draggable' ) ) {
                    $experience.draggable( 'option', 'disabled', false );
                }
                
                // Add visual feedback
                $experience.css( 'opacity', '0.7' );
            }, LONG_PRESS_DURATION );
        });

        // Handle mouseup/touchend to cancel long press or handle click
        $( document ).on( 'mouseup touchend', '.calendar .dates .days .experiences .experience', function( e ) {
            const $experience = $( this );
            
            // Clear long press timer
            if ( longPressTimer ) {
                clearTimeout( longPressTimer );
                longPressTimer = null;
            }
            
            // If drag was enabled and is dragging, let it complete
            if ( dragEnabled && isDragging ) {
                return true;
            }
            
            // If drag was enabled but not dragging yet, disable it
            if ( dragEnabled && ! isDragging ) {
                if ( $experience.data( 'ui-draggable' ) || $experience.data( 'draggable' ) ) {
                    $experience.draggable( 'option', 'disabled', true );
                }
                $experience.css( 'opacity', '1' );
                dragEnabled = false;
                currentDraggingElement = null;
                return false; // Prevent click
            }
            
            // If long press didn't complete, allow normal click
            dragEnabled = false;
            currentDraggingElement = null;
            $experience.css( 'opacity', '1' );
        });

        // Cancel long press if mouse moves significantly before timer completes
        $( document ).on( 'mousemove touchmove', function( e ) {
            if ( longPressTimer && currentDraggingElement ) {
                const touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                const moveX = Math.abs( touch.pageX - pressStartX );
                const moveY = Math.abs( touch.pageY - pressStartY );
                
                // If moved significantly before long press completes, cancel
                if ( moveX > 10 || moveY > 10 ) {
                    clearTimeout( longPressTimer );
                    longPressTimer = null;
                    currentDraggingElement = null;
                }
            }
        });

        // Click prevention is handled in the availability click handler above

        // Make day containers droppable
        $( '.calendar .dates .days .slider .slides .slide .day' ).droppable({
            accept: '.calendar .dates .days .experiences .experience',
            tolerance: 'pointer',
            hoverClass: 'ui-state-hover',
            drop: function( event, ui ) {
                const $droppedExperience = ui.draggable;
                const $targetDay = $( this );
                const $targetExperiences = $targetDay.find( '.experiences' );
                
                // Calculate new time based on drop position relative to the day container
                const dayOffset = $targetDay.offset();
                const dropY = event.pageY - dayOffset.top;
                const dayHeight = $targetDay.height();
                
                // Calculate time slot (48 slots for 24 hours, 30-minute intervals)
                const timeSlotHeight = dayHeight / 48;
                let newTime = Math.max( 1, Math.min( 48, Math.ceil( dropY / timeSlotHeight ) ) );
                
                // Get duration from original experience
                const duration = parseInt( $droppedExperience.attr( 'data-duration' ) ) || 2;
                
                // Check if moving to different day or same day
                const $originalDay = $droppedExperience.closest( '.day' );
                const isDifferentDay = ! $originalDay.is( $targetDay );
                
                // Remove from original location if moving to different day
                if ( isDifferentDay ) {
                    $droppedExperience.remove();
                } else {
                    // If same day, just update position
                    $droppedExperience.attr( 'data-time', newTime );
                    $droppedExperience.css( 'top', ( ( newTime - 1 ) * timeSlotHeight ) + 'px' );
                    if ( $droppedExperience.data( 'ui-draggable' ) || $droppedExperience.data( 'draggable' ) ) {
                        $droppedExperience.draggable( 'option', 'disabled', true );
                    }
                    isDragging = false;
                    dragEnabled = false;
                    currentDraggingElement = null;
                    return;
                }
                
                // Create new experience in target day
                const $newExperience = $droppedExperience.clone();
                $newExperience.attr( 'data-time', newTime );
                $newExperience.attr( 'data-duration', duration );
                $newExperience.css({
                    'top': ( ( newTime - 1 ) * timeSlotHeight ) + 'px',
                    'height': ( duration * timeSlotHeight ) + 'px',
                    'opacity': '1'
                });
                
                // Remove any existing experience at overlapping time slots
                const endTime = newTime + duration - 1;
                $targetExperiences.find( '.experience' ).each(function() {
                    const existingTime = parseInt( $( this ).attr( 'data-time' ) );
                    const existingDuration = parseInt( $( this ).attr( 'data-duration' ) ) || 2;
                    const existingEndTime = existingTime + existingDuration - 1;
                    
                    // Check for overlap
                    if ( ( newTime >= existingTime && newTime <= existingEndTime ) ||
                         ( endTime >= existingTime && endTime <= existingEndTime ) ||
                         ( newTime <= existingTime && endTime >= existingEndTime ) ) {
                        $( this ).remove();
                    }
                });
                
                // Append to target day
                $targetExperiences.append( $newExperience );
                
                // Initialize draggable for the new experience (disabled by default)
                $newExperience.draggable({
                    disabled: true,
                    helper: function() {
                        return $( this ).clone().css({
                            'opacity': '0.8',
                            'z-index': '1000',
                            'position': 'fixed'
                        });
                    },
                    revert: 'invalid',
                    zIndex: 1000,
                    cursor: 'move',
                    appendTo: 'body',
                    start: function( event, ui ) {
                        $( this ).css( 'opacity', '0.5' );
                        isDragging = true;
                    },
                    stop: function( event, ui ) {
                        $( this ).css( 'opacity', '1' );
                        isDragging = false;
                        dragEnabled = false;
                        currentDraggingElement = null;
                        if ( $newExperience.data( 'ui-draggable' ) || $newExperience.data( 'draggable' ) ) {
                            $newExperience.draggable( 'option', 'disabled', true );
                        }
                    }
                });
                
                // Clean up drag state
                isDragging = false;
                dragEnabled = false;
                currentDraggingElement = null;
            }
        });
    }

    // Initialize drag and drop when calendar is ready
    function tryInitCalendarDragDrop() {
        const hasExperiences = $( '.calendar .dates .days .experiences .experience' ).length > 0;
        const hasDays = $( '.calendar .dates .days .slider .slides .slide .day' ).length > 0;
        
        if ( hasExperiences && hasDays ) {
            initCalendarDragDrop();
            return true;
        }
        return false;
    }

    $( document ).ready(function() {
        // Try to initialize immediately
        if ( ! tryInitCalendarDragDrop() ) {
            // If not ready, try again after a delay
            setTimeout(function() {
                if ( ! tryInitCalendarDragDrop() ) {
                    // Try one more time after longer delay
                    setTimeout(function() {
                        tryInitCalendarDragDrop();
                    }, 2000 );
                }
            }, 1000 );
        }
    });

    // Reinitialize when calendar content changes (for dynamically loaded content)
    let calendarObserver;
    if ( typeof MutationObserver !== 'undefined' ) {
        calendarObserver = new MutationObserver(function( mutations ) {
            let shouldReinit = false;
            mutations.forEach(function( mutation ) {
                if ( mutation.addedNodes.length > 0 ) {
                    $( mutation.addedNodes ).each(function() {
                        if ( $( this ).find( '.calendar .dates .days .experiences .experience' ).length > 0 ||
                             $( this ).hasClass( 'calendar' ) ) {
                            shouldReinit = true;
                        }
                    });
                }
            });
            if ( shouldReinit ) {
                setTimeout(function() {
                    tryInitCalendarDragDrop();
                }, 200 );
            }
        });
        
        // Observe calendar container for changes
        $( document ).ready(function() {
            const calendarContainer = document.querySelector( '.calendar' );
            if ( calendarContainer ) {
                calendarObserver.observe( calendarContainer, {
                    childList: true,
                    subtree: true
                } );
            }
        });
    }

    $( document ).on( 'click', '.availability .close, .availability .overlay', function() {
        setTimeout(function() {
            $( '.availability' ).removeClass( 'delay' );
        }, 750 );
        $( '.availability' ).removeClass( 'active' );
    });

    const availabilityBlock = document.querySelector( '.experience .details .content .sections .section.two .blocks .block[data-block="1"]' );
    const availabilityButton = document.querySelector( '.experience .breadcrumbs .content .sections .section.two .blocks .block .buttons .button.small' );

    if ( availabilityBlock && availabilityButton ) {
        window.addEventListener( 'scroll', () => {
            const rect = availabilityBlock.getBoundingClientRect();
            const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
            if ( rect.top <= 150 && inViewport ) {
                availabilityButton.setAttribute( 'data-visibility', 'false' );
            } else {
                availabilityButton.setAttribute( 'data-visibility', 'true' );
            }
        });
    }

    function checkBagScrollbar( el ) {
        const update = () => {
            el.classList.toggle( 'scroll', el.scrollHeight > el.clientHeight + 1 );
            el.classList.toggle( 'active', el.scrollTop > 0 );
        };
        update();
        el.addEventListener( 'scroll', update, { passive: true } );
        window.addEventListener( 'resize', update );
        return () => {
            el.removeEventListener( 'scroll', update );
            window.removeEventListener( 'resize', update );
        };
    }

    const selector = '.checkout .payment .content .sections .section.two .blocks .block[data-block="1"], .bag .content .sections .section.two';
    const media = window.matchMedia( '(min-width: 750px)' );

    let cleanups = [];

    function toggleBags( e ) {
        cleanups.forEach( ( fn ) => fn() );
        cleanups = [];
        if ( e.matches ) {
            document.querySelectorAll( selector ).forEach( ( el ) => {
                cleanups.push( checkBagScrollbar( el ) );
            } );
        }
    }

    media.addEventListener( 'change', toggleBags );

    toggleBags( media );

    $( '.checkout .payment .content .sections .section.two .blocks .block .buttons .button.small' ).click(function() {
        $( '.checkout .payment .content .sections .section.two .blocks .block[data-block="1"]' ).toggleClass( 'active' );
    });

    $( document ).on( 'click', '.accordion .panels .panel .blocks .block[data-block="2ABA"]', function() {
        const $header = $( this ).closest( '.accordion .panels .panel .blocks .block[data-block="2ABA"]' );
        const $allHeaders = $( '.accordion .panels .panel .blocks .block[data-block="2ABA"]' );
        const $allPanels  = $( '.accordion .panels .panel .blocks .block[data-block="2ABB"]' );
        const $panel = $header.next( '.accordion .panels .panel .blocks .block[data-block="2ABB"]' );
        $allHeaders.not( $header ).removeClass( 'active' );
        $allPanels.not( $panel ).css( 'height', '0' );
        $header.toggleClass( 'active' );
        if ( $header.hasClass( 'active' ) ) {
            $panel.css( 'height', $panel[0].scrollHeight + 'px' );
        } else {
            $panel.css( 'height', '0' );
        }
    });

    $( '.form .fields .fieldset .blocks .block .toggle' ).click(function() {
        const $wrapper = $( this ).closest( '.blocks' );
        const $input = $wrapper.find( '.input input' );
        if ( $input.attr( 'type' ) === 'password' ) {
            $input.attr( 'type', 'text' );
        } else {
            $input.attr( 'type', 'password' );
        }
        const $icons = $( this ).find( '.icons' );
        $icons.toggleClass( 'active' );
    });

    $( '.form .fields .fieldset .blocks .block .checkbox' ).click(function() {
        const $icons = $( this ).find( '.icons' );
        $icons.toggleClass( 'active' );
    });

    $( '.checkout .payment .content .sections .section .blocks .block .form .fields .fieldset .blocks .block .blocks .block .blocks .block[data-block="2BDB"] .icons' ).click(function() {
        const $wrapper = $( this ).closest( '.blocks' );
        const $input = $wrapper.find( '.input input' );
        if ( $input.attr( 'type' ) === 'password' ) {
            $input.attr( 'type', 'text' );
        } else {
            $input.attr( 'type', 'password' );
        }
        $( this ).toggleClass( 'active' );
    });

    $( '.account .panel .content .sections .section .blocks .block .bookings .blocks .block .booking .blocks .block .blocks .block .buttons .button[data-action="1001"]' ).click(function() {
        $( '.calendar' ).addClass( 'delay' );
        setTimeout(function() {
            $( '.calendar' ).addClass( 'active' );
        }, 100 );
    });

    $( '.calendar .blocks .block .blocks .block .blocks .block .close, .calendar .overlay' ).click(function() {
        setTimeout(function() {
            $( '.calendar' ).removeClass( 'delay' );
        }, 750 );
        $( '.calendar' ).removeClass( 'active' );
    });

    if ( $( window ).width() <= 900 ) {
        $( '.account .messages .panel .content .sections .section.two .blocks .block .conversations .blocks .block .users .blocks .block .user' ).click(function() {
            $( '.account .messages .panel' ).addClass( 'delay' );
            setTimeout(function() {
                $( '.account .messages .panel' ).addClass( 'active' );
            }, 100 );
        });
    }

    if ( $( window ).width() <= 900 ) {
        $( '.account .messages .panel .content .sections .section.two .blocks .block .conversation .blocks .block .blocks .block .close, .account .messages .panel .content .sections .section.two .blocks .block .conversation .overlay' ).click(function() {
            setTimeout(function() {
                $( '.account .messages .panel' ).removeClass( 'delay' );
            }, 750 );
            $( '.account .messages .panel' ).removeClass( 'active' );
        });
    }
    // Handle experience name clicks in category experiences
    // Navigate to experience detail page
    // Location: templates/inc/layouts/category/experiences.html
    // Used in: pages/ibiza/sightseeing.js (and other category pages)
    // Note: Links are now handled by Next.js Link components, but we keep this
    // for any dynamically rendered content that might not have proper links
    $( document ).on( 'click', '.experiences .experience .blocks .block .title a, .experiences .experience .blocks .block .banner a', function( e ) {
        // Let Next.js Link handle navigation if href is set correctly
        const href = $( this ).attr( 'href' );
        if ( href && href.includes('experience?slug=') ) {
            // Link is already correct, let it navigate naturally
            return;
        }
        
        // Fallback: Get slug from data attribute or href
        const $link = $( this );
        const $experience = $link.closest( '.experience' );
        const experienceId = $experience.attr( 'data-experience-id' );
        const experienceSlug = $experience.attr( 'data-experience-slug' );
        
        // Preserve search parameters from current URL (booking.com style)
        const urlParams = new URLSearchParams(window.location.search);
        const searchParams = new URLSearchParams();
        
        // Try to get slug from data attribute first (most reliable)
        if ( experienceSlug ) {
            e.preventDefault();
            if ( typeof window !== 'undefined' ) {
                searchParams.append('slug', experienceSlug);
                // Preserve search filters if they exist
                if (urlParams.get('destination')) searchParams.append('destination', urlParams.get('destination'));
                if (urlParams.get('checkInDate')) searchParams.append('checkInDate', urlParams.get('checkInDate'));
                if (urlParams.get('checkOutDate')) searchParams.append('checkOutDate', urlParams.get('checkOutDate'));
                if (urlParams.get('adults')) searchParams.append('adults', urlParams.get('adults'));
                if (urlParams.get('children')) searchParams.append('children', urlParams.get('children'));
                window.location.href = `/ibiza/sightseeing/experience?${searchParams.toString()}`;
            }
            return;
        }
        
        // Try to get slug from href
        if ( href && href.includes('slug=') ) {
            const match = href.match(/slug=([^&]+)/);
            if ( match && match[1] ) {
                const slug = decodeURIComponent( match[1] );
                e.preventDefault();
                if ( typeof window !== 'undefined' ) {
                    searchParams.append('slug', slug);
                    // Preserve search filters if they exist
                    if (urlParams.get('destination')) searchParams.append('destination', urlParams.get('destination'));
                    if (urlParams.get('checkInDate')) searchParams.append('checkInDate', urlParams.get('checkInDate'));
                    if (urlParams.get('checkOutDate')) searchParams.append('checkOutDate', urlParams.get('checkOutDate'));
                    if (urlParams.get('adults')) searchParams.append('adults', urlParams.get('adults'));
                    if (urlParams.get('children')) searchParams.append('children', urlParams.get('children'));
                    window.location.href = `/ibiza/sightseeing/experience?${searchParams.toString()}`;
                }
                return;
            }
        }
        
        // If we have experience ID, try to get slug from experience data stored in window
        if ( experienceId && typeof window !== 'undefined' && window.__EXPERIENCES_DATA__ ) {
            const experience = window.__EXPERIENCES_DATA__.find( exp => 
                exp.id === experienceId || exp.experienceId === experienceId || exp._id === experienceId
            );
            if ( experience && experience.slug ) {
                e.preventDefault();
                searchParams.append('slug', experience.slug);
                // Preserve search filters if they exist
                if (urlParams.get('destination')) searchParams.append('destination', urlParams.get('destination'));
                if (urlParams.get('checkInDate')) searchParams.append('checkInDate', urlParams.get('checkInDate'));
                if (urlParams.get('checkOutDate')) searchParams.append('checkOutDate', urlParams.get('checkOutDate'));
                if (urlParams.get('adults')) searchParams.append('adults', urlParams.get('adults'));
                if (urlParams.get('children')) searchParams.append('children', urlParams.get('children'));
                window.location.href = `/ibiza/sightseeing/experience?${searchParams.toString()}`;
                return;
            }
        }
        
        // Last resort: If href exists and is valid, use it
        if ( href && href.startsWith( '/' ) ) {
            return; // Let it navigate naturally
        }
        
        // If no valid link, prevent default and do nothing
        e.preventDefault();
        console.warn( 'Could not determine experience slug for navigation. Experience ID:', experienceId );
    });

    // Handle category name clicks in category experiences
    // Updates URL with category name without page redirect
    // Location: templates/inc/layouts/category/experiences.html (lines 13-360)
    // Used in: pages/ibiza/sightseeing.js (and other category pages)
    // Functionality: When clicking category name (Featured, Sightseeing, etc.), updates URL with ?category=name parameter
    // TODO: Call API to filter experiences by category when category is clicked
    // Example API call:
    // fetch( '/api/experiences?category=' + categorySlug )
    //     .then( response => response.json() )
    //     .then( data => {
    //         // Handle filtered experience data
    //         // Update UI with filtered experiences
    //     } )
    //     .catch( error => {
    //         console.error( 'Error fetching category experiences:', error );
    //     } );
    $( document ).on( 'click', '.experiences .content .sections .section.one .blocks .block .links .one ul li a.action', function( e ) {
        // Handle Featured link to show all experiences
        if ( $( this ).attr( 'data-featured-link' ) === 'true' ) {
            e.preventDefault();
            e.stopPropagation();
            
            // Update active state
            $( '.experiences .content .sections .section.one .blocks .block .links .one ul li' ).removeClass( 'active' );
            $( this ).closest( 'li' ).addClass( 'active' );
            
            // Update URL without page reload
            if ( typeof window !== 'undefined' && window.history && window.history.pushState ) {
                const currentPath = window.location.pathname;
                const params = new URLSearchParams();
                const newUrl = currentPath + ( params.toString() ? '?' + params.toString() : '' );
                window.history.pushState( { category: 'featured' }, '', newUrl );
            }
            
            // Render all experiences from window.__API_EXPERIENCES__
            if ( window.__API_EXPERIENCES__ && Array.isArray( window.__API_EXPERIENCES__ ) ) {
                const mappedExperiences = window.__API_EXPERIENCES__.map( experience => {
                    const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                    return {
                        id: experience.id,
                        slug: experience.slug,
                        title: experience.title,
                        duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                        rating: experience.rating || '0',
                        price: experience.price || '0',
                        image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                               '/assets/images/experiences/experience-1a.jpg',
                        featured: experience.featured || false,
                        new: experience.isNew || false,
                        inWishlist: false
                    };
                } );
                
                // This will also update the count automatically
                renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                    console.error( 'Error rendering featured experiences:', error );
                } );
            }
            return false;
        }
        e.preventDefault();
        e.stopPropagation();
        const $link = $( this );
        const $categoryTitle = $link.find( '.blocks .block .title h4' );
        
        // Get category name from title
        if ( $categoryTitle.length > 0 ) {
            const categoryName = $categoryTitle.text().trim();
            
            // Convert to URL-friendly slug
            const categorySlug = categoryName
                .toLowerCase()
                .replace( /[^a-z0-9]+/g, '-' )
                .replace( /^-+|-+$/g, '' );
            
            // Update active state
            $( '.experiences .content .sections .section.one .blocks .block .links .one ul li' ).removeClass( 'active' );
            $link.closest( 'li' ).addClass( 'active' );
            
            // Update URL without page reload
            if ( typeof window !== 'undefined' && window.history && window.history.pushState ) {
                const currentPath = window.location.pathname;
                const currentSearch = window.location.search;
                const params = new URLSearchParams( currentSearch );
                params.set( 'category', categorySlug );
                // Remove experience param when category changes
                params.delete( 'experience' );
                const newUrl = currentPath + '?' + params.toString();
                window.history.pushState( { category: categoryName }, '', newUrl );
            }
            
            // ✅ REST API CALL: Fetch experiences for this category
            fetchRESTExperiences( categorySlug, null, 10 )
                .then( data => {
                    // Handle REST API response
                    // data.experiences.data is an array of experience objects
                    if ( data && data.experiences && data.experiences.data && Array.isArray( data.experiences.data ) ) {
                        // Map REST API response to render format
                        const mappedExperiences = data.experiences.data.map( experience => {
                            const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                            return {
                                id: experience.id,
                                slug: experience.slug,
                                title: experience.title,
                                duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                                rating: experience.rating || '0',
                                price: experience.price || '0',
                                image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                                       '/assets/images/experiences/experience-1a.jpg',
                                featured: experience.featured || false,
                                new: experience.isNew || false,
                                inWishlist: false // Will be updated if user is authenticated
                            };
                        } );
                        
                        // Call render function to update UI with filtered experiences
                        // This will also update the count automatically
                        renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                            console.error( 'Error rendering experiences:', error );
                        } );
                        
                        // Store pagination info for future use
                        window.experiencesPagination = {
                            hasMore: data.experiences.hasMore || false,
                            nextCursor: data.experiences.nextCursor || null,
                            category: categorySlug
                        };
                    }
                } )
                .catch( error => {
                    console.error( 'Error fetching category experiences:', error );
                    // Optionally show error message to user
                } );
        }
    });
    
    // REST API Function
    // Fetches experiences using REST API
    // GET /api/experiences?category=xxx&limit=xxx&cursor=xxx
    function fetchRESTExperiences( category, cursor, limit ) {
        // ✅ Get API URL - try multiple sources
        let apiUrl = '';
        
        if ( typeof window !== 'undefined' ) {
            // Method 1: Check if API URL is set in window (injected by Next.js build)
            apiUrl = window.__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL || 
                     window.NEXT_PUBLIC_API_URL || 
                     '';
            
            // Method 2: If still empty, try to get from meta tag or script tag
            if ( !apiUrl ) {
                const apiUrlMeta = document.querySelector( 'meta[name="api-url"]' );
                if ( apiUrlMeta ) {
                    apiUrl = apiUrlMeta.getAttribute( 'content' );
                }
            }
            
            // Method 3: Default fallback
            if ( !apiUrl ) {
                apiUrl = 'http://localhost:4000';
                console.warn( 'NEXT_PUBLIC_API_URL not found. Using default:', apiUrl );
            }
        }
        
        // Build query parameters
        const params = new URLSearchParams();
        if ( category ) params.append( 'category', category );
        if ( cursor ) params.append( 'cursor', cursor );
        if ( limit ) params.append( 'limit', limit );
        
        const restEndpoint = `${apiUrl}/api/experiences${params.toString() ? '?' + params.toString() : ''}`;
        console.log( 'REST API Endpoint:', restEndpoint );
    
        return fetch( restEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors' // Explicitly enable CORS
        } )
        .then( response => {
            console.log('REST API Response Status:', response.status);
            if ( !response.ok ) {
                return response.text().then(text => {
                    console.error('API Error Response:', text);
                    throw new Error( `API request failed: ${response.status} ${response.statusText}` );
                });
            }
            return response.json();
        } )
        .then( data => {
            console.log('REST API Result:', data);
            return data;
        } )
        .catch( error => {
            console.error('REST API Fetch Error:', error);
            console.error('Attempted URL:', restEndpoint);
            console.error('API URL:', apiUrl);
            // Provide more helpful error message
            if ( error.message.includes('Failed to fetch') || error.message.includes('NetworkError') ) {
                throw new Error( `Cannot connect to API server at ${apiUrl}. Please ensure the backend is running on port 4000.` );
            }
            throw error;
        } );
    }
    
    // Function to get wishlist IDs from window or fetch
    async function getWishlistIds() {
        // Check if wishlist is already available in window
        if ( typeof window !== 'undefined' && window.__API_WISHLIST__ ) {
            const wishlist = window.__API_WISHLIST__ || [];
            return wishlist.map( item => item.experience?.id || item.experienceId || item.id ).filter( Boolean );
        }
        
        // Try to fetch wishlist if user is authenticated
        try {
            let token = typeof localStorage !== 'undefined' ? localStorage.getItem( 'token' ) : null;
            if ( !token ) {
                // Check cookies
                const cookies = document.cookie.split( ';' );
                const tokenCookie = cookies.find( cookie => cookie.trim().startsWith( 'token=' ) );
                if ( tokenCookie ) {
                    token = tokenCookie.split( '=' )[1];
                }
            }
            
            if ( token ) {
                let apiUrl = document.querySelector( 'meta[name="api-url"]' )?.getAttribute( 'content' ) ||
                             window.__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL ||
                             window.NEXT_PUBLIC_API_URL ||
                             'http://localhost:4000';
                
                const response = await fetch( `${apiUrl}/api/wishlist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                } );
                
                if ( response.ok ) {
                    const data = await response.json();
                    const wishlist = data.wishlist || [];
                    return wishlist.map( item => item.experience?.id || item.experienceId || item.id ).filter( Boolean );
                }
            }
        } catch ( error ) {
            console.error( 'Error fetching wishlist:', error );
        }
        
        return [];
    }
    
    // Function to render experiences from API data
    // This function dynamically creates HTML for experiences and inserts them into the DOM
    // Input format (mapped from GraphQL):
    // {
    //   id: 1,
    //   title: "Experience Title",
    //   duration: "4 Hours",
    //   rating: 4.7,
    //   price: 125,
    //   image: "/assets/images/experiences/experience-1a.jpg",
    //   featured: true,
    //   new: false
    // }
    // Function to update the "Showing X of Y" count text
    function updateExperiencesCount( currentCount, totalCount ) {
        const $countText = $( '.experiences .content .sections .section.two .blocks .block .text p.small.five' );
        if ( $countText.length > 0 ) {
            const total = totalCount !== null && totalCount !== undefined ? totalCount : ( window.__API_TOTAL_COUNT__ || currentCount );
            $countText.text( `Showing ${currentCount} of ${total} experiences.` );
        }
    }
    
    async function renderExperiencesFromAPI( experiences ) {
        const $experiencesContainer = $( '.experiences .content .sections .section.three .container .content .blocks .block .experiences' );
        
        if ( !$experiencesContainer.length ) {
            // Container not found - this is normal on pages that don't have this structure (e.g., experience detail page)
            return;
        }
        
        // Clear existing experiences
        $experiencesContainer.find( '.blocks .block' ).remove();
        
        // Handle empty state
        if ( !experiences || experiences.length === 0 ) {
            $experiencesContainer.html( '<div class="blocks" data-blocks="3"></div>' );
            updateExperiencesCount( 0, window.__API_TOTAL_COUNT__ || 0 );
            return;
        }
        
        // Get wishlist IDs to check which experiences are in wishlist
        const wishlistIds = await getWishlistIds();
        
        // Build HTML for each experience
        let experiencesHTML = '<div class="blocks" data-blocks="3">';
        
        experiences.forEach( ( experience, index ) => {
            const blockNumber = index + 1;
            // Use experience slug or ID for URL
            const slug = experience.slug || experience.id || experience.experienceId || 'experience';
            
            // Preserve search parameters from current URL (booking.com style)
            const urlParams = new URLSearchParams(window.location.search);
            const searchParams = new URLSearchParams();
            searchParams.append('slug', slug);
            
            // Preserve search filters if they exist
            if (urlParams.get('destination')) searchParams.append('destination', urlParams.get('destination'));
            if (urlParams.get('checkInDate')) searchParams.append('checkInDate', urlParams.get('checkInDate'));
            if (urlParams.get('checkOutDate')) searchParams.append('checkOutDate', urlParams.get('checkOutDate'));
            if (urlParams.get('adults')) searchParams.append('adults', urlParams.get('adults'));
            if (urlParams.get('children')) searchParams.append('children', urlParams.get('children'));
            
            // Generate URL using experience slug with search params
            const experienceUrl = `/ibiza/sightseeing/experience?${searchParams.toString()}`;
            
            // Get experience ID - check multiple possible fields
            const experienceId = experience.id || experience.experienceId || experience._id || null;
            
            // Skip experiences without valid IDs
            if ( !experienceId ) {
                console.warn( 'Skipping experience without ID:', experience );
                return; // Skip this experience
            }
            
            // Check if experience is in wishlist
            const isInWishlist = experience.inWishlist || wishlistIds.includes( experienceId ) || wishlistIds.includes( String( experienceId ) );
            
            const experienceHTML = `
                <div class="block" data-block="${blockNumber}A">
                    <div class="experience" data-experience-id="${experienceId}" data-experience-slug="${slug}">
                        <div class="blocks" data-blocks="3">
                            <div class="block" data-block="1AA">
                                <div class="banner">
                                    <div class="blocks" data-blocks="4">
                                        <div class="block" data-block="1AAA">
                                            <div class="icons ${isInWishlist ? 'active' : ''}" data-experience-id="${experienceId}">
                                                <div class="icon one">
                                                    <i class="icons8 icons8-heart"></i>
                                                </div>
                                                <div class="icon two">
                                                    <i class="icons8 icons8-heart-2"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="block" data-block="1AAB">
                                            <a href="${experienceUrl}">
                                                <div class="images">
                                                    <div class="image" style="background-image: url('${experience.image || '/assets/images/experiences/experience-1a.jpg'}')"></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="block" data-block="1AB">
                                <a href="${experienceUrl}">
                                    <div class="title">
                                        <h3 class="three">${experience.title || experience.name || 'Experience'}</h3>
                                    </div>
                                </a>
                            </div>
                            <div class="block" data-block="1AC">
                                <div class="blocks" data-blocks="5">
                                    <div class="block" data-block="1ACA">
                                        <div class="duration">
                                            <div class="text">${experience.duration || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div class="block" data-block="1ACB">
                                        <div class="rating">
                                            <div class="icon">
                                                <i class="icons8 icons8-star-2"></i>
                                            </div>
                                            <div class="text">${experience.rating || '0'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="block" data-block="1AD">
                                <div class="blocks" data-blocks="6">
                                    <div class="block" data-block="1ADA">
                                        <div class="price">
                                            <div class="text">From €${experience.price || '0'}</div>
                                        </div>
                                    </div>
                                    ${((experience.featured === true) || (experience.new === true)) ? `
                                    <div class="block" data-block="1ADB">
                                        <div class="labels">
                                            ${experience.featured ? '<div class="label">Featured</div>' : ''}
                                            ${experience.new ? '<div class="label">New</div>' : ''}
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            experiencesHTML += experienceHTML;
        } );
        
        experiencesHTML += '</div>';
        
        // Insert HTML
        $experiencesContainer.html( experiencesHTML );
        
        // Update the count text
        updateExperiencesCount( experiences.length, window.__API_TOTAL_COUNT__ || experiences.length );
        
        // Re-initialize any event handlers or plugins if needed
        // For example, if you have Swiper sliders or other interactive elements
    }
    
    // Initial load: Fetch experiences on page load if category page and no category in URL
    $( document ).ready(function() {
        // Check if we're on a category page (has .category class or experiences section)
        // BUT exclude wishlist page (wishlist page has its own React component that handles data)
        const isWishlistPage = $( 'body' ).hasClass( 'wishlist' );
        const isHomePage = $( 'body' ).hasClass( 'home' );
        const isCategoryPage = !isWishlistPage && ( $( 'body' ).hasClass( 'category' ) || $( '.experiences' ).length > 0 );
        
        // If on home page and window.__API_EXPERIENCES__ exists, render from that
        if ( isHomePage && window.__API_EXPERIENCES__ && Array.isArray( window.__API_EXPERIENCES__ ) ) {
            const mappedExperiences = window.__API_EXPERIENCES__.map( experience => {
                const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                return {
                    id: experience.id,
                    slug: experience.slug,
                    title: experience.title,
                    duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                    rating: experience.rating || '0',
                    price: experience.price || '0',
                    image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                           '/assets/images/experiences/experience-1a.jpg',
                    featured: experience.featured || false,
                    new: experience.isNew || false,
                    inWishlist: false // Will be updated if user is authenticated
                };
            } );
            
            // Call render function to update UI with experiences
            // This will also update the count automatically
            renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                console.error( 'Error rendering experiences from window.__API_EXPERIENCES__:', error );
            } );
        } else if ( isCategoryPage ) {
            // Get category from URL params
            const urlParams = new URLSearchParams( window.location.search );
            const categoryFromUrl = urlParams.get( 'category' );
            
            // If no category in URL, fetch all experiences (or default category)
            if ( !categoryFromUrl ) {
                // Fetch experiences without category filter (or with default)
                fetchRESTExperiences( null, null, 5 )
                    .then( data => {
                        // Handle REST API response
                        if ( data && data.experiences && data.experiences.data && Array.isArray( data.experiences.data ) ) {
                            // Map REST API response to render format
                            const mappedExperiences = data.experiences.data.map( experience => {
                                const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                                return {
                                    id: experience.id,
                                    slug: experience.slug,
                                    title: experience.title,
                                    duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                                    rating: experience.rating || '0',
                                    price: experience.price || '0',
                                    image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                                           '/assets/images/experiences/experience-1a.jpg',
                                    featured: experience.featured || false,
                                    new: experience.isNew || false,
                                    inWishlist: false // Will be updated if user is authenticated
                                };
                            } );
                            
                            // Call render function to update UI with experiences
                            renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                                console.error( 'Error rendering experiences:', error );
                            } );
                            
                            // Store pagination info
                            window.experiencesPagination = {
                                hasMore: data.experiences.hasMore || false,
                                nextCursor: data.experiences.nextCursor || null,
                                category: null
                            };
                        }
                    } )
                    .catch( error => {
                        console.error( 'Error fetching initial experiences:', error );
                        // Silently fail on initial load - static content will still show
                    } );
            } else {
                // Category is in URL, fetch for that category
                fetchRESTExperiences( categoryFromUrl, null, 10 )
                    .then( data => {
                        if ( data && data.experiences && data.experiences.data && Array.isArray( data.experiences.data ) ) {
                            const mappedExperiences = data.experiences.data.map( experience => {
                                const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                                return {
                                    id: experience.id,
                                    slug: experience.slug,
                                    title: experience.title,
                                    duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                                    rating: experience.rating || '0',
                                    price: experience.price || '0',
                                    image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                                           '/assets/images/experiences/experience-1a.jpg',
                                    featured: experience.featured || false,
                                    new: experience.isNew || false,
                                    inWishlist: false // Will be updated if user is authenticated
                                };
                            } );
                            
                            renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                                console.error( 'Error rendering experiences:', error );
                            } );
                            
                            window.experiencesPagination = {
                                hasMore: data.experiences.hasMore || false,
                                nextCursor: data.experiences.nextCursor || null,
                                category: categoryFromUrl
                            };
                        }
                    } )
                    .catch( error => {
                        console.error( 'Error fetching category experiences on load:', error );
                    } );
            }
        }
    });

    // Handle wishlist icon click in header - navigate to wishlist page
    $( document ).on( 'click', 'header .content .sections .section.three .blocks .block .icons .icon.five a.action', function( e ) {
        e.preventDefault();
        if ( typeof window !== 'undefined' ) {
            window.location.href = '/wishlist';
        }
    });

    // ============================================
    // MENU DRAWER FUNCTIONALITY
    // ============================================
    
    // Menu toggle trigger - use delegated event handler that works on all pages
    $(document).on('click', 'header .content .sections .section.three .blocks .block .icons .icon[data-icon="1"], header .content .sections .section.three .blocks .block .icons .icon.one', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $icon = $(this);
        var $menu = $('.menu[data-menu="3"]');
        if ($menu.length === 0) {
            console.warn('Menu element not found');
            return;
        }
        var timers = $menu.data('timers') || [];
        while (timers.length) {
            clearTimeout(timers.pop());
        }
        $menu.off('transitionend.menuClose webkitTransitionEnd.menuClose');
        var action = $menu.attr('data-action') || '0';
        if (action !== '0' && action !== '') {
            closeMenuOne();
        } else {
            // Open menu
            if (document.body) {
                document.body.style.overflow = 'hidden';
            }
            $icon.attr('data-action', '1');
            $menu.attr('data-action', '1');
            timers.push(setTimeout(function() {
                $menu.attr('data-action', '2');
            }, 100));
            timers.push(setTimeout(function() {
                $menu.attr('data-action', '3');
            }, 600));
        }
        $menu.data('timers', timers);
    });

    // Close menu on close button or overlay click
    $(document).on('click', '.menu .sections .section.one .blocks .block .close, .menu .overlay', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuTwo();
        // Also restore body overflow
        if (document.body) {
            document.body.style.overflow = '';
        }
    });

    // Handle navigation link clicks
    $(document).on('click', '.menu .content .sections .section.two .blocks .block .slider .slides .slide .blocks .block .links ul li .blocks .block ul li a', function() {
        var linkAction = $(this).attr('data-action');
        if (linkAction !== '2') {
            return;
        }
        if (window.innerWidth >= 900) {
            closeMenuTwo();
        } else {
            closeMenuOne();
        }
    });

    function closeMenuOne() {
        var $icon = $('[data-icon="1"]');
        var $menu = $('.menu[data-menu="3"]');
        var timers = $menu.data('timers') || [];
        while (timers.length) {
            clearTimeout(timers.pop());
        }
        $menu.off('transitionend.menuClose webkitTransitionEnd.menuClose');
        var action = $menu.attr('data-action') || '0';
        if (action === '0') {
            $menu.data('timers', timers);
            return;
        }
        $icon.attr('data-action', '0');
        $menu.attr('data-action', '2');
        timers.push(setTimeout(function() {
            $menu.attr('data-action', '1');
        }, 100));
        var finishClose = function() {
            $menu.attr('data-action', '0');
            $icon.attr('data-action', '0');
            timers.push(setTimeout(function() {
                $menu.removeAttr('data-action');
                $icon.removeAttr('data-action');
                // Restore body overflow
                if (document.body) {
                    document.body.style.overflow = '';
                }
            }, 200));
            $menu.data('timers', timers);
        };
        var fallback = setTimeout(function() {
            finishClose();
        }, 650);
        timers.push(fallback);
        $menu.one('transitionend.menuClose webkitTransitionEnd.menuClose', function(e) {
            if (e.originalEvent && e.originalEvent.propertyName !== 'height') {
                return;
            }
            clearTimeout(fallback);
            finishClose();
        });
        $menu.data('timers', timers);
    }

    function closeMenuTwo() {
        var $icon = $('[data-icon="1"]');
        var $menu = $('.menu[data-menu="3"]');
        var timers = $menu.data('timers') || [];
        while (timers.length) {
            clearTimeout(timers.pop());
        }
        $menu.off('transitionend.menuClose webkitTransitionEnd.menuClose');
        var action = $menu.attr('data-action') || '0';
        if (action === '0') {
            $menu.data('timers', timers);
            return;
        }
        $icon.attr('data-action', '0');
        $menu.attr('data-action', '4');
        var finishClose = function() {
            $menu.attr('data-action', '0');
            $icon.attr('data-action', '0');
            timers.push(setTimeout(function() {
                $menu.removeAttr('data-action');
                $icon.removeAttr('data-action');
                // Restore body overflow
                if (document.body) {
                    document.body.style.overflow = '';
                }
            }, 200));
            $menu.data('timers', timers);
        };
        var fallback = setTimeout(function() {
            finishClose();
        }, 650);
        timers.push(fallback);
        $menu.one('transitionend.menuClose webkitTransitionEnd.menuClose', function(e) {
            if (e.originalEvent && e.originalEvent.propertyName !== 'height') {
                return;
            }
            clearTimeout(fallback);
            finishClose();
        });
        $menu.data('timers', timers);
    }

    // Initialize Swiper for menu slider
    const menuSliderElement = document.querySelector('.menu .slider');
    if (menuSliderElement && !menuSliderElement.swiper) {
        const swiperMenu = new Swiper('.menu .slider', {
            containerModifierClass: 'slide-',
            slideActiveClass: 'active',
            slideBlankClass: 'blank',
            slideClass: 'slide',
            slideNextClass: 'next',
            slidePrevClass: 'previous',
            slideVisibleClass: 'visible',
            wrapperClass: 'slides',
            autoHeight: true,
            slidesPerGroup: 1,
            spaceBetween: 0,
            loop: false,
            speed: 750,
            allowTouchMove: false,
            navigation: {
                disabledClass: 'disabled',
                nextEl: '.menu .content .slider .slides .slide .links ul li a[data-action="1"]',
                prevEl: '.menu .content .slider .slides .slide .close',
            }
        });
    }

    // Handle logout from account navigation (for bookings, messages pages using HTML template)
    $( document ).on( 'click', '.account .navigation .list ul li[data-link="logout"] a.action', function( e ) {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear token from localStorage
        if ( typeof localStorage !== 'undefined' ) {
            localStorage.removeItem( 'token' );
        }
        
        // Clear token cookie
        document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        
        // Redirect to login page
        setTimeout( function() {
            if ( typeof window !== 'undefined' && window.location ) {
                window.location.href = '/account/log-in';
            }
        }, 100 );
    } );

    // Handle authentication-required links in footer (and anywhere else)
    $( document ).on( 'click', 'a.auth-required', function( e ) {
        // Check if user is authenticated - check both localStorage and cookies
        let token = typeof localStorage !== 'undefined' ? localStorage.getItem( 'token' ) : null;
        
        // If not in localStorage, check cookies
        if ( !token && typeof document !== 'undefined' ) {
            const cookies = document.cookie.split( ';' );
            const tokenCookie = cookies.find( cookie => cookie.trim().startsWith( 'token=' ) );
            if ( tokenCookie ) {
                token = tokenCookie.split( '=' )[1];
            }
        }
        
        // If no token, redirect to login page
        if ( !token || token.trim() === '' ) {
            e.preventDefault();
            e.stopPropagation();
            
            // Store the intended destination in sessionStorage for redirect after login
            const href = $( this ).attr( 'href' );
            if ( href && href !== '#' && href !== '/account/log-in' ) {
                sessionStorage.setItem( 'redirectAfterLogin', href );
            }
            
            // Redirect to login page
            if ( typeof window !== 'undefined' && window.location ) {
                window.location.href = '/account/log-in';
            }
            return false;
        }
        
        // If token exists, allow normal navigation
        return true;
    } );

    // ============================================
    // Filters Modal Functionality
    // ============================================
    
    // Store selected filters globally
    window.selectedFilters = window.selectedFilters || [];

    // Open Filters Modal (from any Filters button)
    $( document ).on( 'click', '[data-action="filters"], .experiences .two a.action', function( e ) {
        e.preventDefault();
        e.stopPropagation();

        $( 'body' ).addClass( 'active' );
        const $modal = $( '.filters' );
        if ( !$modal.length ) return;

        // Hide the currently active category from filters
        const $activeCategory = $( '.experiences .content .sections .section.one .blocks .block .links ul li.active' );
        if ( $activeCategory.length > 0 ) {
            const $categoryTitle = $activeCategory.find( '.title h4' );
            if ( $categoryTitle.length > 0 ) {
                const activeCategoryName = $categoryTitle.text().trim();
                
                // Map category names to filter labels (handle variations)
                const categoryMap = {
                    'featured': 'Featured',
                    'sightseeing': 'Sightseeing',
                    'wellness': 'Wellness',
                    'art & culture': 'Art & Culture',
                    'art-culture': 'Art & Culture',
                    'entertainment': 'Entertainment',
                    'food & drink': 'Food & Drink',
                    'food-drink': 'Food & Drink',
                    'sports': 'Sports',
                    'sport': 'Sports'
                };
                
                const categoryLower = activeCategoryName.toLowerCase();
                const filterLabel = categoryMap[categoryLower] || activeCategoryName;
                
                // Hide the matching filter item in "Filter By Type" section (first taxonomy)
                $( '.filters .taxonomies .block:first .taxonomy ul li' ).each( function() {
                    const $li = $( this );
                    const label = $li.attr( 'aria-label' );
                    if ( label && ( label.toLowerCase() === filterLabel.toLowerCase() || label.toLowerCase() === categoryLower ) ) {
                        $li.hide();
                    }
                } );
            }
        }

        // Initialize selected filters list with any pre-selected languages (with active class)
        // Always ensure English is selected and in the list
        const englishLabel = 'English';
        if ( window.selectedFilters.indexOf( englishLabel ) === -1 ) {
            window.selectedFilters.push( englishLabel );
        }
        addSelectedFilter( englishLabel );
        
        // Also add any other pre-selected languages
        $( '.filters .taxonomy ul li.active' ).each( function() {
            const $li = $( this );
            const label = $li.attr( 'aria-label' );
            if ( label && label !== englishLabel && window.selectedFilters.indexOf( label ) === -1 ) {
                window.selectedFilters.push( label );
                addSelectedFilter( label );
            }
        } );
        
        // Ensure English language filter is always active
        $( '.filters .taxonomy ul li[aria-label="' + englishLabel + '"]' ).addClass( 'active' );

        // Sliding behaviour similar to bag
        $modal.addClass( 'delay' );
        setTimeout( function() {
            $modal.addClass( 'active' );
        }, 100 );
    } );

    // Close Filters Modal
    $( document ).on( 'click', '.filters .overlay, .filters .close', function() {
        $( 'body' ).removeClass( 'active' );
        let $modal = $( this ).closest( '.filters' );
        if ( !$modal.length ) {
            $modal = $( '.filters' );
        }

        // Show all filter items again when closing
        $( '.filters .taxonomy ul li' ).show();

        // Sliding behaviour similar to bag
        $modal.removeClass( 'active' );
        setTimeout( function() {
            $modal.removeClass( 'delay' );
        }, 750 );
    } );

    // Toggle Filter Selection (handles all filters including languages)
    $( document ).on( 'click', '.filters .taxonomy ul li', function() {
        const $li = $( this );
        const label = $li.attr( 'aria-label' );
        const englishLabel = 'English';
        
        // Prevent removing English from selection
        if ( label === englishLabel && $li.hasClass( 'active' ) ) {
            return; // Don't allow deselecting English
        }
        
        if ( !$li.hasClass( 'active' ) ) {
            // Add filter
            $li.addClass( 'active' );
            if ( window.selectedFilters.indexOf( label ) === -1 ) {
                window.selectedFilters.push( label );
                addSelectedFilter( label );
            }
        } else {
            // Remove filter (but not English)
            $li.removeClass( 'active' );
            const index = window.selectedFilters.indexOf( label );
            if ( index > -1 ) {
                window.selectedFilters.splice( index, 1 );
                removeSelectedFilter( label );
            }
        }
    } );

    // Add Selected Filter to Terms List
    function addSelectedFilter( label ) {
        // Use the correct selector for the selected filters list
        const $list = $( '.filters .content .sections .section.two .blocks .block[data-block="1B"] .blocks .block[data-block="1BA"] .terms .blocks .block[data-block="1BAA"] .list ul' );
        if ( $list.length === 0 ) return;
        
        // Check if already exists to avoid duplicates
        let exists = false;
        $list.find( 'li' ).each( function() {
            if ( $( this ).find( '.text' ).text() === label ) {
                exists = true;
                return false;
            }
        } );
        if ( exists ) return;
        
        const englishLabel = 'English';
        const isEnglish = label === englishLabel;
        
        const $blocks = $( '<div>' ).addClass( 'blocks' ).attr( 'data-blocks', '4' )
            .append(
                $( '<div>' ).addClass( 'block' ).attr( 'data-block', '1BAAA' )
                    .append( $( '<div>' ).addClass( 'text' ).text( label ) )
            );
        
        // Only add cross button if not English
        if ( !isEnglish ) {
            $blocks.append(
                $( '<div>' ).addClass( 'block' ).attr( 'data-block', '1BAAB' )
                    .append(
                        $( '<div>' ).addClass( 'icon' )
                            .html( '<i class="icons8 icons8-close"></i>' )
                            .data( 'filter-label', label )
                    )
            );
        }
        
        const $li = $( '<li>' ).append( $blocks );
        $list.append( $li );
    }

    // Remove Selected Filter from Terms List
    function removeSelectedFilter( label ) {
        const englishLabel = 'English';
        
        // Prevent removing English
        if ( label === englishLabel ) {
            return;
        }
        
        const $list = $( '.filters .content .sections .section.two .blocks .block[data-block="1B"] .blocks .block[data-block="1BA"] .terms .blocks .block[data-block="1BAA"] .list ul' );
        $list.find( 'li' ).each( function() {
            if ( $( this ).find( '.text' ).text() === label ) {
                $( this ).remove();
            }
        } );
        
        // Also remove active class from taxonomy item
        $( '.filters .taxonomy ul li[aria-label="' + label + '"]' ).removeClass( 'active' );
    }

    // Remove Filter from Terms List
    $( document ).on( 'click', '.filters .content .sections .section.two .blocks .block[data-block="1B"] .blocks .block[data-block="1BA"] .terms .blocks .block[data-block="1BAA"] .list ul li .icon', function( e ) {
        e.stopPropagation();
        const label = $( this ).data( 'filter-label' ) || $( this ).closest( 'li' ).find( '.text' ).text();
        const englishLabel = 'English';
        
        // Prevent removing English
        if ( label === englishLabel ) {
            return;
        }
        
        removeSelectedFilter( label );
        const index = window.selectedFilters.indexOf( label );
        if ( index > -1 ) {
            window.selectedFilters.splice( index, 1 );
        }
        
        // Also remove active class from taxonomy item
        $( '.filters .taxonomy ul li[aria-label="' + label + '"]' ).removeClass( 'active' );
    } );

    // Reset All Filters (but keep English)
    $( document ).on( 'click', '.filters .button.text[data-button="3A"]', function() {
        const englishLabel = 'English';
        window.selectedFilters = [ englishLabel ];
        const $list = $( '.filters .content .sections .section.two .blocks .block[data-block="1B"] .blocks .block[data-block="1BA"] .terms .blocks .block[data-block="1BAA"] .list ul' );
        $list.empty();
        // Re-add English
        addSelectedFilter( englishLabel );
        // Remove active class from all except English
        $( '.filters .taxonomy ul li' ).removeClass( 'active' );
        $( '.filters .taxonomy ul li[aria-label="' + englishLabel + '"]' ).addClass( 'active' );
    } );

    // Show Results Button - Apply Filters
    $( document ).on( 'click', '.filters .button.medium[data-button="1A"]', function() {
        console.log( 'Selected Filters:', window.selectedFilters );
        
        // Close modal
        $( 'body' ).removeClass( 'active' );
        $( '.filters' ).removeClass( 'active' );
        setTimeout( function() {
            $( '.filters' ).removeClass( 'delay' );
        }, 750 );
        
        // Apply filters to experiences
        applyFiltersToExperiences( window.selectedFilters );
    } );

    // Function to apply filters to experiences
    function applyFiltersToExperiences( filters ) {
        if ( !window.__API_EXPERIENCES__ || !Array.isArray( window.__API_EXPERIENCES__ ) ) {
            console.warn( 'No experiences data available for filtering' );
            return;
        }

        // If no filters selected, show all experiences
        if ( !filters || filters.length === 0 ) {
            const mappedExperiences = window.__API_EXPERIENCES__.map( experience => {
                const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                return {
                    id: experience.id,
                    slug: experience.slug,
                    title: experience.title,
                    duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                    rating: experience.rating || '0',
                    price: experience.price || '0',
                    image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                           '/assets/images/experiences/experience-1a.jpg',
                    featured: experience.featured || false,
                    new: experience.isNew || false,
                    inWishlist: false
                };
            } );
            renderExperiencesFromAPI( mappedExperiences ).catch( error => {
                console.error( 'Error rendering all experiences:', error );
            } );
            return;
        }

        let filteredExperiences = [...window.__API_EXPERIENCES__];

        // Filter by category/type
        const categoryFilters = filters.filter( filter => 
            ['Featured', 'Sightseeing', 'Wellness', 'Art & Culture', 'Entertainment', 'Food & Drink', 'Sports'].includes( filter )
        );

        if ( categoryFilters.length > 0 ) {
            filteredExperiences = filteredExperiences.filter( experience => {
                // Check if experience matches any selected category
                const categoryName = experience.category?.name || '';
                const categorySlug = experience.category?.slug || '';
                
                return categoryFilters.some( filter => {
                    const filterLower = filter.toLowerCase();
                    // Map filter names to category slugs/names
                    const categoryMap = {
                        'featured': 'featured',
                        'sightseeing': 'sightseeing',
                        'wellness': 'wellness',
                        'art & culture': 'art-culture',
                        'entertainment': 'entertainment',
                        'food & drink': 'food-drink',
                        'sports': 'sports'
                    };
                    
                    const mappedSlug = categoryMap[filterLower] || filterLower.replace( /\s+/g, '-' ).toLowerCase();
                    
                    // Check if experience is featured
                    if ( filterLower === 'featured' && ( experience.featured === true || experience.isFeatured === true ) ) {
                        return true;
                    }
                    
                    // Check category match
                    return categorySlug.toLowerCase() === mappedSlug || 
                           categoryName.toLowerCase() === filterLower ||
                           categoryName.toLowerCase().replace( /\s+/g, '-' ) === mappedSlug;
                } );
            } );
        }

        // Filter by time (if implemented in experience data)
        const timeFilters = filters.filter( filter => 
            ['Morning', 'Afternoon', 'Evening'].includes( filter )
        );

        if ( timeFilters.length > 0 ) {
            // This would need to check availability slots or time fields in experiences
            // For now, we'll skip time filtering if not available in data structure
        }

        // Filter by language (if implemented in experience data)
        const languageFilters = filters.filter( filter => 
            ['English', 'Spanish', 'German', 'French', 'Italian', 'Portuguese'].includes( filter )
        );

        if ( languageFilters.length > 0 ) {
            // This would need to check language fields in experiences
            // For now, we'll skip language filtering if not available in data structure
        }

        // Map filtered experiences to render format
        const mappedExperiences = filteredExperiences.map( experience => {
            const primaryImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
            return {
                id: experience.id,
                slug: experience.slug,
                title: experience.title,
                duration: experience.duration || (experience.hours ? `${experience.hours} Hours` : 'N/A'),
                rating: experience.rating || '0',
                price: experience.price || '0',
                image: primaryImage?.medium || primaryImage?.large || primaryImage?.original || 
                       '/assets/images/experiences/experience-1a.jpg',
                featured: experience.featured || false,
                new: experience.isNew || false,
                inWishlist: false
            };
        } );

        // Re-render filtered experiences
        renderExperiencesFromAPI( mappedExperiences ).catch( error => {
            console.error( 'Error rendering filtered experiences:', error );
        } );
    }

