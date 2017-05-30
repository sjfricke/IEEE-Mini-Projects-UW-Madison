CC = gcc
CFLAGS = -Wall -Werror -c

main: server
	$(CC) server/websocket.o server/http.o main.c -lpthread -o Audio_Savage

server: server/http.o server/websocket.o

http.o: server/http.c
	$(CC) -Wall -Werror -c -lpthread server/http.c -o server/http.o

websocket.o: server/websocket.c
	$(CC) $(CFLAGS) server/websocket.c -o server/websocket.o

clean:
	rm server/*.o
	rm Audio_Savage
