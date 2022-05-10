// 项目使用版本
const package = {
    "xgplayer": "^2.14.4",
    "xgplayer-hls.js": "^2.3.0"
}

//不同视频源初始化播放器
// 视频mp4/直播m3u8+flv

getPlayer (playerType, force = false) {
  if (!force && this.playerType === playerType) return
  if (this.playerType !== 'flv') {
    this.xg.src = ''
  }
  this.config.url = ''
  this.xg.destroy()
  this.xg = null
  switch (playerType) {
    case 'mp4':
      this.xg = new Player(this.config)
      break
    case 'flv':
      this.xg = new FlvJsPlayer(this.config)
      break
    default:
      this.xg = new HlsJsPlayer(this.config)
  }
}

// 初始化配置选项
const config = {
  id: 'mse0',
  width: window.innerWidth,
  height: window.innerWidth * vitem.wh,
  poster: vitem.url,  //封面
  url: '//video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8', //视频链接
  // 适配相关-同层播放微信端
  playsinline: true, // 处理ios点击播放默认全屏问题
  'x5-video-player-type': 'h5-page',

  isLive: true, //直播
  autoplay: true, //自动播放
  cors: true, // 请求是否跨域
  loop: true,
  preload: 'auto',//<video>加载元素后是否应该开始下载视频数据
  fitVideoSize: 'fixWidth', //宽度为准，高度auto（全屏时切换）
  controls: true, // 播放器控制
  controlsList: ['nodownload'], // 关闭控制器相关配置 ['nodownload','nofullscreen','noremoteplayback'] 只对原生video有效 对自定义UI请使用ignores选项
  ignores: ['cssFullscreen',  //忽略插件
    'danmu', 'download', 
    'localPreview', 'memoryPlay',
    'pip', 'playNext', 'rotate', 'screenShot',
    'definition', 'fullscreen', 'i18n', 'play', 
    'loading', 
    // 'mobile', //包括autoplay，不能忽略
    // 'pc', 
    'playbackRate', 'volume', 'replay'
  ],
  'x5-video-player-fullscreen': true,
  lang: 'zh-cn', // 语言支持 'zh-cn' | 'en' | 'jp' 中文、英文、日文
  closePlayVideoFocus: true,  //处理自动聚焦，页面滚动到定位视频，导致swiper上下视频位移偏差
  rotateFullscreen: false,// 样式全屏，不旋转=>视频会随着手机横竖屏进行切换
  closeVideoClick: false, // video触发click事件后视频切换播放/暂停状态 关闭
  closeVideoTouch: true, // h5端触发touchend事件后视频切换播放/暂停状态 关闭
  // 其他一些属性
  // enableSwipeHandler: true,
  // closeVideoClick: true,
  // rotateFullscreen: false,
  // disableLongPress: false,
  // enableStallCheck: true
  // videoInit: true
  // rotateFullscreen: true

  // enableVideoDbltouch: true,
  // disableVideoDbltouch: true,
  // closeVideoTouch: true,
  // closeVideoPreventDefault: true,
  // closeVideoStopPropagation: true,
}

// 监听player状态事件
player.on('error', err => {
  console.error('报错了')
  if (
    !document.querySelector(
      `#${id}.xgplayer video`
    )
  ) {
    console.error('还没挂载上video元素')
    let root = document.querySelector('.xgplayer')
    if (root) {
      root.insertBefore(this.player.video, undefined)
    }
  }
})
player.on('waiting',() => {
  console.log('缓存等待中')
})
player.on('canplay',() => {
  console.log('可以播放了')
})
player.on('play',() => {
  console.log('播放了')
})
player.on('playing',() => {
  console.log('在播放了')
})
player.on('pause',() => {
  console.log('暂停了')
})

// 播放器状态
console.log(this.player.networkState) // 返回视频的当前网络状态
console.log(this.player.hasStart)// 是否开始播放
console.log(this.player.readyState)//返回视频的就绪状态
console.log(this.player.paused)//返回视频播放/暂停

// app横屏
使用app内部api

// 其他浏览器不给横屏
// 检测横屏状态就有很多坑
// 2/用css的@media all and (orientation : landscape)
// 能检测到横屏 但是如果页面里有输入框 安卓的机子呼出键盘的时候就会被css检测为横屏状态
// 3/js的window.orientation
// 这个确实能检测到横屏变化 但是安卓又奇葩了 有些安卓手机的微信是不支持横屏的 怎么都横不过来 
// 有的手机却能横屏 但是横屏了根本不会触发监听横屏的事件 横屏状态执行window.orientation获得的结果依然是0
// 4/就算用屏幕分辨率来判断是不是横屏都有坑
// 比如手机分辨率是 宽320*高568 有的手机横屏以后会变成 宽568*高320 但有的手机是不变的
