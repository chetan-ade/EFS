#include <stdio.h> 
#include <stdlib.h>
#include <string.h>

struct mdtElement
{
    // int index;
    char instruction[20];
}mdt[20];

void main() {
    FILE *file;
    char line[20];
    int i = 0, j = 0, flag = 0;

    file = fopen("macro.txt","r");
    if (file == NULL) {
        printf("Cannor open file");
        exit(0);
    }

    while(fgets(line,sizeof(line),file)) {
        // printf("%s",line);
        if (flag == 1) {
            // mdt[i].index = i;
            strcpy((mdt[i].instruction),line);
            i++;
        }
        if (strcmp(line,"MACRO\n")==0) {
            flag = 1;
        } else if(strcmp(line,"MEND\n")==0) {
            flag = 0;
        }
    }
    printf("\n\tMDT");
    printf("\nINDEX  INSTRUCTION\n");
    for(j=0;j<i;j++) {
        // printf("%d       ",mdt[j].index);
        printf("%d       ",j);
        puts(mdt[j].instruction);
    }

    fclose(file);
}