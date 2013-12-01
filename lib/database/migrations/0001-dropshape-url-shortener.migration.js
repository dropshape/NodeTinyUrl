'use strict';

var TYPE = 'MongooseURLShortener';
var objId = '5297d4c891452d0000000004';

/**
 * Add your Model creation code by getting a reference to the model
 * and then calling a creation method like create() insert() upsert() etc.
 * You must call next when you are finished.
 * @param db
 * @param next
 */
exports.up = function (db, next) {
    var model = getModel(db);
    model.create({
        'hash': '4EK_lmyHi',
        'url': 'http://www.dropshape.com',
        'twitters': [],
        'created': '2013-11-28T23:42:00.295Z',
        'totalHits': 0,
        'hits': [],
        'type': TYPE,
        '_id': objId,
        '__v': 0
    }, next);
};

/**
 * Place your schema layout here.
 * @param schema
 */
function extendSchema(schema) {
    //Do your schema extension here
    //schema.add({ prop: value } );
    //schema.methods.newMethod = function();
    //schema.statics.newMethod = function();
    //schema.pre() etc etc....
    schema.add({
        type: {type: String, 'default': TYPE},
        url: {type: String, unique: true},
        hash: {type: String, unique: true},
        hits: [
            {}
        ],
        totalHits: {type: Number, 'default': 0},
        created: {type: Date, 'default': Date.now}
    });
}

/**
 * Teardown your migration.
 * If you use the objId variable above then you should not need to
 * modify this method as it will automatically remove the imported model.
 * @param db
 * @param next
 */
exports.down = function (db, next) {
    getModel(db).remove({'_id': objId}, next);
};

//-------------------------------------------------------------------------
//
// Private Methods
// You should not have to edit the methods below this line.
//-------------------------------------------------------------------------

function getModel(db) {
    return createBaseSchema(db, TYPE);
}

function createBaseSchema(db, TYPE) {
    try {
        return db.model(TYPE);
    } catch (e) {
        var schema = db.model('____' + TYPE + '____', {}).schema;
        extendSchema(schema);
        return db.model(TYPE, schema);
    }
}