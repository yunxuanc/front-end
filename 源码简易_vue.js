// ## 创建git文件
https://blog.csdn.net/ZM_Yang/article/details/105617607

// # 1.数据初始化
// 针对props,methods,data,computed和watch做数据的初始化处理，并将他们转换为响应式对象
function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  // 初始化props
  if (opts.props) { initProps(vm, opts.props); }
  // 初始化methods
  if (opts.methods) { initMethods(vm, opts.methods); }
  // 初始化data
  if (opts.data) {
    initData(vm);
  } else {
    // 如果没有定义data，则创建一个空对象，并设置为响应式
    observe(vm._data = {}, true /* asRootData */);
  }
  // 初始化computed
  if (opts.computed) { initComputed(vm, opts.computed); }
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
//  vue.js
class Vue {
  constructor(options) {
    // 1.初始化操作：保存选项配置属性
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2.把data的成员转换成getter和setter，注入到vue实例中
    this._proxyData(this.$data)
    // 3.监听数据变化
    new Observer(this.$data)
    // 4.调用compiler对象,解析指令和差值表达式
    new Compiler(this)
  }
  _proxyData(data){
    if(!data || typeof data !== 'Object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
}
// observer.js
// # vue的响应式实现模拟
class Observer {
  constructor(data) {
    // 遍历data成员转换成getter和setter，注入到vue实例中
    this._proxyData(data)
  }
  _proxyData(data){
    if(!data || typeof data !== 'Object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(obj, key, val) {
    const _this = this;
    //* 如果val是对象，也把val的属性递归转为响应式数据
    this._proxyData(val)
    // 把data属性注入到vue实例中,obj相当于this.$data
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 使用闭包存储val，用data[key]会自调用死循环
        return val
      },
      set(newVal) {
        if(newVal == val) { return }
        val = newVal
        // this这里指向data
        //* 如果新赋值是对象，将对象的属性转为响应式
        _this._proxyData(newVal)
      }
    })
  }
}

// 依赖
// vue.js
// observer.js
// compile.js

let vm = new Vue({
  el: '#app',
  data: {
    msg: 'Hello Vue',
    isloading: false,
    person: {
      name: 'jack'
    }
  }
})
console.log(vm.msg)
vm.msg = {
  err: '400'
}

// compile.js
// 编译器
class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 处理节点
      if(this.isTextNode(node)) {
        this.compileText(node)
      } else if(this.isElementNode(node)) {
        this.compileElement(node)
      }
      // 处理子节点,递归调用
      if(node.childNodes) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历所有属性节点
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      // 判断是否是指令
      if(this.isDirective(attrName)) {
        // 执行指令动作
        let attrValue = attr.value
        // 指令函数名前缀为指令名去除v-
        attrName = attrName.substr(2)
        this.update(node, attrName, attrValue)
      }

    })
  }
  update(node, attrName, key) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn(node, this.$vm[key])
  }
  // 处理v-text指令
  textUpdater(node, value) {
    // 更新内容
    node.textContent = value
  }
  // 处理v-model指令
  modelUpdater(node, value) {
    // 更新值
    node.value = value
  }
  // 编译文本节点，处理插值表达式
  compileText(node) {
    // {{ msg }}
    let reg = /\{\{(.+?)\}\}/; //插值表达式正则匹配
    let value = node.textContent;  //文本节点内容
    // 如果存在插值表达式
    if(reg.test(value)) {
      let key = RegExp.$1.trim() //$1表示筛选出的第一组(变量名)
      node.textContent = value.replace(reg, this.vm[key]) //将{{msg}}替换成Hello Vue
    }

  }
  // 判断属性是否指令
  isDirective(attrName) {
    return attrName.startwith('v-')//startwith字符串自带方法
  }
  // 判断是否文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断是否元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}





