//
// Created by SpencerFricke on 8/7/2016.
//

#include "helperFunctions.h"

void findRoute(const char* message, char** route) {
    int endIndex = 0;
    char *messageRoute;

    //finds when the route starts
    messageRoute = strstr(message, "/");

    //finds when the route ends
    while (messageRoute[endIndex] != ' ') {
        endIndex++;
    }


    //copies route from message to reference string
    strncpy(*route, messageRoute, endIndex);

    //ends the string so if a shorter string is passed then last route otherwise previous longer strings will remain
    strcpy(*route + endIndex, "\0");

}


void findBody(const char* message, char** body) {
//    int endIndex = 0;
    char *messageBody;

    //finds when the body starts
    messageBody = strstr(message, "\n");

    //copies body from message to reference string
    strncpy(*body, messageBody, strlen(messageBody));

}