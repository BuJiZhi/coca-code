import { 
  InodeHandler,
  Iiterator,
  IsimpleValue,
  Istep,
  Inode
 } from '../../types/compiler';
import { Node } from 'acorn';
import { Itrack, Position, AnimationTypes, ValueType } from '../../types/animation';
import { startend2Index, typeOf } from '../../utils/tools';
import Signal from './Signal';

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

function produceTrack(
  value:any, 
  type:AnimationTypes, 
  startpos:Position, 
  endpos:Position, 
  keyCounter:number,
  trackCounter:number
  ):Itrack {
  return {
    begin: trackCounter,
    end: 0,
    effect: {
      value,
      type,
      valueType: typeOf(value),
      startpos,
      endpos,
      key: `${type}-${keyCounter}`
    }
  }
}

function produceStep(step:()=>void, stepCounter:number):Istep {
  return {
    key: stepCounter,
    step
  }
}

let trackCounter: number;
let keyCounter: number;
let stepCounter: number;
const donothing = () => {};
/**
 * 节点有主干节点以及叶子节点组成
 * 主干节点有上传动画轨道及操作函数的权限，
 * 因此主干节点都有创建新的轨道列表及操作列表
 */
const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    trackCounter = 0;
    keyCounter = 0;
    stepCounter = 0;
    const nodes = nodeIterator.node.body as Node[];
    nodes.forEach(item => {
      nodeIterator.traverse(item as Inode);
    })
  },

  // 变量定义
  VariableDeclaration: nodeIterator => {
    const code = nodeIterator.code;
    const kind = nodeIterator.node.kind;
    let variableTracks: Itrack[] = [];
    let variableSteps: Istep[] = [];
    if (nodeIterator.node.declarations) {
      for (const declaration of nodeIterator.node.declarations) {
        const { id, init } = declaration;
        if (id instanceof Node) {
          const { start, end, name } = id;
          const idPos = startend2Index(start, end, code);
          // 1. id节点动画
          const idTrack = produceTrack(name, "appear", idPos[0], idPos[1], keyCounter++, trackCounter++);
          variableTracks.push(idTrack);
          // 2. id节点操作函数
          const idStep = produceStep(donothing, stepCounter++);
          variableSteps.push(idStep);
          // 3. 上个节点的结束点，无
          // 4. 返回值
          const idNode = {value: name, preTrack: idTrack}

          const initNode = init
            ? nodeIterator.traverse(init as Inode, {tracks: variableTracks, steps: variableSteps})
            : {value: undefined, preTrack: produceTrack(
              'undefined', 
              'appear', 
              idNode.preTrack.effect.startpos,
              idNode.preTrack.effect.endpos,
              keyCounter++,
              trackCounter++
            )}

          const track = produceTrack(initNode.value, "move", initNode.preTrack.effect.startpos,
            idNode.preTrack.effect.startpos, keyCounter++, trackCounter++)
          variableTracks.push(track);
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const step = produceStep(
            (): void => {nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);},
            stepCounter++
          );
          variableSteps.push(step);

          for (let i = 0; i < variableTracks.length - 1; i++) {
            let track = variableTracks[i];
            if (track.end === 0) {
              track.end = trackCounter;
            }
          }
        }
      }
      // 上传轨道及操作函数
      nodeIterator.storeStepAndTrack(variableSteps, variableTracks);
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
    const argResult = nodeIterator.traverse(argument as Inode);
    const value = nodeHandlers.unaryoperateMap[operator](argResult.value);
    // 1.本节点动画
    const track = produceTrack(value, "appear", pos[0], pos[1], keyCounter, trackCounter);
    nodeIterator.addTrack(track);
    // 2.本节点操作函数
    const unaryStep = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(unaryStep);
    // 4. 返回
    return {value,preTrack: track}
  },

  // 值定义
  Literal: nodeIterator => {
    const { start, end, value } = nodeIterator.node;
    const code = nodeIterator.code;
    const pos = startend2Index(start, end, code);
    // 本节点动画
    const track:Itrack = produceTrack(value, "appear", pos[0], pos[1], keyCounter++, trackCounter++);
    nodeIterator.addTrack(track);
    // 本节点操作
    const literalStep = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(literalStep);
    // 返回值
    if(nodeIterator.node.value === undefined) {
      track.effect.value = 'undefined';
      return {value: undefined, preTrack: track};
    }
    track.effect.value = nodeIterator.node.value;
    return {value: nodeIterator.node.value, preTrack: track};
  },

  // // 标识符
  // Identifier: nodeIterator => {
  //   const { code, node } = nodeIterator;
  //   const { name, start, end } = node;
  //   const pos = startend2Index(start, end, code);
    
  //   const value = nodeIterator.scope.get(name).value;
  //   // track
  //   let track: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: "t2",
  //       startpos: pos[0],
  //       endpos: pos[1],
  //       value,
  //       valueType: typeOf(value),
  //       key: `idf-${++keyCount}`
  //     }
  //   }
  //   nodeIterator.addTrack(track);
  //   // operation
  //   const identifierOperate = {
  //     key: operationCount++,
  //     operation: () => {}
  //   };;
  //   nodeIterator.addOperation(identifierOperate);
  //   return {
  //     value,
  //     preTrack: track
  //   }
  // },

  // // 表达式
  // ExpressionStatement: nodeIterator => {
  //   let expressionTrack: Itrack[] = [];
  //   let expressionOperate: Istep[] = [];
  //   nodeIterator.traverse(nodeIterator.node.expression, {tracks: expressionTrack, operations: expressionOperate});
  //   expressionTrack = trackSetEnd(expressionTrack, trackCount);
  //   nodeIterator.addOperateTrack(expressionOperate, expressionTrack);
  //   // return result;
  // },

  // AssignmentExpressionMap: {
  //  "=": (simpleValue: IsimpleValue, value: any) => simpleValue.set(value),
  //  "++": (simpleValue: IsimpleValue) => simpleValue.set(++simpleValue.value),
  // },

  // // 赋值表达式
  // AssignmentExpression: nodeIterator => {
  //   const code = nodeIterator.code;
  //   const { left, right, operator } = nodeIterator.node;
  //   const { start, end, name } = left;
  //   // 判断变量是否已经定义，如果没有会报错
  //   nodeIterator.scope.get(name);
  //   const idPos = startend2Index(start, end, code);
  //   // 1. id节点动画
  //   const idTrack: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: "t2",
  //       value: name,
  //       valueType: typeOf(name),
  //       startpos: idPos[0],
  //       endpos: idPos[1],
  //       key: `idf-${++keyCount}`
  //     }
  //   }
  //   nodeIterator.addTrack(idTrack);
  //   // 2. id节点操作函数
  //   const idOperate = {
  //     key: operationCount++,
  //     operation: () => {}
  //   };;
  //   nodeIterator.addOperation(idOperate);
  //   // 3. 上个节点的结束点，无
  //   // 4. 返回值
  //   // const idNode = {
  //   //   value: name,
  //   //   preTrack: idTrack
  //   // }
  //   if (right instanceof Node) {
  //     const {value, preTrack}  = nodeIterator.traverse(right);
  //     // 1.本节点动画
  //     let track: Itrack = {
  //       begin: trackCount++,
  //       end: 0,
  //       content: {
  //         type: "t3",
  //         endpos: idTrack.content.startpos,
  //         startpos: preTrack.content.endpos,
  //         value,
  //         valueType: typeOf(value),
  //         key: `asg-${++keyCount}`
  //       }
  //     }
  //     nodeIterator.addTrack(track);

  //     // 2. 本节点操作
  //     let val = nodeIterator.scope.get(name);
  //     nodeHandlers.AssignmentExpressionMap[operator](val, value);
  //     // 以闭包的方式保存，确保数据的准确
  //     const literalOperate = {
  //       key: operationCount++,
  //       operation: (function(val: any) {
  //         const valInside = val;
  //         return function() {
  //           let simplevalue = nodeIterator.mirrorScope.get(name);
  //           nodeHandlers.AssignmentExpressionMap[operator](simplevalue, valInside);
  //         }
  //       })(value)
  //     }
  //     nodeIterator.addOperation(literalOperate);

  //     // 3. 上一个节点的结束点,无

  //   }
  // },

  // // 运算操作
  // BinaryExpressionOperatorMap: {
  //   '+': (a: number, b: number) => a + b,
  //   '-': (a: number, b: number) => a - b,
  //   '*': (a: number, b: number) => a * b,
  //   '/': (a: number, b: number) => a / b,
  //   '%': (a: number, b: number) => a % b,
  //   '==': (a: number, b: number) => a === b,
  //   '>': (a: number, b: number) => a > b,
  //   '<': (a: number, b: number) => a < b,
  //   '>=': (a: number, b: number) => a >= b,
  //   '<=': (a: number, b: number) => a <= b
  // },

  // BinaryExpression: nodeIterator => {
  //   const { code, node } = nodeIterator;
  //   const { start, end } = node;
  //   const pos = startend2Index(start, end, code);
  //   // 从右到左运算？
  //   const right = nodeIterator.traverse(node.right).value;
  //   const left = nodeIterator.traverse(node.left).value;
  //   const result = nodeHandlers.BinaryExpressionOperatorMap[nodeIterator.node.operator](left, right);
  //   // 1.本节点动画
  //   let value = result === true ? 'true' : result === false ? 'false' : result;
  //   let track: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: "t4",
  //       startpos: pos[0],
  //       endpos: pos[1],
  //       value,
  //       valueType: typeOf(value),
  //       key: `idf-${++keyCount}`
  //     }
  //   }
  //   nodeIterator.addTrack(track);

  //   // 2.本节点操作函数
  //   const binaryOp = {
  //     key: operationCount++,
  //     operation: () => {}
  //   };;
  //   nodeIterator.addOperation(binaryOp);
  //   // 3.上个节点动画结束, 无

  //   // 4. 返回
  //   return {value: result, preTrack: track};
  // },

  // // 条件判断
  // IfStatement: nodeIterator => {
  //   const { node } = nodeIterator;
  //   const { test, consequent, alternate } = node;
  //   const ifStmTracks: Itrack[] = [];
  //   const ifOperate: Istep[] = [];
  //   const testResult = nodeIterator.traverse(test, {tracks: ifStmTracks, operations: ifOperate});
  //   if (testResult.value) {
  //     nodeIterator.traverse(consequent, {tracks: ifStmTracks, operations: ifOperate});
  //   } else if (node.alternate) {
  //     nodeIterator.traverse(alternate as Node, {tracks: ifStmTracks, operations: ifOperate});
  //   }
  //   trackSetEnd(ifStmTracks, trackCount);
  //   nodeIterator.addOperateTrack(ifOperate, ifStmTracks);
  // },

  // // 块语句
  // BlockStatement: nodeIterator => {
  //   let scope = nodeIterator.createScope('block');
  //   let mirrorScope = nodeIterator.createMirroScope('block');
  //   const nodes = nodeIterator.node.body as Node[];
  //   for (const node of nodes) {
  //     const signal = nodeIterator.traverse(node as Node, {scope, mirrorScope, operations: nodeIterator.operations});
  //     if (Signal.isReturn(signal)) {
  //       trackSetEnd(nodeIterator.tracks, trackCount);
  //       return signal;
  //     }
  //   }
  //   trackSetEnd(nodeIterator.tracks, trackCount);
  // },

  // // while循环
  // WhileStatement(nodeIterator) {
  //   const { node } = nodeIterator;
  //   const { test } = node;
  //   const whileTrack: Itrack[] = [];
  //   const whileOperate: Istep[] = [];
  //   let whileCount = 0; //  防止死循环的出现
  //   while (nodeIterator.traverse(test, {tracks: whileTrack, operations: whileOperate}).value && whileCount < 100) {
  //     nodeIterator.traverse(node.body as Node, {tracks: whileTrack, operations: whileOperate});
  //     trackSetEnd(whileTrack, trackCount);
  //     whileCount += 1;
  //   }
  //   nodeIterator.addOperateTrack(whileOperate, whileTrack);
  // },

  // // for循环
  // ForStatement(nodeIterator) {
  //   const { node } = nodeIterator;
  //   const { init, test, update, body } = node;
  //   let forTrack: Itrack[] = [];
  //   let forOperate: Istep[] = []; 
  //   // let scope = nodeIterator.createScope('block');
  //   for (nodeIterator.traverse(init as Node, {tracks: forTrack, operations: forOperate});
  //     nodeIterator.traverse(test, {tracks: forTrack, operations: forOperate}).value;
  //     nodeIterator.traverse(update, {tracks: forTrack, operations: forOperate})
  //     ) {
  //       nodeIterator.traverse(body, {tracks: forTrack, operations: forOperate});
  //   }
  //   trackSetEnd(forTrack, trackCount);
  //   nodeIterator.addOperateTrack(forOperate, forTrack);
  // },

  // // for循环，参数更新
  // UpdateExpression(nodeIterator) {
  //   const { node, code } = nodeIterator;
  //   const { argument, operator, start, end } = node;
  //   const pos = startend2Index(start, end, code);
  //   // @ts-ignore
  //   let simpleValue = nodeIterator.scope.get(argument.name);
  //   const value = nodeHandlers.AssignmentExpressionMap[nodeIterator.node.operator](simpleValue);
  //   // 1.本节点动画
  //   const track: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: 't4',
  //       value,
  //       valueType: typeOf(value),
  //       startpos: pos[0],
  //       endpos: pos[1],
  //       key: `upd-${++keyCount}`
  //     }
  //   }
  //   nodeIterator.addTrack(track);
  //   // 2.本节点操作
  //   const updateOperate = {
  //     key: operationCount++,
  //     operation: () => {
  //       // @ts-ignore
  //       let simpleValue = nodeIterator.mirrorScope.get(argument.name);
  //       nodeHandlers.AssignmentExpressionMap[nodeIterator.node.operator](simpleValue);
  //     }
  //   }
  //   nodeIterator.addOperation(updateOperate);
  //   // 3.设置结束，返回值，无
  // },

  // FunctionDeclaration: nodeIterator => {
  //   const { node, code } = nodeIterator;
  //   const { start, end, id } = node;
  //   const pos = startend2Index(start, end, code);
  //   const funcTracks: Itrack[] = [];
  //   const funcOperations: Istep[] = [];
  //   // 1. 本节点动画
  //   const track: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: 't5',
  //       startpos: pos[0],
  //       endpos: pos[1],
  //       value: id.name,
  //       valueType: typeOf(id.name),
  //       key: `func-${++keyCount}`
  //     }
  //   }
  //   funcTracks.push(track);
  //   // 2.本节点操作函数
  //   const fns = nodeHandlers.FunctionExpression(nodeIterator);
  //   nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fns[0]);
  //   const funcOp: Istep = {
  //     key: operationCount++,
  //     operation: () => {
  //       nodeIterator.mirrorScope.varDeclare(nodeIterator.node.id.name, fns[1]);
  //     }
  //   }
  //   funcOperations.push(funcOp);
  //   // 3. 节点设置结束点
  //   trackSetEnd(funcTracks, trackCount);
  //   nodeIterator.addOperateTrack(funcOperations, funcTracks);
  //   // return fn;
  // },

  // // 根据节点生成对应函数
  // FunctionExpression (nodeIterator) {
  //   const node = nodeIterator.node;
  //   const fn = function() {
  //     const _arguments = arguments;
  //     const scope = nodeIterator.createScope('function');
  //     scope.constDeclare('arguments', _arguments);
  //     node.params.forEach((param, index) => {
  //       //@ts-ignore
  //       const name = param.name;
  //       scope.varDeclare(name, _arguments[index]); // 注册变量
  //     })

  //     const signal = nodeIterator.traverse(node.body, { scope });
  //     if (Signal.isReturn(signal)) {
  //       return signal.value
  //     }
  //   }
  //   const mirrorFn = function() {
  //     const mirrorScope = nodeIterator.createMirroScope('function')
  //     mirrorScope.constDeclare('arguments', arguments);
  //     node.params.forEach(function(param, index) {
  //       //@ts-ignore
  //       const name = param.name;
  //       mirrorScope.varDeclare(name, arguments[index]); // 注册变量
  //     })
  //   }
  //   Object.defineProperties(fn, {
  //     name: { value: node.id ? node.id.name : '' },
  //     length: { value: node.params.length }
  //   })
  //   Object.defineProperties(mirrorFn, {
  //     name: { value: node.id ? node.id.name : '' },
  //     length: { value: node.params.length }
  //   })

  //   return [fn, mirrorFn];
  // },

  // // 调用函数
  // CallExpression(nodeIterator) {
  //   const { node } = nodeIterator;
  //   const args = node.arguments.map(arg => nodeIterator.traverse(arg).value);
  //   const func = nodeIterator.traverse(nodeIterator.node.callee);
  //   // apply第一个参数为this的指向
  //   return func.value.apply(null, args);
  // },

  // ReturnStatement(nodeIterator) {
  //   const { node } = nodeIterator;
  //   let returnTrack: Itrack[] = [];
  //   let returnOperation: Istep[] = [];
  //   const result = nodeIterator.traverse(node.argument, {tracks: returnTrack, operations: returnOperation})
  //   returnTrack = trackSetEnd(returnTrack, trackCount);
  //   nodeIterator.addOperateTrack(returnOperation, returnTrack);
  //   return Signal.Return(result);
  // },

  // ArrayExpression(nodeIterator) {
  //   const { node, code } = nodeIterator;
  //   const { start, end, id } = node;
  //   const pos = startend2Index(start, end, code);
  //   const value = nodeIterator.node.elements.map(ele => nodeIterator.traverse(ele).value)
  //   // 1. 本节点动画
  //   const track: Itrack = {
  //     begin: trackCount++,
  //     end: 0,
  //     content: {
  //       type: 't2',
  //       value,
  //       valueType: typeOf(value),
  //       startpos: pos[0],
  //       endpos: pos[1],
  //       key: `arr-${++keyCount}`
  //     }
  //   };
  //   nodeIterator.addTrack(track);
  //   // 2.本节点操作
  //   const arrOperation: Istep = {
  //     key: operationCount++,
  //     operation: () => {}
  //   };
  //   nodeIterator.addOperation(arrOperation);
  //   // 3. 上个节点结束点，无
  //   // 4. 返回
  //   return {
  //     value,
  //     preTrack: track
  //   }
  // }
}

export default nodeHandlers;