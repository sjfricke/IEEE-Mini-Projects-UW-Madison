//Use netstat -ant|grep <PORT> | awk '{print$6}'    -to check status of socket if in TIME_WAIT

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "server/server.h" 

void onResponse( char* response ) {
  printf("%s\n", response);
}

int main ( int argc, char* argv[] ) {

  int status;
  HTTP myHttp;

  myHttp.response = onResponse;
  myHttp.value = 0;

  status = httpServer(&myHttp);
  printf("Status: %d\n", status);
  printf("value: %d\n", myHttp.value);
}
