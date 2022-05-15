// ------------------------------------------

// vue2.5.12源码分析
// 1、执行 import Vue from 'vue' 做了什么？
// 入口: \src\platforms\web\entry-runtime.js，得到Vue的构造函数

/* 2、Vue的构造函数做了什么？
    2.1 *initGlobalAPI
      - 初始化 Vue 上一些属性/方法（即类方法，而不是实例方法）

    2.2 *core/index (主要核心在core目录下)
      - 初始化工作：初始化Vue.prototype上一些属性/方法
        - initMixin: 初始化Vue.prototype._init方法
        - stateMixin: 初始化$data, $props属性、初始化$set, $delete, $watch方法
        - eventsMixin: 初始化$on, $off, $once, $emit方法
        - lifecycleMixin: 初始化_update, $forceUpdate, $destroy方法
        - renderMixin: 初始化$nextTick 和 _render 方法以及一大堆renderHelpers
      - 调用_init，执行其他几个初始化方法
 

    2.3 总结：Vue类包含了哪些内容？
      - 构造函数
          function Vue () {
            this._init()
          }
      - 全局config对象，我们几乎不会用到
          Vue.config = {
            keyCodes,
            _lifecycleHooks: ['beforeCreate', 'created', ...]
          }
      - 默认的options配置，我们每个组件都会继承这个配置。
          Vue.options = {
            beforeCreate, // 比如 vue-router 就会注册这个回调，因此会每一个组件继承
            components, // 前面提到了，默认组件有三个 `KeepAlive`,`transition`, `transitionGroup`，这里注册的组件就是全局组件，因为任何一个组件中不用声明就能用了。所以全局组件的原理就是这么简单
            directives, // 默认只有 `v-show` 和 `v-model`
            filters // 不推荐使用了
          }
      - 一些全局方法
          Vue.use // 注册插件
          Vue.component // 注册组件
          Vue.directive // 注册指令
          Vue.nextTick //下一个tick执行函数
          Vue.set/delete // 数据的修改操作
          Vue.mixin // 混入mixin用的  
      - Vue.prototype 上有几种不同作用的方法
          - 由initMixin 添加的 `_init` 方法，是Vue实例初始化的入口方法，会调用其他的功能初始话函数
            Vue.prototype._init
          - 由 initState 添加的三个用来进行数据操作的方法
            Vue.prototype.$data
            Vue.prototype.$props
            Vue.prototype.$watch
          - 由initEvents添加的事件方法
            Vue.prototype.$on
            Vue.prototype.$off
            Vue.prototype.$one
            Vue.prototype.$emit
          - 由 lifecycle添加的生命周期相关的方法
            Vue.prototype._update
            Vue.prototype.$forceUpdate
            Vue.prototype.$destroy
      - 在 platform 中添加的生命周期方法
          Vue.prototype.$mount
      - 由renderMixin添加的`$nextTick` 和 `_render` 以及一堆renderHelper
          Vue.prototype.$nextTick
          Vue.prototype._render
          Vue.prototype._b
          Vue.prototype._e
*/



export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data
    
    constructor (value: any) {
      this.value = value
      this.dep = new Dep()
      this.vmCount = 0
      // 初始化属性
      def(value, '__ob__', this)
      // 1、数组的响应式
      if (Array.isArray(value)) {
        // 是否支持__proto__属性
        if (hasProto) {
          // 是, 将value.__proto__指向Array.prototype
          protoAugment(value, Object.create(Array.prototype))
        } else {
          // 否, 将Array.prototype自身属性复制到value下
          copyAugment(value, Object.create(Array.prototype), Object.getOwnPropertyNames(Object.create(Array.prototype)))
        }
        this.observeArray(value)
      } else {
        // 2、非数组
        this.walk(value)
      }
    }
    observeArray (items: Array<any>) {
      for (let i = 0, l = items.length; i < l; i++) {
        // 将数组元素转换为响应式
        observe(items[i])
      }
    }

}

function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 元素是否有__ob__, 如有，__ob__是否是Observer实例，是说明已经转为响应式（返回响应式数据即可）
  if (Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve = true &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}
let _isServer
const inBrowser = typeof window !== 'undefined'
// JSContext的扩展属性WXEnvironment
const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
function isServerRendering() {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}