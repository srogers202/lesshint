'use strict';

module.exports = function (options) {
    var config = options.config;
    var node = options.node;
    var excludes;
    var message;
    var start;

    // Bail if the linter isn't wanted
    if (!config.idSelector || (config.idSelector && !config.idSelector.enabled)) {
        return null;
    }

    // Not applicable, bail
    if (node.type !== 'selector') {
        return null;
    }

    excludes = config.idSelector.exclude.map(function (id) {
        // Remove #
        return id.replace(/^\#/, '');
    });

    node.forEach('simpleSelector', function (selector) {
        selector.content.some(function (selector) {
            var name = selector.first('ident').content;

            if (selector.type === 'id' && excludes.indexOf(name) === -1) {
                message = 'Selectors should not use IDs.';
                start = selector.start;

                return true;
            }

            return false;
        });
    });

    if (message) {
        return {
            column: start.column,
            line: start.line,
            linter: 'idSelector',
            message: message
        };
    }

    return null;
};
