//
// Created by SpencerFricke on 8/17/2016.
//

#include "mongoPlayer.h"

void updateNumberStatMongo(char** returnMessage, char* body) {

    char *bodyKey;
    char *bodyValue;
    char *playerOID;

    strtok (body," ,:"); //gets '{' from body
    //next call will get inner part
    bodyKey = strtok (NULL," ,:");
    bodyValue = strtok (NULL," ,:");
    strtok (NULL," ,:"); //ignores oid key
    playerOID = strtok (NULL," ,:");
    
    mongoc_collection_t *collection;
    mongoc_client_t *client;
    bson_error_t error;
    bson_oid_t oid;
    bson_t *doc = NULL;
    bson_t *update = NULL;
    bson_t *query = NULL;

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Player");

    bson_oid_init_from_string (&oid, playerOID);
    query = BCON_NEW ("_id", BCON_OID(&oid));
    update = BCON_NEW ("$set", "{",
                       BCON_UTF8(bodyKey), BCON_INT32(atoi(bodyValue)),
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

        strcpy (*returnMessage, "Error Updated");
    }

    strcpy (*returnMessage, "Updated ");
    strcat (*returnMessage, bodyKey);
    strcat (*returnMessage, " to ");
    strcat (*returnMessage, bodyValue);
}

void updateModeMongo(char** returnMessage, char* body) {

    char *bodyKey;
    char *bodyValue;
    char *playerOID;

    strtok (body," :"); //gets '{' from body
    //next call will get inner part
    bodyKey = strtok (NULL," :");
    bodyValue = strtok (NULL," :");
    strtok (NULL," ,:"); //ignores oid key
    playerOID = strtok (NULL," ,:");

    mongoc_collection_t *collection;
    mongoc_client_t *client;
    bson_error_t error;
    bson_oid_t oid;
    bson_t *doc = NULL;
    bson_t *update = NULL;
    bson_t *query = NULL;

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Player");

    bson_oid_init_from_string (&oid, playerOID);
    query = BCON_NEW ("_id", BCON_OID(&oid));
    update = BCON_NEW ("$set", "{",
                       BCON_UTF8(bodyKey), BCON_UTF8(bodyValue),
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

        strcpy (*returnMessage, "Error Updated");
    }

    strcpy (*returnMessage, "Updated ");
    strcat (*returnMessage, bodyKey);
    strcat (*returnMessage, " to ");
    strcat (*returnMessage, bodyValue);
}
