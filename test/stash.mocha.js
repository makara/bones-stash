var should = require('should');
var path = require('path');

require('./fixture');

var bonesTest = require('bones-test');
var server = bonesTest.server();

var config = server.plugin.config;

describe('Stash', function() {
    it('should be a backend', function(done) {
        server.plugin.backends.should.be.a('object');
        server.plugin.backends.should.have.property('Stash');
        setTimeout(done, 1);
    });

    it('should have a custom stash path', function(done) {
        config.should.be.a('object');
        config.should.have.property('stash', path.resolve(require
            .resolve('bones-stash'), '../test/fixture/stash'));
        setTimeout(done, 1);
    });

    describe('Install', function() {
        it('should be able to install', function(done) {
            var stash = new server.plugin.backends.Stash();
            stash.should.be.a('object');
            stash.should.have.property('install');
            stash.install(function(err) {
                should.not.exist(err);
                setTimeout(done, 1);
            });
        });
    });

    describe('Lorem model using Stash backend', function() {
        bonesTest.testModel(server, 'Lorem');
        bonesTest.testModelCRUD(server, 'Lorem', {
            id: 'lorem',
            name: 'Lorem'
        }, {
            another: 'Ipsum'
        });
        bonesTest.testModelCRUDHTTP(server, 'Lorem', {
            id: 'lorem',
            name: 'Lorem'
        }, {
            another: 'Ipsum'
        });
    });

    describe('Uninstall', function() {
        it('should fail to uninstall an unempty stash', function(done) {
            var stash = new server.plugin.backends.Stash();
            stash.should.be.a('object');
            stash.should.have.property('uninstall');
            stash.uninstall(function(err) {
                should.exist(err);
                err.should.be.a('object');
                err.should.have.property('code', 'ENOTEMPTY');
                setTimeout(done, 1);
            });
        });

        it('should be able to uninstall lorems', function(done) {
            var stash = new server.plugin.backends.Stash('lorems');
            stash.uninstall(function(err) {
                should.not.exist(err);
                setTimeout(done, 1);
            });
        });

        it('should be able to uninstall', function(done) {
            var stash = new server.plugin.backends.Stash();
            stash.uninstall(function(err) {
                should.not.exist(err);
                setTimeout(done, 1);
            });
        });
    });
});
