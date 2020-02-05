import { Parser } from 'acorn';
import Iterator from './Iterator';
import Scope from './Scope';
import { Node } from 'acorn';
import { Icompiler, Iiterator, Iscope, IstateHandler, Ioperation } from '../../types/compiler';
class Compiler implements Icompiler {

  code: string;
  ast: Node;
  scope: Iscope;
  mirrorScope: Iscope;
  stateHandler: IstateHandler;
  iterator: Iiterator;
  operations: Ioperation[];

  constructor(code: string, stateHandler: IstateHandler) {
    this.code = code;
    this.ast = Object.create(null);
    this.scope = Object.create(null);
    this.mirrorScope = Object.create(null);
    this.stateHandler = stateHandler;
    this.iterator = Object.create(null);
    this.operations = [];
  }

  init() {
    this.stateHandler?.clearScope();
    this.stateHandler?.clearMirrorScope();
    this.stateHandler?.clearOperation();
    this.stateHandler?.clearKeys();
    this.stateHandler?.clearTracks();
    this.stateHandler?.updateCurrent(0);

    this.scope = new Scope('function', null);
    this.mirrorScope = new Scope('function', null);
    this.stateHandler.updateScope(this.scope);
    this.stateHandler.updateMirrorScope(this.mirrorScope)

    this.ast = Parser.parse(this.code);
    this.stateHandler.updateAst(this.ast);

    this.operations = [];
    // this.stateHandler
    
    this.iterator = new Iterator(
      Object.create(null), 
      this.scope, 
      this.mirrorScope, 
      this.stateHandler,
      this.code,
      [],
      []
      );
  }

  run() {
    this.iterator.traverse(this.ast);
  }

}

export default Compiler;