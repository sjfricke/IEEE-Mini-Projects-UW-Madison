//
// Created by SpencerFricke on 8/7/2016.
//

#ifndef PISOCKETS_HELPERFUNCTIONS_H
#define PISOCKETS_HELPERFUNCTIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

void findRoute(const char* message, char** route);

void findBody(const char* message, char** body);

#endif //PISOCKETS_HELPERFUNCTIONS_H
