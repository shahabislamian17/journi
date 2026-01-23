// Dates Template (for Vue component)
// Check if DatesTemplate already exists (from pages), otherwise define it
if (typeof DatesTemplate === 'undefined') {
    window.DatesTemplate = `
    <div class="blocks" data-blocks="5">
        <div class="block" data-block="2CA">
            <div class="blocks" data-blocks="6">
                <div class="block" data-block="2CAA">
                    <div class="close">
                        <div class="button circle" data-button="2A">
                            <div class="action">
                                <div class="icon">
                                    <i class="icons8 icons8-less-than"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block" data-block="2CAB">
                    <div class="title">
                        <h3 class="six">Dates</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="block" data-block="2CB">
            <div class="blocks" data-blocks="7">
                <div class="block" data-block="2CBA">
                    <div class="buttons">
                        <div class="button circle one" data-button="3A" @click="navigateDates('previous')" v-if="canNavigatePreviousDates">
                            <div class="action">
                                <div class="icon">
                                    <i class="icons8 icons8-less-than"></i>
                                </div>
                            </div>
                        </div>
                        <div class="button circle two" data-button="3A" @click="navigateDates('next')">
                            <div class="action">
                                <div class="icon">
                                    <i class="icons8 icons8-more-than"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block" data-block="2CBB">
                    <div class="dates">
                        <div class="blocks" data-blocks="7">
                            <div class="block" data-block="2CCA" v-for="month in months" :key="month.monthIndex + '-' + month.year" :attr="month.monthName">
                                <div class="month">
                                    <div class="name">
                                        <div class="text">{{ month.monthName + ' ' + month.year }}</div>
                                    </div>
                                    <div class="days">
                                        <ul class="one">
                                            <li><span>M</span></li>
                                            <li><span>T</span></li>
                                            <li><span>W</span></li>
                                            <li><span>T</span></li>
                                            <li><span>F</span></li>
                                            <li><span>S</span></li>
                                            <li><span>S</span></li>
                                        </ul>
                                        <ul class="two">
                                            <template v-for="(week, i) in month.weeks">
                                                <template v-for="day in week">
                                                    <li v-if="i == 0 && parseInt( day.day ) > 7" class="alt"><span></span></li>
                                                    <li v-else @click="selectDay(day)" :class="setDayClass(day.date)">
                                                        <span v-if="day">{{ day.day }}</span>
                                                    </li>
                                                </template>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}

// Vue Dates Component
if (typeof Vue !== 'undefined') {
    Vue.component('dates', {
        props: ['query'],
        data() {
            return {
                months: [],
                weekNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                selectedDay: null,
                checkInDate: '',
                checkOutDate: '',
                currentDate: new Date(),
                minMonthIndex: 0,
                year: 0,
                source: '',
                showDates: false
            };
        },
        mounted() {
            const _this = this;
            setTimeout(() => {
                // Read from parent query prop first, then try URL params
                if (_this.query && _this.query.checkInDateObj) {
                    _this.checkInDate = new Date(_this.query.checkInDateObj);
                } else if (_this.query && _this.query.checkInDate) {
                    // Try to parse formatted date string
                    const dateStr = _this.query.checkInDate;
                    const parts = dateStr.split(' ');
                    if (parts.length >= 2) {
                        const day = parseInt(parts[0]);
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = monthNames.indexOf(parts[1]);
                        if (month >= 0 && day > 0) {
                            const currentYear = new Date().getFullYear();
                            _this.checkInDate = new Date(currentYear, month, day);
                        }
                    }
                } else {
                    // Try reading from URL params
                    const urlParams = new URLSearchParams(window.location.search);
                    const checkInDateISO = urlParams.get('checkInDate');
                    if (checkInDateISO) {
                        _this.checkInDate = new Date(checkInDateISO);
                    }
                }
                
                if (_this.query && _this.query.checkOutDateObj) {
                    _this.checkOutDate = new Date(_this.query.checkOutDateObj);
                } else if (_this.query && _this.query.checkOutDate) {
                    // Try to parse formatted date string
                    const dateStr = _this.query.checkOutDate;
                    const parts = dateStr.split(' ');
                    if (parts.length >= 2) {
                        const day = parseInt(parts[0]);
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = monthNames.indexOf(parts[1]);
                        if (month >= 0 && day > 0) {
                            const currentYear = new Date().getFullYear();
                            _this.checkOutDate = new Date(currentYear, month, day);
                        }
                    }
                } else {
                    // Try reading from URL params
                    const urlParams = new URLSearchParams(window.location.search);
                    const checkOutDateISO = urlParams.get('checkOutDate');
                    if (checkOutDateISO) {
                        _this.checkOutDate = new Date(checkOutDateISO);
                    }
                }
                
                if (_this.util.isMobile && _this.util.isMobile()) {
                    _this.minMonthIndex = _this.currentDate.getMonth();
                    _this.year = _this.currentDate.getFullYear();
                } else {
                    _this.minMonthIndex = _this.checkInDate ? _this.checkInDate.getMonth() : _this.currentDate.getMonth();
                    _this.year = _this.checkInDate ? _this.checkInDate.getFullYear() : _this.currentDate.getFullYear();
                }
                _this.generateDates();
            }, 1);
            if (typeof $ !== 'undefined') {
                $(window).resize(function() {
                    _this.generateDates();
                });
            }
            window.Dates = this;
        },
        watch: {
            // Watch for changes in parent query prop
            'query.checkInDateObj': {
                handler(newVal) {
                    if (newVal && newVal instanceof Date) {
                        this.checkInDate = new Date(newVal);
                        this.generateDates();
                    }
                },
                immediate: false
            },
            'query.checkOutDateObj': {
                handler(newVal) {
                    if (newVal && newVal instanceof Date) {
                        this.checkOutDate = new Date(newVal);
                        this.generateDates();
                    }
                },
                immediate: false
            }
        },
        computed: {
            util() {
                const util = (typeof window !== 'undefined' && window.Util) ? window.Util : {};
                if (!util.isMobile) {
                    util.isMobile = function() {
                        return window.innerWidth <= 900;
                    };
                }
                return util;
            },
            canNavigatePreviousDates() {
                if (this.minMonthIndex == this.currentDate.getMonth() && this.year == this.currentDate.getFullYear()) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            hideModals() {
                if (typeof $ !== 'undefined') {
                    $('html').removeAttr('data-modal');
                    $('body').removeAttr('data-modal');
                    
                    // Close the dates modal
                    var $modal = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="dates"]');
                    if ($modal.length) {
                        $modal.removeClass('active');
                        setTimeout(function() {
                            $modal.removeClass('delay');
                        }, 200);
                    }
                }
                this.showDates = false;
            },
            generateDates() {
                const months = [];
                let year = this.year;
                // On desktop, show exactly 2 months side by side
                // On mobile, show more months (24)
                const monthsToShow = (this.util.isMobile && this.util.isMobile()) ? 24 : 2;
                let perPage = this.minMonthIndex + monthsToShow;
                for (let i = this.minMonthIndex; i < perPage; i++) {
                    year = (months.length > 0 && months[months.length - 1].monthIndex == 11) ? year + 1 : year;
                    const month = new Date(year, i, 1);
                    const monthIndex = month.getMonth();
                    const monthName = month.toLocaleString('default', { month: 'long' });
                    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                    const days = [];
                    const firstDayOfMonth = new Date(year, monthIndex, 1);
                    const firstDayWeekIndex = this.weekNames.findIndex((item) => item == firstDayOfMonth.toDateString().split(' ')[0]);
                    const previousYear = monthIndex == 12 ? year - 1 : year;
                    const prevMonthIndex = monthIndex == 11 ? 0 : (monthIndex - 1);
                    const previousMonthDays = new Date(previousYear, prevMonthIndex + 1, 0).getDate();
                    for (let j = firstDayWeekIndex - 1; j >= 0; j--) {
                        const day = previousMonthDays - j;
                        const date = new Date(previousYear, prevMonthIndex, day);
                        days.push({
                            date: date,
                            day: day
                        });
                    }
                    for (let j = 1; j <= daysInMonth; j++) {
                        const day = new Date(year, monthIndex, j);
                        days.push({
                            date: day,
                            day: j < 10 ? '0' + j : j
                        });
                    }
                    let weeks = [];
                    while (days.length) {
                        weeks.push(days.splice(0, 7));
                    }
                    months.push({
                        monthIndex,
                        monthName,
                        weeks,
                        year: year
                    });
                }
                this.months = months;
            },
            setDayClass(date) {
                if (date.toDateString() != this.currentDate.toDateString() && date < this.currentDate) {
                    return 'alt';
                }
                if (this.checkInDate && this.checkInDate.toDateString() == date.toDateString()) {
                    return 'start active';
                }
                if (this.checkOutDate && this.checkOutDate.toDateString() == date.toDateString()) {
                    return 'end active';
                }
                if (this.checkInDate && this.checkOutDate && date >= this.checkInDate && date <= this.checkOutDate) {
                    return 'active alt';
                }
                return '';
            },
            selectDay(day) {
                // Prevent selection of past dates
                if (day.date.toDateString() != this.currentDate.toDateString() && day.date < this.currentDate) {
                    return;
                }
                
                // Three-click cycle: first click = start date, second click = end date, third click = reset
                if (!this.checkInDate) {
                    // First click: Set check-in date
                    this.checkInDate = day.date;
                    this.checkOutDate = '';
                } else if (!this.checkOutDate) {
                    // Second click: Set check-out date
                    // If clicked date is before check-in, make it the new check-in
                    if (day.date < this.checkInDate) {
                        this.checkInDate = day.date;
                        this.checkOutDate = '';
                    } else {
                        // Set check-out date and close modal
                        this.checkOutDate = day.date;
                        this.hideModals();
                    }
                } else {
                    // Third click: Reset both dates and set new check-in
                    this.checkInDate = day.date;
                    this.checkOutDate = '';
                }
                
                this.selectedDay = day.date;
                this.generateDates();
                
                // Update parent query with formatted strings for display
                const formattedCheckIn = this.checkInDate ? this.parseDate(this.checkInDate).replace(/\s\d{4}$/, '') : '';
                const formattedCheckOut = this.checkOutDate ? this.parseDate(this.checkOutDate).replace(/\s\d{4}$/, '') : '';
                this.query.checkInDate = formattedCheckIn;
                this.query.checkOutDate = formattedCheckOut;
                
                // Also store Date objects in parent for proper conversion
                if (this.$parent && this.$parent.query) {
                    this.$parent.query.checkInDateObj = this.checkInDate ? new Date(this.checkInDate) : null;
                    this.$parent.query.checkOutDateObj = this.checkOutDate ? new Date(this.checkOutDate) : null;
                }
            },
            parseDate(date) {
                if (!date) {
                    return '';
                }
                let arr = date.toString().split(' ');
                return arr[2] + ' ' + arr[1] + ' ' + arr[3];
            },
            navigateDates(navigation) {
                switch (navigation) {
                    case 'previous':
                        if (this.minMonthIndex == this.currentDate.getMonth() && this.year == this.currentDate.getFullYear()) {
                            return;
                        }
                        if (this.minMonthIndex > 0) {
                            this.minMonthIndex--;
                        } else {
                            if (this.year > this.currentDate.getFullYear()) {
                                this.minMonthIndex = 11;
                                this.year--;
                            }
                        }
                        break;
                    case 'next':
                        if (this.minMonthIndex == 11) {
                            this.minMonthIndex = 0;
                            this.year++;
                        } else {
                            this.minMonthIndex++;
                        }
                        break;
                }
                this.generateDates();
            },
            showDates(source) {
                this.source = source;
                if (typeof $ !== 'undefined') {
                    $('.dates').addClass('active');
                }
                this.generateDates();
            }
        },
        template: typeof DatesTemplate !== 'undefined' ? DatesTemplate : (typeof window.DatesTemplate !== 'undefined' ? window.DatesTemplate : '')
    });

    // Vue Search Instance
var Search = new Vue({
        el: '#search',
     data: {        
        query: {
            search: '',
            checkInDate: '',
            checkOutDate: '',
                checkInDateObj: null, // Store actual Date object
                checkOutDateObj: null // Store actual Date object
            },
            guests: {
                adults: 1,
                children: 0
            }
    },
    mounted() {
            // Read URL parameters and populate form (booking.com style)
            this.initializeFromURL();
            this.updateGuestsDisplay();
            // Prevent form submission
            const form = document.getElementById('search');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.performSearch();
                    return false;
                });
                // Also prevent Enter key in readonly inputs
                const inputs = form.querySelectorAll('input[readonly]');
                inputs.forEach(input => {
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.performSearch();
                            return false;
                        }
                    });
                });
            }
    },
    computed: {
        util() {
                const util = (typeof window !== 'undefined' && window.Util) ? window.Util : {};
                if (!util.isMobile) {
                    util.isMobile = function() {
                        return window.innerWidth <= 900;
                    };
                }
                return util;
            }
        },
        methods: {
            initializeFromURL() {
                // Read URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                
                // Set destination
                const destination = urlParams.get('destination');
                if (destination) {
                    const destinationInput = document.querySelector('input[name="destination"]');
                    if (destinationInput) {
                        destinationInput.value = destination;
                    }
                }
                
                // Set dates from URL
                const checkInDateISO = urlParams.get('checkInDate');
                const checkOutDateISO = urlParams.get('checkOutDate');
                
                if (checkInDateISO) {
                    try {
                        const checkInDate = new Date(checkInDateISO);
                        if (!isNaN(checkInDate.getTime())) {
                            this.query.checkInDateObj = checkInDate;
                            // Format date for display (e.g., "15 Jan")
                            const day = checkInDate.getDate();
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const month = monthNames[checkInDate.getMonth()];
                            this.query.checkInDate = `${day} ${month}`;
                        }
                    } catch (e) {
                        console.warn('Could not parse checkInDate from URL:', checkInDateISO);
                    }
                }
                
                if (checkOutDateISO) {
                    try {
                        const checkOutDate = new Date(checkOutDateISO);
                        if (!isNaN(checkOutDate.getTime())) {
                            this.query.checkOutDateObj = checkOutDate;
                            // Format date for display (e.g., "20 Jan")
                            const day = checkOutDate.getDate();
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const month = monthNames[checkOutDate.getMonth()];
                            this.query.checkOutDate = `${day} ${month}`;
                        }
                    } catch (e) {
                        console.warn('Could not parse checkOutDate from URL:', checkOutDateISO);
                    }
                }
                
                // Set guests
                const adults = urlParams.get('adults');
                const children = urlParams.get('children');
                if (adults) {
                    this.guests.adults = parseInt(adults) || 1;
                }
                if (children) {
                    this.guests.children = parseInt(children) || 0;
                }
                
                // Update guest inputs in modal if they exist
                const adultsInput = document.querySelector('.modal[data-modal="guests"] input[data-type="adults"]');
                const childrenInput = document.querySelector('.modal[data-modal="guests"] input[data-type="children"]');
                if (adultsInput) {
                    adultsInput.value = this.guests.adults;
                }
                if (childrenInput) {
                    childrenInput.value = this.guests.children;
                }
            },
            updateGuestsDisplay() {
                const total = this.guests.adults + this.guests.children;
                const guestInput = document.querySelector('input[name="guests"]');
                if (guestInput) {
                    if (total === 0) {
                        guestInput.value = '';
                    } else if (total === 1) {
                        guestInput.value = '1 Guest';
                    } else {
                        guestInput.value = total + ' Guests';
                    }
                }
            },
            updateGuestCount(type, action) {
                if (type === 'adults') {
                    if (action === 'increment') {
                        this.guests.adults++;
                    } else if (action === 'decrement' && this.guests.adults > 1) {
                        this.guests.adults--;
                    }
                } else if (type === 'children') {
                    if (action === 'increment') {
                        this.guests.children++;
                    } else if (action === 'decrement' && this.guests.children > 0) {
                        this.guests.children--;
                    }
                }
                this.updateGuestsDisplay();
            },
            performSearch() {
                const destination = document.querySelector('input[name="destination"]')?.value || 'Ibiza';
                const adults = this.guests.adults || 1;
                const children = this.guests.children || 0;
                
                // Use Date objects if available, otherwise try to parse formatted strings
                let checkInDateISO = null;
                let checkOutDateISO = null;
                
                if (this.query.checkInDateObj && this.query.checkInDateObj instanceof Date) {
                    checkInDateISO = this.query.checkInDateObj.toISOString().split('T')[0];
                } else if (this.query.checkInDate && this.query.checkInDate.trim() !== '') {
                    // Try to parse formatted date string (e.g., "15 Jan")
                    const dateStr = this.query.checkInDate.trim();
                    try {
                        // Try parsing as "DD MMM" format
                        const parts = dateStr.split(' ');
                        if (parts.length >= 2) {
                            const day = parseInt(parts[0]);
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const month = monthNames.indexOf(parts[1]);
                            if (month >= 0 && day > 0) {
                                const currentYear = new Date().getFullYear();
                                const date = new Date(currentYear, month, day);
                                if (!isNaN(date.getTime())) {
                                    checkInDateISO = date.toISOString().split('T')[0];
                                }
                            }
                        }
                        // Fallback: try direct Date parsing
                        if (!checkInDateISO) {
                            const date = new Date(dateStr);
                            if (!isNaN(date.getTime())) {
                                checkInDateISO = date.toISOString().split('T')[0];
                            }
                        }
                    } catch (e) {
                        console.warn('Could not parse checkInDate:', dateStr);
                    }
                }
                
                if (this.query.checkOutDateObj && this.query.checkOutDateObj instanceof Date) {
                    checkOutDateISO = this.query.checkOutDateObj.toISOString().split('T')[0];
                } else if (this.query.checkOutDate && this.query.checkOutDate.trim() !== '') {
                    const dateStr = this.query.checkOutDate.trim();
                    try {
                        const parts = dateStr.split(' ');
                        if (parts.length >= 2) {
                            const day = parseInt(parts[0]);
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const month = monthNames.indexOf(parts[1]);
                            if (month >= 0 && day > 0) {
                                const currentYear = new Date().getFullYear();
                                const date = new Date(currentYear, month, day);
                                if (!isNaN(date.getTime())) {
                                    checkOutDateISO = date.toISOString().split('T')[0];
                                }
                            }
                        }
                        if (!checkOutDateISO) {
                            const date = new Date(dateStr);
                            if (!isNaN(date.getTime())) {
                                checkOutDateISO = date.toISOString().split('T')[0];
                            }
                        }
                    } catch (e) {
                        console.warn('Could not parse checkOutDate:', dateStr);
                    }
                }
                
                // Build search URL
                const params = new URLSearchParams();
                if (destination && destination.trim() !== '' && destination !== 'Ibiza') {
                    params.append('destination', destination);
                }
                if (checkInDateISO) {
                    params.append('checkInDate', checkInDateISO);
                }
                if (checkOutDateISO) {
                    params.append('checkOutDate', checkOutDateISO);
                }
                if (adults > 1) {
                    params.append('adults', adults);
                }
                if (children > 0) {
                    params.append('children', children);
                }
                
                // Check if we're on an experience detail page
                const currentPath = window.location.pathname;
                const isExperiencePage = currentPath.includes('/experience');
                
                if (isExperiencePage) {
                    // Preserve existing query params (especially slug) and merge with new search params
                    const currentUrl = new URL(window.location.href);
                    const existingParams = new URLSearchParams(currentUrl.search);
                    
                    // Merge new search params with existing ones (new params override existing)
                    params.forEach((value, key) => {
                        existingParams.set(key, value);
                    });
                    
                    // Build new URL preserving the pathname and all params
                    const queryString = existingParams.toString();
                    const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;
                    console.log('Updating URL on experience page:', newUrl);
                    window.history.pushState({}, '', newUrl);
                    
                    // Trigger page reload to update availability slots
                    window.location.reload();
                } else {
                    // Navigate to search results on home page
                    const queryString = params.toString();
                    const searchUrl = queryString ? `/?${queryString}` : '/';
                    console.log('Search URL:', searchUrl);
                    window.location.href = searchUrl;
                }
            }
        }
    });

    // Make Search available globally
    window.Search = Search;
    
    // Also initialize from URL immediately if DOM is ready
    if (typeof window !== 'undefined' && document.readyState === 'complete') {
        setTimeout(() => {
            if (window.Search && window.Search.initializeFromURL) {
                window.Search.initializeFromURL();
            }
        }, 100);
    } else if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.Search && window.Search.initializeFromURL) {
                    window.Search.initializeFromURL();
                }
            }, 100);
        });
    }
}

// jQuery Event Handlers
if (typeof $ !== 'undefined') {
    $(function() {
        // Use delegated events for better reliability
        // Open modals when input fields are clicked
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .blocks .block .fields .blocks .block .input', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $modals = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals');
            if ($modals.length) {
            $modals.addClass('delay');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $modals.addClass('active');
                });
            });
            }
        });

        // Close modals
        $('.search .content .sections .section.two .blocks .block .form .blocks .block .overlay, .search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal .blocks .block .blocks .block .close').click(function() {
            var $modals = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals');
            $modals.removeClass('active');
            setTimeout(function() {
                $modals.removeClass('delay');
            }, 750);
        });

        // Close specific modal
        $('.search .content .sections .section.two .blocks .block .form .blocks .block .overlay, .search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal .blocks .block .blocks .block .close').click(function() {
            var $modal = $(this).closest('.modal');
            $modal.removeClass('active');
            setTimeout(function() {
                $modal.removeClass('delay');
            }, 750);
        });

        // Open search section (mobile)
        $('.search .content .sections .section.three .blocks .block .form').click(function() {
            $('body').attr('data-modal', 'search');
            var $modal = $('.search');
            $modal.addClass('delay');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $modal.addClass('active');
                });
            });
        });

        // Close search section
        $('footer ~ .overlay, .search .sections .section.two .blocks .block[data-block="1"] .blocks .block .close').click(function() {
            $('body').removeClass('active');
            $('body').removeAttr('data-modal');
            var $modal = $('.search');
            $modal.removeClass('active');
            setTimeout(function() {
                $modal.removeClass('delay');
            }, 750);
        });

        // Destination input click - use delegated event
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="destination"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('[data-modal]').removeClass('delay active');
            $('body').attr('data-modal', 'search');
            var $modal = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="destination"]');
            if ($modal.length) {
            $modal.addClass('delay');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $modal.addClass('active');
                });
            });
            }
        });

        // Dates input click - use delegated event
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="dates"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('[data-modal]').removeClass('delay active');
            $('body').attr('data-modal', 'search');
            var $modal = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="dates"]');
            if ($modal.length) {
            $modal.addClass('delay');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $modal.addClass('active');
                });
            });
                if (window.Dates && window.Dates.showDates) {
                    window.Dates.showDates('check-in');
                }
            }
        });

        // Guests input click - use delegated event
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .fields .blocks .block input[name="guests"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('[data-modal]').removeClass('delay active');
            $('body').attr('data-modal', 'search');
            var $modal = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="guests"]');
            if ($modal.length) {
            $modal.addClass('delay');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $modal.addClass('active');
                });
            });
            }
        });

        // Destination selection
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="destination"] .list ul li:not(.alt)', function() {
            var destinationName = $(this).find('.text span.one').text();
            $('input[name="destination"]').val(destinationName);
            var $modal = $(this).closest('.modal');
            $modal.removeClass('active');
            setTimeout(function() {
                $modal.removeClass('delay');
            }, 750);
        });

        // Guest counter increment/decrement
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="guests"] .button.circle.alt', function() {
            var action = $(this).attr('data-action');
            var type = $(this).attr('data-type');
            var $input = $(this).siblings('input.amount[data-type="' + type + '"]');
            var currentValue = parseInt($input.val()) || 0;
            
            if (action === 'increment') {
                if (type === 'adults') {
                    currentValue++;
                } else if (type === 'children') {
                    currentValue++;
                }
            } else if (action === 'decrement') {
                if (type === 'adults' && currentValue > 1) {
                    currentValue--;
                } else if (type === 'children' && currentValue > 0) {
                    currentValue--;
                }
            }
            
            $input.val(currentValue);
            
            // Update Vue instance
            if (window.Search) {
                window.Search.guests[type] = currentValue;
                window.Search.updateGuestsDisplay();
            } else {
                // Fallback if Vue not available
                var adults = parseInt($('.modal[data-modal="guests"] input[data-type="adults"]').val()) || 0;
                var children = parseInt($('.modal[data-modal="guests"] input[data-type="children"]').val()) || 0;
                var total = adults + children;
                var guestInput = $('input[name="guests"]');
                if (total === 0) {
                    guestInput.val('');
                } else if (total === 1) {
                    guestInput.val('1 Guest');
                } else {
                    guestInput.val(total + ' Guests');
                }
            }
        });

        // Search button click
        $(document).on('click', '.search .content .sections .section.two .blocks .block .form .blocks .block .buttons .button[data-button="1A"], .search .content .sections .section.two .blocks .block .form .blocks .block .buttons .button[data-button="1C"]', function(e) {
            e.preventDefault();
            if (window.Search && window.Search.performSearch) {
                window.Search.performSearch();
            }
        });

        // Close overlay
        $('footer ~ .overlay').click(function() {
            $('body').removeAttr('data-modal');
            var $modal = $('[data-modal]');
            $modal.removeClass('active');
            setTimeout(function() {
                $modal.removeClass('delay');
            }, 200);
        });

        // Open dates modal on page load if URL has date parameters
        $(document).ready(function() {
            const urlParams = new URLSearchParams(window.location.search);
            const checkInDate = urlParams.get('checkInDate');
            const checkOutDate = urlParams.get('checkOutDate');
            
            // If dates are in URL, open the dates modal after a short delay to ensure Vue is ready
            if (checkInDate || checkOutDate) {
                setTimeout(function() {
                    var $modal = $('.search .content .sections .section.two .blocks .block .form .blocks .block .modals .modal[data-modal="dates"]');
                    if ($modal.length) {
                        $('body').attr('data-modal', 'search');
                        $modal.addClass('delay');
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                $modal.addClass('active');
                            });
                        });
                        if (window.Dates && window.Dates.showDates) {
                            window.Dates.showDates('check-in');
                        }
                    }
                }, 500); // Wait for Vue component to be mounted
            }
        });
    });
}
