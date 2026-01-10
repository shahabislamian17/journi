    Vue.component( 'dates', {
        props: [ 'query' ],
        data() {
            return {
                months: [],
                weekNames: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
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
                _this.checkInDate   = _this.query.checkInDate ? new Date( _this.query.checkInDate ) : '';
                _this.checkOutDate  = _this.query.checkOutDate ? new Date( _this.query.checkOutDate ) : '';
                if ( _this.util.isMobile() ) {
                    _this.minMonthIndex = _this.currentDate.getMonth();
                    _this.year          = _this.currentDate.getFullYear();
                } else {
                    _this.minMonthIndex = _this.checkInDate ? _this.checkInDate.getMonth() : _this.currentDate.getMonth();
                    _this.year          = _this.checkInDate ? _this.checkInDate.getFullYear() : _this.currentDate.getFullYear();
                }
                _this.generateDates();
            }, 1);
            $(window).resize(function() {
                _this.generateDates();
            });
        },
        computed: {
            util() {
                return Util ? Util : {};
            },
            canNavigatePreviousDates() {
                if ( this.minMonthIndex == this.currentDate.getMonth() && this.year == this.currentDate.getFullYear() ) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            hideModals() {
                $( 'html' ).removeAttr( 'data-modal' );
                this.showDates = false;
            },
            generateDates() {
                const months = [];
                let year     = this.year;
                let perPage  = this.util.isMobile() ? ( this.minMonthIndex + 24 ) : this.minMonthIndex + 2;

                for ( let i = this.minMonthIndex; i < perPage; i++ ) {
                    year = ( months.length > 0 && months[ months.length - 1 ].monthIndex == 11 ) ? year + 1 : year;
                    const month = new Date(year, i, 1);
                    const monthIndex = month.getMonth();
                    const monthName = month.toLocaleString( 'default', { month: 'long' });
                    const daysInMonth = new Date(
                        year,
                        monthIndex + 1,
                        0
                    ).getDate();

                    const days = [];

                    const firstDayOfMonth = new Date(year, monthIndex, 1);
                    const firstDayWeekIndex = this.weekNames.findIndex(item => item == firstDayOfMonth.toDateString().split( ' ' )[0]);
                    const previousYear =  monthIndex == 12 ? year - 1 : year;
                    const prevMonthIndex = monthIndex == 11 ? 0 : ( monthIndex - 1 );
                    const previousMonthDays = new Date(
                        previousYear,
                        prevMonthIndex + 1,
                        0
                    ).getDate();

                    for ( let j = firstDayWeekIndex - 1; j >= 0; j-- ) {
                        const day = previousMonthDays - j;
                        const date = new Date( previousYear, prevMonthIndex,  day );
                        days.push({
                            date: date,
                            day: day
                        });

                    }

                    for (let j = 1; j <= daysInMonth; j++) {
                        const day = new Date(year, monthIndex, j);
                        days.push({
                            date: day,
                            day: j < 10 ? '0' + j : j,
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
                if ( date.toDateString() != this.currentDate.toDateString() && date < this.currentDate ) {
                    return 'alt';
                }
                if ( this.checkInDate && this.checkInDate.toDateString() == date.toDateString() ) {
                    return 'start active';
                }
                if ( this.checkOutDate && this.checkOutDate.toDateString() == date.toDateString() ) {
                    return 'end active';
                }
                if ( this.checkInDate && this.checkOutDate && date >= this.checkInDate && date <= this.checkOutDate ) {
                    return 'active alt';
                }
                return '';
            },
            selectDay(day) {
                if ( day.date.toDateString() != this.currentDate.toDateString() && day.date < this.currentDate ) {
                    return;
                }
                if ( this.source == 'check-out' && this.checkInDate && ( day.date < ( new Date( this.checkInDate ) ) ) ) {
                    this.checkInDate = day.date;
                    this.checkOutDate = '';
                } else {
                    if ( ! this.checkInDate ) {
                        this.checkInDate = day.date;
                    } else {
                        if ( this.source == 'check-in' && ( this.checkOutDate || ( day.date < this.checkInDate ) ) ) {
                            this.checkInDate = day.date;
                            this.checkOutDate = '';
                        } else {
                            this.checkOutDate = day.date;
                            this.hideModals();
                            /* setTimeout(() => {
                                $( 'body' ).removeClass( 'focus' );
                            }, 20); */
                        }
                    }
                }
                this.selectedDay = day.date;
                this.generateDates();
                this.query.checkInDate  = this.parseDate( this.checkInDate ).replace(/\s\d{4}$/, '');
                this.query.checkOutDate = this.parseDate( this.checkOutDate ).replace(/\s\d{4}$/, '');
            },
            isToday(date) {
                const today = new Date();
                return (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
                );
            },
            parseDate( date ) {
                if ( ! date ) {
                    return '';
                }
                let arr = date.toString().split( ' ' );
                return arr[2] + ' ' + arr[1] + ' ' + arr[3];
            },
            navigateDates(navigation) {
                switch (navigation) {
                    case 'previous':
                        if ( this.minMonthIndex == this.currentDate.getMonth() && this.year == this.currentDate.getFullYear() ) {
                            return;
                        }
                        if ( this.minMonthIndex > 0 ) {
                            this.minMonthIndex--;
                        } else {
                            if ( this.year > this.currentDate.getFullYear() ) {
                                this.minMonthIndex = 11;
                                this.year--;
                            }
                        }
                        break;

                    case 'next':
                        if ( this.minMonthIndex == 11 ) {
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
                $( '.dates' ).addClass( 'active' );
                this.generateDates();
            }
        },
        template: DatesTemplate
    });
