<template>
    <div class="play">
        <div class="header">
            <div class="back">
                <svg class="icon" aria-hidden="true" @click="goback(-1)">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </div>
            <div class="title">
                <h1 class="song-name">{{ title }}</h1>
                <span class='artist'>{{ artist }}</span>
            </div>
            <div class="forwarding">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanfa"></use>
                </svg>             
            </div>
        </div>
        <div class="song-main">
            <transition name="fade">
            <div class="middle-box" v-show="!showLrc" @click="showLrc = true">
                <img class='player-needle' src="./player-needle.png" alt="">
                <div class="pic-box" :style='{"animation": (isPlay?" 25s linear 0s normal none infinite rotate":"none")}'>
                    <img :src="picUrl" alt="" class="album-pic">
                    <div></div>
                </div>
                <div class="option-1">
                    <div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shoucang"></use>
                        </svg> 
                    </div>
                    <div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-xiazai"></use>
                        </svg> 
                    </div>
                    <div @click="toComment()">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-pinglun"></use>
                        </svg> 
                    </div>
                    <div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-sandiancaidan"></use>
                        </svg> 
                    </div>      
                </div>
            </div>
            </transition>
            <transition name="fade">
            <div v-show="showLrc" class="showLrc-box" @click="showLrc = false">
                <ul v-show="lrc.length" v-bind:style="{top:lrcTop}" class="lrc"> 
                    <li v-for="(item,index) in lrc">
                        {{ item[1] }}
                    </li>
                </ul>
                <ul v-show="!lrc.length" style="margin-top:40%;">
                    <span class="no-lrc">暂无歌词</span>
                </ul>
            </div>
            </transition>
        </div>  
        <div class="option-box">
            <div class="progress-bar">
                <div class="current-time">{{ nowTime }}</div>
                <div class="progress-box">
                    <div ref="progress" class="progress">
                        <div ref="curProgress" class="cur-progress" :style="{width: curLength+'%'}"></div>
                        <div class="idot" :style="{left: curLength+'%'}" @mousedown="down" @mousemove="move" @touchstart="touchstart" @touchmove="touchmove"></div> 
                    </div> 
                </div>
                <div class="left-time">{{ songTime }}</div>
            </div>
            <div class="option-2">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xunhuanbofang01"></use>
                    </svg> 
                </div>
                <div @click="prev">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shangyishou"></use>
                    </svg> 
                </div>
                <div @click="togglePlay">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="playButtonUrl"></use>
                    </svg> 
                </div>
                <div @click="next">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-next1"></use>
                    </svg> 
                </div>
                <div @click="showSongsList = true">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mulu"></use>
                    </svg> 
                </div>  
            </div>
        </div>
        <div class="songsList-box" :style="{bottom:showSongsList?'0':'-70%'}">
            <div class="top">
                <span class="title">歌曲列表</span>
                <span class="option" @click="emptied">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu2"></use>
                    </svg> 
                    清空
                </span>
            </div>
            <div class="content">
                <div class="song-list" v-for="(item,index) in songsList" @click="toPlay(item.id)">
                    <h1>
                        <span class="name">{{ item.name }}</span>
                        <span class="artist"> - {{  item.ar?item.ar[0].name:item.artists[0].name }}</span>
                    </h1>
                    <svg class="icon delete" aria-hidden="true">
                        <use xlink:href="#icon-chuyidong"></use>
                    </svg> 
                </div>
            </div>
            <div class="close" @click="showSongsList = false">
                <h1>关闭</h1>
            </div>
        </div>
        <div class="mask" v-show="showSongsList" @click="showSongsList = false"></div>
        <div class="bg" :style='{background: "url(" + picUrl + ")"}'></div>
        <div class="bg2"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapMutations, mapGetters } from 'vuex'

    export default {
        data() {
            return {
                showSongsList: false,
                lrcTop: 200 + 'px',
                showLrc: false,
                touchStartX:0, 
                progressLength: 0,
                isDown: false,
                curLength: 0,
                host: this.$store.state.HOST,
                songUrl: null,
                songName: '',
                songTime: '00:00',
                nowTime: '00:00'
            }
        },
        watch: {
            autoNext: function() {
                this.next();
            },
            isPlay: function(val) {
                if(val)
                    this.$store.commit('setPlayButtonUrl',"#icon-zanting1");
                else
                    this.$store.commit('setPlayButtonUrl',"#icon-bofang"); 
            },
            duration: function() {
                this.songTime = this.formatSeconds(this.duration);
            },
            curTime: function() {
                this.nowTime = this.formatSeconds(this.curTime);
                this.songTime = this.formatSeconds(this.duration - this.curTime);
                this.curLength = (this.curTime/this.duration) * 100;
                if( this.lrc.length != 0 ) {
                    for( var i = 0; i < this.lrc.length; i++) {
                        if ( this.curTime >= this.lrc[i][0]) {
                            for(var j = 0; j < this.lrc.length; j++){
                                document.querySelectorAll('.lrc li')[j].style.color="rgba(145,145,145,0.5)"
                            }
                            if ( i >= 0 ) {
                                this.lrcTop = -i * 31 + 180 + 'px';
                                document.querySelectorAll('.lrc li')[i].style.color="#ffffff";
                            }
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                'url',
                'songsList',
                'isPlay',
                'playButtonUrl',
                'id',
                'picUrl',
                'duration',
                'curTime',
                'title',
                'artist',
                'lrc',
                'listIndex',
                'autoNext'
            ])
        },
        mounted() {  
            this.progressLength = this.$refs.progress.getBoundingClientRect().width;
            document.onmouseup = this.up;
            if( this.$route.params.id && this.id != this.$route.params.id) {
                this.$store.commit('setId',this.$route.params.id);
                this.getSongDetail()
            }
        },
        methods: {
            //  暂停\播放
            togglePlay() {
                if( this.isPlay ) {
                    this.$store.commit('setIsPlay',false);
                }else {
                    this.$store.commit('setIsPlay',true);
                }
            },
            // 获取歌词
            getLyric() {
                this.$store.commit('setLyric', []);
                this.$store.commit('setLrc', []);
                if(!this.id)
                    return false;
                var _this = this;
                axios.get(this.host + '/lyric',{
                    params: {
                        id: _this.id
                    }
                }).then(function(res) {
                    console.log("获取歌词：");
                    console.log(res.data);
                    var lrc = _this.parseLyric(res.data.lrc.lyric);
                    _this.$store.commit('setLyric',res.data.lrc.lyric);
                    _this.$store.commit('setLrc',lrc);
                })
            },
            //  获取歌曲详情
            getSongDetail() {
                var _this = this;
                axios.get(this.host+'/song/detail',{
                    params: {
                        ids: _this.id
                    }
                }).then(function(res) {
                    console.log("获取歌曲详情：");
                    console.log(res.data.songs[0]);
                    _this.getLyric();
                    _this.$store.commit('setpicUrl',res.data.songs[0].al.picUrl);
                    _this.$store.commit('setTitle',res.data.songs[0].name);
                    _this.$store.commit('setArtist',res.data.songs[0].ar[0].name);
                })
            },
            //  鼠标按下拖拽按钮
            down() {
                this.isDown = true;
            },
            //  鼠标拖拽按钮
            move(e) {
                if( this.isDown ) {
                    var curLength = this.$refs.curProgress.getBoundingClientRect().width;
                    var newLength = ((curLength + e.movementX)/this.progressLength ) * 100;
                    if(newLength > 100)
                        newLength = 100;
                    else if(newLength < 0)
                        newLength = 0;
                    this.curLength = newLength; 
                }
            },
            //  松开鼠标
            up(){
                this.isDown = false;
            },
            //  触屏开始
            touchstart(e) {
                this.touchStartX = e.touches[0].pageX;
            },
            //  触屏拖拽
            touchmove(e) {
                if(!this.duration)
                    return false;
                var movementX = e.touches[0].pageX - this.touchStartX ;
                var curLength = this.$refs.curProgress.getBoundingClientRect().width;
                //  计算出百分比
                var newPercent = ((curLength + movementX)/this.progressLength ) * 100;
                if(newPercent > 100)
                    newLength = 100;  
                this.curLength = newPercent; 
                this.touchStartX = e.touches[0].pageX;
                //  根据百分比推出对应的播放时间
                this.changeTime(newPercent);
            },
            //  更改歌曲进度
            changeTime(percent) {
                let newCurTime = this.duration * ( percent * 0.01 );
                this.$store.commit('setChangeTime', newCurTime);
            },
            //  解析歌词
            parseLyric(text) {
                var lines = text.split('\n'),
                    pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g,
                    result = [];
                while (!pattern.test(lines[0])) {
                    lines = lines.slice(1);
                };
                lines[lines.length - 1].length === 0 && lines.pop();
                lines.forEach(function(v, i , a) {
                    var time = v.match(pattern),
                        value = v.replace(pattern, '');
                    time.forEach(function(v1, i1, a1) {

                        var t = v1.slice(1, -1).split(':');
                        if( value != "" && value != " ")
                            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
                    });
                });
                result.sort(function(a, b) {
                    return a[0] - b[0];
                });
                return result;
            },
            //  解析时间
            formatSeconds(value) {
                var theTime = parseInt(value);
                var theTime1 = 0;
                var theTime2 = 0;
                if(theTime > 60) {
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                        if(theTime1 > 60) {
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                    }
                }   
                    if(parseInt(theTime)<10){
                    var result = "0:0"+parseInt(theTime)+"";
                    }else{
                    var result = "0:"+parseInt(theTime)+""; 
                    }
                    if(theTime1 > 0) {
                    if(parseInt(theTime)<10){
                        result="0"+parseInt(theTime);
                    }else{
                        result=parseInt(theTime);
                    }
                    result = "0"+parseInt(theTime1)+":"+result;
                    }
                return result;
            },
            //  跳转至【评论】
            toComment() {
                if( this.id )
                    this.$router.push({path: '/comment/music/' + this.id});
            },
            //  播放歌曲列表内容
            toPlay(id) {
                if( id && id != this.id ) {
                    this.$router.replace({path: '/player/' + id});
                    this.$store.commit('setId', id);
                    this.$store.commit('setIsPlay', false);
                    this.getSongDetail();
                }
                this.showSongsList = false;
            },
            //  下一首
            next() {
                if( this.listIndex != -1 && this.songsList.length > 1  ) {
                    if ( this.listIndex < (this.songsList.length-1) ) {
                        this.toPlay(this.songsList[this.listIndex+1].id);
                        this.$store.commit('setListIndex',this.listIndex+1);
                    } else {
                        this.$store.commit('setListIndex',0);
                        this.toPlay(this.songsList[0].id);
                    }
                }
            },
            //  上一首
            prev() {
                if( this.listIndex != -1 && this.songsList.length > 1  ) {
                    if ( this.listIndex > 0 ) {
                        this.$store.commit('setListIndex',this.listIndex - 1);
                        this.toPlay(this.songsList[this.listIndex].id);
                    } else {
                        this.$store.commit('setListIndex', this.songsList.length-1 );
                        this.toPlay(this.songsList[this.listIndex].id);
                    }
                }      
            },
            //  清空歌曲列表
            emptied() {
                this.$store.commit('setSongsList', []);
            },
            goback(index) {
                this.$router.go(index);
            }
        }
    }
</script>

<style>
    .play {
        padding-top: 55px;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
    }
    .play .header{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 50px;
        color: #ffffff;
    }
    .play .header:after{
        content: '';
        position: fixed;
        left: 0;
        top: 50px;
        background: rgba(255,255,255,0.3);
        width: 100%;
        height: 1px;
        -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
        -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
    }
    .play .header .title{
        flex: 1;
        padding-top: 10px;
        font-size: 16px;
        text-align: center;
        line-height: 18px !important;
        overflow: hidden;
    }
    .play .header .title .song-name {
        width: 100%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;     
    }
    .play .header .title .artist {
        font-size: 12px;
        color: #ffffff;
    }
    .play .header .back,
    .play .header .forwarding {
        text-align: center;
        line-height: 60px;
        width: 35px;
    }
    .play .header .icon {
       font-size: 1.5em;
       color: #ffffff;
    } 
    .play .bg{
        position: fixed;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -2;
        background-position: center top;
        background-size: cover;
        background-attachment: fixed;
        -webkit-filter: blur(30px);
        -moz-filter: blur(30px);
        -ms-filter: blur(30px);
        -o-filter: blur(30px);
        filter: blur(30px);
    }
    .play .song-main {
        width: 100%;
        height: 75%;
        overflow: hidden;
    }
    .play .middle-box {
        overflow: hidden;
    }
    .play .song-main .player-needle {
        width: 18%;
        position: fixed;
        top: 50px;
        left: 45%;
        z-index: 20;
    }
    .play .song-main .pic-box {
        position: relative;
        width: 70%;
        height: 0;
        padding-bottom: 70%;
        border-radius: 50%; 
        border: 10px solid rgba(255,255,255,0.2);
        margin: 0 auto;
        margin-top: 9%;
        text-align: center;
    }
    .play .song-main .pic-box .album-pic {
        width: 75%;
        height: auto;
        max-height: 250px;
        border-radius: 50%; 
        margin-top: 15%;
    }
    @-webkit-keyframes rotate{
        from { -webkit-transform:rotate(0deg) }
        to { -webkit-transform:rotate(360deg) }
	}
    .play .song-main .pic-box div {
        position:absolute;
        width: 105%;
        height: 105%;
        border-radius: 50%; 
        overflow: hidden;
        top: -3px;
        left: -3px;
        background: url('./coverall.png') no-repeat;
        background-position:-5px -7px;
        background-size: 102%;
        z-index:10;
    }
    .play .option-box {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .play .option-box .progress-bar {
        width: 100%;
        display: flex;
    }
    .play .option-box .progress-bar .current-time,
    .play .option-box .progress-bar .left-time {
        width: 70px;
        text-align: center;
        font-size: 13px;
        line-height: 25px;
        color: #ffffff;
    }
    .play .option-box .progress-bar .progress-box {
        flex: 1;
    }
    .play .option-box .progress-bar .progress-box .progress {
        width: 100%;
        background: #ffffff;
        margin-top: 10px;
        height: 2px;
    }
    .play .option-box .progress-bar .progress-box .progress .cur-progress {
        width: 20%;
        height: 100%;
        background: #D23023;
    }
    .play .option-box .progress-bar .progress-box .progress .idot {
        width: 16px;
        height: 16px;
        position: relative;
        border-radius: 50%;
        background-color: #fff;
        top: -9px;
    }
    .play .option-box .progress-bar  .slider {
        margin: 0 auto;
        width: 100%;
    }
    .play .song-main .option-1 {
        display: flex;
        width: 80%;
        padding: 10px 0;
        margin: 20px auto;
    }
    .play .song-main .option-1 div {
        flex: 1;
        text-align: center;
    }
    .play .song-main .option-1 .icon {
        color: #ffffff;
        font-size: 1.4em;
    }
    .play .option-box .option-2 {
        display: flex;
    }
    .play .option-box .option-2 div {
        flex: 1;
        text-align: center;
        padding: 20px 0;
    }
    .play .option-box .option-2 .icon {
        color: #ffffff;
        font-size: 2.5em;
    }
    .play .bg2 {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.6);
        z-index: -1;
    }
    .play .showLrc-box {
        position: relative;
        height: 320px;
        width: 100%;
        padding: 40px 0;
        overflow: hidden;
        transition: all 1s;
    }
    .play .showLrc-box ul{
        padding-top: 20px;
        position: absolute;
        width:100%;
        text-align: center;
        font-size: 16px;
        line-height: 30px;
        color: rgba(145,145,145,0.7);
        transition: all 0.5s;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }
    .play .songsList-box {
        position: fixed;
        bottom: -70%;
        width: 100%;
        height: 70%;
        overflow: hidden;
        flex-direction: column;
        display: flex;
        align-content:stretch;
        z-index: 99;
        transition: all 0.4s;
    }
    .play .songsList-box:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(255,255,255,0.9);
        z-index: -1;
    }
    .play .songsList-box .top {
        height: 50px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        color: #3d3d3d;
    }
    .play .songsList-box .top .title {
        line-height: 50px;
        font-size: 16px;
        padding-left: 10px;
    }
    .play .songsList-box .top .option {
        margin: 12px 0;
        padding: 0px 15px;
        border-left: 1px solid rgba(0,0,0,0.1);
        float: right;    
        font-size: 14px;
        color: #3d3d3d;
    }
    .play .songsList-box .top .icon {
        font-size: 1.8em !important;
        vertical-align: middle;
    }
    .play .songsList-box .content {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        border-bottom: 1px solid rgba(0,0,0,0.1); 
    }
    .play .songsList-box .content .song-list {
        width: 100%;
        padding: 15px 10px;
        border-bottom: 1px solid rgba(0,0,0,0.1);  
        font-size: 16px;
    }
    .play .songsList-box .content .song-list h1 {
        display: inline-block;
        width: 85%;
        white-space:nowrap;
        text-overflow:ellipsis; 
        -o-text-overflow:ellipsis; 
        overflow: hidden;
    }
    .play .songsList-box .content .song-list .artist {
        color: #3d3d3d;
        font-size: 12px;
    }
    .play .songsList-box .content .song-list .delete {
        float: right;
        padding-right: 20px;
        color: #3d3d3d;
    }  
    .play .songsList-box .close {
        width: 100%;
        padding: 18px 0;
        text-align: center;
        color: #3d3d3d;
    } 
    .play .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 90;
    }
</style>