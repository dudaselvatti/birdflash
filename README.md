# Birdflash — Music Diary

Uma aplicação web pessoal e interativa criada como um diário musical. O projeto reúne textos, músicas, pequenas dinâmicas e referências compartilhadas em uma interface pensada principalmente para dispositivos móveis.

Além das entradas do diário, o Birdflash possui uma página inicial própria, um arquivo colaborativo de referências (`duda i julia coded`), dados de clima em tempo real e integração com Firebase para autenticação, sincronização e armazenamento de imagens.

## Recursos

- **Home do Birdflash:** Menu principal para navegar entre o diário e o arquivo de referências, com contador de dias do relacionamento e acesso à carteirinha interativa.
- **Sistema de Diário (Accordion):** Entradas organizadas por mês e data em componentes expansíveis.
- **Dinâmicas Interativas:** Jogos da memória, conexo, contexto, cofres, puzzles, revelações progressivas e outras interações personalizadas desenvolvidas em JavaScript Vanilla.
- **Revelação de Músicas:** Embeds responsivos do Spotify integrados às entradas e, em diversas dinâmicas, liberados após a conclusão da interação.
- **Duda i Julia Coded:** Arquivo colaborativo para registrar referências, personagens, músicas e outras coisas associadas ao casal.
- **Cadastro com Imagens:** Inclusão de novos codeds com título, descrição, papéis e imagem de referência.
- **Autenticação:** Acesso ao cadastro e gerenciamento dos codeds protegido com Firebase Authentication.
- **Sincronização em Tempo Real:** Novos registros são armazenados no Cloud Firestore e atualizados automaticamente na interface.
- **Firebase Storage:** Upload e remoção das imagens associadas aos codeds.
- **Clima em Tempo Real:** Consulta à Open-Meteo API para exibir as temperaturas de Guarulhos e Mossoró.
- **Interface Responsiva:** Layout mobile friendly, com atenção especial ao uso em iPhone, áreas de toque, safe areas e diferentes tamanhos de tela.
- **Animações e Microinterações:** Transições, efeitos de revelação, partículas, elementos clicáveis e feedback visual durante as dinâmicas.

## Tecnologias Utilizadas

- **HTML5:** Estrutura semântica das páginas, entradas, componentes e embeds.
- **CSS3:** Responsividade, animações, Grid, Flexbox, transições e estilos específicos para cada dinâmica.
- **JavaScript (Vanilla):** Navegação entre views, accordions, jogos, interações, manipulação do DOM e consumo de APIs.
- **Firebase Authentication:** Controle de acesso às funções de cadastro e gerenciamento.
- **Cloud Firestore:** Persistência e sincronização dos registros do `duda i julia coded`.
- **Firebase Storage:** Armazenamento das imagens enviadas para os codeds.
- **Open-Meteo API:** Dados meteorológicos em tempo real.
- **Spotify Embed:** Reprodução das músicas associadas às entradas do diário.

## Estrutura de Arquivos

```text
├── index.html              # Estrutura principal da aplicação e diary entries
├── style.css               # Estilos, responsividade e animações
├── script.js               # Navegação, clima e lógica das dinâmicas
├── firebase-codeds.js      # Firebase, autenticação e gerenciamento dos codeds
├── storage.rules           # Regras de segurança do Firebase Storage
├── bird.jpg                # Imagem utilizada na introdução do Birdflash
├── megan.jpg               # Recurso visual utilizado nos codeds
└── README.md               # Documentação do projeto
```

## Organização da Aplicação

O Birdflash é dividido em três áreas principais:

1. **Home:** apresenta o projeto, informações do relacionamento, clima e atalhos de navegação.
2. **Diary Entries:** reúne as entradas mensais com textos pessoais, músicas e dinâmicas interativas.
3. **Duda i Julia Coded:** mantém um arquivo de referências compartilhadas e permite adicionar novos registros autenticados.

As funcionalidades principais continuam implementadas diretamente no front-end, enquanto o Firebase é utilizado nos recursos que precisam de autenticação, persistência de dados e armazenamento de arquivos.
