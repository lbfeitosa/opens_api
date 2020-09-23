# Requisitos de Sistema

- Node
- Npm
- Docker * <i>(somente se não possuir o mongodb)</i>
 

### Instalação NPM e Node
```
sudo apt-get update
sudo apt install npm
sudo apt-get install git-core curl build-essential openssl libssl-dev

sudo npm cache clean -f
sudo npm install -g n
sudo n latest
```
### Instalação Docker
https://docs.docker.com/install/linux/docker-ce/ubuntu/
```
sudo apt-get install  curl apt-transport-https ca-certificates software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```

# Configurações

## .env
* DEFAULT_SECRET é jwt secret para o User credentials
* MASTER_SECRET é jwt secret para o Master Token
```
MONGO_URL=mongodb://localhost:27018/opensapi
MONGO_USER=root
MONGO_PASS=opens
MONGO_SCHEMA=admin
DEFAULT_SECRET=opensapi_secret
MASTER_SECRET=opensapi_master_secret
```

## Executando 

Execute o docker-compose para criar as imagens e containers das imagens do MongoExpress e MongoDB:
```
sudo docker-compose up -d
```
Testar as conexões do MongoDB:
```
mongo --port 27018 -u root -p opens -authenticationDatabase admin
```
Insira o usuário master no sistema, responsável por criar e deletar usuários:
```
use opensapi
db.user.insert({"isMaster" : true, "login" : "master", "name" : "master", "email" : "master@master.com", "password" : "$2b$10$TLQH.vtlYQUfVX8EhpfYhegZA2J6Q1VV6u3m.jj7oR../JlXjfppK", "__v" : 0 })
```

Finalmente, instale as dependências npm install e execute a aplicação npm run start e faça a autenticação em POST:http://localhost:3000/auth com body
```json
{ 
    "email":"master@master.com",
    "password: "123456"
}
```
Resgate o token retornado da autenticação e utilize nos endpoints com autenticação Bearer:
- POST:http://localhost:3000/user  
- DEL:http://localhost:3000/user/:id

Para usuário simples, utilizar:
- PUT:http://localhost:3000/user/:id  
- GET:http://localhost:3000/user/:id


## Acessar dados via MongoExpress 

Testar mongoExpress (usuario express, senha opens):
``` 
http://localhost:8081
```

## Docker tests

Listando containers ativos
```
sudo docker container ls
```
Parando container
```
sudo docker stop <container_id>
```
Listando imagens docker
```
sudo docker images -a
```
Removendo uma imagem docker
```
sudo docker rmi <image_id> -f
```