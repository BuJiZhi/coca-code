import { 
  InodeHandler,
  Iiterator,
  ItarversBack,
  IsimpleValue
 } from '../../types/compiler';
import { Node } from 'acorn';
import { Itrack } from '../../types/animate';
import { startend2Index } from '../tools';

function trackSetEnd(tracks: Itrack[], endpoint: number): Itrack[] {
  let newTracks: Itrack[] = [...tracks];
  for (let i = 0; i < newTracks.length; i++) {
    let track = newTracks[i];
    if (track.end === 0) {
      track.end = endpoint;
    }
  }
  return newTracks;
}

let trackCount: number;
let keyCount: number;
const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    trackCount = 0;
    keyCount = 0;
    nodeIterator.node.body.forEach(item => {
      nodeIterator.traverse(item, undefined, [], []);
    })
  },

  // 变量定义
  VariableDeclaration: nodeIterator => {
    const code = nodeIterator.code;
    const kind = nodeIterator.node.kind;
    if (nodeIterator.node.declarations) {
      for (const declaration of nodeIterator.node.declarations) {
        // 一个轨道列表就相当于是一条语句
        const { id, init } = declaration;
        if (id instanceof Node) {
          const { start, end, name } = id;
          const idPos = startend2Index(start, end, code);
          // 1. id节点动画
          const idTrack: Itrack = {
            begin: trackCount++,
              end: 0,
              content: {
                type: "t2",
                value: name,
                startpos: idPos[0],
                endpos: idPos[1],
                key: `idf-${++keyCount}`
              }
          }
          nodeIterator.addTrack(idTrack);
          // 2. id节点操作函数
          const idOperate = () => {};
          nodeIterator.addOperation(idOperate);
          // 3. 上个节点的结束点，无
          // 4. 返回值
          const idNode = {
            value: name,
            preTrack: idTrack
          }

          const initNode = init
            ? nodeIterator.traverse(init)
            : {value: undefined, preTrack: {
              begin: trackCount++,
              end: 0,
              content: {
                type: "t2",
                startpos: idNode.preTrack.content.startpos[0],
                endpos: idNode.preTrack.content.endpos[0],
                value: "undefined",
                key: "undefined"
              }
            }};

          // 本节点动画
          const track: Itrack = {
            begin: trackCount++,
            end: trackCount,
            content: {
              type: "t3",
              startpos: initNode.preTrack.content.startpos,
              endpos: idNode.preTrack.content.startpos,
              value: initNode.value,
              key: `lta-${++keyCount}`
            }
          }
          nodeIterator.addTrack(track);
          
          // 本节点操作
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const mirrorOperate = (): void => {
            // 在state添加了mirrorScope以后，如果改变了它的值，store里是否会更新？
            nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);
          }
          nodeIterator.addOperation(mirrorOperate);

          // 前面节点动画结束点
          for (let i = 0; i < nodeIterator.tracks.length - 1; i++) {
            let track = nodeIterator.tracks[i];
            if (track.end === 0) {
              track.end = trackCount;
            }
          }
        }
      }
      // 上传轨道及操作函数
      nodeIterator.addOperateTrack(nodeIterator.operations, nodeIterator.tracks);
    }
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
        key: `lta-${++keyCount}`
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
      return {value: undefined, preTrack: track};
    }
    track.content.value = nodeIterator.node.value;
    return {value: nodeIterator.node.value, preTrack: track};
  },

  // 标识符
  Identifier: nodeIterator => {
    const { code, node } = nodeIterator;
    const { name, start, end } = node;
    const pos = startend2Index(start, end, code);
    
    const value = nodeIterator.scope.get(name).value;
    // track
    let track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t2",
        startpos: pos[0],
        endpos: pos[1],
        value,
        key: `idf-${++keyCount}`
      }
    }
    nodeIterator.addTrack(track);
    // operation
    const identifierOperate = () => {
      return;
    }
    nodeIterator.addOperation(identifierOperate);
    return {
      value,
      preTrack: track
    }
  },

  // 表达式
  ExpressionStatement: nodeIterator => {
    const result = nodeIterator.traverse(nodeIterator.node.expression);
    let { tracks, operations } = nodeIterator;
    tracks = trackSetEnd(tracks, trackCount);
    console.log(nodeIterator.tracks);
    nodeIterator.addOperateTrack(operations, tracks);
    return result;
  },

  AssignmentExpressionMap: {
   "=": (simpleValue: IsimpleValue, value: any) => simpleValue.set(value),
   "++": (simpleValue: IsimpleValue) => simpleValue.set(++simpleValue.value),
  },

  // 赋值表达式
  AssignmentExpression: nodeIterator => {
    console.log(nodeIterator.node);
    const code = nodeIterator.code;
    const { left, right, operator } = nodeIterator.node;
    const { start, end, name } = left;
    // 判断变量是否已经定义，如果没有会报错
    nodeIterator.scope.get(name);
    const idPos = startend2Index(start, end, code);
    // 1. id节点动画
    const idTrack: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t2",
        value: name,
        startpos: idPos[0],
        endpos: idPos[1],
        key: `idf-${++keyCount}`
      }
    }
    nodeIterator.addTrack(idTrack);
    // 2. id节点操作函数
    const idOperate = () => {};
    nodeIterator.addOperation(idOperate);
    // 3. 上个节点的结束点，无
    // 4. 返回值
    const idNode = {
      value: name,
      preTrack: idTrack
    }
    if (right instanceof Node) {
      const {value, preTrack} = nodeIterator.traverse(right);

      // 1.本节点动画
      let track: Itrack = {
        begin: trackCount++,
        end: 0,
        content: {
          type: "t3",
          endpos: idTrack.content.startpos,
          startpos: preTrack.content.endpos,
          value,
          key: `asg-${++keyCount}`
        }
      }
      nodeIterator.addTrack(track);

      // 2. 本节点操作
      let val = nodeIterator.scope.get(name);
      nodeHandlers.AssignmentExpressionMap[operator](val, value);
      const literalOperate = () => {
        let simplevalue = nodeIterator.mirrorScope.get(name);
        nodeHandlers.AssignmentExpressionMap[operator](simplevalue, value);
      }
      nodeIterator.addOperation(literalOperate);

      // 3. 上一个节点的结束点,无

    }
  },

  // 运算操作
  BinaryExpressionOperatorMap: {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '%': (a: number, b: number) => a % b,
    '==': (a: number, b: number) => a === b,
    '>': (a: number, b: number) => a > b,
    '<': (a: number, b: number) => a < b,
    '>=': (a: number, b: number) => a >= b,
    '<=': (a: number, b: number) => a <= b
  },

  BinaryExpression: nodeIterator => {
    const { code, node } = nodeIterator;
    const { start, end } = node;
    const pos = startend2Index(start, end, code);
    // 从右到左运算？
    const right = nodeIterator.traverse(node.right).value;
    const left = nodeIterator.traverse(node.left).value;
    const result = nodeHandlers.BinaryExpressionOperatorMap[nodeIterator.node.operator](left, right);
    // 1.本节点动画
    let value = result === true ? 'true' : result === false ? 'false' : result;
    let track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t4",
        startpos: pos[0],
        endpos: pos[1],
        value,
        key: `idf-${++keyCount}`
      }
    }
    nodeIterator.addTrack(track);

    // 2.本节点操作函数
    const binaryOp = () => {};
    nodeIterator.addOperation(binaryOp);

    // 3.上个节点动画结束, 无

    // 4. 返回
    return {value: result, preTrack: track};

  },

  // // 条件判断
  IfStatement: nodeIterator => {
    const { node } = nodeIterator;
    console.log(node);
    // if (nodeIterator.traverse(nodeIterator.node.test)) {
    //   nodeIterator.traverse(nodeIterator.node.consequent)
    // } else if (nodeIterator.node.alternate) {
    //   nodeIterator.traverse(nodeIterator.node.alternate);
    // }
  },

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