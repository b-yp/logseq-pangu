import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

/**
 * 深度优先遍历，递归实现
 * @param arr BlockEntity[]
 * @param fn (block: BlockEntity) => void
 */
export const deepFirstTraversal = (arr: BlockEntity[], fn: (block: BlockEntity) => void) => {
  arr.forEach(obj => {
    // console.log(obj.id); // 输出当前节点的 id
    if (obj) {
      fn(obj)
    }
    if (obj.children && obj.children.length > 0) {
      deepFirstTraversal(obj.children as BlockEntity[], fn); // 递归遍历子节点
    }
  });
}
