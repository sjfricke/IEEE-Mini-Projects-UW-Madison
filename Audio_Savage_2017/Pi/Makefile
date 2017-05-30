CC = gcc
CFLAGS = -Wall -Werror -c
OBJ = server/util.o server/websocket.o server/http.o

main: server
	$(CC) $(OBJ) main.c -lpthread -o Audio_Savage

server: $(OBJ)

server/%.o: server/%.c
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm server/*.o
	rm Audio_Savage
