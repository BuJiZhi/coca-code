import { 
  InodeHandler,
  Iiterator,
  IsimpleValue,
  Ioperation
 } from '../../types/compiler';
import { Node } from 'acorn';
import { Itrack } from '../../types/animate';
import { startend2Index, /*deepCopy*/ } from '../tools';

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
let operationCount: number;

/**
 * 节点有主干节点以及叶子节点组成
 * 主干节点有上传动画轨道及操作函数的权限，
 * 因此主干节点都有创建新的轨道列表及操作列表
 */
const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    trackCount = 0;
    keyCount = 0;
    operationCount = 0;
    const nodes = nodeIterator.node.body as Node[];
    nodes.forEach(item => {
      nodeIterator.traverse(item as Node, {tracks: [], operations: []});
    })
  },

  // 变量定义
  VariableDeclaration: nodeIterator => {
    const code = nodeIterator.code;
    const kind = nodeIterator.node.kind;
    let variableTrack: Itrack[] = [];
    let variableOperate: Ioperation[] = [];
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
          variableTrack.push(idTrack);
          // 2. id节点操作函数
          const idOperate = {
            key: operationCount++,
            operation: () => {}
          };
          variableOperate.push(idOperate);
          // 3. 上个节点的结束点，无
          // 4. 返回值
          const idNode = {
            value: name,
            preTrack: idTrack
          }

          const initNode = init
            ? nodeIterator.traverse(init as Node, {tracks: variableTrack, operations: variableOperate})
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
          variableTrack.push(track);
          
          // 本节点操作
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const mirrorOperate = {
            key: operationCount++,
            operation: (): void => {
              // 在state添加了mirrorScope以后，如果改变了它的值，store里是否会更新？
              nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);
            }
          }
          variableOperate.push(mirrorOperate);

          // 前面节点动画结束点
          for (let i = 0; i < variableTrack.length - 1; i++) {
            let track = variableTrack[i];
            if (track.end === 0) {
              track.end = trackCount;
            }
          }
        }
      }
      // 上传轨道及操作函数
      nodeIterator.addOperateTrack(variableOperate, variableTrack);
    }
  },

  unaryoperateMap: {
    "-": (a: number) => -a
  },

  // 一元操作符
  UnaryExpression: nodeIterator => {
    const { node, code } = nodeIterator;
    const { argument, operator, start, end } = node;
    const pos = startend2Index(start, end, code);
    const argResult = nodeIterator.traverse(argument);
    const value = nodeHandlers.unaryoperateMap[operator](argResult.value);
    
    // 1.本节点动画
    const track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: "t2",
        startpos: pos[0],
        endpos: pos[1],
        value,
        key: `uae-${++keyCount}`
      }
    }
    nodeIterator.addTrack(track);

    // 2.本节点操作函数
    const unaryOp = {
      key: operationCount++,
      operation: () => {}
    };;
    nodeIterator.addOperation(unaryOp);

    // 3.上一个节点动画结束，无

    // 4. 返回
    return {
      value,
      preTrack: track
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
    const literalOperate = {
      key: operationCount++,
      operation: () => {}
    };;
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
    const identifierOperate = {
      key: operationCount++,
      operation: () => {}
    };;
    nodeIterator.addOperation(identifierOperate);
    return {
      value,
      preTrack: track
    }
  },

  // 表达式
  ExpressionStatement: nodeIterator => {
    let expressionTrack: Itrack[] = [];
    let expressionOperate: Ioperation[] = [];
    nodeIterator.traverse(nodeIterator.node.expression, {tracks: expressionTrack, operations: expressionOperate});
    expressionTrack = trackSetEnd(expressionTrack, trackCount);
    nodeIterator.addOperateTrack(expressionOperate, expressionTrack);
    // return result;
  },

  AssignmentExpressionMap: {
   "=": (simpleValue: IsimpleValue, value: any) => simpleValue.set(value),
   "++": (simpleValue: IsimpleValue) => simpleValue.set(++simpleValue.value),
  },

  // 赋值表达式
  AssignmentExpression: nodeIterator => {
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
    const idOperate = {
      key: operationCount++,
      operation: () => {}
    };;
    nodeIterator.addOperation(idOperate);
    // 3. 上个节点的结束点，无
    // 4. 返回值
    // const idNode = {
    //   value: name,
    //   preTrack: idTrack
    // }
    if (right instanceof Node) {
      const {value, preTrack}  = nodeIterator.traverse(right);
      // 1.本节点动画
      let track: Itrack = {
        begin: trackCount++,
        end: 0,
        content: {
          type: "t3",
          endpos: idTrack.content.startpos,
          startpos: preTrack.content.endpos,
          value: value,
          key: `asg-${++keyCount}`
        }
      }
      nodeIterator.addTrack(track);

      // 2. 本节点操作
      let val = nodeIterator.scope.get(name);
      nodeHandlers.AssignmentExpressionMap[operator](val, value);
      // 以闭包的方式保存，确保数据的准确
      const literalOperate = {
        key: operationCount++,
        operation: (function(val: any) {
          const valInside = val;
          return function() {
            let simplevalue = nodeIterator.mirrorScope.get(name);
            nodeHandlers.AssignmentExpressionMap[operator](simplevalue, valInside);
          }
        })(value)
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
    const binaryOp = {
      key: operationCount++,
      operation: () => {}
    };;
    nodeIterator.addOperation(binaryOp);
    // 3.上个节点动画结束, 无

    // 4. 返回
    return {value: result, preTrack: track};
  },

  // 条件判断
  IfStatement: nodeIterator => {
    const { node } = nodeIterator;
    console.log(node);
    const { test, consequent, alternate } = node;
    const ifStmTracks: Itrack[] = [];
    const ifOperate: Ioperation[] = [];
    const testResult = nodeIterator.traverse(test, {tracks: ifStmTracks, operations: ifOperate});
    if (testResult.value) {
      nodeIterator.traverse(consequent, {tracks: ifStmTracks, operations: ifOperate});
    } else if (node.alternate) {
      nodeIterator.traverse(alternate as Node, {tracks: ifStmTracks, operations: ifOperate});
    }
    trackSetEnd(ifStmTracks, trackCount);
    nodeIterator.addOperateTrack(ifOperate, ifStmTracks);
  },

  // 块语句
  BlockStatement: nodeIterator => {
    let scope = nodeIterator.createScope('block');
    let mirrorScope = nodeIterator.createMirroScope('block');
    const nodes = nodeIterator.node.body as Node[];
    for (const node of nodes) {
      nodeIterator.traverse(node as Node, {scope, mirrorScope, operations: nodeIterator.operations});
    }
    trackSetEnd(nodeIterator.tracks, trackCount);
  },

  // while循环
  WhileStatement(nodeIterator) {
    const { node } = nodeIterator;
    const { test } = node;
    const whileTrack: Itrack[] = [];
    const whileOperate: Ioperation[] = [];
    let whileCount = 0; //  防止死循环的出现
    while (nodeIterator.traverse(test, {tracks: whileTrack, operations: whileOperate}).value && whileCount < 100) {
      nodeIterator.traverse(node.body as Node, {tracks: whileTrack, operations: whileOperate});
      trackSetEnd(whileTrack, trackCount);
      whileCount += 1;
    }
    nodeIterator.addOperateTrack(whileOperate, whileTrack);
  },

  // for循环
  ForStatement(nodeIterator) {
    const { node } = nodeIterator;
    const { init, test, update, body } = node;
    let forTrack: Itrack[] = [];
    let forOperate: Ioperation[] = []; 
    // let scope = nodeIterator.createScope('block');
    for (nodeIterator.traverse(init as Node, {tracks: forTrack, operations: forOperate});
      nodeIterator.traverse(test, {tracks: forTrack, operations: forOperate}).value;
      nodeIterator.traverse(update, {tracks: forTrack, operations: forOperate})
      ) {
        nodeIterator.traverse(body, {tracks: forTrack, operations: forOperate});
    }
    trackSetEnd(forTrack, trackCount);
    nodeIterator.addOperateTrack(forOperate, forTrack);
  },

  // for循环，参数更新
  UpdateExpression(nodeIterator) {
    const { node, code } = nodeIterator;
    const { argument, operator, start, end } = node;
    const pos = startend2Index(start, end, code);
    // @ts-ignore
    let simpleValue = nodeIterator.scope.get(argument.name);
    const value = nodeHandlers.AssignmentExpressionMap[nodeIterator.node.operator](simpleValue);
    // 1.本节点动画
    const track: Itrack = {
      begin: trackCount++,
      end: 0,
      content: {
        type: 't4',
        value,
        startpos: pos[0],
        endpos: pos[1],
        key: `upd-${++keyCount}`
      }
    }
    nodeIterator.addTrack(track);
    // 2.本节点操作
    const updateOperate = {
      key: operationCount++,
      operation: () => {
        // @ts-ignore
        let simpleValue = nodeIterator.mirrorScope.get(argument.name);
        nodeHandlers.AssignmentExpressionMap[nodeIterator.node.operator](simpleValue);
      }
    }
    nodeIterator.addOperation(updateOperate);
    // 3.设置结束，返回值，无
  },

  FunctionDeclaration: nodeIterator => {
    const { node } = nodeIterator;
    console.log(node);
    // const fn = nodeHandlers.FunctionExpression(nodeIterator);
    // nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fn);
    // return fn;
  },

  FunctionExpression(nodeIterator) {
    const { node } = nodeIterator;
    console.log(node);
    /**
     * 1、定义函数需要先为其定义一个函数作用域，且允许继承父级作用域
     * 2、注册`this`, `arguments`和形参到作用域的变量空间
     * 3、检查return关键字
     * 4、定义函数名和长度
     */
    // const fn = function() {
    //   const scope = nodeIterator.createScope('function');
    //   node.params.forEach((param, index) => {
    //     const name = param.name;
    //     scope.varDeclare(name, arguments[index]);
    //   })
    // }

    // Object.defineProperties(fn, {
    //   name: {value: node.id ? node.id.name : ''},
    //   length: {value: node.params.length}
    // })
    // return fn;
  },

  // // 调用函数
  // CallExpression(nodeIterator) {
  //   const node = nodeIterator.node;
  //   const args = node.arguments.map(arg => nodeIterator.traverse(arg));
  //   const func = nodeIterator.traverse(nodeIterator.node.callee);
  //   return func.apply(args);
  // },
}

export default nodeHandlers;