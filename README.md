# vue-music 一个模仿网易云音乐的单页面应用

#说明

这是我在暑假花了十多天做的一个单页面应用，目的是为了熟悉一下Vue.js的开发。

网易云音乐APP的功能模块非常多，目前仅仅完成了`首页`，`歌单`，`播放器`，`搜索歌曲和歌手`，`查看评论`等一些基本的功能。

所有需要登录才能使用的功能目前都尚未开发。

由于获取网易云数据的方式比较特殊，有时候请求数据的时间会偏久一点（为此自己也做了缓存机制来缓解这一问题）。

# 项目地址

https://github.com/SlowSoulWen/vue-music

# 项目预览

手机请扫描下方二维码预览

![手机预览](http://oo917ps5l.bkt.clouddn.com/1501167847.png)

PC预览地址（只做了移动端适配，请将浏览器设置为手机预览模式）

[www.wenguangblog.cn:8080](www.wenguangblog.cn:8080)

# 前端技术栈

vue2 + vuex + vue-router  + vue-awesome-swiper + axios + webpack 

# 后端

网易云音乐API由 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供

自己在该项目基础上增加了IP代理及缓存机制，以防止网易封禁IP及减少后台的请求频率。

# 效果演示

![首页](http://oo917ps5l.bkt.clouddn.com/vue-music-home.gif)

![歌单页](http://oo917ps5l.bkt.clouddn.com/vue-music-songslist.gif)

![搜索页](http://oo917ps5l.bkt.clouddn.com/vue-music-search.gif)

![播放页](http://oo917ps5l.bkt.clouddn.com/vue-music-player.gif)

![评论页](http://oo917ps5l.bkt.clouddn.com/vue-music-comment.gif)

# 安装

``` bash
$ git clone git@github.com:SlowSoulWen/vue-music.git
$ npm install
```

# 运行

``` bash
$ npm run dev 
```
