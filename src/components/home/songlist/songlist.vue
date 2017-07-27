<template>
    <div class="songlist">
        <div class="list-wrapper">
            <div class="item-1-2" v-for="(item,index) in highqualitPlaylist" @click="toSongsList(item.id,item,'gd',item.name,item.coverImgUrl)">
                <img :src="item.coverImgUrl" alt="">
                <h3 class="item-title">{{ item.name }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                host: this.$store.state.HOST,
                highqualitPlaylist : []
            }
        },
        mounted() {
            this.getPersonalized();
        },
        methods: {
            //  获取【推荐歌单】数据
            getPersonalized() {
                var _this = this;
                axios.get(this.host + "/top/playlist",{
                    params: {
                        limit: 12,
                        order: 'hot'
                    }
                }).then(function(res) {
                    console.log("网友精选碟歌单数据:");
                    console.log(res.data.playlists);
                    _this.highqualitPlaylist = res.data.playlists;
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
        }
    }
</script>

<style>
    .songlist .list-wrapper {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
        flex: 1;
    }
    .songlist .list-wrapper .item-1-2 {
        width: 49%;
        display: inline-block;
        margin-bottom: 10px;
    }
    .songlist .list-wrapper img {
        width:100%;
        height: auto;
    }
    .songlist .list-wrapper .item-title {
        font-size: 14px;
        line-height: 1.3em;
        letter-spacing: 1px; 
        color: black;
    }
</style>