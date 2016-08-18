//
// Created by SpencerFricke on 8/7/2016.
//

#include "mongoPokemon.h"

void newPokemonMongo(void) {
    mongoc_client_t *client;
    mongoc_collection_t *collection;
    bson_error_t error;
    //bson_oid_t oid;
    bson_t *doc;
    const char *json = "{\"hello Json\": { \"world\" : \"5\"} }";

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Pokemon");

//    doc = bson_new ();
//    bson_oid_init (&oid, NULL);
//    BSON_APPEND_OID (doc, "_id", &oid);
//    BSON_APPEND_UTF8 (doc, "hello", "world");


    doc = bson_new_from_json ((const uint8_t *)json, -1, &error);


    if (!mongoc_collection_insert (collection, MONGOC_INSERT_NONE, doc, NULL, &error)) {
        fprintf (stderr, "%s\n", error.message);
    }

    bson_destroy (doc);
    mongoc_collection_destroy (collection);
    mongoc_client_destroy (client);
    mongoc_cleanup ();

}

void updatePokemonMongo(void) {
    mongoc_collection_t *collection;
    mongoc_client_t *client;
    bson_error_t error;
    bson_oid_t oid;
    bson_t *doc = NULL;
    bson_t *update = NULL;
    bson_t *query = NULL;

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Pokemon");

    bson_oid_init_from_string (&oid, "57a7253174fece2ead0af781");
    query = BCON_NEW ("_id", BCON_OID(&oid));
    update = BCON_NEW ("$set", "{",
                       "key", BCON_UTF8 ("hello"),
                       "updated", BCON_BOOL (true),
                       "}");

    if (!mongoc_collection_update (collection, MONGOC_UPDATE_NONE, query, update, NULL, &error)) {
        fprintf (stderr, "%s\n", error.message);

        if (doc)
            bson_destroy (doc);
        if (query)
            bson_destroy (query);
        if (update)
            bson_destroy (update);

        mongoc_collection_destroy (collection);
        mongoc_client_destroy (client);
        mongoc_cleanup ();
    }



}