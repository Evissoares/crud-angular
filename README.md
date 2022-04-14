# Projeto Crud Angular

 Projeto desenvolvido para treinar habilidades de front-end com Angular  13 e bootstrap 5

O formulário permite cadastrar pessoas com nome, email, telefone, estado e cidade.

<br><br><br>
# Tecnologias usadas no projeto

* Angular 13
* Angular CLI
* Node 
* Npm
* Bootstrap 5
* Json-Server

<br><br><br>
# Requisitos básicos
 
#### (SO Windows)
###### para instalações em outros sistemas operacionais, consulte [este link](https://www.google.com)
<br>

Para rodar o projeto, certifique-se de ter instalado o node e o npm no seu computador.
No windows, abra o CMD e digite `node --version` dê enter. Caso não apareça a versão do node ou apareça uma mensagem que o comando node não é um comando válido, faça o download e instalação da versão LTS [neste link.](https://nodejs.org/en/)

Após instalar o node, instale também o [angular CLI](https://angular.io/cli) para rodar o projeto. <br>

Este projeto salva dados localmente em um JSON usando uma API falsa, para isto será necessário instalar o json-server. O passo a passo da instalação pode ser visto [neste link.](https://www.npmjs.com/package/json-server)


<br><br><br>
# Executando o projeto

Faça o clone do repositório por download ou via git. Caso não saibe como clonar via git [clique aqui.](https://medium.com/@gabrielnovakovski/introdu%C3%A7%C3%A3o-ao-git-clonando-e-enviando-altera%C3%A7%C3%B5es-no-c%C3%B3digo-a7915b8018d5#:~:text=b%C3%A1sicos%20para%20contribuir.-,Clonando%20um%20reposit%C3%B3rio,copie%20a%20url%20do%20reposit%C3%B3rio.&text=Ap%C3%B3s%20clonar%20seu%20reposit%C3%B3rio%2C%20voc%C3%AA,altera%C3%A7%C3%B5es%20necess%C3%A1rias%20no%20c%C3%B3digo%20fonte.) <br>


Depois de instalar o json-server globalmente (parâmetro -g), crie uma pasta em qualquer local do pc e crie um arquivo 
.json para salvar os dados do formulário. Abra o arquivo 
.json e crie a seguinte estrutura. 
```
{
  "pessoas": []
}

``` 

salve o arquivo, abra o terminal e navegue até a pasta que está o arquivo json e inicie o json server com o comando <br>
`json-server --watch nomeDoSeuArquivo.json`

```
C:\caminho-do-arquivo-json> json-server --watch pessoas.json

  \{^_^}/ hi!

  Loading pessoas.json
  Done

  Resources
  http://localhost:3000/pessoas

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...

```

A URL Resources `http://localhost:3000/pessoas` é onde será persistido e lido os dados da aplicação angular, caso não tenha sido adicionada a estrutura de pessoas, esta url não aparecerá e o projeto angular acusará erros 404 no console.


Navegue até a pasta onde o download do projeto foi feito,  abra o terminal do windows e digite `ng serve --open`
e aguarde que o servidor node seja executado. Caso não use o parâmetro `--open`, a URL para acessar a aplicação no navegador será `http://localhost:4200`.
 ```
C:\caminho-do-projeto-angular> ng serve --open
✔ Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
vendor.js             | vendor        |   2.34 MB | 
styles.css, styles.js | styles        | 333.86 kB | 
polyfills.js          | polyfills     | 294.85 kB | 
scripts.js            | scripts       |  57.87 kB | 
main.js               | main          |  50.88 kB | 
runtime.js            | runtime       |   6.52 kB | 

                      | Initial Total |   3.06 MB

Build at: 2022-04-14T12:44:34.007Z - Hash: 3aeb7583ef8d5f36 - Time: 5793ms

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **


√ Compiled successfully.
 
 ```

Agora é só carregar os campos de formulário e clicar em salvar.  <br>

A tabela abaixo do formulário atualiza dinamicamente e abaixo da tabela existe um card para cada estado que contenha ao menos uma pessoa cadastrada.
