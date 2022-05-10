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