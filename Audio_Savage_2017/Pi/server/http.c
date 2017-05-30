#include "http.h"

pthread_t server_thread;

int httpServer(http_t *http) {

  int status;
  char* test = "test";

  http->port = 8000;
  
  status = pthread_create(&server_thread,
			  NULL,
			  httpDaemon,
			  (void *)http);

  http->response(test);
  
  return status;
}

void* httpDaemon(void *config) {

  //--------------------------------//
  //         Variable Setup         //
  //--------------------------------//
  
  int status; // used to check status of c functions return values
  int port = ((http_t*)config)->port;

  char* msg_receive = malloc(sizeof(char) * 4096); //4096 char max for data
  int msg_size;
  char* msg_callback = malloc(sizeof(char) * 4096);
  char* msg_return = malloc(sizeof(char) * 131072);
  char* route = malloc(sizeof(char) * 128);
  char* timestamp = malloc(sizeof(char) * 256);
  int content_length;
  char* html = malloc(sizeof(char) * 131072);
  
  //--------------------------------//
  //       Configure TCP Socket     //
  //--------------------------------//
  
  struct sockaddr_in client;    // socket info about the machine connecting to us
  struct sockaddr_in server;    // socket info about our server
  int socket_fp;                // socket used to listen for incoming connections
  int socket_con;               // used to hold status of connect to socket
  socklen_t socket_size = sizeof(struct sockaddr_in);

  memset(&server, 0, sizeof(server));            // zero the struct before filling the fields
  server.sin_family = AF_INET;                 // set to use Internet address family
  server.sin_addr.s_addr = htonl(INADDR_ANY);  // sets our local IP address
  server.sin_port = htons(port);               // sets the server port number

  // creates the socket
  // AF_INET refers to the Internet Domain
  // SOCK_STREAM sets a stream to send data
  // 0 will have the OS pick TCP for SOCK_STREAM
  socket_fp = socket(AF_INET, SOCK_STREAM, 0);
  if (socket_fp < 0) {
    printf("ERROR: Opening socket\n");
    pthread_exit(NULL);
  }
  else { printf("TCP Socket Created! \n"); }

  // bind server information with server file poitner
  status = bind(socket_fp, (struct sockaddr *)&server, sizeof(struct sockaddr));

  // checks for TIME_WAIT socket
  // when daemon is closed there is a delay to make sure all TCP data is propagated
  if (status < 0) {
    printf("ERROR opening socket: %d , possible TIME_WAIT\n", status);
    printf("USE: netstat -ant|grep %d to find out\n", port);
    pthread_exit(NULL);
  } else {
    printf("Socket Binded!\n");
  }

  // start listening, allowing a queue of up to 10 pending connection
  listen(socket_fp, 10);
  printf("Socket Listening on port %d!\n\n", port);
  //blocking for response
  socket_con = accept(socket_fp, (struct sockaddr *)&client, &socket_size);

  //--------------------------------//
  //      HTTP Server Polling       //
  //--------------------------------//
  
  while(socket_con) {

    msg_size = recv(socket_con, msg_receive, 4096, 0);
    //printf("message of %d bytes:\n%s\n", msg_size, msg_receive);
    //printf("--------------------------\n");
    
    sprintf(msg_callback, "Incoming connection from %s - sending welcome\n", inet_ntoa(client.sin_addr));

    // HTTP Request - Need to handle it accordingly
    
    if (strncmp(msg_receive, "GET", 3) == 0) { //GET Request

      findRoute(msg_receive, &route);

      //      get_FindMethod(route, &returnMsg);

    } else if (strncmp(msg_receive, "POST", 4) == 0) { //POST Request
      //printf("POST \n");
      //findRoute(msg_receive, &route);
      //printf("Route: %s\n", route);
      //findBody(msg_receive, &postBody);
      //post_FindMethod(route, &returnMsg, postBody);

    } else { //something not GET or POST
      //printf("NONE \n");
      strcpy(msg_return, "HTTP Method not supported");
    }
    
    memset(msg_receive, 0, msg_size); //clears receive message

    // HTTP Reponse - Need to format string

    
    if (strncmp(route, "/key/", 5) == 0) {

      ((http_t*)config)->response(route + 5);
      strcpy(msg_return, "Key Received");

    } else {
      
      getTime(&timestamp, 256);
      content_length = getHTML(route, &html, 131072);

      if (content_length < 0) {
	sprintf(msg_return, "HTTP/1.1 400 OK\r\nCache-Control: no-cache, private\r\nDate: %s\r\n\r\n", timestamp);
      } else {
	sprintf(msg_return, "HTTP/1.1 200 OK\r\nCache-Control: no-cache, private\r\nContent-Length: %i\r\nDate: %s\r\n\r\n%s", content_length, timestamp, html);
      }
      
    }
    
    send(socket_con, msg_return, strlen(msg_return), 0);

    close(socket_con);

    //printf("waiting for next request\n");
    //printf("--------------------------\n");
    socket_con = accept(socket_fp, (struct sockaddr *)&client, &socket_size);
  }

  pthread_exit(NULL);
  
}

void findRoute(const char* request, char** route) {
    int end_index = 0;
    char *route_str;

    //finds when the route starts
    route_str = strstr(request, "/");

    //finds when the route ends
    while (route_str[end_index] != ' ') {
        end_index++;
    }

    //copies route from message to reference string
    strncpy(*route, route_str, end_index);

    //ends the string so if a shorter string is passed then last route otherwise previous longer strings will remain
    strcpy(*route + end_index, "\0");

}
