import '@logseq/libs'
import { BlockEntity, IHookEvent } from '@logseq/libs/dist/LSPlugin'
import pangu from 'pangu'

import { deepFirstTraversal } from './utils'
import { logseq as PL } from "../package.json";

const pluginId = PL.id;

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

  const newContent = pangu.spacing(block.content)
  logseq.Editor.updateBlock(block.uuid, newContent)
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  logseq.Editor.registerSlashCommand('📄 Pangu Format', formatBlock)

  logseq.Editor.registerBlockContextMenuItem('📄 Pangu Format', formatBlock)

  logseq.App.registerPageMenuItem('📄 Pangu Format', formatPage)
}

logseq.ready(main).catch(console.error);
