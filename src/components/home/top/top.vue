<template>
    <div id="top">
        <div class="top-list"  @click="toSongsList(soaring.id,'gd')">
            <div class="pic-box">
                <img src="./soaring.jpg" alt="">
            </div>
            <div class="top-songs">
                <ul>
                    <li v-for="(item,index) in soaring.firstThree">{{ index+1 + ". " +  item.name + " - " + item.ar[0].name }}</li>
                </ul>
            </div>
        </div>
        <div class="top-list" @click="toSongsList(newsong.id,'gd')">
            <div class="pic-box">
                <img src="./newsong.jpg" alt="">
            </div>
            <div class="top-songs">
                <ul>
                    <li v-for="(item,index) in newsong.firstThree">{{ index+1 + ". " +  item.name + " - " + item.ar[0].name }}</li>
                </ul>
            </div>
        </div>
        <div class="top-list" @click="toSongsList(original.id,'gd')">
            <div class="pic-box">
                <img src="./original.jpg" alt="">
            </div>
            <div class="top-songs">
                <ul>
                    <li v-for="(item,index) in original.firstThree">{{ index+1 + ". " +  item.name + " - " + item.ar[0].name }}</li>
                </ul>
            </div>
        </div>
        <div class="top-list" @click="toSongsList(hotsing.id,'gd')">
            <div class="pic-box">
                <img src="./hotsing.jpg" alt="">
            </div>
            <div class="top-songs">
                <ul>
                    <li v-for="(item,index) in hotsing.firstThree">{{ index+1 + ". " +  item.name + " - " + item.ar[0].name }}</li>
                </ul>
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
                soaring: {
                    id: null,
                    firstThree: []
                },
                newsong: {
                    id: null,
                    firstThree: []
                },
                original: {
                    id: null,
                    firstThree: [] 
                },
                hotsing: {
                    id: null,
                    firstThree: []                  
                }
            }
        },
        mounted() {
            var _this = this;
            axios.get(this.host + '/toplist').then(function(res) {
                console.log("排行榜单数据：");
                console.log(res.data.list);
                _this.soaring.id = res.data.list[0].id;
                _this.newsong.id = res.data.list[1].id;
                _this.original.id = res.data.list[2].id;
                _this.hotsing.id = res.data.list[3].id;
                //  拿到飙升榜前三首歌
                _this.getFirstThree(res.data.list[0].id,_this.soaring);
                //  新歌前三
                _this.getFirstThree(res.data.list[1].id,_this.newsong);
                //  原创
                _this.getFirstThree(res.data.list[2].id,_this.original);
                //  热歌
                _this.getFirstThree(res.data.list[3].id,_this.hotsing);
            })
        },
        methods: {
            getFirstThree(id, obj) {
                axios.get(this.host + '/playlist/detail', {
                    params: {
                        id: id
                    }
                }).then(function(res) {
                    console.log("排行榜歌单数据：")
                    console.log(res.data.playlist.tracks);
                    if( res.data && res.data.playlist && res.data.playlist.tracks ) {
                        for(let i = 0; i<3; i++)
                            obj.firstThree.push(res.data.playlist.tracks[i]);
                    }
                })
            },
            //  跳转至【歌单】
            toSongsList(id,type) {
                this.$router.push({path: '/songslist/' + id,query: {
                    type: type || null
                }});
            }
        }
    }
</script>

<style>
    #top {
        width: 100%;
    }
    #top .top-list {
        display: flex;
    }
    #top .pic-box {
        width: 35%;
    }
    #top .pic-box img {
        width: 100%;
        height: auto;
        padding:0;
        margin: 0;
    }
    #top .top-songs {
        flex: 1;
        height: auto;
        overflow-x: hidden;
    }
    #top .top-songs ul {
        margin-left: 8%;
        padding: 5% 0; 
        
    }
    #top .top-songs ul li {
        padding: 4% 0;
        font-size: 14px;
        color: #a9a9a9;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow:hidden;
    }
</style>