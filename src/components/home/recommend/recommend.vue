<template>
    <div class="recommend">
        <v-swiper :getUrl="bannerUrl" @bannerUpdate="updateBanner"></v-swiper>
        <div class="recommend-menu">
            <div class="recommend-item" @click="slideTo(2)">
                <img src="./fm.png" alt="">
                <h4>私人FM</h4>
            </div>
            <div class="recommend-item"  @click="slideTo(1)">
                <img src="./recommend.png" alt="">
                <h4>每日歌曲推荐</h4>
            </div>
            <div class="recommend-item"  @click="slideTo(3)">
                <img src="./top.png" alt="">
                <h4>云音乐热歌榜</h4>
            </div>
        </div>
        <div class="recommend-songlist"  @click="slideTo()">
            <h2 class="title">推荐歌单 ＞</h2>
            <div class="list-wrapper">
                <div class="item-1-3" v-for="(item,index) in personalized" @click="toSongsList(item.id,item,'gd',item.name,item.picUrl)">
                    <img :src="item.picUrl" alt="">
                    <h3 class="item-title">{{ item.name }}</h3>
                </div>
            </div>
        </div>
        <div class="recommend-newsongs">
            <h2 class="title">最新音乐 ＞</h2>
            <div class="list-wrapper">
                <div class="item-1-3" v-for="(item,index) in newsongs" @click="toSongsList(item.song.album.id,item,'zj',item.name,item.song.album.picUrl)" v-if="index < 6">
                    <img :src="item.song.album.picUrl" alt="">
                    <h3 class="item-title">{{ item.name }}</h3>
                    <span class="artists-name">{{ item.song.artists[0].name }}</span>
                </div>
            </div>
        </div>
        <div class="recommend-exclusive">
            <h2 class="title">独家放送 ＞</h2>
            <div class="list-wrapper">
                <div class="item-1-2" v-for="(item,index) in privatecontent" v-if="index < 2">
                    <img :src="item.picUrl" alt="">
                    <h3 class="item-title">{{ item.name }}</h3>
                </div>
                <div class="item-1" v-for="(item,index) in privatecontent" v-if="index == 2">
                    <img :src="item.picUrl" alt="">
                    <h3 class="item-title">{{ item.name }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import vSwiper from '@/components/swiper/swiper'

    export default {
        data() {
            return {
                host: this.$store.state.HOST,
                bannerUrl: this.$store.state.HOST + '/banner', // 轮播图接口地址
                personalized : [], // 存放推荐歌单
                privatecontent: [], // 独家放送
                newsongs: []        // 最新音乐
            }
        },
        components: {
            vSwiper
        },
        mounted() {
            this.getPersonalized();
            this.getPrivatecontent();
            this.getNewsongs();
        },
        methods: {
            //  获取【推荐歌单】数据
            getPersonalized() {
                var _this = this;
                axios.get(this.host + "/personalized").then(function(res) {
                    console.log("推荐歌单数据:");
                    console.log(res.data.result);
                    _this.personalized = res.data.result;
                    _this.$emit('swiperUpdate');
                })
            },
            //  获取【独家放送】歌单
            getPrivatecontent() {
                var _this = this;
                axios.get(this.host + "/personalized/privatecontent").then(function(res) {
                    console.log("独家放送数据:");
                    console.log(res.data.result);
                    _this.privatecontent = res.data.result;
                    _this.$emit('swiperUpdate');
                })
            },
            //  获取【最新音乐】
            getNewsongs() {
                var _this = this;
                axios.get(this.host + "/personalized/newsong").then(function(res) {
                    console.log("最新音乐数据:");
                    console.log(res.data.result);
                    _this.newsongs = res.data.result;
                    _this.$emit('swiperUpdate');
                }) 
            },
            //  跳转至【歌单】
            toSongsList(id,obj,type,name,picUrl) {
                this.$router.push({path: '/songslist/' + id,query:{
                    type: type,
                    name: (name || ''),
                    picUrl: (picUrl || null) 
                }});
            },
            updateBanner() {
                 this.$emit('swiperUpdate');
            },
            slideTo(num) {
                this.$emit('slideTo',num);
            }
        }
    }
</script>

<style>
    .recommend {
        overflow: hidden;
    }
    .recommend .recommend-menu {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #eee;
    }
    .recommend .recommend-menu .recommend-item {
        flex: 1;
        text-align: center;
        padding:5px 0 15px 0;
    }
    .recommend .recommend-menu .recommend-item img {
        width: 45%;
        height: auto;
    }
    .recommend .recommend-menu .recommend-item h4 {
        font-size: 12px;
    }
    .recommend .title {
        font-size: 15px;
        padding-left: 10px;
        border-left: 2px solid #D23023;
        margin: 15px 0 15px 0;
    }
    .recommend .list-wrapper {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
        flex: 1;
    }
    .recommend .list-wrapper .item-1-3,
    .recommend .list-wrapper .item-1-2,
    .recommend .list-wrapper .item-1
     {
        display: inline-block;
        margin-bottom: 10px;
        height: auto;
    }
    .recommend .list-wrapper .item-1-3 {
        width: 33%;
    }
    .recommend .list-wrapper .item-1-2 {
        width: 49%;
    }
    .recommend .list-wrapper .item-1 {
        width: 100%;
    }
    .recommend .list-wrapper img {
        width:100%;
        height: auto;
    }
    .recommend .list-wrapper .item-title {
        font-size: 14px;
        line-height: 1.3em;
        letter-spacing: 1px; 
        color: black;
        overflow: hidden;
    }
    .recommend .recommend-newsongs .item-title {
        width: 100%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    .recommend .recommend-newsongs .artists-name {
        font-size: 10px;
        color: #3d3d3d;
        width: 100%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
</style>