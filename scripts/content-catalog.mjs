import {writeFile} from 'node:fs/promises';
import {identities,storyData} from '../js/data.js';
import {CONTENT_VERSION} from '../js/content-manifest.js';
import {findRoute} from './route-search.mjs';
const lines=[`# 结局目录 · 内容 ${CONTENT_VERSION}`,'','由 node scripts/content-catalog.mjs 根据当前数据生成。归档保留旧 ID，正式游戏不提供入口；全部结局并非均已逐条浏览器验证。',''];
for(const identity of identities){
    const route=findRoute(identity.id);
    lines.push(`## ${identity.name}`, '', '完整长篇：208 次实际决策，九个结局；单元测试已逐条真实引擎通关并验证中途保存恢复。', '', `旧版代表路线：${route.steps.map(step=>step.text).join(' → ')} → ${route.ending}。`, '', '| 节点 | 标题 / 文本 | 状态 |','| --- | --- | --- |');
    for(const [key,node] of Object.entries(storyData[identity.id]))if(!node.choices.length)lines.push(`| ${key} | ${(node.ending?.title??node.text).replaceAll('|','\\|').replaceAll('\n',' ')} | ${node.archived?'归档':key.startsWith('city3_')?'三日章节':key.startsWith('campaign_')?'完整长篇（208 次）':'旧版短篇'} |`);
    lines.push('');
}
await writeFile(new URL('../ENDING_CATALOG.md',import.meta.url),lines.join('\n'));
console.log('已更新 ENDING_CATALOG.md');
