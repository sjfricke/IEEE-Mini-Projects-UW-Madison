CC = gcc
CFLAGS = -Wall -Werror -c
MONGOFLAG = $(pkg-config --cflags --libs libmongoc-1.0)
OBJ = socket/startSocket.o socket/getFunctions.o database/mongoStatus.o

temp: server move login

clean: cleanMove cleanLogin

server:
	gcc -Wall -Werror -o runSocket socket/startSocket.c socket/helperFunctions.c socket/getFunctions.c database/mongoStatus.c socket/postFunctions.c database/mongoPokemon.c $$(pkg-config --cflags --libs libmongoc-1.0)

move:
	gcc -Wall -Werror -o move client/move.c

login:
	gcc -Wall -Werror -o login client/login.c

cleanMove:
	rm move

cleanLogin:
	rm login