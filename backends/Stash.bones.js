var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

backend = Bones.Backend.extend({
    initialize: function(filepath) {
        var stashPath = Bones.plugin.config.stash || '/tmp';
        if (filepath) {
            stashPath = path.resolve(stashPath, filepath);
        }
        var backboneStash = require('backbone-stash')(stashPath);

        // A reference.
        this.stash = backboneStash.stash;

        // The sync function.
        this.sync = function(method, model, options) {
            options || (options = {});

            // Override the success callback and provide the saved data.
            // TODO: push to upstream.
            switch (method) {
            case 'create':
            case 'update':
                var _options = options ? _.clone(options) : {};
                // Drop the original response.
                options.success = function(dropped) {
                    // Replace with the response from read.
                    backboneStash.sync.call(model, 'read', model, _options);
                };
                break;
            }

            backboneStash.sync.call(model, method, model, options);
        };

        // Install: .
        this.install = function(options, callback) {
            if (_(options).isFunction()) {
                callback = options;
                options = {};
            }
            mkdirp(stashPath, callback);
        };

        // Uninstall: .
        this.uninstall = function(options, callback) {
            if (_(options).isFunction()) {
                callback = options;
                options = {};
            }
            fs.rmdir(stashPath, callback);
        };
    }
});
