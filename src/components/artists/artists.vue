<template>
    <div id="singer">
        <div class="header">
            <div class="back" @click="goback(-1)">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </div>
            <div class="title">
                <h1 v-if="artist">{{ artist.name }}</h1>
            </div>
            <router-link to="/player">
                <div class="listing">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-p7zhengzaibofangzhong"></use>
                    </svg>             
                </div>
            </router-link>
        </div>
        <div class="singer-pic">
            <img v-if="artist" :src="artist.picUrl" alt="">
        </div> 
        <div class="list-box">
            <div class="title">
                <h1>50首热门歌曲</h1>
            </div>
            <v-loading msg="歌单加载可能需等待较长时间.." v-if="!hotSongsList"></v-loading>
            <div v-if="hotSongsList" class="item" v-for="(item,index) in hotSongsList" @click="toPlay(item.id,index)">
                <div class="sequence">
                    <span>{{ index+1 }}</span>
                </div>
                <div class="song-msg">
                    <h1 class='song-name'>{{ item.name }}</h1>
                    <h4 class="description">{{ item.ar[0].name + ((item.ar[1] && item.ar[1].name)?'/'+item.ar[1].name:'') + (item.al?' - '+item.al.name:"")  }}</h4>
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
    import vLoading from '@/components/loading/loading'
    import vFooter from '@/components/footer/footer'

    export default {
        data() {
            return {
                host: this.$store.state.HOST,
                artist: {
                    name: '',
                    picUrl: null
                },
                hotSongsList: null
            }
        },
        mounted() {
            if(this.$route.params.id) {
                this.getArtistSongList(this.$route.params.id);
            }
            if(this.$route.query.name)
                this.artist.name = this.$route.query.name
            if(this.$route.query.picUrl)
                this.artist.picUrl = this.$route.query.picUrl
        },
        methods: {
            getArtistSongList(id) {
                var _this = this;
                axios.get(this.host + '/artists', {
                    params: {
                        id: id
                    }
                }).then(function(res) {
                    console.log("歌手单曲数据：");
                    console.log(res);
                    _this.hotSongsList = res.data.hotSongs;
                })
            },
            goback(index) {
                this.$router.go(index);
            },
            //  跳转至【播放器】
            toPlay(id,index) {
                this.$store.commit('setSongsList',this.hotSongsList); 
                this.$store.commit('setListIndex',index); 
                this.$router.push({path: '/player/' + id});
            }
        },
        components: {
            vLoading,
            vFooter
        }
    }
</script>

<style>
    #singer {
        padding-bottom: 50px;
    }
    #singer .header{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 55px;
        background: rgba(0,0,0,0.1);
    }
    #singer .header .title{
        flex: 1;
        color: #ffffff;
        font-size: 18px;
    }
    #singer .header div {
        text-align: center;
        line-height: 60px;
    }
    #singer .header .back,
    #singer .header .listing {
        width: 35px;
    }
    #singer .header .icon {
       font-size: 1.5em;
       color: #ffffff;
    }
    #singer .singer-pic {
        width: 100%;
        height: 250px;
        overflow: hidden;
    }
    #singer .singer-pic img {
        width: 100%;
    } 
    #singer .list-box {
        width: 100%;
        z-index: 10;
    }
    #singer .list-box .title {
        padding: 15px 15px;
        border-bottom: 1px solid #eee;
    }
    #singer .list-box .item {
        display: flex;
        height: 60px;
    }
    #singer .list-box .item .sequence {
        width: 30px;
        text-align: center;
        color: #666;
    }
    #singer .list-box .item .sequence span {
        font-size: 14px;
        line-height: 60px;
    }
    #singer .list-box .item .song-msg {
        flex: 1;
        border-bottom: 1px solid #eee;
        position: relative;
        overflow-x:hidden;
    }
    #singer .list-box .item .song-msg .song-name {
        font-size: 16px;
        padding:10px 0;
        width: 90%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    #singer .list-box .item .song-msg .description {
        font-size: 12px;
        color: #666;
        width: 90%;
        white-space: nowrap;
        text-overflow: ellipsis; 
        -o-text-overflow: ellipsis; 
        overflow: hidden;
    }
    #singer .list-box .item .song-msg .icon {
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 1.2em;
        color: #666;
    }
</style>