<template>
    <div class="swiper">
        <swiper :options="generalSwiperOption" ref="mySwiper">
            <swiper-slide v-for="(item,index) in banners">
                <img :src="item.pic" alt="">
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>
</template>


<script>
    import axios from 'axios'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        props: {
            getUrl: {
                default: null,
                type: String
            } 
        },
        data() {
            return {
                banners: [],  // 存放轮播图
                generalSwiperOption: {
                    notNextTick: true,
                    autoplay: 3000,
                    direction : 'horizontal',
                    grabCursor : true,
                    setWrapperSize :true,
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    scrollbar:false,
                    mousewheelControl : true,
                    observeParents:true,
                    debugger: true,
                    loop: true,
                    pagination: '.swiper-pagination'
                }
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        mounted() {
            if( this.getUrl ) {
                this.getBanner();
            }
        },
        methods: {
            //  获取轮播图数据
            getBanner() {
                var _this = this;
                axios.get(_this.getUrl).then(function(res){
                    console.log("轮播图数据:");
                    console.log(res.data.banners);
                    _this.banners = res.data.banners;
                    _this.$emit('bannerUpdate')
                })
            } 
        }
    }
</script>

<style>
    .swiper img{
        width: 100%;
    }
    .swiper-pagination .swiper-pagination-bullet-active {
        background: #D23023 
    }
</style>