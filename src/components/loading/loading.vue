<template>
    <div class="loading">
        <img src="./loading.gif" alt="">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
    export default {
        mounted() {
            var _this = this;
            setTimeout(function() {
                _this.msg = '若长时间未加载成功可以退出重试..'
            },40000)
        },
        props: {
            msg: {
                type: String,
                default: '正在加载中...'
            }
        }
    }
</script>

<style>
    .loading {
        padding: 20px 0;
        width: 100%;
        text-align: center;
    }
    .loading img {
        width: 20%;
        height: auto;
    }
    .loading h1 {
        padding: 0;
        margin: 0;
        color: #d3d3d3;
        font-size: 12px;
    }
</style>