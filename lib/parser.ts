// const expressionTypeMatcher = require('./expression_type_matcher');
import { Parser, ParserOptions } from "prettier";

function parse(text: string, parsers, options) {
  const root: RootNode = {
    type: "root",
    content: text,
    aliasedContent: "",
    children: {},
    index: 0,
    contentStart: 0,
    length: text.length,
  };
  let id = -1
  const getId = () => (id++).toString()

  const nodeStack: (BlockNode | RootNode)[] = [root];
  const regexp =
  /<%(?<startdelimiter>=|==|-|%|\/\*)?\s*(?<statement>[\s\S]*?)\s*(?<endDelimiter>-|%|\*\/)?%>|(?<unformattableScript><(script)((?!<)[\s\S])*>((?!<\/script)[\s\S])*?{{[\s\S]*?<\/(script)>)|(?<unformattableStyle><(style)((?!<)[\s\S])*>((?!<\/style)[\s\S])*?{{[\s\S]*?<\/(style)>)/g;

  for (let match of text.matchAll(regexp)) {
    const current = last(nodeStack);
    const expressionType = match.groups?.keyword as ExpressionType | undefined;
    const statement = match.groups?.statement;
    const unformattable =
      match.groups?.unformattableScript ?? match.groups?.unformattableStyle;

    const startDelimiter = (match.groups?.startdelimiter ??
      "") as ExpressionStartDelimiter;
    const endDelimiter = (match.groups?.endDelimiter ??
      "") as ExpressionEndDelimiter;

    if (current === undefined) {
      throw Error("Node stack empty.");
    }

    if (match.index === undefined) {
      throw Error("Regex match index undefined.");
    }
    const id = getId();

    if (unformattable) {
      current.children[id] = <UnformattableNode>{
        id,
        type: "unformattable",
        index: match.index,
        length: match[0].length,
        content: unformattable,
        parent: current,
      } ;
      continue;
    }
    // TODO: what about empty tags
    if (statement === undefined) {
      throw Error("Formattable match without statement.");
    }

    const expressionNode: ExpressionNode = {
      index: match.index,
      length: match[0].length,
      startDelimiter,
      endDelimiter,
      parent: current!,
      type: "expression",
      statement,
      id,
    };

    if (expressionType === "end" || expressionType === "prettier-ignore-end") {
      if (current.type !== "block") {
        throw Error("Encountered unexpected end keyword.");
      }
      current.length = match[0].length + match.index - current.index;
      current.content = text.substring(current.contentStart, match.index);
      current.aliasedContent = aliasNodeContent(current);
      current.end = expressionNode;

      if (current.parent.type === "multi-block") {
        const firstChild = current.parent.blocks[0];
        const lastChild = last(current.parent.blocks);
        current.parent.length = lastChild.index + lastChild.length - firstChild.index;
      }

      nodeStack.pop();
    }  else if (isBlockNode(current) && expressionType === "else") {
      // TODO: should be an error if we spotted else without start
      const nextChild: BlockNode = {
        type: "block",
        start: expressionNode,
        end: null,
        children: {},
        expressionType: expressionType,
        index: match.index,
        parent: current.parent,
        contentStart: match.index + match[0].length,
        content: "",
        aliasedContent: "",
        length: -1,
        id: getId(),
        startDelimiter,
        endDelimiter,
      };

      if (isMultiBlockNode(current.parent)) {
        current.parent.blocks.push(nextChild);
      } else {
        const multiBlock: MultiBlockNode = {
          type: "multi-block",
          parent: current.parent,
          index: current.index,
          length: -1,
          expressionType,
          id: current.id,
          blocks: [current, nextChild],
        };
        nextChild.parent = multiBlock;
        current.parent = multiBlock;

        if ("children" in multiBlock.parent) {
          multiBlock.parent.children[multiBlock.id] = multiBlock;
        } else {
          throw Error("Could not find child in parent.");
        }
      }

      current.id = getId();
      current.length = match[0].length + match.index - current.index;
      current.content = text.substring(current.contentStart, match.index);
      current.aliasedContent = aliasNodeContent(current);

      nodeStack.pop();
      nodeStack.push(nextChild);
    } else if (expressionType) {
      const block: BlockNode = {
        type: "block",
        start: expressionNode,
        end: null,
        children: {},
        expressionType: expressionType,
        index: match.index,
        parent: current,
        contentStart: match.index + match[0].length,
        content: "",
        aliasedContent: "",
        length: -1,
        id: getId(),
        startDelimiter,
        endDelimiter,
      };

      current.children[block.id] = block;
      nodeStack.push(block);
    } else {
      current.children[expressionNode.id] = expressionNode;
    }
  }


  if (!isRootNode(nodeStack.pop()!)) {
    throw Error("Missing end block.");
  }

  root.aliasedContent = aliasNodeContent(root);

  return root;
}

module.exports = {
  parse,
  astFormat: 'erb-ast',
} as Parser;

function last<T>(array: T[]): T {
  return array[array.length - 1];
}

function aliasNodeContent(current: BlockNode | RootNode): string {
  let result = current.content;

  Object.entries(current.children)
    .sort(([_, node1], [__, node2]) => node2.index - node1.index)
    .forEach(
      ([id, node]) =>
        (result =
          result.substring(0, node.index - current.contentStart) +
          id +
          result.substring(node.index + node.length - current.contentStart))
    );

  return result;
}

// TODO: check this
export type ExpressionSharedDelimiter = "%" | "-" | "";
export type ExpressionStartDelimiter = "==" | "="  | "-" | "#" | ExpressionSharedDelimiter;
export type ExpressionEndDelimiter = ">" | "*/" | ExpressionSharedDelimiter;

export interface WithDelimiters {
  startDelimiter: ExpressionStartDelimiter;
  endDelimiter: ExpressionEndDelimiter;
}

export interface BaseNode<Type extends string> {
  id: string;
  type: Type;
  index: number;
  length: number;
  parent: Node | RootNode | MultiBlockNode;
}


type ExpressionType =
  | "if"
  | "else"
  | "end"
  | "elsif"
  | "case"
  | "when"
  | "block"
  | "prettier-ignore-end"

type Node =
  | RootNode
  | ExpressionNode
  | BlockNode
  | MultiBlockNode
  | UnformattableNode



export interface RootNode extends Omit<BaseNode<"root">, 'parent' | 'id'>  {
  content: string,
  aliasedContent: string,
  contentStart: number,
  children: {
    [id: string]: Node;
  }
}

export interface BlockNode extends BaseNode<"block">, WithDelimiters {
  expressionType: ExpressionType;
  children: {
    [id: string]: Node;
  };
  start: ExpressionNode;
  end: ExpressionNode | null;
  content: string;
  aliasedContent: string;
  contentStart: number;
}

export interface MultiBlockNode extends BaseNode<"multi-block"> {
  blocks: (BlockNode | MultiBlockNode)[];
  expressionType: ExpressionType;
}

export interface ExpressionNode extends BaseNode<"expression">, WithDelimiters {
  statement: string;
}

export interface UnformattableNode extends BaseNode<"unformattable"> {
  content: string;
}


export function isBlockNode(node: Node): node is BlockNode {
  return node.type === "block";
}

export function isMultiBlockNode(node: Node): node is MultiBlockNode {
  return node.type === "multi-block";
}

export function isRootNode(node: Node): node is RootNode {
  return node.type === "root";
}

