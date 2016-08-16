//
// Created by SpencerFricke on 7/22/2016.
//

#ifndef PISOCKETS_POSTFUNCTIONS_H
#define PISOCKETS_POSTFUNCTIONS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../database/mongoPokemon.h"

void post_FindMethod(const char *route, char** returnMessage);

void newPokemon(char** returnMessage);

void updatePokemon(char** returnMessage);
#endif //PISOCKETS_POSTFUNCTIONS_H
