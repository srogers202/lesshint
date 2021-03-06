'use strict';

module.exports = function (options) {
    var config = options.config;
    var node = options.node;
    var results = [];
    var property;
    var value;

    // Bail if the linter isn't wanted
    if (!config.propertyUnits || (config.propertyUnits && !config.propertyUnits.enabled)) {
        return null;
    }

    // Not applicable, bail
    if (!node.is('declaration')) {
        return null;
    }

    property = node.first('property').first('ident').content;
    value = node.first('value');

    value.forEach('dimension', function (element) {
        var allowed = config.propertyUnits.properties[property];
        var unit = element.first('ident').content;

        // Check if the unit is allowed for this property
        if (Array.isArray(allowed) && allowed.indexOf(unit) !== -1) {
            return;
        }

        // Unit allowed, bail
        if (!allowed && config.propertyUnits.global.indexOf(unit) !== -1) {
            return;
        }

        results.push({
            column: element.start.column,
            line: element.start.line,
            message: 'Unit "' + unit + '" is not allowed for "' + property + '".'
        });
    });

    // Check if percentages are allowed
    if (config.propertyUnits.global.indexOf('%') === -1) {
        value.forEach('percentage', function (element) {
            // Check if the percentages are allowed for this property
            if (config.propertyUnits.properties[property]) {
                if (config.propertyUnits.properties[property].indexOf('%') !== -1) {
                    return;
                }
            }

            results.push({
                column: element.start.column,
                line: element.start.line,
                message: 'Percentages are not allowed for "' + property + '".'
            });
        });
    }

    if (results.length) {
        return results.map(function (result) {
            return {
                column: result.column,
                line: result.line,
                linter: 'propertyUnits',
                message: result.message
            };
        });
    }

    return null;
};
