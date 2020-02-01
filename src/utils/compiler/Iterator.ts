import nodeHandlers from './handlers';
import Scope from './Scope';
import { 
  Iiterator,
  Iscope, 
  InodeHandler,
  Ioptions,
  IstateHandler,
  InodeTypes,
  ItarversBack
} from '../../types/compiler';
import { Itrack } from '../../types/animate';
import { IanimateKey } from '../../types/store';

class Iterator implements Iiterator {

  node: InodeTypes;
  scope: Iscope;
  mirrorScope: Iscope;
  stateHandler: IstateHandler;
  code: string;

  constructor(
    node: InodeTypes, 
    scope: Iscope, 
    mirrorScope: Iscope, 
    stateHandler: IstateHandler,
    code: string
    ) {
    this.node = node;
    this.scope = scope;
    this.mirrorScope = mirrorScope;
    this.stateHandler = stateHandler;
    this.code = code;
  }

  traverse(node: InodeTypes, options: Ioptions={}): ItarversBack {
    const scope = options.scope || this.scope;
    const mirrorScope = options.mirrorScope || this.mirrorScope;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(node, scope, mirrorScope, this.stateHandler, this.code);
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

  createMirrorOperate(fn: ()=>any) {
    this.stateHandler.addOperation(fn);
  }

  createMirrorAnimate(animate: IanimateKey) {
  //   this.stateHandler.updateKeys(animate);
  }

  addOperateTrack(fn:()=>void, track: Itrack) {
    this.createMirrorOperate(fn);
    this.addTrack(track);
  }

  addTrack(track: Itrack): void {
    this.stateHandler.addTrack(track);
  }
}

export default Iterator;