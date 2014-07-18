### O Projeto
Usuários podem gerenciar suas tarefas, que são armazenadas numa planilha do Google Drive

### Por que fizemos?
* Aprender novas tecnologias
* Desenvolver em pequenas etapas
* Ideia simples com potencial interessante
* Foi utilizada como gerenciadora do projeto

### O que foi utilizado?
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

### O que temos para essa versão?
__Criação de seções e tarefas__ para o seu quadro Kanban ficar do seu jeito que você deseja

![image](https://cloud.githubusercontent.com/assets/1449015/3621257/e0dfdb7c-0e11-11e4-9abe-79974b2b7a80.png)

__Indicação do WIP (*Work in Progress*)__ em cada raia para facilitar a visualização do quadro

![image](https://cloud.githubusercontent.com/assets/1449015/3621224/03aec240-0e11-11e4-8d84-aedf8be2eec6.png)

__Movimentação das tarefas pelas raias__ é feita de maneira bem simples: "drag and drop"

![image](https://cloud.githubusercontent.com/assets/1449015/3621225/0e3feaa4-0e11-11e4-94ef-da8583c6132d.png)

__Edição inline das seções e das tarefas__ permite que a alteração seja feita de modo simples e rápido

![image](https://cloud.githubusercontent.com/assets/1449015/3621228/19c55918-0e11-11e4-96b8-42197c3f42cd.png)

__Editor com markdown__ permite a definição do tipo e projeto da tarefa, bem como subtópicos na descrição da mesma.

![image](https://cloud.githubusercontent.com/assets/1449015/3621230/2a8368f8-0e11-11e4-8788-f054ab13ff8b.png)

__Integração com o Google Drive__ e suas planilhas!

![image](https://cloud.githubusercontent.com/assets/1449015/3621248/b9d49c98-0e11-11e4-810b-647c3527a7c4.png)

__Modo offline__ se você não tiver conexão com a Internet!

![image](https://cloud.githubusercontent.com/assets/1449015/3621249/bfb7ae70-0e11-11e4-9353-fa894ea1e95b.png)

__Auto Save das tarefas do quadro__ é feito constantemente

### Usando o servidor (WebService)?

#### 1. Instalar as dependências do projeto
```shell
  npm install edit-google-spreadsheet
  npm install restify
  npm install async
  npm install semaphore
```

#### 2. Indicar os nomes da planilha e das folhas de trabalho no arquivo server/node-server-properties.js.

```javascript
  Properties.SPREADSHEET_NAME = '';           // google drive spreadsheet name
  Properties.SECTIONS_WORKSHEET_NAME = '';    // sections worksheet name
  Properties.TASKS_WORKSHEET_NAME = '';       // tasks worksheet name
  Properties.TASKLOGS_WORKSHEET_NAME = '';    // taskLogs worksheet name
```

#### 3. Indicar usuário que possui perfil para acessar a planilha em server/node-server-properties.js
```javascript
  Properties.USERNAME = '';
  Properties.PASSWORD = '';
```

#### 4. Subir o servidor
```shell
  node server/node-server.js
```

### Estrutura das folhas de trabalho (_worksheets_)
Cada uma das folhas de trabalho tem uma característica diferente e uma estrutura que deve ser seguida para o correto funcionamento.

#### Seções
Cada linha da folha contém dados de uma seção.
* __order__ controle para atualização de uma seção
* __id__ identificador da seção (deve ser único)
* __name__ nome da seção que é exibida
* __maxWip__ limita as tarefas na raia
* __show__ indica se a seção foi removida

![image](https://cloud.githubusercontent.com/assets/1449015/3621297/a12c610c-0e12-11e4-9647-e8cf552147de.png)

#### Tarefas
Cada linha da folha contém dados de uma tarefa.
* __order__ controle para atualização de uma tarefa
* __id__ identificador da tarefa (deve ser único)
* __section__ identificador da seção
* __priority__ prioridade da tarefa na seção
* __type__ tipo da tarefa (bug, extra ou normal)
* __project__ projeto da tarefa
* __title__ título da tarefa
* __description__ descrição da tarefa
* __show__ indica se a tarefa foi removida

![image](https://cloud.githubusercontent.com/assets/1449015/3621313/e1b62776-0e12-11e4-833d-c7caf2a9fd3b.png)

#### Dados de movimentação das tarefas
Cada linha da folha contém dados da movimentação de uma tarefa. Pode ser usada para analisar o progresso do trabalho.
* __order__ controle para atualização de uma movimentação
* __id__ identificador da movimentação (deve ser único)
* __task__ identificador da tarefa
* __fromSection__ seção de origem da tarefa movida
* __toSection__ seção de destino da tarefa movida
* __date__ data da movimentação

![image](https://cloud.githubusercontent.com/assets/1449015/3621326/2445b1b0-0e13-11e4-9566-6e3b5a6a225e.png)

#### Observações
As planilhas podem ter qualquer nome e a ordem dos campos é irrelevante. Para o correto funcionamento da aplicação, cada uma das planilhas listadas acima deve conter os campos informados.

Você pode ainda utilizar apenas a lógica do servidor para fazer acesso às planilha. Neste caso, elas devem conter pelo menos os campos __order__ e __id__.