import nodeHandlers from './handlers';
import Scope from './Scope';
import { 
  Iiterator,
  Iscope, 
  InodeHandler,
  Ioptions,
  IstateHandler,
  Inode,
  Istep,
  ItraversBack
} from '../../types/compiler';
import { Itrack } from '../../types/animation';

class Iterator implements Iiterator {

  node:Inode;
  scope:Iscope;
  mirrorScope:Iscope;
  stateHandler:IstateHandler;
  tracks:Itrack[] | [];
  steps:Istep[] | [];
  skip:boolean;
  opt?:{listIndex?:number};

  constructor(
    node:Inode, 
    scope:Iscope, 
    mirrorScope:Iscope, 
    stateHandler:IstateHandler,
    tracks:Itrack[],
    steps:Istep[],
    skip:boolean,
    opt?:{listIndex?:number}
    ) {
    this.node = node;
    this.scope = scope;
    this.mirrorScope = mirrorScope;
    this.stateHandler = stateHandler;
    this.tracks = tracks;
    this.steps = steps;
    this.skip = skip;
    this.opt = opt;
  }

  traverse(node:Inode, options:Ioptions={}):ItraversBack {
    const {scope, tracks, steps, mirrorScope, skip, opt} = options;
    const nextTracks = tracks || this.tracks;
    const nextSteps = steps || this.steps;
    const nextScope = scope || this.scope;
    const nextMirrorScope = mirrorScope || this.mirrorScope;
    const nextskip = skip || this.skip;
    const nextopt = opt || this.opt;
    const _eval = nodeHandlers[node.type as keyof InodeHandler];
    const iterator = new Iterator(
      node, 
      nextScope, 
      nextMirrorScope, 
      this.stateHandler, 
      nextTracks, 
      nextSteps, 
      nextskip,
      nextopt
    );
    if (!_eval) {
      throw new Error(`No handler for ${node.type}`);
    }
    return _eval(iterator);
  }

  createScope(scopeType='block') {
    const newScope = new Scope(scopeType, this.scope);
    this.scope.addChild(newScope);
    this.scope = newScope;
    this.stateHandler.updateScope(this.scope);
    return this.scope;
  }

  createMirroScope(scopeType='block') {
    const newMirrorScope =  new Scope(scopeType, this.mirrorScope);
    this.mirrorScope.addChild(newMirrorScope);
    this.mirrorScope = newMirrorScope;
    this.stateHandler.updateMirrorScope(this.mirrorScope);
    return this.mirrorScope;
  }

  storeStepAndTrack(steps:Istep[] | undefined, tracks:Itrack[] | undefined) {
    const that:any = this;
    const sp = steps || this.steps;
    const tk = tracks || this.tracks;
    that.stateHandler.updateSteps(sp);
    that.stateHandler.updateTracks(tk);
  }

  addTrack(track:Itrack): void {
    const that: any = this;
    that.tracks.push(track);
  }

  addStep(fn:Istep) {
    const that: any = this;
    that.steps.push(fn);
  }
}

export default Iterator;