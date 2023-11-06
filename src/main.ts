import '@logseq/libs'
import { BlockEntity, IHookEvent } from '@logseq/libs/dist/LSPlugin'

import { remark } from 'remark'
import pangu from 'remark-pangu'

import { deepFirstTraversal } from './utils'
import { logseq as PL } from "../package.json";
import { isModuleNamespaceObject } from 'util/types'

const pluginId = PL.id;

remark().use(pangu)

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

  remark().use(pangu).process(block.content, (_, file: any) => {
    // TODO
    logseq.Editor.updateBlock(block.uuid, String(file).replace(/==\s+/g, '==').replace(/\s+==/g, '=='))
  });
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  logseq.Editor.registerSlashCommand('📄 Pangu Format', formatBlock)

  logseq.Editor.registerBlockContextMenuItem('📄 Pangu Format', formatBlock)

  logseq.App.registerPageMenuItem('📄 Pangu Format', formatPage)
}

logseq.ready(main).catch(console.error);
