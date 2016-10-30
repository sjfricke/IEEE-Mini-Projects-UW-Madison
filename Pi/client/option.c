//
// Created by SpencerFricke on 8/10/2016.
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
    if (argc < 2) {
        puts("Need to pass an option value\n");
        puts("Battle Options:");
            puts("\t1 - Light Attack");
            puts("\t2 - Big Attack");
            puts("\t3 - Run");
            puts("\t4 - Pokeball");
            puts("\t5 - GreatBall");
            puts("\t6 - UltraBall");
            puts("\t7 - Potion");
            puts("\t8 - Super Potion");  
        puts("Mart Options:");
            puts("\t1 - Pokeball - 200 coins");
            puts("\t2 - Greatball - 400 coins");
            puts("\t3 - Ultraball - 700 coins");
            puts("\t4 - Potion - 200 coins");
            puts("\t5 - Super Potion - 350 coins");
        return -1;
    }

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

    puts("Connected");

    //Send some data
    strcpy (message, "GET /option/");
    strcat (message, argv[1]);
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
    puts("Reply received");
    
    response_body = strstr(server_reply,"\r\n\r\n")+4;
    puts(response_body);
    puts("\n");


    close(socket_desc);
    return EXIT_SUCCESS;
}
