'use strict';

module.exports = function (options) {
    var config = options.config;
    var node = options.node;
    var block;

    // Bail if the linter isn't wanted
    if (!config.emptyRule || (config.emptyRule && !config.emptyRule.enabled)) {
        return null;
    }

    // Not applicable, bail
    if (node.type !== 'ruleset') {
        return null;
    }

    block = node.first('block') || {};
    block.content = block.content || [];

    if (!block.content.length || (block.content.length === 1 && block.content[0].type === 'space')) {
        return {
            column: node.start.column,
            line: node.start.line,
            linter: 'emptyRule',
            message: 'There shouldn\'t be any empty rules present.'
        };
    }

    return null;
};
