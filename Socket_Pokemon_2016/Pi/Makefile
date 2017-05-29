CC = gcc
CFLAGS = -Wall -Werror -c
MONGOFLAG = $(pkg-config --cflags --libs libmongoc-1.0)
OBJ = socket/startServer.o socket/getFunctions.o database/mongoStatus.o

temp: server move login option stats

clean: cleanMove cleanLogin cleanOption cleanStats
	rm runServer

server:
	gcc -Wall -Werror -o runServer socket/startServer.c socket/helperFunctions.c socket/getFunctions.c database/mongoStatus.c socket/postFunctions.c database/mongoPokemon.c database/mongoPlayer.c $$(pkg-config --cflags --libs libmongoc-1.0)

move:
	gcc -Wall -Werror -o move client/move.c

login:
	gcc -Wall -Werror -o login client/login.c

option:
	gcc -Wall -Werror -o option client/option.c
    
stats:
	gcc -Wall -Werror -o stats client/stats.c

cleanMove:
	rm move

cleanLogin:
	rm login

cleanOption:
	rm option
    
cleanStats:
	rm stats

