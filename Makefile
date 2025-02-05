#●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●#
#	 __  __    __    _  _  ____  ____  ____  __    ____ 		    	 	 #
#	(  \/  )  /__\  ( )/ )( ___)( ___)(_  _)(  )  ( ___)		   		     #
#	 )    (  /(__)\  )  (  )__)  )__)  _)(_  )(__  )__) 		     		 #
#	(_/\/\_)(__)(__)(_)\_)(____)(__)  (____)(____)(____) 𝕓𝕪 𝕁𝕠𝕤𝕖𝕡𝕙 ℂ𝕙𝕖𝕖𝕝	   #
#●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●#

#●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●#
#•❅──────✧❅✦❅✧──────❅••❅──────✧❅✦❅✧─COLOR──✧❅✦❅✧──────❅••❅──────✧❅✦❅✧──────❅•#
#●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●●○●○●○●○●○●○●○●○●○●#

NO_COLOR		=	\033[1;97m
OK_COLOR		=	\033[1;92m
ERROR_COLOR		=	\033[1;91m
WARN_COLOR		=	\033[1;93m
BLUE_COLOR		=	\033[1;94m

DOCKER_COMPOSE_FILE = ./docker-compose.yml



# Define the docker compose command and check if it is available
DOCKER_COMPOSE_CMD := $(shell command -v docker-compose >/dev/null 2>&1 && echo docker-compose || (docker compose version >/dev/null 2>&1 && echo docker compose))

ifndef DOCKER_COMPOSE_CMD
    $(error "Neither docker-compose nor docker compose is available.")
endif

all: up

check_compose:
	
up:
	@echo "$(OK_COLOR)Docker compose up [$(DOCKER_COMPOSE_FILE)]$(NO_COLOR)"
	@${DOCKER_COMPOSE_CMD} -f $(DOCKER_COMPOSE_FILE) up -d
	@echo 
	@echo "$(NO_COLOR)App running on http://localhost:3000 by default (you can change it in docker-compose)$(NO_COLOR)"
	
down-all:
	@echo "$(ERROR_COLOR)Docker compose down and removes everything [$(DOCKER_COMPOSE_FILE)]$(NO_COLOR)"
	@${DOCKER_COMPOSE_CMD} -f $(DOCKER_COMPOSE_FILE) down -v --remove-orphans --rmi all
down:
	@echo "$(ERROR_COLOR)Docker compose down and removes everything [$(DOCKER_COMPOSE_FILE)]$(NO_COLOR)"
	@${DOCKER_COMPOSE_CMD} -f $(DOCKER_COMPOSE_FILE) down -v

re-img:
	@${DOCKER_COMPOSE_CMD} -f $(DOCKER_COMPOSE_FILE) up -d --build

clean-cache:
	@echo "$(ERROR_COLOR)Cleaning Docker cache$(NO_COLOR)"
	@docker system prune -a

re : down up

app-dev:
	@echo "$(OK_COLOR)Installing dependencies...$(NO_COLOR)"
	@cd app && npm install
	@echo "$(OK_COLOR)Starting development server...$(NO_COLOR)"
	@cd app && npm run dev

clean-app-dev:
	@echo "$(ERROR_COLOR)Cleaning app dependencies...$(NO_COLOR)"
	@cd app && rm -rf node_modules

help:
	@echo "$(BLUE_COLOR)Usage:$(NO_COLOR)"
	@echo "  make [command]"
	@echo ""
	@echo "$(BLUE_COLOR)Commands:$(NO_COLOR)"
	@echo "  help        Show this help message"
	@echo "**************************** DOCKERIZED DEPLOY *************************************"
	@echo "  up                Start the application[default]"
	@echo "  down              Stop the application"
	@echo "  re                Restart the application"
	@echo "  re-img            Restart the application with rebuild"
	@echo "  clean-cache       Clean Docker cache"
	@echo "**************************** DEVELOPMENT DEPLOY ****************************************"
	@echo "  app-dev           Start the application in development mode"
	@echo "  clean-app-dev     Clean the application dependencies"
	

.PHONY: all up down down-all re-img clean-cache re app-dev
