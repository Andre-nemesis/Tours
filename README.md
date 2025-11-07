# Tour's

Este projeto se determina a criar uma aplicação mobile multi plataforma(Android & Ios) utilizando alguns recursos do dispositivo utilizando o react native e o expo go, como:
- GPS
- Câmera
- Áudio
- Notificações
- Armazenamento local

Tendo o intuito final, gerar uma aplicação que forneça informações multimídia sobre pontos de interesse, exibindo dados ou conteúdos quando o usuário se aproxima.

## Configuração
Antes de utilizar a aplicação é necessário a realização da configuração das varáveis de ambiente do arquivo `.env` local, dessa forma, realize uma cópia do arquivo `.env.example` e deixe no formato `.env`, sem apaguar o arquivo `.env.example`, após isso, deverá ser feito a troca das variáveis que contem as informações do banco de dados __PostgreSql__.

## Instalação
- Para instalar todos os pacotes do servidor e da aplicação, utilizar o comando abaixo:

    `npm run install-all`

- Para rodar a aplicação após fazer todas as configurações, utilize o comando abaixo:

    `npm start`

## Estrutura de arquivos
O diretório `server` irá se restringir a todo a lógica do servidor da aplicação, contendo assim a __API__ que irá disponibilizar os dados para a aplicação em __React Native__ consumir. Por consequênte, o diretório `tours` será referente a aplicação em __React Native__ com o framework __Expo Go__, caso seja feito a configuração para abrir a porta para acesso externo, a nivel __LAN__, alterar o endereço de __IP__ da __API__ para o seu endereço ___IPV4:Porta___.
