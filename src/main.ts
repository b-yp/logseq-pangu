import '@logseq/libs'
import { BlockEntity, IHookEvent } from '@logseq/libs/dist/LSPlugin'
import init, { format } from 'autocorrect-wasm';

import { deepFirstTraversal } from './utils'
import { logseq as PL } from "../package.json";

const pluginId = PL.id;

await init('/node_modules/autocorrect-wasm/autocorrect_wasm_bg.wasm')

const formatPage = async (e: IHookEvent) => {
  const tree = await logseq.Editor.getPageBlocksTree(e.page)
  if (!tree.length) return

  deepFirstTraversal(tree, (block) => {
    formatBlock(block)
  })
}

const formatBlock = async (b?: BlockEntity | IHookEvent) => {
  const block = await logseq.Editor.getBlock(b?.uuid)
  if (!block) return

  // TODO: If the tag name is mixed in Chinese and English, it will also be processed
  const newContent = format(block.content)
  logseq.Editor.updateBlock(block.uuid, newContent)
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  logseq.Editor.registerSlashCommand('📄 Pangu Format', formatBlock)

  logseq.Editor.registerBlockContextMenuItem('📄 Pangu Format', formatBlock)

  logseq.App.registerPageMenuItem('📄 Pangu Format', formatPage)
}

logseq.ready(main).catch(console.error);
