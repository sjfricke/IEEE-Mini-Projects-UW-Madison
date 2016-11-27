//
// Created by SpencerFricke on 7/23/2016.
//
#include "mongoStatus.h"

void getStatusMongo(char** queryResult){

    mongoc_client_t *client;
    mongoc_collection_t *collection;
    mongoc_cursor_t *cursor;
    const bson_t *doc;
    bson_t *query;
    char *str;

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Player");
    query = BCON_NEW ("$query", "{", "}");
    cursor = mongoc_collection_find (collection, MONGOC_QUERY_NONE, 0, 0, 0, query, NULL, NULL);

    while (mongoc_cursor_next (cursor, &doc)) {
        str = bson_as_json (doc, NULL);
        printf ("Query: %s\n", str);
        strcpy (*queryResult, str);
        bson_free (str);
    }

    bson_destroy (query);
    mongoc_cursor_destroy (cursor);
    mongoc_collection_destroy (collection);
    mongoc_client_destroy (client);
    mongoc_cleanup ();

}

void getPlayerMongo(char** queryResult){

    mongoc_client_t *client;
    mongoc_collection_t *collection;
    mongoc_cursor_t *cursor;
    const bson_t *doc;
    bson_t *query;
    char *str;
    
    //sets as null incase query returns empty
    strcpy (*queryResult, "null");
    
    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, "IEEE", "Player");
    query = BCON_NEW ("$query", "{", "}"); //checks for score over -1
    cursor = mongoc_collection_find (collection, MONGOC_QUERY_NONE, 0, 1, 0, query, NULL, NULL); //limits to 1 query

    while (mongoc_cursor_next (cursor, &doc)) {
        str = bson_as_json (doc, NULL);
        printf ("Query: %s\n", str);
        strcpy (*queryResult, str);
        bson_free (str);
    }

    bson_destroy (query);
    mongoc_cursor_destroy (cursor);
    mongoc_collection_destroy (collection);
    mongoc_client_destroy (client);
    mongoc_cleanup ();

}
