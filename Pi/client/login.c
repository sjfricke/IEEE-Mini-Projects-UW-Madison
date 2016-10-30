//
// Created by SpencerFricke on 8/14/2016.
//
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

#include "util.h"

int main(int argc , char *argv[])
{
    int socket_desc;
    struct sockaddr_in server;
    char message[200], server_reply[2000], *response_body;

    //Create socket
    socket_desc = socket(AF_INET , SOCK_STREAM , 0);
    if (socket_desc == -1)
    {
        printf("Could not create socket");
    }

    server.sin_addr.s_addr = inet_addr( MAIN_SERVER_IP );
    server.sin_family = AF_INET;
    server.sin_port = htons( MAIN_SERVER_PORT );

    //Connect to remote server
    if (connect(socket_desc , (struct sockaddr *)&server , sizeof(server)) < 0)
    {
        puts("connect error");
        return 1;
    }

    puts("Connected\n");

    //Send some data
    strcpy (message, "GET /login");
    strcat (message," HTTP/1.1\r\n\r\n");

    if( send(socket_desc , message , strlen(message) , 0) < 0)
    {
        puts("Send failed");
        return 1;
    }
    puts("Data Send\n");

    //Receive a reply from the server
    if( recv(socket_desc, server_reply , 2000 , 0) < 0)
    {   
        puts("recv failed");
    }
    puts("Reply received\n");
    
    response_body = strstr(server_reply,"\r\n\r\n")+4;
    puts(response_body);
    puts("\n");


    close(socket_desc);
    return EXIT_SUCCESS;
}
