<template>
    <div id="find">
        <div id="header">
            <div class="identify">
                <router-link to="/search">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tinggeshiqu"></use>
                </svg>
                </router-link>
            </div>
            <div class="search-box">
                <input  class="homeInput" v-model="searchKey" type="text" placeholder="搜索音乐，歌词，电台" key="homeInput" @keyup.enter="search">
            </div>
            <router-link to="/playing">
                <div class="listing">
                    <router-link to="/player">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-p7zhengzaibofangzhong"></use>
                        </svg>  
                    </router-link>           
                </div>
            </router-link>
        </div>
        <div class="menutab">
            <span :class="{checkStyle:check == 0}" @click="slideTo(0)">个性推荐</span>
            <span :class="{checkStyle:check == 1}" @click="slideTo(1)">歌单</span>
            <span :class="{checkStyle:check == 2}" @click="slideTo(2)">主播电台</span>
            <span :class="{checkStyle:check == 3}" @click="slideTo(3)">排行榜</span>
        </div>
        <div>
            <swiper :options="swiperOption" ref="homeSwiper">
                <swiper-slide>
                    <v-recommend @slideTo="slideTo" @swiperUpdate="updateSwiper"></v-recommend>
                </swiper-slide>
                <swiper-slide>
                    <v-songlist></v-songlist>
                </swiper-slide>
                <swiper-slide>
                    <v-fm></v-fm>
                </swiper-slide>
                <swiper-slide>
                    <v-top></v-top>
                </swiper-slide>
            </swiper>
        </div>
        <v-footer></v-footer>
    </div>
</template>

<script>
    import axios from 'axios'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import vRecommend from '@/components/home/recommend/recommend'
    import vSonglist from '@/components/home/songlist/songlist'
    import vFm from '@/components/home/fm/fm'
    import vTop from '@/components/home/top/top'
    import vFooter from '@/components/footer/footer'

    export default {
        data() {
            return {
                searchKey: '',
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
        components: {
            swiper,
            swiperSlide,
            vRecommend,
            vSonglist,
            vFm,
            vTop,
            vFooter
        },
        computed: {
            homeSwiper() {
                return this.$refs.homeSwiper.swiper
            }   
        },
        methods: {
            slideTo(num) {
                this.homeSwiper.slideTo(num,0.1);
            },
            updateSwiper() {
                var _this = this;
                //  延迟500毫秒更新swiper组件，等待数据加载进DOM
                setTimeout(function(){
                    _this.homeSwiper.update();
                },500);
            },
            search() {
                // 手动使input失焦，否则后续页面点击会不断调出键盘，原因不明
                document.querySelector('#find .homeInput').blur();
                this.$router.push({ path: '/search', query: { key: this.searchKey }});
            }
        }
    }
</script>

<style>
    #find {
        padding-top: 101px;
        padding-bottom: 50px;
    }
    #find #header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 60px;
        background: #D23023;
    }
    #find #header div {
         line-height: 60px;
         text-align: center;
    }
    #find #header .search-box {
        flex: 1;
    }
    #find #header .identify,
    #find #header .listing {
        width: 40px;
        padding-top: 4px;
    }
    #find #header .search-box input {
        width: 90%;
        height: 30px;
        border-radius: 15px;
        border-style: none;
        padding: 0 10px;
        font-size: 12px;
        line-height:20px;
    }
    #find #header .icon {
       font-size: 1.8em;
       color: #ffffff;
    }
    #find .checkStyle {
        color: #D23023;
        border-bottom: 2px solid #D23023;
    }
    #find .menutab {
        display: flex;
        position: fixed;
        width: 100%;
        top: 60px;
        left: 0;
        z-index: 999;
        background: rgba(255,255,255,0.9);
    }
    #find .menutab span {
        flex: 1;
        text-align: center;
        padding: 12px 0;
        font-size: 15px;
    }
</style>