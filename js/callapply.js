function add(c, d) {
    console.log(this.a + this.b + c + d);
}

var o = { a: 1, b: 3 };

// 第一个参数是作为‘this’使用的对象
// 后续参数作为参数传递给函数调用
add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

// 第一个参数也是作为‘this’使用的对象
// 第二个参数是一个数组，数组里的元素用作函数调用中的参数
add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34


function bar() {
    console.log(Object.prototype.toString.call(this));
}
bar.call(8);


/**
 * bind
 */
function f() {
    return this.a;
}
var g = f.bind({ a: '哈哈' });
console.log(g());

var h = g.bind({ a: '呵呵' });
console.log(h());

var o = { a: 37, f: f, g: g, h: h };
console.log(o.a, o.f(), o.g(), o.h());


/**
 * jiantou
 */
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject);

var obj = { foo: foo };
console.log(obj.foo() === globalObject); // true

// 尝试使用call来设定this
console.log(foo.call(obj) === globalObject); // true

// 尝试使用bind来设定this
foo = foo.bind(obj);
console.log(foo() === globalObject); // true

var obj = {
    bar: function() {
        var x = (() => this);
        return x;
    }
}
console.log(obj.bar());