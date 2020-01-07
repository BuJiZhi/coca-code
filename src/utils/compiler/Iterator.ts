import nodeHandlers from './handlers';
import Scope from './Scope';
import Operation from './Mirror';
import { 
  Iiterator, 
  Iscope, 
  InodeHandler,
  Ioptions,
  IstateHandler,
  Ioperation,
  InodeTypes
} from '../../types/compiler';

class Iterator implements Iiterator{

  node: InodeTypes
  scope: Iscope
  mirrorScope: Iscope
  stateHandler: IstateHandler

  constructor(
    node: InodeTypes, 
    scope: Iscope, 
    mirrorScope: Iscope, 
    stateHandler: IstateHandler
    ) {
    this.node = node;
    this.scope = scope;
    this.mirrorScope = mirrorScope;
    this.stateHandler = stateHandler;
  }

  traverse(node: InodeTypes, options: Ioptions={}) {
    const scope = options.scope || this.scope;
    const mirrorScope = options.mirrorScope || this.mirrorScope;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(node, scope, mirrorScope, this.stateHandler);
    if (!_eval) {
      throw new Error(`No handler for ${node.type}`)
    }
    return _eval(iterator);
  }

  createScope(scopeType='block') {
    let newScope =  new Scope(scopeType, this.scope);
    this.scope.addChild(newScope);
    if (this.stateHandler.updateScope) {
      this.stateHandler.updateScope(newScope);
    }
    return newScope;
  }

  createMirroScope(scopeType='block') {
    let newMirrorScope =  new Scope(scopeType, this.mirrorScope);
    this.mirrorScope.addChild(newMirrorScope);
    if (this.stateHandler.updateMirrorScope) {
      this.stateHandler.updateMirrorScope(newMirrorScope);
    }
    return newMirrorScope;
  }

  createMirrorOperate(fn: ()=>void) {
    const operation = new Operation(fn);
    this.stateHandler.addOperation(operation);
  } 

}

export default Iterator;