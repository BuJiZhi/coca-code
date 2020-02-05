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

  traverse(node: InodeTypes, options: Ioptions={}): ItarversBack {
    const { scope, tracks, operations, mirrorScope } = options;
    const nextTracks = tracks || this.tracks;
    const nextOperations = operations || this.operations;
    const nextScope = scope || this.scope;
    const nextMirrorScope = mirrorScope || this.mirrorScope;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(node, nextScope, nextMirrorScope, this.stateHandler, this.code, nextTracks, nextOperations);
    if (!_eval) {
      throw new Error(`No handler for ${node.type}`)
    }
    return _eval(iterator);
  }

  createScope(scopeType='block') {
    this.scope =  new Scope(scopeType, this.scope);
    this.scope.parentScope.addChild(this.scope);
    // if (this.stateHandler.updateScope) {
    //   this.stateHandler.updateScope(newScope);
    // }
    return this.scope;
  }

  createMirroScope(scopeType='block') {
    this.mirrorScope =  new Scope(scopeType, this.mirrorScope);
    this.mirrorScope.parentScope.addChild(this.mirrorScope);
    // if (this.stateHandler.updateMirrorScope) {
    //   this.stateHandler.updateMirrorScope(newMirrorScope);
    // }
    return this.mirrorScope;
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