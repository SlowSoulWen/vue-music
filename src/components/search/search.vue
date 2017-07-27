<template>
    <div id="search">
        <div class="header">
            <div class="search-box">
                <input class='searchInput' v-model="keywords" type="text" placeholder="搜索音乐，歌词，电台" @keyup.enter="getSearch"  key="searchInput">
            </div>
            <router-link to="/index">
                <div class="back">
                    <span>取消</span>
                </div>
            </router-link>
        </div>
        <div class="menutab">
            <span :class="{checkStyle:check == 0}" @click="slideTo(0)">单曲</span>
            <span :class="{checkStyle:check == 1}" @click="slideTo(1)">歌手</span>
        </div>
        <div class="swiper-box">
            <swiper :options="swiperOption" ref="searchSwiper">
                <swiper-slide>
                    <div class="song-list" v-for="(item,index) in songs">
                        <div class="item" @click="toPlay(item.id,item,index)">
                            <div class="song-msg">
                                <h1 class='song-name'>{{ item.name }}</h1>
                                <h4 class="description">{{ item.album.artists[0].name + (item.album.name?(' - ' + item.album.name):'')  }}</h4>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-unie644"></use>
                                </svg>  
                            </div>
                        </div>
                    </div>
                </swiper-slide>
                <swiper-slide>
                    <div class="artist-list" v-for="(item,index) in artists" @click="toArtists(item.id,item,item.name,item.picUrl)">
                        <div class="item">
                            <div class="artist-pic">
                                <img :src="item.picUrl" alt="">
                            </div>
                            <div class="song-msg">
                                <h1 class='artist-name'>{{ item.name + (item.alias.length?(' (' + item.alia[0] + ')'):'' ) }}</h1>
                            </div>
                        </div>  
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        data() {
            return {
                songs: [],
                artists: [],
                host: this.$store.state.HOST,
                keywords: '',
                check: 0,
                swiperOption: {
                    notNextTick: true,
                    autoplay: false,
                    direction : 'horizontal',
                    grabCursor : true,
                    setWrapperSize :false,
                    autoHeight: true,
                    paginationClickable :true,
                    scrollbar:false,
                    observeParents:true,
                    debugger: true,
                    touchRatio : 0.6,
                    touchAngle : 12,
                    onSlideChangeStart: swiper => {
                        this.check = swiper.activeIndex;
                    }
                }
            }
        },
        computed: {
            searchSwiper() {
                return this.$refs.searchSwiper.swiper
            }   
        },
        mounted() {
            if( this.$route.query.key ) {
                this.keywords = this.$route.query.key;
                this.getSearch();
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods: {
            slideTo(num) {
                this.searchSwiper.slideTo(num,0.1);
            },
            //  跳转至【播放器】
            toPlay(id,item,index) {
                this.$store.commit('pushSongsList',item); 
                this.$store.commit('setListIndex',0); 
                this.$router.push({path: '/player/' + id});
            },
            //  跳转至【歌手单曲】
            toArtists(id,artist,name,pciUrl) {
                this.$router.push({path: '/artists/' + id,query: { name:name, picUrl: pciUrl }});
            },
            getSearch() {
                var _this = this;
                //  获取单曲
                axios.get(this.host + '/search', {
                    params: {
                        keywords:  this.keywords,
                        type: 1
                    }
                }).then(function(res) {
                    console.log("获取搜索单曲数据：");
                    console.log(res.data.result.songs);
                    _this.songs = res.data.result.songs;
                });
                //  获取歌手
                axios.get(this.host + '/search', {
                    params: {
                        keywords: this.keywords,
                        type: 100
                    }
                }).then(function(res) {
                    console.log("获取搜索歌手数据：");
                    console.log(res.data.result.artists);
                    _this.artists = res.data.result.artists;
                })
                return false;
            }
        }
    }
</script>

<style>
    #search {
        padding-top: 101px;
    }
    #search  .header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 60px;
        background: #D23023;
    }
    #search .header div {
         line-height: 60px;
         text-align: center;
    }
    #search .header .search-box {
        flex: 1;
    }
    #search .header .search-box input {
        width: 90%;
        height: 30px;
        border-radius: 15px;
        border-style: none;
        padding: 0 10px;
        font-size: 12px;
        line-height:20px;
    }
    #search .header .icon {
       font-size: 1.8em;
       color: #ffffff;
    }
    #search .back {
        color: #ffffff;
        padding:0 5px;
    }
    #search .menutab {
        display: flex;
        position: fixed;
        width: 100%;
        top: 60px;
        left: 0;
        z-index: 999;
        background: rgba(255,255,255,0.9);
    }
    #search .menutab span {
        flex: 1;
        text-align: center;
        padding: 12px 0;
        font-size: 15px;
    }
    #search .checkStyle {
        color: #D23023;
        border-bottom: 2px solid #D23023;
    }
    #search .swiper-box .item {
        display: flex;
        height: 60px;
        border-bottom: 1px solid #eee;
    }
    #search .swiper-box .item .artist-pic {
        width: 60px;
        height: 60px;
    }
    #search .swiper-box .item .artist-pic img {
        width: 50px;
        height: 50px;
        margin: 5px 5px;
    }
    #search .swiper-box .item .song-msg {
        flex: 1;
        position: relative;
        padding-left: 5px;
        overflow: hidden;
    }
    #search .swiper-box .item .artist-name {
        line-height: 55px;
    }
    #search .swiper-box .item .song-msg .song-name {
        font-size: 16px;
        padding: 10px 0;
        width: 90%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    #search .swiper-box .item .song-msg .description {
        font-size: 12px;
        color: #666;
        width: 90%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    #search .swiper-box .item .song-msg .icon {
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 1.2em;
        color: #666;
    }
</style>