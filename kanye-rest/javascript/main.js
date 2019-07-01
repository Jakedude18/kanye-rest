

Vue.component('kanye-wisdom', {
    props: ["index"],
    data() {
        return {
            liking: false,
            errored: false,
            loading: false
        }
    },
    template: `<div class="tweet" @click="like">
    <transition name="jump"><img v-if="this.liking" src="images/red_heart.jpg" class="heart"></transition>
    <transition name="fade"><img v-show="!this.liking" src="images/red-heart-outline-md.png"class="heart"></transition>
    <img src="images/correct.png" style="width:3%; margin:1px">
    <img src="images/kanye_profile_picture.jpg" style="width:10%; float:left; margin:8px">
    kanyewest<br>
    <p v-if="errored">Sorry, there seems to be an error</p>
    <p v-else-if="loading">Loading...</p>
    <p v-else>{{quote()}}</p></div>`,
    methods: {
        like: function () {
            this.liking = true;
            this.loading = true;
            vi.likedQuotes.unshift(this.quote());
            axios
                .get('https://api.kanye.rest')
                .then(response => {
                    (vi.ordered ? vi.quotes.splice(vi.quotes.indexOf(this.quote()),1,response.data.quote): vi.quotes[this.index] = response.data.quote)
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() =>{ this.loading = false;this.liking=false});
        },
            quote: function () {
                return vi.ordered ? vi.sortedQuotes()[this.index] : vi.quotes[this.index]
        }
    },
});


var vi = new Vue({
    el: '#app',
    data() {
        return{
            showLiked: false,
            ordered: false,
            quotes: [],
            likedQuotes: []
        }
    },
    mounted(){
        for(var i = 0;i<10;i++) {
            axios
                .get('https://api.kanye.rest')
                .then(response =>{(this.quotes.push(response.data.quote))})
                .catch(error => {
                    console.log(error);
                    this.quotes.push("Sorry, there seems to be an error");
                })
        }
    },
    methods: {
        changeShowLiked: function () {
            this.showLiked = true;

        },
        sortQuotes: function () {
            this.ordered = true;
            this.showLiked = false;
        },
        sortedQuotes: function () {
            return [...this.quotes].sort(function (a, b) {
                return a.length - b.length
            })
        },
        refreshQuotes: function () {
            this.ordered = false;
            this.showLiked = false;
            this.quotes = [];
            for (var i = 0; i < 10; i++) {
                axios
                    .get('https://api.kanye.rest')
                    .then(response => {
                        (this.quotes.push(response.data.quote))
                    })
                    .catch(error => {
                        console.log(error);
                        this.quotes.push("Sorry, there seems to be an error");
                    })
            }
        },
        unorderedQuotes: function () {
            this.ordered = false;
            this.showLiked = false;
        }
    },
})