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

     //ends the string so if a shorter string is passed then last route otherwise previous longer strings will remain
    messageRoute[endIndex] = '\0';

    //copies route from message to reference string
    strncpy(*route, messageRoute, endIndex + 1);

}