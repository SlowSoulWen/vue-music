<template>
    <div id="footer">
        <div class="item">
            <router-link to="/index">
                <svg class="icon active" aria-hidden="true">
                    <use xlink:href="#icon-wangyiyunyinlezizhi"></use>
                </svg>
                <h2>我的音乐</h2>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/index">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yinyue"></use>
                </svg>
                <h2>发现音乐</h2>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/index">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-19"></use>
                </svg>
                <h2>朋友</h2>
            </router-link>
        </div>
        <div class="item">
            <router-link to="/index">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhanghao"></use>
                </svg>
                <h2>账号</h2>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style>
    #footer {
        position: fixed;
        display: flex;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        background: rgba(0,0,0,0.9);
    }
    #footer .item {
        flex: 1;
        text-align: center;
    }
    #footer .item .icon {
        color: #666;
        font-size: 1.6em;
        padding: 5px 0;
    }
    #footer .item h2 {
        font-size: 10px;
        padding: 3px 0;
    }
    .active {
        color: #ffffff !important;
    }
</style>