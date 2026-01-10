var Search = new Vue({
    'el': '#search',
     data: {        
        query: {
            search: '',
            checkInDate: '',
            checkOutDate: '',
            rooms: [],
            nationality: ''
        },
    },
    mounted() {
    },
    computed: {
        util() {
            return Util ? Util : {};
        }
    },
});