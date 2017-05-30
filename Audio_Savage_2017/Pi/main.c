//Use netstat -ant|grep <PORT> | awk '{print$6}'    -to check status of socket if in TIME_WAIT

#include "server/server.h" 

void onResponse( char* response ) {
  printf("CALLBACK: %s\n", response);
}

int main ( int argc, char* argv[] ) {

  int status;
  http_t http;

  http.response = onResponse;

  status = httpServer(&http);
  printf("Status: %d\n", status);
  printf("value: %d\n", http.port);

  while(1){}
}
