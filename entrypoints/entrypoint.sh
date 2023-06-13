#!/usr/bin/env bash

RED='\033[1;31m'
GREEN='\033[1;32m'
BLUE='\033[1;36m'
NC='\033[0m' 

printf "${GREEN} ██████╗   █████╗   ██████╗ ██╗  ██╗ ███████╗ ███╗   ██╗ ██████╗${NC}\n" 
printf "${GREEN} ██╔══██╗ ██╔══██╗ ██╔════╝ ██║ ██╔╝ ██╔════╝ ████╗  ██║ ██╔══██╗${NC}\n"
printf "${GREEN} ██████╔╝ ███████║ ██║      █████╔╝  █████╗   ██╔██╗ ██║ ██║  ██║${NC}\n"
printf "${GREEN} ██╔══██╗ ██╔══██║ ██║      ██╔═██╗  ██╔══╝   ██║╚██╗██║ ██║  ██║${NC}\n"
printf "${GREEN} ██████╔╝ ██║  ██║ ╚██████╗ ██║  ██╗ ███████╗ ██║ ╚████║ ██████╔╝${NC}\n"
printf "${GREEN} ╚═════╝  ╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝ ╚══════╝ ╚═╝  ╚═══╝ ╚═════╝ ${NC}\n"
printf "${RED}   ★-------------------     jimmg35     -------------------★\n${NC}"

printf "${BLUE}༼ つ ◕_◕ ༽つ ==> wait for database connection ready...${NC}\n"

function migrate() {
    printf "${BLUE}༼ つ ◕_◕ ༽つ ==> generating migrations...${NC}\n"
    yarn migrate:prod
}

function main() {
    printf "${BLUE}༼ つ ◕_◕ ༽つ ==> updating database...${NC}\n"
    yarn update:prod &&
    printf "${BLUE}༼ つ ◕_◕ ༽つ ==> seeding database...${NC}\n"
    yarn seed:prod &&
    printf "${BLUE}༼ つ ◕_◕ ༽つ ==> starting the service...${NC}\n"
    yarn prod
}

{
    migrate && main
} || {
    main
}
    