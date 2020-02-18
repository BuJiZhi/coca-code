import nodeHandlers from './handlers';
import Scope from './Scope';
import { Node } from 'acorn';
import { 
  Iiterator,
  Iscope, 
  InodeHandler,
  Ioptions,
  IstateHandler,
  InodeTypes,
  Istep,
  ItraversBack
} from '../../types/compiler';
import { Itrack } from '../../types/animation';

class Iterator implements Iiterator {

  node: Node;
  scope: Iscope;
  mirrorScope: Iscope;
  stateHandler: IstateHandler;
  tracks: Itrack[] | [];
  steps: Istep[] | [];
  code: string;

  constructor(
    node: Node, 
    scope: Iscope, 
    mirrorScope: Iscope, 
    stateHandler: IstateHandler,
    code: string,
    tracks: Itrack[],
    steps: Istep[]
    ) {
    this.node = node;
    this.scope = scope;
    this.mirrorScope = mirrorScope;
    this.stateHandler = stateHandler;
    this.code = code;
    this.tracks = tracks;
    this.steps = steps;
  }

  traverse(node: Node, options: Ioptions={}):ItraversBack {
    const { scope, tracks, steps, mirrorScope } = options;
    const nextTracks = tracks || this.tracks;
    const nextSteps = steps || this.steps;
    const nextScope = scope || this.scope;
    const nextMirrorScope = mirrorScope || this.mirrorScope;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(node, nextScope, nextMirrorScope, this.stateHandler, this.code, nextTracks, nextSteps);
    if (!_eval) {
      throw new Error(`No handler for ${node.type}`)
    }
    return _eval(iterator);
  }

  createScope(scopeType='block') {
    this.scope =  new Scope(scopeType, this.scope);
    this.stateHandler.updateScope(this.scope);
    return this.scope;
  }

  createMirroScope(scopeType='block') {
    this.mirrorScope =  new Scope(scopeType, this.mirrorScope);
    this.stateHandler.updateMirrorScope(this.mirrorScope);
    return this.mirrorScope;
  }

  storeStepAndTrack(steps: Istep[] | undefined, tracks: Itrack[] | undefined) {
    const that:any = this;
    const sp = steps || this.steps;
    const tk = tracks || this.tracks;
    that.stateHandler.updateSteps(sp);
    that.stateHandler.updateTracks(tk);
  }

  addTrack(track: Itrack): void {
    const that: any = this;
    that.tracks.push(track);
  }

  addStep(fn: Istep) {
    const that: any = this;
    that.operations.push(fn);
  }
}

export default Iterator;