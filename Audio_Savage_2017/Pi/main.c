//Use netstat -ant|grep <PORT> | awk '{print$6}'    -to check status of socket if in TIME_WAIT

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <signal.h>

#include "server/server.h" 

int main ( int argc, char* argv[] ) {
  int a;
  
  printf("%d\n", MAIN_SERVER_PORT);

  a = httpServer();
  printf("%d\n", a);

  a = websocketServer();
  printf("%d\n", a);

}
