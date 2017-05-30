CC = gcc
CFLAGS = -Wall -Werror -c

main: server
	$(CC) server/websocket.o server/http.o main.c -o Audio_Savage

server: server/http.o server/websocket.o

http.o: server/http.c
	$(CC) $(CFLAGS) server/http.c -o server/http.o

websocket.o: server/websocket.c
	$(CC) $(CFLAGS) server/websocket.c server/websocket.o

clean:
	rm server/*.o
	rm Audio_Savage
