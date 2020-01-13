import { 
  InodeHandler,
  Iiterator,
  ItarversBack
 } from '../../types/compiler';
import { IanimateKey } from '../../types/store';
import { startend2Index } from '../tools';

const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    nodeIterator.node.body.forEach(item => {
      nodeIterator.traverse(item);
    })
  },

  // 变量定义
  VariableDeclaration: nodeIterator => {
    // const { start, end } = nodeIterator.node;
    const code = nodeIterator.code;
    const kind = nodeIterator.node.kind;
    if (nodeIterator.node.declarations) {
      for (const declaration of nodeIterator.node.declarations) {
        const { name, start, end } = declaration.id;
        const pos = startend2Index(start, end, code);
        let animate: IanimateKey = {
          on: true,
          type: 'VariableDeclaration',
          pos: pos,
          payload: Object.create(null)
        }
        const backInfo = declaration.init ?
          nodeIterator.traverse(declaration.init) :
          {value: undefined};
        nodeIterator.scope.declare(name, backInfo.value, kind);
        animate.payload = backInfo.animate;
        const mirrorOperate = (): void => {
          // 在state添加了mirrorScope以后，如果改变了它的值，store里是否会更新？
          nodeIterator.mirrorScope.declare(name, backInfo.value, kind);
        }
        nodeIterator.createMirrorOpAnm(mirrorOperate, animate);
      }
    }
  },

  // 值定义
  Literal: nodeIterator => {
    const { start, end } = nodeIterator.node;
    const code = nodeIterator.code;
    const pos = startend2Index(start, end, code);
    let animate: IanimateKey = {
      on: true,
      type: 'Literal',
      pos: pos,
      payload: Object.create(null)
    }
    const literalOperate = () => { return nodeIterator.node.value; }
    if(nodeIterator.node.value === undefined) {
      animate.payload.value = 'undefined';
      nodeIterator.createMirrorOpAnm(literalOperate, animate);
      return {value: undefined, animate};
    }
    animate.payload.value = nodeIterator.node.value;
    nodeIterator.createMirrorOpAnm(literalOperate, animate);
    return {value: nodeIterator.node.value, animate};
  },

  // 标识符
  // Identifier: nodeIterator => {
  //   const { code, node } = nodeIterator;
  //   const { name, start, end } = node;
  //   const pos = startend2Index(start, end, code);
  //   const IdentifierOperate = () => {
  //     return;
  //   }
  //   let animate = {
  //     on: true,
  //     type: 'Identifier',
  //     pos,
  //     payload: Object.create(null);
  //   }
  //   nodeIterator.createMirrorOpAnm(IdentifierOperate, animate);
  //   return nodeIterator.scope.get(name).value;
  // },
  // // 表达式
  // ExpressionStatement: nodeIterator => {
  //   return nodeIterator.traverse(nodeIterator.node.expression);
  // },

  // AssignmentExpressionMap: {
  //  "=": (simpleValue, value) => simpleValue.set(value),
  //  "++": (simpleValue) => simpleValue.set(++simpleValue.value)
  // },

  // // 赋值表达式
  // AssignmentExpression: nodeIterator => {
  //   const node = nodeIterator.node;
  //   if (node.left.type === 'Identifier') {
  //     const simpleValue = nodeIterator.scope.get(node.left.name);
  //     nodeHandlers.AssignmentExpressionMap[node.operator](simpleValue, nodeIterator.traverse(node.right));
  //   }
  // },

  // // 运算操作
  // BinaryExpressionOperatorMap: {
  //   '+': (a, b) => a + b,
  //   '-': (a, b) => a - b,
  //   '*': (a, b) => a * b,
  //   '/': (a, b) => a / b,
  //   '==': (a, b) => a === b,
  //   '>': (a, b) => a > b,
  //   '<': (a, b) => a < b
  // },

  // BinaryExpression: nodeIterator => {
  //   const left = nodeIterator.traverse(nodeIterator.node.left);
  //   const right = nodeIterator.traverse(nodeIterator.node.right);
  //   return nodeHandlers.BinaryExpressionOperatorMap[nodeIterator.node.operator](left, right);
  // },

  // // 条件判断
  // IfStatement: nodeIterator => {
  //   if (nodeIterator.traverse(nodeIterator.node.test)) {
  //     nodeIterator.traverse(nodeIterator.node.consequent)
  //   } else if (nodeIterator.node.alternate) {
  //     nodeIterator.traverse(nodeIterator.node.alternate);
  //   }
  // },

  // // 块语句
  // BlockStatement: nodeIterator => {
  //   let scope = nodeIterator.createScope('block');
  //   for (const node of nodeIterator.node.body) {
  //     nodeIterator.traverse(node, {scope})
  //   }
  // },

  // FunctionDeclaration: nodeIterator => {
  //   const fn = nodeHandlers.FunctionExpression(nodeIterator);
  //   nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fn);
  //   return fn;
  // },

  // FunctionExpression(nodeIterator) {
  //   const node = nodeIterator.node;
  //   /**
  //    * 1、定义函数需要先为其定义一个函数作用域，且允许继承父级作用域
  //    * 2、注册`this`, `arguments`和形参到作用域的变量空间
  //    * 3、检查return关键字
  //    * 4、定义函数名和长度
  //    */
  //   const fn = function() {
  //     const scope = nodeIterator.createScope('function');
  //     node.params.forEach((param, index) => {
  //       const name = param.name;
  //       scope.varDeclare(name, arguments[index]);
  //     })
  //   }

  //   Object.defineProperties(fn, {
  //     name: {value: node.id ? node.id.name : ''},
  //     length: {value: node.params.length}
  //   })

  //   return fn;
  // },

  // // 调用函数
  // CallExpression(nodeIterator) {
  //   const node = nodeIterator.node;
  //   const args = node.arguments.map(arg => nodeIterator.traverse(arg));
  //   const func = nodeIterator.traverse(nodeIterator.node.callee);
  //   return func.apply(args);
  // },

  // // while循环
  // WhileStatement(nodeIterator) {
  //   while (nodeIterator.traverse(nodeIterator.node.test)) {
  //     nodeIterator.traverse(nodeIterator.node.body);
  //   }
  // },

  // // for循环
  // ForStatement(nodeIterator) {
  //   let scope = nodeIterator.createScope('block');
  //   for (nodeIterator.traverse(nodeIterator.node.init, {scope});
  //     nodeIterator.traverse(nodeIterator.node.test, {scope});
  //     nodeIterator.traverse(nodeIterator.node.update, {scope})
  //     ) {
  //       nodeIterator.traverse(nodeIterator.node.body, {scope});
  //   }
  // },

  // // for循环，参数更新
  // UpdateExpression(nodeIterator) {
  //   let simpleValue = nodeIterator.scope.get(nodeIterator.node.argument.name);
  //   nodeHandlers.AssignmentExpressionMap[nodeIterator.node.operator](simpleValue);
  // }
}

export default nodeHandlers;