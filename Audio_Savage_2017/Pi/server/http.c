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
  char* msg_return = malloc(sizeof(char) * 4096);

  char* timestamp = malloc(sizeof(char) * 256);
  int content_length;
  char* html = malloc(sizeof(char) * 4096);
  
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
    sprintf(msg_callback, "Incoming connection from %s - sending welcome\n", inet_ntoa(client.sin_addr));

    ((http_t*)config)->response(msg_callback);

    // HTTP Request - Need to handle it accordingly
    
    msg_size = recv(socket_con, msg_receive, 4096, 0);
    //printf("message of %d bytes:\n%s\n", msg_size, msg_receive);
    //printf("--------------------------\n");

    memset(msg_receive, 0, msg_size); //clears receive message

    // HTTP Reponse - Need to format string

    getTime(&timestamp, 256);

    printf("time: %s\n", timestamp);
    content_length = getHTML("index.html", &html, 4096);
    //    strcpy(html, "<html><head><title>IEEE Audio Savage</title></head><body>Hello World</body></html>");
    printf("%s \n%d\n", html, content_length);
    sprintf(msg_return, "HTTP/1.1 200 OK\r\nCache-Control: no-cache, private\r\nContent-Length: %i\r\nDate: %s\r\n\r\n%s", content_length, timestamp, html);
    
    send(socket_con, msg_return, strlen(msg_return), 0);

    close(socket_con);

    //printf("waiting for next request\n");
    //printf("--------------------------\n");
    socket_con = accept(socket_fp, (struct sockaddr *)&client, &socket_size);
  }

  pthread_exit(NULL);
  
}
