# call
call 的第一个参数，是一个对象。 Function 的调用者，将会指向这个对象。如果不传，则默认为全局对象 window。

```js
function func (a,b,c) {}

func.call(obj, 1,2,3)
// func 接收到的参数实际上是 1,2,3

func.call(obj, [1,2,3])
// func 接收到的参数实际上是 [1,2,3],undefined,undefined

```
## 使用场景
1.继承
```js
function superClass () {
    this.a = 1;
    this.print = function () {
        console.log(this.a);
    }
}
function subClass () {

// 继承了 superClass 的 print 方法和 a 变量
    superClass.call(this);
    this.print();
}

subClass();
// 1
```

2.借用方法
```js
let domNodes = Array.prototype.slice.call(document.getElementsByTagName("*"));
```
类数组想使用 Array 原型链上的方法，参照这个
domNodes 就可以应用 Array 下的所有方法了


# apply
只接收两个参数，第一个参数的规则与 call 一致
区别：第二个参数，必须是数组或者类数组，它们会被转换成类数组(具备与数组特征类似的对象，for 循环/length属性)

```js
func.apply(obj, [1,2,3])
// func 接收到的参数实际上是 1,2,3

func.apply(obj, {
    0: 1,
    1: 2,
    2: 3,
    length: 3
})
// func 接收到的参数实际上是 1,2,3
```

## 类数组
具备与数组特征类似的对象，for 循环/length属性
比如，我们获取 DOM 节点的方法，返回的就是一个类数组。再比如，在一个方法中使用 arguments 获取到的所有参数，也是一个类数组
但是需要注意的是：类数组无法使用 forEach、splice、push 等数组原型链上的方法，毕竟它不是真正的数组。

## 使用场景
1.Math.max
```js
let max = Math.max.apply(null, array);
```

2.实现两个数组合并
```js
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

Array.prototype.push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]
```

# bind
bind() 方法创建一个新的函数，并且需要稍后调用，才会执行。而 apply 和 call 则是立即调用。
```js
function add (a, b) {
    return a + b;
}

function sub (a, b) {
    return a - b;
}

add.bind(sub, 5, 3); // 这时，并不会返回 8
add.bind(sub, 5, 3)(); // 调用后，返回 8
```
如果 bind 的第一个参数是 null 或者 undefined，this 就指向全局对象 window

