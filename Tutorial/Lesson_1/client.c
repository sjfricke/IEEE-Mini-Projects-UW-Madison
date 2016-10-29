#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h> 

//called when a system call fails
void error(char *msg)
{
    perror(msg);
    exit(0);
}

int main(int argc, char *argv[])
{
    int mySocket, port_number, status;

    struct sockaddr_in server_address;
    struct hostent *server;

    char buffer[512]; //will use to hold message from server response

    //makes sure you passed hostname and port
    if (argc < 3) {
       fprintf(stderr,"usage: %s <hostname> <port>\n", argv[0]);
       exit(0);
    }

    port_number = atoi(argv[2]); //grabs port number from argument

    mySocket = socket(AF_INET, SOCK_STREAM, 0);
    if (mySocket < 0) {
        error("ERROR opening socket");
    }

    //socket library function to get host from string, returns a struct pointer of type hostent
    server = gethostbyname(argv[1]);
    if (server == NULL) {
        fprintf(stderr,"ERROR, no such host\n");
        exit(0);
    }

    bzero((char *) &server_address, sizeof(server_address)); //clears buffer

    server_address.sin_family = AF_INET;

    // copies the address set from the argument passed
    bcopy((char *)server->h_addr, (char *)&server_address.sin_addr.s_addr,  server->h_length);

    server_address.sin_port = htons(port_number); //sets port number

    if ( connect( mySocket, (struct sockaddr *)&server_address, sizeof(server_address)) < 0) {
        error("ERROR connecting");
    } else {
        puts("Connected\n");
    }

    //used to get message from user
    printf("Please enter the message: ");
    bzero(buffer,512);
    fgets(buffer,512,stdin);

    status = write(mySocket, buffer, strlen(buffer));
    if (status < 0)  {
        error("ERROR writing to socket");
    }

    bzero(buffer,512); //clears buffer
    status = read(mySocket, buffer, 511); //blocks until response
    if (status < 0) {
        error("ERROR reading from socket");
    }

    printf("%s\n",buffer);
    return 0;
}
