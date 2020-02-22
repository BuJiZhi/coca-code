import { 
  InodeHandler,
  Iiterator,
  IsimpleValue,
  Istep,
  Inode,
  ImemberValue
 } from '../../types/compiler';
import {Node} from 'acorn';
import {Itrack, Position, AnimationTypes, ValueType} from '../../types/animation';
import {startend2Index, typeOf} from '../../utils/tools';
import Signal from './Signal';
import {MemberValue} from './Value';

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

function produceBaseTrack(start:number, end:number, code:string, counter:number):Itrack {
  const pos = startend2Index(start, end, code);
  return produceTrack('', 'base', pos[0], pos[1], counter, trackCounter);
}

function produceStep(step:()=>void, stepCounter:number):Istep {
  return {key: stepCounter, step}
}

function getPropertyName (node:Inode, nodeIterator:Iiterator) {
  if (node.computed) {
    return nodeIterator.traverse(node.property).value;
  } else {
    return node.property.name
  }
}

function getIdenOrMemberValue(node:Inode, nodeIterator:Iiterator, scope:string) {
  if (node.type === 'Identifier') {
    if (scope === 'scope') {
      return nodeIterator.scope.get(node.name);
    } else if (scope === 'mirrorscope') {
      return nodeIterator.mirrorScope.get(node.name);
    }
  } else if (node.type === 'MemberExpression') {
    const obj = nodeIterator.traverse(node.object)
    const name = getPropertyName(node, nodeIterator)
    return new MemberValue(obj, name)
  } else {
    throw new Error(`canjs: Not support to get value of node type "${node.type}"`)
  }
}

let trackCounter: number;
let basetrackCounter:number;
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
    basetrackCounter = 0;
    const nodes = nodeIterator.node.body as Node[];
    nodes.forEach(item => {
      nodeIterator.traverse(item as Inode);
    })
  },

  VariableDeclaration: nodeIterator => {
    const {code, node} = nodeIterator
    const {kind, start, end} = node;
    let variableTracks: Itrack[] = [];
    variableTracks.push(produceBaseTrack(start, end, code, basetrackCounter));
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
          console.log(track)
          variableTracks.push(track);
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const step = produceStep(
            (): void => {nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);},
            stepCounter++
          );
          variableSteps.push(step);
        }
      }
      // 上传轨道及操作函数
      trackSetEnd(variableTracks, trackCounter);
      nodeIterator.storeStepAndTrack(variableSteps, variableTracks);
    }
  },

  unaryoperateMap: {
    "-": (nodeIterator:Iiterator) => {
      const nodeReturn = nodeIterator.traverse(nodeIterator.node.argument as Inode);
      nodeReturn.value = -nodeReturn.value;
      return nodeReturn;
    },
    "+": (nodeIterator:Iiterator) => {
      const nodeReturn = nodeIterator.traverse(nodeIterator.node.argument as Inode);
      nodeReturn.value = +nodeReturn.value;
      return nodeReturn;
    },
    "!": (nodeIterator:Iiterator) => {
      const nodeReturn = nodeIterator.traverse(nodeIterator.node.argument as Inode);
      nodeReturn.value = !nodeReturn.value;
      return nodeReturn;
    },
    "~": (nodeIterator:Iiterator) => {
      const nodeReturn = nodeIterator.traverse(nodeIterator.node.argument as Inode);
      nodeReturn.value = ~nodeReturn.value;
      return nodeReturn;
    },
    "typeof": (nodeIterator:Iiterator) => {
      const argument = <Inode>nodeIterator.node.argument;
      if (argument.type === 'Identifier') {
        const result = nodeIterator.traverse(nodeIterator.node.argument as Inode);
        try {
          const value = nodeIterator.scope.get(argument.name);
          const type = value ? typeof value : 'undefined';
          result.value = type;
          return result;
        } catch(err) {
          if (err.message === `${argument.name} is not defined`) {
            result.value = 'undefined';
            return result;
          } else {
            throw err;
          }
        } 
      }
      const nodeReturn = nodeIterator.traverse(nodeIterator.node.argument as Inode);
      nodeReturn.value = +nodeReturn.value;
      return nodeReturn;
    }
    // unfinished
    // "void": (nodeIterator:Iiterator) => {
    // },
    // "delete": (nodeIterator:Iiterator) => {
    // },
  },

  UnaryExpression: nodeIterator => {
    const { node, code } = nodeIterator;
    const { argument, operator, start, end } = node;
    const pos = startend2Index(start, end, code);
    const result = nodeHandlers.unaryoperateMap[operator](nodeIterator);
    const track = produceTrack(result.value, "appear", pos[0], pos[1], keyCounter++, trackCounter);
    nodeIterator.addTrack(track);
    const unaryStep = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(unaryStep);
    return {value: result.value, preTrack: track}
  },

  Literal: nodeIterator => {
    const { start, end, value } = nodeIterator.node;
    const code = nodeIterator.code;
    const pos = startend2Index(start, end, code);
    const track:Itrack = produceTrack(value, "appear", pos[0], pos[1], keyCounter++, trackCounter++);
    nodeIterator.addTrack(track);
    const literalStep = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(literalStep);
    if(nodeIterator.node.value === undefined) {
      track.effect.value = 'undefined';
      return {value: undefined, preTrack: track};
    }
    track.effect.value = nodeIterator.node.value;
    return {value: nodeIterator.node.value, preTrack: track};
  },

  Identifier: nodeIterator => {
    const { code, node } = nodeIterator;
    const { name, start, end } = node;
    const pos = startend2Index(start, end, code);
    const value = nodeIterator.scope.get(name).value;
    let track = produceTrack(value, 'appear', pos[0], pos[1], keyCounter++, trackCounter++);
    nodeIterator.addTrack(track);
    const identifierOperate = produceStep(
      donothing,
      stepCounter++,
    )
    nodeIterator.addStep(identifierOperate);
    return {value, preTrack: track};
  },
  
  BinaryExpressionOperatorMap: {
    '==': (a:number, b:number) => a == b,
    '!=': (a:number, b:number) => a != b,
    '===': (a:number, b:number) => a === b,
    '!==': (a:number, b:number) => a !== b,
    '<': (a:number, b:number) => a < b,
    '<=': (a:number, b:number) => a <= b,
    '>': (a:number, b:number) => a > b,
    '>=': (a:number, b:number) => a >= b,
    '<<': (a:number, b:number) => a << b,
    '>>': (a:number, b:number) => a >> b,
    '>>>': (a:number, b:number) => a >>> b,
    '+': (a:number, b:number) => a + b,
    '-': (a:number, b:number) => a - b,
    '*': (a:number, b:number) => a * b,
    '/': (a:number, b:number) => a / b,
    '%': (a:number, b:number) => a % b,
    '**': (a:number, b:number) => a ** b,
    '|': (a:number, b:number) => a | b,
    '^': (a:number, b:number) => a ^ b,
    '&': (a:number, b:number) => a & b,
    'in': (a:any, b:object | any[]) => a in b,
    'instanceof': (a:any, b:any) => a instanceof b
  },

  BinaryExpression: nodeIterator => {
    const {code, node} = nodeIterator;
    const {start, end} = node;
    const baseTrack = produceBaseTrack(start, end, code, basetrackCounter);
    const pos = startend2Index(start, end, code);
    const right = nodeIterator.traverse(node.right).value;
    const left = nodeIterator.traverse(node.left).value;
    const result = nodeHandlers.BinaryExpressionOperatorMap[nodeIterator.node.operator](left, right);
    let value = result === true ? 'true' : result === false ? 'false' : result;
    let track = produceTrack(value, 'compute', pos[0], pos[1], keyCounter++, trackCounter++);
    nodeIterator.addTrack(track);
    const binaryOp = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(binaryOp);
    return {value: result, preTrack: track};
  },

  ExpressionStatement: nodeIterator => {
    const {node, code} = nodeIterator;
    const {start, end} = node;
    let expressionTrack: Itrack[] = [];
    let expressionStep: Istep[] = [];
    const baseTrack = produceBaseTrack(start, end, code, basetrackCounter);
    expressionTrack.push(baseTrack);
    nodeIterator.traverse(nodeIterator.node.expression, {tracks: expressionTrack, steps: expressionStep});
    expressionTrack = trackSetEnd(expressionTrack, trackCounter);
    nodeIterator.storeStepAndTrack(expressionStep, expressionTrack);
  },

  MemberExpression: nodeIterator => {
    const {node, code, scope} = nodeIterator;
    const {object, property} = node;
    const obj = nodeIterator.traverse(object);
    const prop = node.property.name;
    // return obj[prop];
  },

  AssignmentExpressionMap: {
    '=': (value:IsimpleValue | ImemberValue, v:any) => value.set(v),
    '+=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() + v),
    '-=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() - v),
    '*=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() * v),
    '/=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() / v),
    '%=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() % v),
    '**=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() ** v),
    '<<=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() << v) ,
    '>>=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() >> v),
    '>>>=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() >>> v),
    '|=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() | v),
    '^=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() ^ v),
    '&=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() & v),
    '++': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() + 1),
    '--': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() - 1),

  },

  AssignmentExpression: nodeIterator => {
    const code = nodeIterator.code;
    const { left, right, operator } = nodeIterator.node;
    const { start, end, name } = left;
    const baseTrack = produceBaseTrack(start, end, code, basetrackCounter);
    nodeIterator.addTrack(baseTrack);
    const idPos = startend2Index(start, end, code);
    const idTrack = produceTrack(
      name, 'appear', idPos[0], idPos[1], keyCounter++, trackCounter++
    )
    nodeIterator.addTrack(idTrack);
    const idStep = produceStep(donothing, stepCounter++);
    nodeIterator.addStep(idStep);

    if (right instanceof Node) {
      const {value, preTrack}  = nodeIterator.traverse(right);
      const track = produceTrack(
        value, 'move', preTrack.effect.endpos, idTrack.effect.startpos, keyCounter++, trackCounter++
      );
      nodeIterator.addTrack(track);
      let val = getIdenOrMemberValue(left, nodeIterator, 'scope');
      nodeHandlers.AssignmentExpressionMap[operator](val, value);
      const assnStep = produceStep(
        () => {
          let val = getIdenOrMemberValue(left, nodeIterator, 'mirrorscope');
          nodeHandlers.AssignmentExpressionMap[operator](val, value);
         },
        stepCounter++
      );
      nodeIterator.addStep(assnStep);
    }
  },

  IfStatement:nodeIterator => {
    const {node, code} = nodeIterator;
    const {start, end, test, consequent, alternate} = node;
    const ifStmTracks: Itrack[] = [];
    const ifSteps: Istep[] = [];
    const baseTrack = produceBaseTrack(start, end, code, ++basetrackCounter);
    ifStmTracks.push(baseTrack);
    const testResult = nodeIterator.traverse(test, {tracks:ifStmTracks, steps:ifSteps});
    if (testResult.value) {
      nodeIterator.traverse(consequent, {tracks:ifStmTracks, steps:ifSteps});
    } else if (node.alternate) {
      nodeIterator.traverse(alternate as Inode, {tracks: ifStmTracks, steps:ifSteps});
    }
    trackSetEnd(ifStmTracks, trackCounter);
    nodeIterator.storeStepAndTrack(ifSteps, ifStmTracks);
  },

  BlockStatement:nodeIterator => {
    let scope = nodeIterator.createScope('block');
    let mirrorScope = nodeIterator.createMirroScope('block');
    const nodes = nodeIterator.node.body as Node[];
    for (const node of nodes) {
      const signal = nodeIterator.traverse(node as Inode, {scope, mirrorScope});
      if (Signal.isReturn(signal)) {
        trackSetEnd(nodeIterator.tracks, trackCounter);
        return signal;
      }
    }
    trackSetEnd(nodeIterator.tracks, trackCounter);
  },

  WhileStatement(nodeIterator) {
    const { node } = nodeIterator;
    const { test } = node;
    const whileTrack: Itrack[] = [];
    const whileSteps: Istep[] = [];
    let whileCount = 0; //  防止死循环的出现
    while (nodeIterator.traverse(test, {tracks: whileTrack, steps:whileSteps}).value && whileCount < 100) {
      nodeIterator.traverse(node.body as Inode, {tracks: whileTrack, steps:whileSteps});
      trackSetEnd(whileTrack, trackCounter);
      whileCount += 1;
    }
    nodeIterator.storeStepAndTrack(whileSteps, whileTrack);
  },

  ForStatement(nodeIterator) {
    const { node, code } = nodeIterator;
    const { start, end, init, test, update, body } = node;
    let forTrack: Itrack[] = [];
    let forSteps: Istep[] = []; 
    const baseTrack = produceBaseTrack(start, end, code, ++basetrackCounter);
    forTrack.push(baseTrack);
    for (nodeIterator.traverse(init as Inode, {tracks:forTrack, steps:forSteps});
      nodeIterator.traverse(test, {tracks:forTrack, steps:forSteps}).value;
      nodeIterator.traverse(update as Inode, {tracks: forTrack, steps:forSteps})
      ) {
        nodeIterator.traverse(body as Inode, {tracks:forTrack, steps:forSteps});
    }
    trackSetEnd(forTrack, trackCounter);
    nodeIterator.storeStepAndTrack(forSteps, forTrack);
  },

  UpdateExpression(nodeIterator) {
    const {node, code} = nodeIterator;
    const {operator, start, end} = node;
    const argument = <Inode>node.argument;
    const pos = startend2Index(start, end, code);
    let simpleValue = nodeIterator.scope.get(argument.name);
    const value = nodeHandlers.AssignmentExpressionMap[operator](simpleValue);
    const track = produceTrack(
      value, 'compute', pos[0], pos[1], keyCounter++, trackCounter++
    )
    nodeIterator.addTrack(track);
    const updateStep = produceStep(
      () => {
        let simpleValue = nodeIterator.mirrorScope.get(argument.name);
        nodeHandlers.AssignmentExpressionMap[operator](simpleValue);
      },
      stepCounter++
    );
    nodeIterator.addStep(updateStep);
  },

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

  ObjectExpression(nodeIterator) {
    const {node, code} = nodeIterator;
    const {start, end} = node;
    const basePos = startend2Index(start, end, code);
    const obj = Object.create(null);
    const baseTrack = produceTrack(
      '       \n', 'block', basePos[0], basePos[0], keyCounter++, trackCounter++
    );
    nodeIterator.addTrack(baseTrack);
    const baseStep = produceStep(donothing,stepCounter++);
    nodeIterator.addStep(baseStep);
    let track;
    for (const prop of nodeIterator.node.properties) {
      let key;
      if (prop.key.type === 'Literal') {
        const keyResult = nodeIterator.traverse(prop.key);
        key = `${keyResult.value}`;
      } else if (prop.key.type === 'Identifier') {
        const {start, end} = prop.key;
        const keyPos = startend2Index(start, end, code);
        const keyTrack = produceTrack(
          prop.key.name, 'appear', keyPos[0], keyPos[1], keyCounter++, trackCounter++
        );
        nodeIterator.addTrack(keyTrack);
        const keyStep = produceStep(donothing, stepCounter++);
        nodeIterator.addStep(keyStep);
        key = prop.key.name;
      } else {
        throw new Error(`[ObjectExpression] Unsupported property key type "${prop.key.type}"`)
      }
      const value = nodeIterator.traverse(prop.value).value;
      track = produceTrack(
        `${key}: ${value}\n`, 
        'block',
        basePos[0],
        basePos[0],
        keyCounter++,
        trackCounter++
      )
      nodeIterator.addTrack(track);
      obj[key] = value;
      const step = produceStep(
        donothing,
        stepCounter++
      );
      nodeIterator.addStep(step);
    }
    return {
      value: obj,
      preTrack: track
    }
  }
}

export default nodeHandlers;