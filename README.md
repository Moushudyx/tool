## Electron + TypeScript + Babel + Vue-eslint-parser + React + Antd

一个用于扫描Intl和将中文转为Intl的工具，目前支持三种格式的`intl`：
- `Hzero Intl`格式，即`intl.get(code, params).d()`，其导出格式为`csv`
- `Umi Intl`格式，目前并没有直接支持其`intl.formatMessage`格式，而是需要通过工具函数改为`intl.get.d`，其导出格式为`JS`对象
- `Vue i18n`格式，即`intl(code, params).d()`或`this.intl().d()`，导出格式为`JSON`

由于是使用`babel`在语法树的层面对调用表达式进行检测，所以不用考虑注释，字符串不会有引号的问题，不会有代码格式的问题。

代码中有对模板字符串的检测逻辑：
- `get`中的模板字符串支持插入变量，但该变量必须在该文件的最外层定义，并且为字符串常量
- `d`中的模板字符串同样支持插入变量和表达式，根据`intl`的使用规范，`d`中插入了变量，必须在`get`中的第二个参数提供该变量，这同样在代码中有检测。注意，如果使用了模板字符串中使用了比较复杂的表达式可能会造成问题

我并没有找到合适的`Vue AST`工具，目前使用的是`vue-eslint-parser`转化为语法树并检测，其中`template`中的中文转`intl`是手动字符串替换，因为`vue-eslint-parser`并没有提供好的工具函数，恼（
`Vue`中的`script`仍然是使用`babel`处理，目前还存在一些问题，比如`uniapp`预编译注释的会使`babel`解析报错（比如在不同的预编译注释里面重复定义了变量）

## Installation

Use a package manager of your choice (npm, yarn, etc.) in order to install all dependencies

```bash
yarn
```

## Usage

Just run `start` script.

```bash
yarn start
```

## Packaging

To generate the project package based on the OS you're running on, just run:

```bash
yarn package
```

## Contributing

Pull requests are always welcome 😃.

## License

[MIT](https://choosealicense.com/licenses/mit/)
