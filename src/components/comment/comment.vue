<template>
    <div class="comment">
        <div class="header">
            <div class="back" @click="goback(-1)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </div>
            <div class="title">
                <h1 class="title">评论</h1>
            </div>
            <div class="forwarding">
                <router-link to="/player">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-p7zhengzaibofangzhong"></use>
                    </svg> 
                </router-link>            
            </div>
        </div>
        <div class="top">
            <div class="img-box">
                <img :src="picUrl" alt="">
            </div>
            <div class="msg-box">
                <h1 class="title">{{ title }}</h1>
                <h4 class="author">{{ artist }}</h4>
            </div>
        </div>
        <div class="comment-box">
            <div class="hot-comment">
                <h2 class="title">精彩评论</h2>
                <v-loading v-if="!hotComments" msg=''></v-loading>
                <div class="comments-list" v-for="(item,index) in hotComments">
                    <div class="avatar">
                        <img :src="item.user.avatarUrl" alt="">
                    </div>
                    <div class="content">
                        <div class="information">
                            <h1 class="name">{{ item.user.nickname }}</h1>
                            <span class="date">{{ (new Date( item.time )).getFullYear()+'年'+(new Date( item.time )).getMonth()+'月'+(new Date( item.time )).getDate()+'日'  }}</span>
                            <div class="like">
                                <span class='num'>{{ item.likedCount }}</span>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-dianzan"></use>
                                </svg>  
                            </div>
                        </div>
                        <div class="context">
                            {{ item.content }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="new-comment">
                <h2 class="title">最新评论</h2>
                <v-loading v-if="!newComments" msg=''></v-loading>
                <div class="comments-list" v-for="(item,index) in newComments">
                    <div class="avatar">
                        <img :src="item.user.avatarUrl" alt="">
                    </div>
                    <div class="content">
                        <div class="information">
                            <h1 class="name">{{ item.user.nickname }}</h1>
                            <span class="date">{{ (new Date( item.time )).getFullYear()+'年'+(new Date( item.time )).getMonth()+'月'+(new Date( item.time )).getDate()+'日'  }}</span>
                            <div class="like">
                                <span class='num'>{{ item.likedCount }}</span>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-dianzan"></use>
                                </svg>  
                            </div>                        
                        </div>
                        <div class="context">
                            {{ item.content }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapMutations, mapGetters } from 'vuex'
    import vLoading from '@/components/loading/loading'

    export default {
        data() {
            return {
                host: this.$store.state.HOST,
                hotComments: null,
                newComments: null
            }
        },
        computed: {
            ...mapGetters([
                'picUrl',
                'title',
                'artist'
            ])
        },
        mounted() {
            var type = this.$route.params.type;
            var id = this.$route.params.id;
            this.getComments(type,id);
        },
        methods: {
            getComments(type,id) {
                var _this = this;
                if( !type || !id )
                    return false;
                axios.get(this.host + '/comment/' + type,{
                    params: {
                        id: id
                    }
                }).then(function(res) {
                    console.log("获取评论：");
                    console.log(res.data);
                    _this.hotComments = res.data.hotComments;
                    _this.newComments = res.data.comments;
                })
            },
            goback(index) {
                this.$router.go(index);
            }
        },
        components: {
            vLoading
        }
    }
</script>

<style>
    .comment {
        padding-top: 50px;
        width: 100%;
        overflow: hidden;
    }
    .comment .header{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 50px;
        color: #ffffff;
        background: #D23023;
    }
    .comment .header .title{
        flex: 1;
        padding-top: 10px;
        font-size: 16px;
        text-align: center;
        line-height: 15px !important;
    }
    .comment .header .back,
    .comment .header .forwarding {
        text-align: center;
        line-height: 60px;
        width: 35px;
    }
    .comment .header .icon {
       font-size: 1.5em;
       color: #ffffff;
    } 
    .comment .top {
        width: 100%;
        height: 100px;
        display: flex;
        overflow: hidden;
    }
    .comment .top .img-box {
        width: 84px;
        padding: 0 8px;
    }
    .comment .top .img-box img {
        margin-top: 8px;
        max-width: 84px;
    }
    .comment .top .msg-box {
        flex: 1;
    }
    .comment .top .msg-box .title {
        font-size: 16px;
        padding-top: 25px;
    }
    .comment .top .msg-box .author {
        font-size: 13px;
        padding-top: 20px;
        color: #3d3d3d;
    }
    .comment .comment-box .title{
        font-size: 12px;
        width: 100%;
        padding: 6px 8px;
        background: #eee;
        color: #a3a3a3;
    }
    .comment .comment-box .comments-list {
        display: flex;
    }
    .comment .comment-box .comments-list .avatar {
        width: 60px;
        height: 60px;
        text-align: center;
    }
    .comment .comment-box .comments-list .avatar img {
        width: 40px;
        border-radius: 50%;
        padding: 9px 0;
    }
    .comment .comment-box .comments-list .content {
        flex: 1;
    }
    .comment .comment-box .comments-list .content .information {
        position:relative;
        height: 34px;
        font-size: 14px;
        padding: 12px 0;
    }
    .comment .comment-box .comments-list .content .information .name {
        padding-bottom: 5px;
        color: #4B4D4B;
    }
    .comment .comment-box .comments-list .content .information .date {
        font-size: 10px;
        color: #a3a3a3;
    }
    .comment .comment-box .comments-list .content .information .like {
        position: absolute;
        top: 10px;
        right: 5px;
        color: #a3a3a3;
        font-size: 12px;
    }
    .comment .comment-box .comments-list .content .information .like .icon {
        font-size: 1.3em;
    }
    .comment .comment-box .comments-list .content .context {
        font-size: 14px;
        position: relative;
        padding-right: 10px;
        line-height: 20px;
        padding-bottom: 10px;
        border: none;
    }
    .comment .comment-box .comments-list .content .context:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        background: #ddd;
        width: 100%;
        height: 1px;
        -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
    }
</style>