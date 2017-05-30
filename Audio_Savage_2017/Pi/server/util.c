#include "util.h"

void getTime(char** timestamp, int length) {

  time_t raw_time;
  struct tm *info;
  time( &raw_time );

  info = localtime( &raw_time );

  strftime(*timestamp, length, "%a, %d %b %Y %H:%M:%S %Z", info);  
}
