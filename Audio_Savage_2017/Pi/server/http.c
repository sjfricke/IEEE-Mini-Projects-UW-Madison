#include "http.h"

int httpServer(HTTP *httpObject) {

  char* test = "test";
  
  httpObject->value = 5;
  httpObject->response(test);

  return 0;
}
