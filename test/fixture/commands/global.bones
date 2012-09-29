var path = require('path');

Bones.Command.options['stash']['default'] = function(options, config) {
    return path.resolve(require.resolve('bones-stash'), '../test/fixture/stash');
};
