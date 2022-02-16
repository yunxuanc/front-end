# qrcode

qrcode是一个用于生成二维码图片的插件
地址：[qrcode](https://www.npmjs.com/package/qrcode)

---

## 安装

安装：npm i qrcode --save

## 引入

需要用到的页面组件或者js文件中直接引入

import QRCode from 'qrcode'

使用

```jsx
<canvas id="canvas" style="width:300px;height:300px;"></canvas>

<script>
import QRCode from 'qrcode'
export default {
  mounted () {
    this.getCode()
  },
  methods: {
    getCode () {
      let canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, 'http://localhost:8080/home', { width: 200 }, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    }
  }
}
</script>
```

## Api

toCanvas

toDataURL

toString

## 最终实现

安装及引用如上方nuxt配置

```jsx
<template>
<client-only>
  <vue-qr :text="link" :size="108" :logoSrc="logoSrc" :logoScale="0.25" :margin="10" :dotScale="1"></vue-qr>
</client-only>
</template>

<script>
const logoSrc = require('@/assets/image/pc/logo-rect.png');
export default {
	data() {
    return {
			link: '',
      logoSrc: logoSrc
    };
	}
	mounted() {
		this.$nextTick(function () {
//生成当前地址二维码
      this.link = window.location.href;
    })
	}
}

</script>
```


---

 缺点：打包时会被编译，会报错

解决：使用其他库，例如**vue-qr**

参考：

引用/安装及生产环境兼容，参考

[nuxt 使用vue-qr生成二维码图片 - 爱瞎搞的技术宅](https://oitboy.com/detail?id=25)

[vue-qr 自动生成二维码+logo图片_木子静静的博客-CSDN博客_vue-qr 动态logo](https://blog.csdn.net/qq_37919055/article/details/106426461)