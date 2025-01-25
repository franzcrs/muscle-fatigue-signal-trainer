import { MindMapNode } from "./mindmap-comp/MindMap";

export function createNode(
  id: string,
  content: string,
  parentId: string | null,
  level: number
): MindMapNode {
  return { id, content, parentId, level, };
}

export function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 9);
}