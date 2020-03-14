import { 
  InodeHandler,
  Iiterator,
  IsimpleValue,
  Istep,
  Inode,
  ImemberValue,
  IVariableDecalrations
 } from '../../types/compiler';
import {Itrack, AnimationTypes, ValueType, Ilocation, Ilocations} from '../../types/animation';
import {typeOf} from '../../utils/tools';
import Signal from './Signal';
import {MemberValue} from './Value';
import Counter from './Counter';

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
  loc: Ilocations,
  keyCounter:number,
  trackCounter:number
  ):Itrack {
  return {
    begin: trackCounter,
    end: 0,
    loc: loc,
    effect: {
      value,
      type,
      valueType: typeOf(value),
      startpos: loc.start,
      endpos: loc.end,
      key: `${type}-${keyCounter}`
    }
  }
}

function produceTrackBycounter(value:any, type:AnimationTypes, loc: Ilocations, keyAndTrack:[number, number]) {
  return produceTrack(value, type, loc, keyAndTrack[0], keyAndTrack[1]);
}

function produceBaseTrackAtLoc(loc:Ilocations, keycounter:number, trackCounter:number):Itrack {
  return produceTrack('', 'base', loc, keycounter, trackCounter);
}

function baseTrackAtLocBycounter(loc:Ilocations, baseKeyAndTrackcount:[number, number]):Itrack {
  return produceTrack('', 'base', loc,...baseKeyAndTrackcount);
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

function skipTest(value:string):boolean {
  if (value.length <= 2) return false;
  return value[0] === '_' && value[0] === value[1];
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

const donothing = () => {};
/**
 * 节点有主干节点以及叶子节点组成
 * 主干节点有上传动画轨道及操作函数的权限，
 * 因此主干节点都有创建新的轨道列表及操作列表
 */
const counter = new Counter();
const nodeHandlers: InodeHandler =  {

  Program: (nodeIterator: Iiterator) => {
    const nodes = nodeIterator.node.body as Inode[];
    nodes.forEach(item => {
      nodeIterator.traverse(item as Inode);
    })
  },

  VariableDeclaration: nodeIterator => {
    const {node} = nodeIterator;
    const {kind, loc, declarations} = node as IVariableDecalrations;
    let variableTracks: Itrack[] = [];
    let variableSteps: Istep[] = [];
    if (declarations) {
      for (const declaration of declarations) {
        const {id, init} = declaration;
        if (id) {
          const name = id.name;
          const idloc = id.loc;
          const skip = skipTest(name);
          variableTracks.push(baseTrackAtLocBycounter(loc, counter.getBaseKeyAndTrackCount(skip)));
          // 1. id节点动画
          const idTrack = produceTrackBycounter(name, "appear", idloc, counter.getKeyAndTrackCount(skip));
          variableTracks.push(idTrack);
          // 2. id节点操作函数
          const idStep = produceStep(donothing, counter.getStepcount(skip));
          variableSteps.push(idStep);
          // 3. 上个节点的结束点，无
          // 4. 返回值
          const idNode = {value: name, preTrack: idTrack}

          const initNode = init
            ? nodeIterator.traverse(init as Inode, {tracks: variableTracks, steps: variableSteps, skip:skip})
            : {value: undefined, preTrack: produceTrack(
              'undefined', 
              'appear', 
              idNode.preTrack.loc,
              ...counter.getKeyAndTrackCount(skip),
            )}
          const track = produceTrack(
            initNode.value, 
            "move",
            {start: initNode.preTrack.effect.startpos,
              end: idNode.preTrack.effect.startpos
            },
            ...counter.getKeyAndTrackCount(skip))
          variableTracks.push(track);
          nodeIterator.scope.declare(idNode.value, initNode.value, kind);
          const step = produceStep(
            (): void => {nodeIterator.mirrorScope.declare(idNode.value, initNode.value, kind);},
            counter.getStepcount(skip)
          );
          variableSteps.push(step);
        }
      }
      // 上传轨道及操作函数
      trackSetEnd(variableTracks, counter.trackCounter);
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
    const {node, skip} = nodeIterator;
    const {operator, loc} = node;
    const result = nodeHandlers.unaryoperateMap[operator](nodeIterator);
    const track = produceTrackBycounter(result.value, "appear", loc, counter.getKeyAndTrackCount(skip));
    nodeIterator.addTrack(track);
    const unaryStep = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addStep(unaryStep);
    return {value: result.value, preTrack: track}
  },

  Literal: nodeIterator => {
    const {node, skip} = nodeIterator;
    const {loc, value} = node;
    const track:Itrack = produceTrackBycounter(value, "appear", loc, counter.getKeyAndTrackCount(skip));
    const literalStep = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addTrack(track);
    nodeIterator.addStep(literalStep);
    if(nodeIterator.node.value === undefined) {
      track.effect.value = 'undefined';
      return {value: undefined, preTrack: track};
    }
    track.effect.value = nodeIterator.node.value;
    return {value: nodeIterator.node.value, preTrack: track};
  },

  Identifier: nodeIterator => {
    let {node, skip} = nodeIterator;
    const {name, loc} = node;
    if (!skip) {
      skip = skipTest(name);
    }
    const value = nodeIterator.scope.get(name).value;
    let track = produceTrackBycounter(value, 'appear', loc, counter.getKeyAndTrackCount(skip));
    nodeIterator.addTrack(track);
    const identifierOperate = produceStep(donothing, counter.getStepcount(skip));
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
    'instanceof': (a:any, b:any) => {
      switch (b) {
        case 'Array':
          return a instanceof Array;
        default:
          if (b instanceof Object) {
            return a instanceof b;
          } else {
            return false;
          }
      }
    }
  },

  BinaryExpression: nodeIterator => {
    let {node, skip} = nodeIterator;
    const {loc} = node;
    const left = nodeIterator.traverse(node.left).value;
    if (!skip) {skip = skipTest(left);}
    const right = nodeIterator.traverse(node.right).value;
    const result = nodeHandlers.BinaryExpressionOperatorMap[nodeIterator.node.operator](left, right);
    let value = result === true ? 'true' : result === false ? 'false' : result;
    let track = produceTrackBycounter(value, 'compute', loc, counter.getKeyAndTrackCount(skip));
    nodeIterator.addTrack(track);
    const binaryOp = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addStep(binaryOp);
    return {value: result, preTrack: track};
  },

  ExpressionStatement: nodeIterator => {
    const {node, skip} = nodeIterator;
    const {loc} = node;
    let expressionTrack: Itrack[] = [];
    let expressionStep: Istep[] = [];
    const baseTrack = baseTrackAtLocBycounter(loc, counter.getBaseKeyAndTrackCount(skip));
    expressionTrack.push(baseTrack);
    nodeIterator.traverse(nodeIterator.node.expression, {tracks: expressionTrack, steps: expressionStep, skip});
    expressionTrack = trackSetEnd(expressionTrack, counter.trackCounter);
    nodeIterator.storeStepAndTrack(expressionStep, expressionTrack);
  },

  MemberExpression: nodeIterator => {
    const {node} = nodeIterator;
    const {object, property} = node;
    const obj:{[index:string]:any} = nodeIterator.traverse(object);
    const prop = property.name;
    return {
      value:obj.value[prop],
      preTrack: obj.preTrack
    };
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
    '--': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() - 1)
  },

  AssignmentExpression: nodeIterator => {
    const {node, skip} = nodeIterator;
    const {left, right, operator} = node;
    const {loc, name} = left;
    const idTrack = produceTrackBycounter(name, 'appear', loc, counter.getBaseKeyAndTrackCount(skip));
    nodeIterator.addTrack(idTrack);
    const idStep = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addStep(idStep);

    if (right) {
      const {value, preTrack}  = nodeIterator.traverse(right);
      const track = produceTrackBycounter(
        value, 
        'move',
        {
          start: preTrack.loc.start,
          end: idTrack.loc.start
        },
        counter.getKeyAndTrackCount(skip)
      );
      nodeIterator.addTrack(track);
      let val = getIdenOrMemberValue(left, nodeIterator, 'scope');
      nodeHandlers.AssignmentExpressionMap[operator](val, value);
      const assnStep = produceStep(
        () => {
          let val = getIdenOrMemberValue(left, nodeIterator, 'mirrorscope');
          nodeHandlers.AssignmentExpressionMap[operator](val, value);
         },
        counter.getStepcount(skip)
      );
      nodeIterator.addStep(assnStep);
    }
  },

  IfStatement:nodeIterator => {
    let {node, skip} = nodeIterator;
    const {loc, test, consequent, alternate} = node;
    const ifStmTracks: Itrack[] = [];
    const ifSteps: Istep[] = [];
    if (!skip) {skip = skipTest(test.left.name)};
    const baseTrack = baseTrackAtLocBycounter(loc, counter.getBaseKeyAndTrackCount(skip));
    ifStmTracks.push(baseTrack);
    const testResult = nodeIterator.traverse(test, {tracks:ifStmTracks, steps:ifSteps, skip});
    if (testResult.value) {
      nodeIterator.traverse(consequent, {tracks:ifStmTracks, steps:ifSteps});
    } else if (node.alternate) {
      nodeIterator.traverse(alternate as Inode, {tracks: ifStmTracks, steps:ifSteps});
    }
    trackSetEnd(ifStmTracks, counter.basetrackCounter);
    nodeIterator.storeStepAndTrack(ifSteps, ifStmTracks);
  },

  BlockStatement: nodeIterator => {
    let scope = nodeIterator.createScope('block');
    let mirrorScope = nodeIterator.createMirroScope('block');
    const nodes = nodeIterator.node.body as Inode[];
    console.log(nodes);
    for (const node of nodes) {
      const signal = nodeIterator.traverse(node as Inode, {scope, mirrorScope});
      if (Signal.isReturn(signal)) {
        trackSetEnd(nodeIterator.tracks, counter.trackCounter);
        return signal;
      }
    }
    trackSetEnd(nodeIterator.tracks, counter.trackCounter);
  },

  WhileStatement(nodeIterator) {
    const {node, skip} = nodeIterator;
    const {test, loc} = node;
    const whileTrack: Itrack[] = [];
    const baseTrack = baseTrackAtLocBycounter(loc, counter.getBaseKeyAndTrackCount(skip));
    whileTrack.push(baseTrack);
    const whileSteps: Istep[] = [];
    let whileCount = 0; //  防止死循环的出现
    while (nodeIterator.traverse(test, {tracks: whileTrack, steps:whileSteps}).value && whileCount < 100) {
      nodeIterator.traverse(node.body as Inode, {tracks: whileTrack, steps:whileSteps});
      trackSetEnd(whileTrack, counter.trackCounter);
      whileCount += 1;
    }
    nodeIterator.storeStepAndTrack(whileSteps, whileTrack);
  },

  ForInStatement(nodeIterator) {
    const {node, scope, skip} = nodeIterator;
    const {left, right, body, loc} = node;
    const forTrack = [];
    const forStep = [];
    const iterate = scope.get('__filbertRight0').value;
    for (let j = 0; j < iterate.length; j++ ) {
      const name = left.name;
      const leftloc = left.loc;
      const leftTrack = produceTrackBycounter(name, "appear", leftloc, counter.getKeyAndTrackCount(skip));
      forTrack.push(leftTrack);
      const leftStep = produceStep(donothing, counter.getStepcount(skip));
      forStep.push(leftStep);
      const leftNode = {value: name, preTrack: leftTrack};

      right.type = 'ListIdentifier';
      const rightNode = nodeIterator.traverse(right, {opt: {listIndex: j}});
      const rightTrack = produceTrackBycounter(
        rightNode.value[j], 
        "move",
        {start: rightNode.preTrack.effect.startpos,
          end: leftNode.preTrack.effect.startpos
        },
        counter.getKeyAndTrackCount(skip))
      forTrack.push(rightTrack);
      nodeIterator.scope.declare(leftNode.value, rightNode.value[j], 'var');
      const step = produceStep(
        (): void => {nodeIterator.mirrorScope.declare(leftNode.value, rightNode.value[j], 'var');},
        counter.getStepcount(skip)
        );
      forStep.push(step);

      nodeIterator.traverse(body, {steps:forStep, tracks:forTrack});
    }
    trackSetEnd(forTrack, counter.trackCounter);
    nodeIterator.storeStepAndTrack(forStep, forTrack);
  },

  ListIdentifier(nodeIterator) {
    const {node, opt, scope, skip} = nodeIterator;
    const {loc, name} = node;
    const lst = scope.get(name).value;
    const track = produceTrackBycounter(lst, 'appear', loc, counter.getKeyAndTrackCount(skip))
    nodeIterator.addTrack(track);
    const step = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addStep(step);
    return {
      value: lst,
      preTrack: track
    }
  },

  // ForStatement(nodeIterator) {
  //   const {node} = nodeIterator;
  //   const {loc, init, test, update, body} = node;
  //   console.log(node)
  //   let forTrack: Itrack[] = [];
  //   let forSteps: Istep[] = []; 
  //   const baseTrack = produceBaseTrackAtLoc(loc, basetrackCounter);
  //   forTrack.push(baseTrack);
  //   for (nodeIterator.traverse(init as Inode, {tracks:forTrack, steps:forSteps});
  //     nodeIterator.traverse(test, {tracks:forTrack, steps:forSteps}).value;
  //     nodeIterator.traverse(update as Inode, {tracks: forTrack, steps:forSteps})
  //     ) {
  //       nodeIterator.traverse(body as Inode, {tracks:forTrack, steps:forSteps});
  //   }
  //   trackSetEnd(forTrack, trackCounter);
  //   nodeIterator.storeStepAndTrack(forSteps, forTrack);
  // },

  // UpdateExpression(nodeIterator) {
  //   const {node} = nodeIterator;
  //   const {operator, loc} = node;
  //   const argument = <Inode>node.argument;
  //   let simpleValue = nodeIterator.scope.get(argument.name);
  //   const value = nodeHandlers.AssignmentExpressionMap[operator](simpleValue);
  //   const track = produceTrack(value, 'compute', loc, keyCounter++, trackCounter++);
  //   nodeIterator.addTrack(track);
  //   const updateStep = produceStep(
  //     () => {
  //       let simpleValue = nodeIterator.mirrorScope.get(argument.name);
  //       nodeHandlers.AssignmentExpressionMap[operator](simpleValue);
  //     },
  //     stepCounter++
  //   );
  //   nodeIterator.addStep(updateStep);
  // },

  NewExpression(nodeIterator) {
    const {node, skip} = nodeIterator;
    const {loc} = node;
    const func = nodeIterator.traverse(nodeIterator.node.callee);
    const args = nodeIterator.node.arguments.map(arg => nodeIterator.traverse(arg).value);
    const news = new func.value(args)[0][0];
    const track = produceTrackBycounter(news, 'appear', loc, counter.getBaseKeyAndTrackCount(skip));
    const step = produceStep(donothing, counter.getStepcount(skip));
    nodeIterator.addTrack(track);
    nodeIterator.addStep(step);
    return {
      value: news,
      preTrack: track
    }
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

  // 调用函数
  CallExpression(nodeIterator) {
    const {node, skip} = nodeIterator;
    const args = node.arguments.map(arg => nodeIterator.traverse(arg).value);
    const back = nodeIterator.traverse(nodeIterator.node.callee);
    // apply第一个参数为this的指向
    const value = back.value.apply(null, args);
    const preTrack = back.preTrack;
    preTrack.effect = {
      ...back.preTrack.effect,
      value,
      type: 'compute',
      valueType: `[object String]`
    }
    return {
      value,
      preTrack
    };
  },

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
  //   const {node} = nodeIterator;
  //   const {loc, id} = node;
  //   const value = nodeIterator.node.elements.map(ele => nodeIterator.traverse(ele).value)
  //   // 1. 本节点动画
  //   const track = produceTrack(value, 'appear', loc, keyCounter++, trackCounter++);
  //   nodeIterator.addTrack(track);
  //   // 2.本节点操作
  //   const arrOperation = produceStep(donothing, stepCounter++);
  //   nodeIterator.addStep(arrOperation);
  //   // 3. 上个节点结束点，无
  //   // 4. 返回
  //   return {
  //     value,
  //     preTrack: track
  //   }
  // }

  // ObjectExpression(nodeIterator) {
  //   const {node, code} = nodeIterator;
  //   const {start, end} = node;
  //   const basePos = startend2Index(start, end, code);
  //   const obj = Object.create(null);
  //   const baseTrack = produceTrack(
  //     '       \n', 'block', basePos[0], basePos[0], keyCounter++, trackCounter++
  //   );
  //   nodeIterator.addTrack(baseTrack);
  //   const baseStep = produceStep(donothing,stepCounter++);
  //   nodeIterator.addStep(baseStep);
  //   let track;
  //   for (const prop of nodeIterator.node.properties) {
  //     let key;
  //     if (prop.key.type === 'Literal') {
  //       const keyResult = nodeIterator.traverse(prop.key);
  //       key = `${keyResult.value}`;
  //     } else if (prop.key.type === 'Identifier') {
  //       const {start, end} = prop.key;
  //       const keyPos = startend2Index(start, end, code);
  //       const keyTrack = produceTrack(
  //         prop.key.name, 'appear', keyPos[0], keyPos[1], keyCounter++, trackCounter++
  //       );
  //       nodeIterator.addTrack(keyTrack);
  //       const keyStep = produceStep(donothing, stepCounter++);
  //       nodeIterator.addStep(keyStep);
  //       key = prop.key.name;
  //     } else {
  //       throw new Error(`[ObjectExpression] Unsupported property key type "${prop.key.type}"`)
  //     }
  //     const value = nodeIterator.traverse(prop.value).value;
  //     track = produceTrack(
  //       `${key}: ${value}\n`, 
  //       'block',
  //       basePos[0],
  //       basePos[0],
  //       keyCounter++,
  //       trackCounter++
  //     )
  //     nodeIterator.addTrack(track);
  //     obj[key] = value;
  //     const step = produceStep(
  //       donothing,
  //       stepCounter++
  //     );
  //     nodeIterator.addStep(step);
  //   }
  //   return {
  //     value: obj,
  //     preTrack: track
  //   }
  // }
}

export default nodeHandlers;