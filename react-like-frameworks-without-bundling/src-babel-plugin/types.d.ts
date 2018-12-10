declare module '@babel/traverse' {
  import { Node } from '@babel/types';

  class NodePath {
    parent: NodePath;
    hub: any;
    contexts: any;
    data: any;
    shouldSkip: any;
    shouldStop: any;
    removed: any;
    state: any;
    opts: any;
    skipKeys: any;
    parentPath: any;
    context: any;
    container: any;
    listKey: any;
    inList: any;
    parentKey: any;
    key: any;
    node: Node;
    scope: any;
    type: any;
    typeAnnotation: any;
  }
}