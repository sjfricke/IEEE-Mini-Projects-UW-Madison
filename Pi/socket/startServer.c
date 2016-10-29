//
// Created by SpencerFricke on 7/17/2016.
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

#include "getFunctions.h"
#include "postFunctions.h"
#include "helperFunctions.h"

#define PORT 5000

#define GET "GET"
#define POST "POST"

int main(int argc, char *argv[])
{
    char* route = malloc(sizeof(char) * 100);
    char* postBody = malloc(sizeof(char) * 2000);
    char* returnMsg = malloc(sizeof(char) * 5000);
    char* receiveMsg = malloc(sizeof(char) * 5000); //5000 char max for data
    int msgSize;
    int status;

    struct sockaddr_in dest; /* socket info about the machine connecting to us */
    struct sockaddr_in serv; /* socket info about our server */
    int mySocket;            /* socket used to listen for incoming connections */
    socklen_t socksize = sizeof(struct sockaddr_in);

    memset(&serv, 0, sizeof(serv));           /* zero the struct before filling the fields */
    serv.sin_family = AF_INET;                /* set the type of connection to TCP/IP */
    serv.sin_addr.s_addr = htonl(INADDR_ANY); /* set our address to any interface */
    serv.sin_port = htons(PORT);           /* set the server port number */

    mySocket = socket(AF_INET, SOCK_STREAM, 0); //creats the socket
    printf("Socket Created! \n");

    /* bind serv information to mySocket */
    status = bind(mySocket, (struct sockaddr *)&serv, sizeof(struct sockaddr));

    //checks for TIME_WAIT socket
    if (status < 0) {
        printf("ERROR opening socket: %d , possible TIME_WAIT\n", status);
        printf("USE: netstat -ant|grep %d to find out\n", PORT);
        free(receiveMsg);
        return 1;
    } else {
        printf("Socket Binded!\n");
    }

    /* start listening, allowing a queue of up to 1 pending connection */
    listen(mySocket, 1);
    printf("Socket Listening on port %d!\n", PORT);
    int consocket = accept(mySocket, (struct sockaddr *)&dest, &socksize); //blocking for response


    while(consocket)
    {
        printf("Incoming connection from %s - sending welcome\n", inet_ntoa(dest.sin_addr));

        msgSize = recv(consocket, receiveMsg , 5000 , 0);
        printf("message of %d bytes:\n%s\n", msgSize, receiveMsg);
        printf("--------------------------\n");

        if (strncmp(receiveMsg, GET, strlen(GET)) == 0) { //GET Request
            findRoute(receiveMsg, &route);
            get_FindMethod(route, &returnMsg);

            printf("Route: %s\n", route);
            printf("Returning: %s\n", returnMsg);
            printf("Status: %d\n", status);

        } else if (strncmp(receiveMsg, POST, strlen(POST)) == 0) { //POST Request
            printf("POST \n");
            findRoute(receiveMsg, &route);

            printf("Route: %s\n", route);

            findBody(receiveMsg, &postBody);

            post_FindMethod(route, &returnMsg, postBody);

        } else { //something not GET or POST
              printf("NONE \n");
              strcpy (returnMsg, "HTTP Method not supported");
        }

        memset(receiveMsg,0, msgSize); //clears receive message

        send(consocket, returnMsg, strlen(returnMsg), 0);

        close(consocket);

        printf("waiting for next request\n");
        printf("--------------------------\n");
        consocket = accept(mySocket, (struct sockaddr *)&dest, &socksize);
    }

    printf("\nClosing Socket\n");
    free(returnMsg);
    free(receiveMsg);
    free(route);
    close(mySocket);
    return EXIT_SUCCESS;
}