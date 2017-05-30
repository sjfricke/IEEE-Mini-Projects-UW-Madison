#ifndef __HTTP_H__
#define __HTTP_H__

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <signal.h>
#include <pthread.h>

#include "util.h"

typedef void (*callback)(char*);
typedef void (*callbackInt)(int*);

typedef struct http_t {
  callback response;
  int port;
} http_t;

int httpServer(http_t *http);

void* httpDaemon(void *config);

void findRoute(const char* request, char** route);

#endif
