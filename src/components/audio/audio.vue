<template>
    <audio :src="url"  id="player" preload="true"  @canplay="startPlay" @timeupdate="timeupdate" @ended="ended"></audio>
</template>

<script>
    import axios from 'axios'
    import { mapMutations, mapGetters } from 'vuex'

    export default {
        data() {
            return {
                host: this.$store.state.HOST
            }
        },
        computed: {
            ...mapGetters([
                'id',
                'url',
                'songsList',
                'isPlay',
                'curTime',
                'changeTime',
                'autoNext'
            ])
        },
        watch: {
            isPlay: function()  {
                this.togglePlay();
            },
            id: function() {
                this.getSong();
            },
            changeTime: function() {
                //  跳到指定时刻播放
                player.currentTime = this.changeTime;
            },
            //  为IOS端无法自动播放做的技巧性方法
            url: function() {
                var _this = this;
                axios.get(this.host + '/lyric', {
                    params: {
                        id: 347230
                    }
                }).then(function() {
                     var player =  document.querySelector('#player');
                     player.play();
                })
            }
        },
        methods: {
            //  开始\暂停
            togglePlay() {
                var player =  document.querySelector('#player');
                if( this.isPlay ) {
                    player.play();
                }else {
                    player.pause();
                }
            },
            //  获取歌曲
            getSong() {
                var _this = this;
                var player = document.querySelector('#player');
                this.$store.commit('setCurTime', 0);
                this.$store.commit('setIsPlay', false);
                axios.get(_this.host + '/music/url',{
                    params: {
                        id: _this.id
                    }
                }).then(function(res) {
                    console.log("获取歌曲信息：");
                    console.log(res.data);
                    if(!res.data.data[0].url) {
                        _this.$store.commit('setUrl','');
                        return false;
                    }
                    _this.$store.commit('setUrl',res.data.data[0].url);
                }) 
            },
            //  播放准备就绪时
            startPlay() {
                //  记录歌曲时长
                this.$store.commit('setDuration',player.duration);
                //  开始播放
                player.play();
                this.$store.commit('setIsPlay',true);
            },
            //  播放结束
            ended() {
                this.$store.commit('setIsPlay',false);
                this.$store.commit('setCurTime',0);
                this.$store.commit('setAutoNext', !this.autoNext);
            },
            timeupdate() {
                this.$store.commit('setCurTime', player.currentTime );
            }
        }
    }
</script>

<style>
    #player {
        display: none;
    }
</style>

