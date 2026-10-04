import { identities, storyData } from '../js/data.js';
import { validateStories } from '../js/core/story-validator.js';

const result = validateStories(storyData, identities);
if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
} else {
    const { stats, errors, warnings } = result;
    console.log(`剧情检查：${stats.identities} 个身份，${stats.nodes} 个节点，${stats.choices} 个选项，${stats.endings} 个结束节点`);
    for (const issue of errors) console.error(`ERROR [${issue.code}] ${issue.path}: ${issue.message}`);
    console.log(`错误：${errors.length}；待核对警告：${warnings.filter(issue=>issue.code!=='archived').length}；已标记归档：${warnings.filter(issue=>issue.code==='archived').length}`);
    if (process.argv.includes('--verbose')) {
        for (const issue of warnings) console.warn(`WARN [${issue.code}] ${issue.path}: ${issue.message}`);
    }
}
process.exitCode = result.errors.length > 0 ? 1 : 0;
