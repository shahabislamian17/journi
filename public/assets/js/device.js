    (function() {

        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const html = document.documentElement;

        if ( /windows phone/i.test(ua) ) {
            html.classList.add( 'windows' );
        } else if ( /win/i.test(ua) ) {
            html.classList.add( 'windows' );
        } else if ( /android/i.test(ua) ) {
            html.classList.add( 'android', 'mobile' );
        } else if ( /iPad|iPhone|iPod/.test(ua) && !window.MSStream ) {
            html.classList.add( 'ios', 'mobile' );
        } else if ( /Macintosh|MacIntel|MacPPC|Mac68K/.test(ua) ) {
            html.classList.add( 'mac' );
        }

        if ( /chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua) ) {
            html.classList.add( 'chrome' );
        } else if ( /firefox|fxios/i.test(ua) ) {
            html.classList.add( 'firefox' );
        } else if ( /safari/i.test(ua) && !/chrome|crios|android/i.test(ua) ) {
            html.classList.add( 'safari' );
        } else if ( /edg/i.test(ua) ) {
            html.classList.add( 'edge' );
        } else if ( /opr|opera/i.test(ua) ) {
            html.classList.add( 'opera' );
        }

        // Define Util object for Vue components
        window.Util = {
            isMobile: function() {
                return document.documentElement.classList.contains( 'mobile' );
            }
        };

    })();
