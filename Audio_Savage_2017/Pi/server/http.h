#ifndef __HTTP_H__
#define __HTTP_H__

typedef void (*callback)(char*);
typedef void (*callbackInt)(int*);

typedef struct HTTP {
  callback response;
  int value;
} HTTP;

int httpServer(HTTP *httpObject);

#endif
