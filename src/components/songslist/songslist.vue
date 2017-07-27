<template>
    <div class="songslist">
        <div class="header">
            <div class="back" @click="goback(-1)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </div>
            <div class="title">
                <h1>{{ type }}</h1>
            </div>
            <router-link to="/player">
                <div class="listing">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-p7zhengzaibofangzhong"></use>
                    </svg>             
                </div>
            </router-link>
        </div>
        <div class="list-top">
            <div class="list-top-after" :style="{backgroundImage: 'url(' + coverImgUrl + ')'}"></div>
            <div class="msg-box">
                <div class="img-msg">
                    <img :src="coverImgUrl" alt="">
                </div>
                <div class="txt-msg">
                    <h1>{{ name }}</h1>
                    <div v-if="avatarUrl && type == '歌单'">
                        <img class='author-pic' :src="avatarUrl" alt="">
                        <span class="author-name">{{ nickname }}</span>
                    </div>
                    <div v-if="nickname && type == '专辑'">
                        <span class="author-name">歌手：{{ nickname }}</span>
                        <h2 class="date">发行时间：{{ date }}</h2>
                    </div>
                </div>
            </div>
            <div class="option-box">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shoucang"></use>
                    </svg>  
                    <h4 class="count">{{ subscribedCount }}</h4>
                </div>
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-pinglun"></use>
                    </svg>  
                    <h4 class="count">{{ commentCount }}</h4>
                </div>
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhuanfa"></use>
                    </svg>  
                    <h4 class="count">{{ shareCount }}</h4>     
                </div>
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiazai"></use>
                    </svg>
                    <h4 class="count">下载</h4>
                </div>
            </div>
        </div>
        <div class="list-box">
            <v-loading msg="歌单加载可能需等待较长时间.." v-if="!songslist"></v-loading>
            <div class="item" v-for="(item,index) in songslist" @click="toPlay(item.id,index)">
                <div class="sequence">
                    <span>{{ index+1 }}</span>
                </div>
                <div class="song-msg">
                    <h1 class='song-name'>{{ item.name }}</h1>
                    <h4 class="description">{{ item.ar[0].name + ((item.ar[1] && item.ar[1].name)?'/'+item.ar[1].name:'') + (item.al?' - '+item.al.name:"") }}</h4>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-unie644"></use>
                    </svg>  
                </div>
            </div>
        </div>
        <v-footer></v-footer>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapMutations, mapGetters } from 'vuex'
    import vFooter from '@/components/footer/footer'
    import vLoading from '@/components/loading/loading'

    export default {
        data() {
            return {
                host: this.$store.state.HOST, 
                type: '',
                name: '',               //  标题
                creator: '',            //  作者
                coverImgUrl: null,      //  图片  
                subscribedCount: 0,     //  收藏数
                commentCount: 0,        //  评论数
                shareCount: 0,          //  转发数
                avatarUrl: null,        //  作者头像
                nickname: '',           //  作者昵称
                songslist: null,        //  存放歌单数据
                date: ''                //  专辑发行时间
            }
        },
        computed: {
            ...mapGetters([
                'songsList'
            ])
        },
        components: {
            vFooter,
            vLoading
        },
        mounted() {
            if(this.$route.params.id) {
                this.name = this.$route.query.name || '';
                this.coverImgUrl = this.$route.query.picUrl || null;
                if(this.$route.query.type == 'gd') {
                    this.type = '歌单';
                    this.getPlaylistDetail();
                } else if(this.$route.params.id && this.$route.query.type == 'zj') {
                    this.type = '专辑';
                    this.getAalbum();
                }
            }
        },
        methods: {
            //  获取歌单数据
            getPlaylistDetail() {
                var _this = this;
                axios.get(_this.host + '/playlist/detail',{
                    params: {
                        id: this.$route.params.id
                    }
                }).then(function(res) {
                    console.log("获取歌单的详细信息：");
                    console.log(res.data);
                    _this.subscribedCount = res.data.playlist.subscribedCount;
                    _this.commentCount = res.data.playlist.commentCount;
                    _this.shareCount = res.data.playlist.shareCount;
                    _this.name = res.data.playlist.name;
                    _this.coverImgUrl = res.data.playlist.coverImgUrl;
                    _this.avatarUrl = res.data.playlist.creator.avatarUrl;
                    _this.nickname = res.data.playlist.creator.nickname;
                    _this.songslist = res.data.playlist.tracks;
                })
            },
            //  获取专辑数据
            getAalbum() {
                var _this = this;
                axios.get(_this.host + '/album',{
                    params: {
                        id: this.$route.params.id
                    }
                }).then(function(res) {
                    console.log("获取专辑的详细信息：");
                    console.log(res.data);
                    _this.subscribedCount = res.data.album.info.likedCount;
                    _this.commentCount = res.data.album.info.commentCount;
                    _this.shareCount = res.data.album.info.shareCount;
                    _this.name = res.data.album.name;
                    _this.coverImgUrl = res.data.album.picUrl;
                    _this.songslist = res.data.songs;
                    _this.nickname = res.data.album.artist.name;
                    let _date = new Date(res.data.album.publishTime);
                    _this.date =_date.getFullYear() + '-' + _date.getMonth() + '-' + _date.getDay();
                })
            },
            goback(index) {
                this.$router.go(index);
            },
            //  跳转至【播放器】
            toPlay(id,index) {
                this.$store.commit('setSongsList',this.songslist); 
                this.$store.commit('setListIndex',index); 
                this.$router.push({path: '/player/' + id});
            }
        }
    }
</script>

<style>
    .songslist {
        padding-bottom: 50px;
    }
    .songslist .header{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 55px;
        background: rgba(255,255,255,0.1);
    }
    .songslist .header .title{
        flex: 1;
        color: #ffffff;
        font-size: 18px;
    }
    .songslist .header div {
        text-align: center;
        line-height: 60px;
    }
    .songslist .header .back,
    .songslist .header .listing {
        width: 35px;
    }
    .songslist .header .icon {
       font-size: 1.5em;
       color: #ffffff;
    }
    .songslist .list-top {
        width: 100%;
        height: 210px;
        padding-top: 55px;
        background: rgba(0,0,0,0.2);
    }
    .songslist .list-top .list-top-after {
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        height: 265px;
        background-position: center top;
        background-size: 100%;
        background-attachment: fixed;
        -webkit-filter: blur(30px);
        -moz-filter: blur(30px);
        -ms-filter: blur(30px);
        -o-filter: blur(30px);
        filter: blur(30px);
    }
    .songslist .list-top .msg-box,
    .songslist .list-top .option-box
    {
        display: flex;
    }
    .songslist .list-top .msg-box {
        height: 150px;
    }
    .songslist .list-top .option-box {
        margin-top: 15px;
    }
    .songslist .list-top .msg-box div,
    .songslist .list-top .option-box div {
        flex: 1;
        overflow: hidden;
    }
    .songslist .list-top .msg-box .img-msg {
        text-align: center;
    }
    .songslist .list-top .msg-box img {
        width: 70%;
        margin-top: 20px;
    }
    .songslist .list-top .msg-box .txt-msg h1{
        margin-top:30px;
        font-size: 18px;
        color: #ffffff;
        line-height: 1.2em;
    }
    .songslist .list-top .msg-box .txt-msg div {
        margin-top: 20px;
    }
    .songslist .list-top .msg-box .txt-msg .author-pic {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-block;
        vertical-align:middle;
        padding: 0;
        margin: 0;
    }
    .songslist .list-top .msg-box .txt-msg div span,
    .songslist .list-top .msg-box .txt-msg .date{
        font-size:12px;
        color: #ffffff;
    }
    .songslist .list-top .msg-box .txt-msg .date {
        margin-top: 10px;
    }
    .songslist .list-top .option-box {
        display: flex;
    }
    .songslist .list-top .option-box div {
        flex: 1;
        text-align: center;
    }
    .songslist .list-top .option-box .icon {
        font-size: 1.4em;
        color: #ffffff;
        padding-bottom: 5px;
    }
    .songslist .list-top .option-box .count {
        font-size: 12px;
        color: #ffffff;
    }
    .songslist .list-box {
        width: 100%;
        z-index: 10;
    }
    .songslist .list-box .item {
        display: flex;
        height: 60px;
    }
    .songslist .list-box .item .sequence {
        width: 30px;
        text-align: center;
        color: #666;
    }
    .songslist .list-box .item .sequence span {
        font-size: 14px;
        line-height: 60px;
    }
    .songslist .list-box .item .song-msg {
        flex: 1;
        border-bottom: 1px solid #eee;
        position: relative;
        overflow-x:hidden;
    }
    .songslist .list-box .item .song-msg .song-name {
        font-size: 16px;
        padding:10px 0;
        width: 90%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    .songslist .list-box .item .song-msg .description {
        font-size: 12px;
        color: #666;
        width: 90%;
        white-space: nowrap;
        text-overflow: ellipsis; 
        -o-text-overflow: ellipsis; 
        overflow: hidden;
    }
    .songslist .list-box .item .song-msg .icon {
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 1.2em;
        color: #666;
    }
</style>