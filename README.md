###O Projeto
Usuários podem gerenciar suas tarefas que são armazenadas numa planilha do Google Drive

###Por que fizemos?
* Aprender novas tecnologias
* Desenvolver em pequenas etapas
* Ideia simples com potencial interessante
* Foi utilizada como gerenciadora do projeto

###O que foi utilizado?
* HTML5 e CSS3
* JavaScript
* [JQuery](http://jquery.com/) e [JQuery UI](http://jqueryui.com/)
* [KnockoutJS](knockoutjs.com)
* [NodeJS](http://nodejs.org/)
  * [node-edit-google-spreadsheet](https://github.com/jpillora/node-edit-google-spreadsheet)
    * [Alteração sugerida por ssimono é necessária para planilhas criadas recentemente](https://github.com/Pingflow/node-edit-google-spreadsheet/tree/pr-response-format)
  * [restify] (https://github.com/mcavage/node-restify)
  * [async] (https://github.com/caolan/async)
  * [semaphore] (https://github.com/abrkn/semaphore.js)
  * [qunit] (https://github.com/kof/node-qunit)

###O que temos?
__Indicação do WIP (*Work in Progress*)__ em cada raia para facilitar a visualização do quadro

![image]()

__Movimentação das tarefas pelas raias__ é feita de maneira bem simples: "drag and drop"

![image]()

__Edição inline de tarefas__ permite que a alteração seja feita de modo simples e rápido

![image]()

__Editor com markdown__ permite a definição do tipo e projeto da tarefa, bem como subtópicos na descrição da mesma.

![image]()

__Integração com o Google Drive__ e suas planilhas!

![image]()

__Modo offline__ se você não tiver conexão com a Internet!

![image]()

__Quadro local__ se você não quiser integração com o Google Drive!

![image]()

__Auto Save das tarefas do quadro__ é feito constantemente

###Como subir o servidor (WebService)?

####1. Instalar as dependencias do projeto
```shell
  npm install edit-google-spreadsheet
  npm install restify
  npm install async
  npm install semaphore
```

####2. Indicar os nomes da planilha e das folhas de trabalho no arquivo server/node-server-properties.js.

```javascript
  Properties.SPREADSHEET_NAME = '';           // google drive spreadsheet name
  Properties.SECTIONS_WORKSHEET_NAME = '';    // sections worksheet name
  Properties.TASKS_WORKSHEET_NAME = '';       // tasks worksheet name
  Properties.TASKLOGS_WORKSHEET_NAME = '';    // taskLogs worksheet name
```

####3. Indicar usuário que possui perfil para acessar a planilha em server/node-server-properties.js
```javascript
  Properties.USERNAME = '';
  Properties.PASSWORD = '';
```

####4. Subir o servidor
```shell
  node server/node-server.js
```

###Estrutura das folhas de trabalho (_worksheets_)
Cada uma das folhas de trabalho tem uma característica diferente e uma estrutura que deve ser seguida para o correto funcionamento.

####Seções
Cada linha da folha contém dados de uma seção.

![image]()

####Tarefas
Cada linha da folha contém dados de uma tarefa.

![image]()