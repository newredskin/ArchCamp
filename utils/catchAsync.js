// Important!!! Not very clear yet!
// 定义一个函数，接受另一个函数（称为controller）作为其参数，并返回一个async函数，该函数将为任何接收到的控制器保持try/catch。如果在包装函数内发生错误，则使用 catch 方法捕获错误，并将错误传递到下一个函数以由全局错误处理程序处理。
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

