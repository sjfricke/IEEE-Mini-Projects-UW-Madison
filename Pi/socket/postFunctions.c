//
// Created by SpencerFricke on 7/22/2016.
//

#include "postFunctions.h"

char* routeIn;

void post_FindMethod(const char *route, char** returnMessage){

    if (strncmp(route, "/newPokemon", strlen(route)) == 0) {
        newPokemon(returnMessage);
    } else if (strncmp(route, "/updatePokemon", strlen(route)) == 0) {
        updatePokemon(returnMessage);
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
