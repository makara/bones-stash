models['Lorem'].prototype.sync = function(method, model, options) {
    var Backend = new Bones.plugin.backends.Stash('lorems');
    Backend.sync(method, model, options);
};
