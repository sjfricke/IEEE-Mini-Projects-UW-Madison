//
// Created by SpencerFricke on 7/22/2016.
//
#include "getFunctions.h"

char* routeIn;

void get_FindMethod(const char *route, char** returnMessage){

    if (strncmp(route, "/player", strlen(route)) == 0) {
        getPlayer(returnMessage);
    } else if (strncmp(route, "/status", strlen(route)) == 0) {
        getStatus(returnMessage);
    } else if (strncmp(route, "/health", strlen(route)) == 0) {
        getHealth(returnMessage);
    } else if (strncmp(route, "/level", strlen(route)) == 0) {
        getLevel(returnMessage);
    } else if (strncmp(route, "/coins", strlen(route)) == 0) {
        getCoins(returnMessage);
    } else {
        strcpy (*returnMessage, "Get Route Not Found");
    }
}

void getPlayer(char** returnMessage){
    getPlayerMongo(returnMessage);
}

void getStatus(char** returnMessage){
    getStatusMongo(returnMessage);
}

// These are hardcoded to show how get request works
void getHealth(char** returnMessage){
    strcpy (*returnMessage, "55hp");
}

void getLevel(char** returnMessage){
    strcpy (*returnMessage, "21");
}

void getCoins(char** returnMessage){
    strcpy (*returnMessage, "40,000");
}


