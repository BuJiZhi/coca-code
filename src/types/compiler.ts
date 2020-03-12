import { Node } from 'acorn';
import { Itrack, Ilocations } from './animation';
export type Value = any;
export type ScopeValue = any;
export type ScopeType = "function" | "block";
export type Step = () => void;

export interface Istep {
  key: number,
  step: Step
}

export interface IsimpleValue {
  kind: string,
  value: any,
  get(): any,
  set(value: any): void
}

export interface ImemberValue {
  obj: object,
  [prop:string]: any,
  set(value:any): void,
  get(): void
}

export interface Iscope {
  type: string,
  globalScope?: ScopeValue,
  declartion: ScopeValue,
  childScope?: ScopeValue,
  parentScope?: ScopeValue,
  get(name: string): Value,
  set(name: string, value: any): Value,
  addChild(scope: Iscope): void,
  declare(name: string, value: Value, kind: string): void,
  varDeclare(name: string, value: Value): void,
  letDeclare(name: string, value: Value): void,
  constDeclare(name: string, value: Value): void
}

export interface Ioptions {
  scope?: Iscope,
  mirrorScope?: Iscope,
  steps?: Istep[],
  tracks?: Itrack[],
  skip?: boolean
}

export interface ItraversBack {
  value: Value,
  preTrack: Itrack
}

export interface Iiterator {
  node: Inode;
  scope: Iscope;
  mirrorScope: Iscope;
  tracks: Itrack[];
  stateHandler: IstateHandler;
  code: string;
  steps: Istep[];
  skip: boolean;
  traverse(node: Inode, options?: Ioptions): ItraversBack;
  createScope(type: ScopeType): Iscope;
  createMirroScope(type: ScopeType): Iscope;
  storeStepAndTrack(operations: Istep[] | undefined, tracks:Itrack[] | undefined): void;
  addTrack(track: Itrack): void;
  addStep(step: Istep): void;
}

export interface IstateHandler {
  updateAst: (ast: Node) => void,
  updateScope: (scope: Iscope) => void,
  updateMirrorScope: (scope: Iscope) => void,
  updateSteps: (op: Istep[]) => void,
  updateTracks: (track:Itrack[]) => void,
}

// ast shape
type nodeTypes = 
'Program' | 
'VariableDeclaration' | 
'VariableDeclartor' | 
'BinaryExpression' | 
'NumberLiteral' |
'StringLiteral' |
'Identifier' |
'MemberExpression' |
'Literal';

export interface Itoken {
  type: string;
  value: string;
  start: number;
  end: number;
}

export interface Icommon {
  type: nodeTypes,
  start: number,
  end: number,
  loc: Ilocations
}

export interface Iid extends Icommon {
  name: string,
  start: number,
  end: number
}

interface IprogramNode extends Icommon{
  body: Inode[] | Inode,
  sourceType?: string,
  declarations?: IvariableDeclartor[],
}

export interface IVariableDecalrations extends Icommon{
  declarations: IvariableDeclartor[],
  kind: string
}

interface IvariableDeclartor extends Icommon{
  declarations: Inode[],
  id: Iid,
  init?: IbinaryExpression
}

interface IbinaryExpression extends Icommon{
  operator: string,
  left: Inode,
  right: Inode,
  start: number,
  end: number
}

export interface InumberLiteral extends Icommon {
  value: string,
}

export interface Iliteral extends Icommon{
  value: any,
  raw: any
}

export interface Iidentifier extends Icommon{
  name: string
}

interface Iexpression extends Icommon{
  expression: any
}

interface IifStatement extends Icommon{
  test: Inode,
  consequent: Inode,
  alternate?: Inode
}

interface IunaryExpression extends Icommon{
  prefix: boolean,
  argument: Inode,
  operator: String
}

interface IforStatement extends Icommon{
  init?: Inode,
  test: Inode,
  update: Inode,
  body: Inode
}

interface IfuncDeclaration extends Icommon{
  id : Node,
  expression: Boolean,
  generator: Boolean,
  async: Boolean,
  params: Inode[],
  body: Inode
}

interface IcallExpression extends Icommon{
  arguments: Inode[],
  callee: Inode
}

interface IarrayExpression extends Icommon{
  elements: Inode[]
}

interface IobjectExpression extends Icommon{
  properties: Inode[]
}

interface Iprop extends Icommon{
  key: Inode
}

interface ImemberExpression extends Icommon{
  object: Inode;
  property: Inode;
  computed: boolean;
}

interface InewExpression extends Icommon {
  callee: Inode;
  arguments: Inode;
}

export type Inode = 
IprogramNode &
IVariableDecalrations &
IvariableDeclartor &
IbinaryExpression &
Iliteral &
InumberLiteral &
Iidentifier &
Iexpression &
IifStatement &
IunaryExpression &
IforStatement &
IfuncDeclaration &
IcallExpression &
IarrayExpression &
IobjectExpression &
ImemberExpression &
InewExpression &
Iprop;

export interface InodeHandler {
  Program(node: Iiterator): any,
  VariableDeclaration(node: Iiterator): any,
  Literal(node: Iiterator): any,
  // UnaryExpression(node: Iiterator): any,
  Identifier(node: Iiterator): any,
  // ExpressionStatement(node: Iiterator): any,
  // AssignmentExpression(node: Iiterator): void,
  // BinaryExpression(node: Iiterator): void,
  // MemberExpression(node: Iiterator): void,
  // IfStatement(node: Iiterator): void,
  // BlockStatement(node: Iiterator): void,
  // WhileStatement(node: Iiterator): void,
  // ForStatement(node:Iiterator): void,
  // UpdateExpression(node: Iiterator): void,
  // NewExpression(node: Iiterator): any,
  // ForInStatement(node: Iiterator): any,
  // FunctionDeclaration(node: Iiterator): void,
  // FunctionExpression(node: Iiterator): [Step, Step],
  // CallExpression(node: Iiterator): any,
  // ArrayExpression(node: Iiterator): void,
  // ObjectExpression(node: Iiterator): void,
  // ReturnStatement(node: Iiterator): any,
  // AssignmentExpressionMap: any,
  // BinaryExpressionOperatorMap: any,
  // unaryoperateMap: any
}

/**
 * about store
 */
export interface Icompiler {
  ast: Node,
  steps: Istep[],
  sortedSteps: Istep[][],
  scopes: Iscope[],
  mirrorScopes: Iscope[],
  iterator?: Iiterator,
}
export const UPDATE_AST = 'UPDATE_AST';
export const UPDATE_STEPS = 'UPDATE_STEPS';
export const REPLACE_STEPS = 'REPLACE_STEPS';
export const UPDATE_SCOPE = 'UPDATE_SCOPE';
export const UPDATE_MIRRORSCOPE = 'UPDATE_MIRRORSCOPE';
export const CLEAR_STEPS = 'CLEAR_STEPS';
export const CLEAR_SCOPES = 'CLEAR_SCOPES';
export const CLEAR_MIRRORSCOPES = 'CLEAR_MIRRORSCOPES';
export const UPDATE_SORTEDSTEPS = 'UPDATE_SORTEDSTEPS';

interface updateAst {
  type: typeof UPDATE_AST,
  payload: Node
}

interface updateSteps {
  type: typeof UPDATE_STEPS,
  payload: Istep[]
}

interface replaceSteps {
  type: typeof REPLACE_STEPS,
  payload: Istep[]
}

interface updateScope {
  type: typeof UPDATE_SCOPE,
  payload: Iscope
}

interface updateMirrorScope {
  type: typeof UPDATE_MIRRORSCOPE,
  payload: Iscope
}

interface clearSteps {
  type: typeof CLEAR_STEPS
}

interface clearScopes {
  type: typeof CLEAR_SCOPES
}

interface clearMirrorScope {
  type: typeof CLEAR_MIRRORSCOPES
}

interface updateSortedsteps {
  type: typeof UPDATE_SORTEDSTEPS,
  payload: Istep[][]
}

export type compilerActionTypes = 
updateAst |
updateSteps |
replaceSteps |
updateScope |
updateMirrorScope |
clearSteps |
clearScopes |
clearMirrorScope |
updateSortedsteps;