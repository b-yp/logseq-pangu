import '@logseq/libs'
import { BlockEntity, IHookEvent } from '@logseq/libs/dist/LSPlugin'
import init, { format } from 'autocorrect-wasm';
import { v4 as uuidv4 } from 'uuid'

import { deepFirstTraversal } from './utils'
import { settings } from './settings'
import { logseq as PL } from '../package.json'

const pluginId = PL.id;

await init()

const formatPage = async (e: IHookEvent) => {
  const tree = await logseq.Editor.getPageBlocksTree(e.page)
  if (!tree.length) return

  await deepFirstTraversal(tree, (block) => {
    if (!block.content) return
    formatBlock(false, block)
  })
  
  logseq.UI.showMsg('Format page successful 🎉')
}

const formatBlock = async (isToast: boolean, b?: BlockEntity | IHookEvent) => {
  const block = await logseq.Editor.getBlock(b?.uuid)
  if (!block) return

  const tagReg = /#[^\s#]+/g
  const linkRefReg = /\[\[.*?\]\]/g

  const tags = block.content.match(tagReg)?.map(i => {
    const uuid = uuidv4()
    return { tag: i, uuid }
  })
  const linkRefs = block.content.match(linkRefReg)?.map(i => {
    const uuid = uuidv4()
    return { linkRef: i, uuid }
  })

  let content = block.content

  tags?.forEach(i => {
    content = content.replaceAll(i.tag, i.uuid)
  })

  linkRefs?.forEach(i => {
    content = content.replaceAll(i.linkRef, i.uuid)
  })

  let formattedContent = format(content)

  tags?.forEach(i => {
    formattedContent = formattedContent.replaceAll(i.uuid, i.tag)
  })

  linkRefs?.forEach(i => {
    formattedContent = formattedContent.replaceAll(i.uuid, i.linkRef)
  })

  logseq.Editor.updateBlock(block.uuid, formattedContent)

  if (!isToast) return

  logseq.UI.showMsg('Format block successful 🎉')
}

const main = () => {
  console.info(`#${pluginId}: MAIN`);

  logseq.useSettingsSchema(settings);
  const shortcutKey = logseq.settings?.['shortcutKey']

  logseq.Editor.registerSlashCommand('📄 Pangu Format Block', e => formatBlock(true, e))

  logseq.Editor.registerBlockContextMenuItem('📄 Pangu Format Block', e => formatBlock(true, e))

  logseq.Editor.registerSlashCommand('📄 Pangu Format Page', formatPage)

  logseq.App.registerPageMenuItem('📄 Pangu Format Page', formatPage)

  logseq.App.registerCommandShortcut(
    {
      binding: shortcutKey,
    },
    async () => {
      const page = await logseq.Editor.getCurrentPage()
      formatPage({ page: page?.name })
    }
  )
}

logseq.ready(main).catch(console.error);
