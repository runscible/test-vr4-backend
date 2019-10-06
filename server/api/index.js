'use strict';

exports.register = function (server, options, next) {
// const {getInfo, getFilms, getMusic} =  require('./persistence');
    const MongoClient = require('mongodb').MongoClient;
    const mongo = require('mongodb');
    const assert = require('assert');
    const url = 'mongodb://localhost:27017';
    const dbName = 'vr4';
    const fs = require('fs');
    const Buffer = require('buffer').Buffer;
    server.route({
        method: 'GET',
        path: '/music',
        handler:  (request, reply) => {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('music');
                col.find({}).toArray((err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/films',
        handler: function (request, reply) {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('films');
                col.find({}).toArray((err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/about',
        handler: function (request, reply) {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('about');
                col.find({}).toArray((err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/update-info',
        handler: function (request, reply) {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('about');
                col.findOneAndUpdate({_id: '5d990d95c516240c4428cf96'}, {$set: {info: request.payload.info}}, {
                    upsert: true
                },(err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('login');
                col.findOne({user: request.payload.user, password: request.payload.password},(err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/post-avatar',
        config: {
                payload: {
                    output: "stream",
                    parse: true,
                    allow: "multipart/form-data",
                    maxBytes: 2 * 1000 * 1000
                },
            handler: function (request, reply){
                var fileContent = request.payload.file._data;
                fs.writeFile('../test-vr4/src/assets/img/avatar.jpg', new Buffer.from(fileContent, "base64"), (err) => {
                    if (err) throw err;
                      console.log("The file was succesfully saved!");
                     reply({message: "OK"});
                });
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/get-avatar',
        handler: function (request, reply) {
            const client = new MongoClient(url);
            client.connect((err, client) => {
                const db = client.db(dbName);
                const col = db.collection('images.files');
                col.find({}).toArray((err, docs) => {
                    reply({message: docs})
                });
            });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'api'
};
