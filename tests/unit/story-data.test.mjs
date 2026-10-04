import test from 'node:test';
import assert from 'node:assert/strict';
import { identities, storyData } from '../../js/data.js';
import { validateStories } from '../../js/core/story-validator.js';

test('published story references and supported rules are valid', () => {
    const { errors } = validateStories(storyData, identities);
    assert.deepEqual(errors, [], JSON.stringify(errors));
});

test('each farmer opening leads onward and money has a same-identity source', () => {
    const nodes = storyData.farmer;
    for (const choice of nodes.start.choices) {
        assert.ok(nodes[choice.next]);
        assert.ok(nodes[choice.next].choices.length > 0);
    }
    const warnings = validateStories({ farmer: nodes }, [{ id: 'farmer' }]).warnings;
    assert.ok(!warnings.some(issue => issue.code === 'item-source' && issue.message.includes('钱币')));
});
