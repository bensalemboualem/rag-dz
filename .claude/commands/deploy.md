# Deployer

Cible: $ARGUMENTS

Pre: tout commit, pas console.log, teste local

Statique: rsync apps/[nom]/ user@vps:/var/www/iafactory/apps/[nom]/
Docker: git pull + docker-compose up -d --build

Verifier: docker-compose ps, curl URL
