import { Parser } from 'acorn';
import Iterator from './Iterator';
import Scope from './Scope';
import { Icompiler, Iiterator, Iscope, IstateHandler } from '../../types/compiler';
class Compiler implements Icompiler {

  code: string;
  ast: object;
  scope: Iscope;
  mirrorScope: Iscope;
  stateHandler: IstateHandler;
  iterator: Iiterator;

  constructor(code: string, stateHandler: IstateHandler) {
    this.code = code;
    this.ast = {};
    this.scope = Object.create(null);
    this.mirrorScope = Object.create(null);
    this.stateHandler = stateHandler;
    this.iterator = Object.create(null);
  }

  init() {
    this.stateHandler?.clearScope();
    this.stateHandler?.clearMirrorScope();
    this.stateHandler?.clearOperation();

    this.scope = new Scope('function', null);
    this.mirrorScope = new Scope('function', null);
    this.stateHandler.updateScope(this.scope);
    this.stateHandler.updateMirrorScope(this.mirrorScope)

    this.ast = Parser.parse(this.code);
    this.stateHandler.updateAst(this.ast);
    
    this.iterator = new Iterator(Object.create(null), this.scope, this.mirrorScope, this.stateHandler);
  }

  run() {
    this.iterator.traverse(this.ast);
  }

}

export default Compiler;