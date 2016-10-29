/* A simple server in the internet domain using TCP
   The port number is passed as an argument */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h> 
#include <sys/socket.h>
#include <netinet/in.h>

//called when a system call fails
void error(char *msg)
{
    perror(msg);
    exit(1);
}

int main(int argc, char *argv[]) {
    int mySocket, connect_socket, port_number, clilen;
    char buffer[512];
    char response_message[512];
    struct sockaddr_in server_address, client_address;
    int status;

    if (argc < 2) {
        fprintf(stderr, "ERROR, no port provided\n");
        fprintf(stderr, "usage: %s <port>\n", argv[0]);
        exit(1);
    }

    port_number = atoi(argv[1]); //grabs port number from argument

    // creates a new socket
    // AF_INET is Internet domain for any two hosts on the Internet
    // SOCK_STREAM streams socket in which characters are read in a continuous stream
    // 0 lets the operating system choose the most appropriate protocol.
    mySocket = socket(AF_INET, SOCK_STREAM, 0);
    if (mySocket < 0) {
        error("ERROR opening socket");
    } else {
        printf("Socket Created! \n");
    }

    // sets all values in a buffer to zero.
    // first parameter is a pointer to the buffer and the second is the size of the buffer
    bzero((char *) &server_address, sizeof(server_address));

    //set up the sockaddr_in struct
    server_address.sin_family = AF_INET;                // set the type of connection to TCP/IP
    server_address.sin_addr.s_addr = INADDR_ANY;        // set our address to any interface
    server_address.sin_port = htons(port_number);       // set the server port number

    // bind server_address information to mySocket
    status = bind(mySocket, (struct sockaddr *) &server_address, sizeof(server_address));

    // checks for TIME_WAIT socket
    if (status < 0) {
        printf("ERROR opening socket: %d , possible TIME_WAIT\n", status);
        printf("USE: netstat -ant|grep %d to find out\n", port_number);
        error("ERROR on binding");
    } else {
        printf("Socket Binded!\n");
    }

    // start listening, allowing a queue of up to 5 pending connection
    listen(mySocket, 5);
    printf("Socket Listening on port %d!\n", port_number);
    printf("--------------------------\n");

    clilen = sizeof(client_address);
    connect_socket = accept(mySocket, (struct sockaddr *) &client_address, &clilen); //blocking for request

    //will keep running until process is killed
    while (connect_socket) {

        printf("Incoming connection from %s\n", inet_ntoa(client_address.sin_addr));

        bzero(buffer,512); //clears buffer from last sent request

        status = read(connect_socket, buffer, 511);

        if (status < 0) {
            error("ERROR reading from socket");
        }

        printf("%s\n",buffer);

        strcpy(response_message, "I got your message!");

        // returns message back to sending client
        status = write(connect_socket, response_message, strlen(response_message));

        if (status < 0) {
            error("ERROR writing to socket");
        }

        printf("--------------------------\n");
        printf("waiting for next request\n");
        printf("--------------------------\n\n");
        connect_socket = accept(mySocket, (struct sockaddr *) &client_address, &clilen);
    }

    printf("\nClosing Socket\n");
    close(mySocket);
    return EXIT_SUCCESS;

}