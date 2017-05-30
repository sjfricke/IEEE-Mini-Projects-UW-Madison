#ifndef __SERVER_H__
#define __SERVER_H__

#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <signal.h>

#include "http.h"
#include "websocket.h"

#define   MAIN_SERVER_IP        "192.168.1.159"
#define   MAIN_SERVER_PORT      8000

#endif
