//
// Created by SpencerFricke on 7/22/2016.
//

#include "postFunctions.h"

char* routeIn;

void post_FindMethod(const char *route, char** returnMessage, char *body){

    if (strncmp(route, "/newPokemon", strlen(route)) == 0) {
        newPokemon(returnMessage);

    } else if (strncmp(route, "/updatePokemon", strlen(route)) == 0) {
        updatePokemon(returnMessage);

    } else if (strncmp(route, "/movePlayer", strlen(route)) == 0) {
        updatePlayerPosition(returnMessage, body);

    } else if (strncmp(route, "/updateMode", strlen(route)) == 0) {
        updatePlayerMode(returnMessage, body);

    } else if (strncmp(route, "/updateHealth", strlen(route)) == 0) {
        updatePlayerHealth(returnMessage, body);

    } else if (strncmp(route, "/updateItem", strlen(route)) == 0) {
        updatePlayerItem(returnMessage, body);

    } else if (strncmp(route, "/updateScore", strlen(route)) == 0) {
        updatePlayerScore(returnMessage, body);

    } else if (strncmp(route, "/updateCoins", strlen(route)) == 0) {
        updatePlayerCoins(returnMessage, body);

    } else {

        strcpy (*returnMessage, "Post Route Not Found");

    }
}


void newPokemon(char** returnMessage){
    newPokemonMongo();
    strcpy (*returnMessage, "Added");
}

void updatePokemon(char** returnMessage){
    updatePokemonMongo();
    strcpy (*returnMessage, "Updated");
}

void updatePlayerPosition(char** returnMessage, char* body){
    updateNumberStatMongo(returnMessage, body);
}

void updatePlayerHealth(char** returnMessage, char* body){
    updateNumberStatMongo(returnMessage, body);
}

void updatePlayerItem(char** returnMessage, char* body){
    updateNumberStatMongo(returnMessage, body);
}

void updatePlayerScore(char** returnMessage, char* body){
    updateNumberStatMongo(returnMessage, body);
}

void updatePlayerCoins(char** returnMessage, char* body){
    updateNumberStatMongo(returnMessage, body);
}

void updatePlayerMode(char** returnMessage, char* body){
    updateModeMongo(returnMessage, body);
}
