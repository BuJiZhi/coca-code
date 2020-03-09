import SimpleValue from './Value';
import { Iscope, ScopeValue, Value } from '../../types/compiler';
import buildIn from './buildIn';

export default class Scope implements Iscope{

  type: string;
  parentScope: ScopeValue;
  globalScope: ScopeValue;
  declartion: ScopeValue;
  childScope: ScopeValue;

  constructor(type: string, parentScope: ScopeValue | {}, childScope: ScopeValue=[]) {
    this.type = type;
    this.parentScope = parentScope;
    this.globalScope = buildIn;
    this.declartion = Object.create(null);
    this.childScope = childScope;
  }

  get(name: string) {
    if (this.declartion[name]) {
      return this.declartion[name];
    } else if (this.parentScope) {
      return this.parentScope.get(name);
    } else if (this.globalScope.declartion) {
      return this.globalScope.declartion[name];
    } else {
      console.log(this.globalScope)
      throw new Error(`${name} is not defined`);
    }
  }

  set(name: string, value: Value) {
    if (this.declartion[name]) {
      return this.declartion[name].set(value);
    } else if (this.parentScope[name]) {
      return this.parentScope[name].set(value);
    } else if (this.globalScope[name]) {
      return this.globalScope[name].set(value);
    } else {
      throw new Error(`${name} is not defined`);
    }
  }

  addChild(scope: Iscope) {
    this.childScope.push(scope);
  }

  declare(name: string, value: Value, kind: string='var') {
    if (kind === 'var') {
      return this.varDeclare(name, value);
    } else if (kind === 'let') {
      return this.letDeclare(name, value);
    } else if (kind === 'const') {
      return this.constDeclare(name, value);
    } else {
      throw new Error(`invalid variable declaration kind of ${kind}`);
    }
  }

  varDeclare(name: string, value: Value) {
    let scope: any = this;
    while (this.parentScope && scope.type !== 'function') {
      scope = scope.parentScope;
    }
    scope.declartion[name] = new SimpleValue(value, 'var');
    return scope.declartion[name];
  }

  letDeclare(name: string, value: Value) {
    if (this.declartion[name]) {
      throw new SyntaxError(`identifier ${name} has already been declared`);
    }
    this.declartion[name] = new SimpleValue(value, 'let');
    return this.declartion[name];
  }

  constDeclare(name: string, value: Value) {
    if (this.declartion[name]) {
      throw new SyntaxError(`identifier ${name} has already been declared`);
    }
    this.declartion[name] = new SimpleValue(value, 'const');
    return this.declartion[name];
  }

}
