import { IanimateKey, DocType } from "./store";

export type Ivalue = any;
export type IscopeValue = any;
export type Ioperation = () => void;

export interface IsimpleValue {
  kind: string,
  value: any
}

export interface Iscope {
  type: string,
  globalScope?: IscopeValue,
  declartion: IscopeValue,
  childScope?: IscopeValue,
  parentScope?: IscopeValue,
  get(name: string): Ivalue,
  set(name: string, value: any): Ivalue,
  addChild(scope: Iscope): void,
  declare(name: string, value: Ivalue, kind: string): void,
  varDeclare(name: string, value: Ivalue): void,
  varDeclare(name: string, value: Ivalue): void,
  varDeclare(name: string, value: Ivalue): void
}

export interface Ioptions {
  scope?: Iscope,
  mirrorScope?: Iscope,
}

export interface Iiterator {
  node: InodeTypes,
  scope: Iscope,
  mirrorScope: Iscope,
  stateHandle?: IstateHandler,
  code: string,
  traverse(node: object, options?: object): void,
  createScope(type: string): Iscope,
  createMirrorOperate(type: any): void,
  createMirrorAnimate(animate: IanimateKey): void,
  createMirrorOpAnm(fn:()=>void, animate:IanimateKey): void
}

export interface Icompiler {
  code: string,
  ast: object,
  operations: Ioperation[],
  iterator?: Iiterator,
  scope: Iscope,
  mirrorScope: Iscope,
  stateHandler: IstateHandler
}

export interface IstateHandler {
  updateAst: (ast: object) => void,
  clearAst: () => void,
  updateScope: (scope: Iscope) => void,
  clearScope: () => void,
  updateMirrorScope: (scope: Iscope) => void,
  clearMirrorScope: () => void,
  addOperation: (op: Ioperation) => void,
  clearOperation: () => void,
  updateCurrent: (current: number) => void,
  updateKeys: (animate: IanimateKey) => void,
  clearKeys: () => void
}

// ast shape
const Program = 'Program';
const VariableDeclaration = 'VariableDeclaration';
const VariableDeclartor = 'VariableDeclartor';
const BinaryExpression = 'BinaryExpression';
const Literal = 'Literal';

export interface Icommon {
  start: number,
  end: number
}

export interface Iid {
  type: string,
  name: string
}

export interface IprogramNode {
  type: typeof Program,
  body: object[],
  sourceType?: string,
  declarations?: IvariableDeclartor[],
}

export interface IVariableDecalrations {
  type: typeof VariableDeclaration,
  declarations: IvariableDeclartor[],
  kind: string
}

export interface IvariableDeclartor {
  type: typeof VariableDeclartor,
  id: Iid,
  init?: IbinaryExpression
}

export interface IbinaryExpression {
  type: typeof BinaryExpression,
  operator: string,
  left: InodeTypes,
  right: InodeTypes
}

export interface Iliteral {
  type: typeof Literal,
  value: any,
  raw: any
}

export type InodeTypes = 
Icommon &
IprogramNode &
IVariableDecalrations &
IvariableDeclartor &
IbinaryExpression &
Iliteral;

export interface InodeHandler {
  Program(node: Iiterator): void,
  VariableDeclaration(node: Iiterator): void,
  Literal(node: Iiterator): any,
  // nodeIterator(node: Iiterator): void,
  // Identifier(node: Iiterator): void,
  // ExpressionStatement(node: Iiterator): void,
  // AssignmentExpression(node: Iiterator): void,
  // BinaryExpression(node: Iiterator): void,
  // IfStatement(node: Iiterator): void,
  // BlockStatement(node: Iiterator): void,
  // FunctionDeclaration(node: Iiterator): void,
}

