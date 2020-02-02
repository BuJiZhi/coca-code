import { 
  InodeHandler,
  Iiterator,
  ItarversBack,
  IsimpleValue
 } from '../../types/compiler';
 import { Node } from 'acorn';
import { Itrack } from '../../types/animate';
import { IanimateKey } from '../../types/store';
import { startend2Index } from '../tools';

let trackCount: number;
const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    trackCount = 0;
    nodeIterator.node.body.forEach(item => {
      nodeIterator.traverse(item, undefined, []);
    })
  },

  // 变量定义
  VariableDeclaration: nodeIterator => {
    const code = nodeIterator.code;
    const kind = nodeIterator.node.kind;
    console.log(nodeIterator.node)
    if (nodeIterator.node.declarations) {
      for (const declaration of nodeIterator.node.declarations) {
        // 一个轨道列表就相当于是一条语句
        const { start, end, id, init} = declaration;
        if (id instanceof Node) {
          const idNode = nodeIterator.traverse(id);
          const initNode = declaration.init
            ? nodeIterator.traverse(declaration.init)
            : {value: undefined, preTrack: {
              begin: trackCount++,
              end: 0,
              content: {
                type: "t2",
                startpos: idNode.content.startpos[0],
                endpos: idNode.content.endpos[0],
                value: "undefined",
                key: "undefined"
              }
            }};

          // 本节点动画
          const track = {
            begin: trackCount++,
            end: trackCount,
            content: {
              type: "t3",
              startpos: idNode.preTrack.content.startpos[0],
              endpos: initNode.preTrack.content.startpos[1],
              value: initNode.value,
              key: `lta-${trackCount}`
            }
          }
          nodeIterator.addTrack(track);
          
          // 本节点操作
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const mirrorOperate = (): void => {
              // 在state添加了mirrorScope以后，如果改变了它的值，store里是否会更新？
              nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);
            }

          // 前面节点动画结束点
          for (let i = 0; i < nodeIterator.tracks.length - 1; i++) {
            let track = nodeIterator.tracks[i];
            if (track.end === 0) {
              track.end = trackCount;
            }
          }

          // 上传轨道
          nodeIterator.addOperateTrack(nodeIterator.operations, nodeIterator.tracks);
        }
      }
    }
    console.log(nodeIterator.tracks);
  },

  // 值定义
  Literal: nodeIterator => {
    const { start, end, value } = nodeIterator.node;

    const code = nodeIterator.code;
    const pos = startend2Index(start, end, code);

    // 本节点动画
    let track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t2",
        startpos: pos[0],
        endpos: pos[1],
        value,
        key: `lta-${trackCount}`
      }
    }
    nodeIterator.addTrack(track);

    // 本节点操作
    const literalOperate = () => { return nodeIterator.node.value; }
    nodeIterator.addOperation(literalOperate);
    // 上一个节点的结束点 无

    // 返回值
    if(nodeIterator.node.value === undefined) {
      track.content.value = 'undefined';
      // nodeIterator.addOperateTrack(literalOperate, track);
      return {value: undefined, preTrack: track};
    }
    track.content.value = nodeIterator.node.value;
    // nodeIterator.addOperateTrack(literalOperate, track);
    return {value: nodeIterator.node.value, preTrack: track};
  },

  // 标识符
  Identifier: nodeIterator => {
    const { code, node, stateHandler } = nodeIterator;
    const { name, start, end } = node;
    const pos = startend2Index(start, end, code);
    
    // track
    let track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t1",
        startpos: pos[0],
        endpos: pos[1],
        value: name,
        key: `idf-${trackCount}`
      }
    }
    nodeIterator.addTrack(track);
    // operation
    const identifierOperate = () => {
      return;
    }
    nodeIterator.addOperation(identifierOperate);
    // nodeIterator.addOperateTrack(IdentifierOperate, track);
    return {
      value: name,
      preTrack: track
    }
  },

  // 表达式
  ExpressionStatement: nodeIterator => {
    return nodeIterator.traverse(nodeIterator.node.expression);
  },

  AssignmentExpressionMap: {
   "=": (simpleValue: IsimpleValue, value: any) => simpleValue.set(value),
   "++": (simpleValue: IsimpleValue) => simpleValue.set(++simpleValue.value)
  },

  // 赋值表达式
  AssignmentExpression: nodeIterator => {
    const node = nodeIterator.node;
    if (node.left.type === 'Identifier') {
      const simpleValue = nodeIterator.scope.get(node.left.name);
      nodeHandlers.AssignmentExpressionMap[node.operator](simpleValue, nodeIterator.traverse(node.right));
    }
  },

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