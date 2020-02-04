import nodeHandlers from './handlers';
import Scope from './Scope';
import { 
  Iiterator,
  Iscope, 
  InodeHandler,
  Ioptions,
  IstateHandler,
  InodeTypes,
  ItarversBack,
  Ioperation
} from '../../types/compiler';
import { Itrack } from '../../types/animate';
import { IanimateKey } from '../../types/store';

class Iterator implements Iiterator {

  node: InodeTypes;
  scope: Iscope;
  mirrorScope: Iscope;
  stateHandler: IstateHandler;
  tracks: Itrack[] | [];
  operations: Ioperation[] | [];
  code: string;

  constructor(
    node: InodeTypes, 
    scope: Iscope, 
    mirrorScope: Iscope, 
    stateHandler: IstateHandler,
    code: string,
    tracks: Itrack[],
    operations: Ioperation[]
    ) {
    this.node = node;
    this.scope = scope;
    this.mirrorScope = mirrorScope;
    this.stateHandler = stateHandler;
    this.code = code;
    this.tracks = tracks;
    this.operations = operations;
  }

  traverse(node: InodeTypes, options: Ioptions={}, track: Itrack[], operation: Ioperation[]): ItarversBack {
    const tracks = track || this.tracks;
    const operations = operation || this.operations;
    const scope = options.scope || this.scope;
    const mirrorScope = options.mirrorScope || this.mirrorScope;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(node, scope, mirrorScope, this.stateHandler, this.code, tracks, operations);
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

  createMirrorAnimate(animate: IanimateKey) {
  //   this.stateHandler.updateKeys(animate);
  }

  addOperateTrack(operations: Ioperation[] | undefined, tracks: Itrack[] | undefined) {
    if (!operations || !tracks) {
      this.createMirrorOperate(this.operations);
      this.storeAddTrack(this.tracks);
    } else {
      this.createMirrorOperate(operations);
      this.storeAddTrack(tracks);
    }
  }

  createMirrorOperate(fn: Ioperation[]) {
    this.stateHandler.addOperation(fn);
  }

  storeAddTrack(track: Itrack[]): void {
    // 直接使用this数组元素会被推断为never
    const that: any = this;
    that.stateHandler.addTrack(track);
  }

  addTrack(track: Itrack): void {
    const that: any = this;
    that.tracks.push(track);
  }

  addOperation(fn: Ioperation) {
    const that: any = this;
    that.operations.push(fn);
  }
}

export default Iterator;