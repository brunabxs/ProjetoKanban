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
  * [restify] (https://github.com/mcavage/node-restify)
  * [async] (https://github.com/caolan/async)
  * [semaphore] (https://github.com/abrkn/semaphore.js)
  * [qunit] (https://github.com/kof/node-qunit)

###O que temos?
__Indicação do WIP (*Work in Progress*)__ em cada raia para facilitar a visualização do quadro

![image](https://f.cloud.github.com/assets/1449015/2361985/5d730f0c-a638-11e3-9304-c4e7d3026d13.png)

__Movimentação das tarefas pelas raias__ é feita de maneira bem simples: "drag and drop"

![image](https://f.cloud.github.com/assets/1449015/2361808/e2410872-a635-11e3-989e-796dbfaee59e.png)

__Edição inline de tarefas__ permite que a alteração seja feita de modo simples e rápido

![image](https://f.cloud.github.com/assets/1449015/2361822/119354e0-a636-11e3-98f6-5f1af2bf23ba.png)

__Editor com markdown__ permite a definição do tipo e projeto da tarefa, bem como subtópicos na descrição da mesma.

![image](https://f.cloud.github.com/assets/1449015/2369282/55b5d8c6-a7d7-11e3-8c17-a212a00493f6.png)

__Integração com o Google Drive__ e suas planilhas!

![image](https://f.cloud.github.com/assets/1449015/2369288/dabb2b2a-a7d7-11e3-927a-b119e177c002.png)

__Auto Save das tarefas do quadro__ é feito constantemente

###Como alterar a planilha de destino das suas tarefas?
Indique os identificadores da planilha e das folhas de trabalho no arquivo server/node-server-properties.js.

```javascript
  Properties.SPREADSHEET_ID = '';        // google drive spreadsheet id
  Properties.SECTIONS_WORKSHEET_ID = ''; // sections worksheet id
  Properties.TASKS_WORKSHEET_ID = '';    // tasks worksheet id
```

###Estrutura das folhas de trabalho (_worksheets_)
Cada uma das folhas de trabalho tem uma característica diferente e uma estrutura que deve ser seguida para o correto funcionamento.

####Seções
Cada linha representa uma seção. A folha contém quatro colunas que representam, respectivamente:
1. __Identificador da seção__[obrigatorio | unico | string] para controle das seções
2. __Nome da seção__[obrigatorio | string] a ser exibido
3. __WIP máximo__[int] da seção
4. __Visibilidade__[obrigatorio | bit] da seção 

####Tarefas
Cada linha representa uma tarefa. A folha contém oito colunas que representam, respectivamente:
1. __Identificador da tarefa__[obrigatorio | unico | int] para controle das tarefas
2. __Identificador da seção da tarefa__[obrigatorio | string] para controle das tarefas
3. __Prioridade__[obrigatorio | int] da tarefa na sua seção
4. __Tipo__[string] da tarefa (normal, bug ou extra)
5. __Projeto__[string] da tarefa (inscricao, portal ou seguranca)
6. __Título__[obrigatorio | string] da tarefa para identificá-la pela equipe
7. __Descrição__[string] da tarefa
8. __Visibilidade__[obrigatorio | bit] da tarefa


###Como subir o servidor (WebService)?

####Instalar as dependencias do projeto
```shell
  npm install edit-google-spreadsheet
  npm install restify
  npm install async
  npm install semaphore
```

####Indicar usuário que possui perfil para acessar a planilha em server/node-server-properties.js
```javascript
  Properties.USERNAME = '';
  Properties.PASSWORD = '';
```

####Subir o servidor
```shell
  node server/node-server.js
```
