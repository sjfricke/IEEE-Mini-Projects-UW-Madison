#ifndef __SERVER_UTIL_H__
#define __SERVER_UTIL_H__

#include <time.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#define WEBSITE_FOLDER "website"

// Takes a string and length and sets it to RFC 1123 Date Format for HTTP Response
void getTime(char** timestamp, int length);

// Takes files and sets it to HTML string
// Returns the length of HTML content length
int getHTML(char* file, char** html, int length);

#endif
