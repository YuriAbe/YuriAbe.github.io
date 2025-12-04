# Projeto Torre 3D com Three.js

Este projeto demonstra como carregar e exibir um modelo 3D (GLTF) em uma página web usando a biblioteca Three.js. Ele foi configurado para rodar localmente sem a necessidade de um processo de build complexo, utilizando importações de módulos via CDN.

## Estrutura do Projeto

```
meu-projeto/
├── src/          
│   ├── css/          
│   │   └── style.css   ← Estilos CSS para a página
│   ├── js/           
│   │   └── script.js   ← Lógica principal da cena Three.js
│   └── index.html    ← Página HTML principal
├── assets/       
│   └── 3dmodels/     
│       └── torre.gltf  ← **VOCÊ DEVE COLOCAR SEU ARQUIVO torre.gltf AQUI**
└── README.md         ← Este arquivo (documentação)
```

## Como Rodar Localmente

Para servir os arquivos localmente e visualizar o projeto, você pode usar um servidor HTTP simples. Uma opção popular para desenvolvimento é o `http-server` do Node.js.

1.  **Instale Node.js**: Se você ainda não tem, baixe e instale o Node.js em [nodejs.org](https://nodejs.org/).
2.  **Instale `http-server`**: Abra seu terminal ou prompt de comando e execute:
    ```bash
    npm install -g http-server
    ```
3.  **Navegue até a pasta `meu-projeto`**: No terminal, vá para o diretório raiz do seu projeto:
    ```bash
    cd meu-projeto
    ```
4.  **Coloque o modelo 3D**: Certifique-se de que seu arquivo `torre.gltf` (e quaisquer arquivos `.bin` ou texturas associadas) esteja na pasta `meu-projeto/assets/3dmodels/`.
5.  **Inicie o servidor**: Dentro da pasta `meu-projeto`, execute o comando para servir os arquivos da pasta `src`:
    ```bash
    http-server src
    ```
    Isso iniciará um servidor que geralmente estará disponível em `http://127.0.0.1:8080` ou `http://localhost:8080`. Você verá o endereço exato no seu terminal.
6.  **Acesse no Navegador**: Abra seu navegador e navegue para o endereço fornecido pelo `http-server` (ex: `http://localhost:8080`).

## Onde Colocar `torre.gltf`

O arquivo `torre.gltf` (e quaisquer arquivos associados como `.bin` ou texturas) deve ser colocado dentro da pasta `meu-projeto/assets/3dmodels/`. O `GLTFLoader` está configurado para procurar o modelo neste caminho relativo.

## Por que das Escolhas? (Documentação para Dev Júnior)

### Câmera Ortográfica (OrthographicCamera)

Optamos por uma `OrthographicCamera` para criar uma **visão isométrica**. Diferente da `PerspectiveCamera` (que simula a visão humana com perspectiva), a câmera ortográfica não distorce objetos com base na distância, fazendo com que objetos distantes pareçam do mesmo tamanho que os próximos. Isso é ideal para jogos estratégicos, diagramas técnicos ou, como neste caso, para dar um estilo visual específico que remete a desenhos técnicos ou jogos clássicos.

### Luzes (DirectionalLight e HemisphereLight)

-   **`DirectionalLight`**: Simula a luz do sol, ou seja, uma fonte de luz que vem de uma direção específica e atinge todos os objetos da cena com a mesma intensidade, independentemente da distância. É crucial para criar sombras e dar forma aos objetos.
-   **`HemisphereLight`**: Simula a luz ambiente que vem de um ambiente, como o céu. Ela ilumina a cena de cima com uma cor e de baixo com outra, criando um efeito de iluminação mais natural e suave, preenchendo as áreas escuras que o `DirectionalLight` pode deixar.

Juntas, essas luzes garantem que o modelo 3D seja bem iluminado, com detalhes visíveis e uma sensação de profundidade.

### GLTFLoader

O `GLTFLoader` é a maneira recomendada de carregar modelos 3D no formato GLTF (Graphics Library Transmission Format) no Three.js. GLTF é um formato eficiente e otimizado para a web, que pode incluir geometria, materiais, texturas, animações e muito mais em um único arquivo ou conjunto de arquivos. Ele é o "JPEG dos modelos 3D".

## Otimizações (DRACOLoader - Opcional)

Para modelos GLTF que utilizam compressão DRACO (uma técnica para reduzir o tamanho da geometria), você precisaria incluir o `DRACOLoader`. Embora não esteja habilitado por padrão neste projeto para simplicidade, se seu modelo `torre.gltf` for compactado com DRACO, você adicionaria as seguintes linhas ao seu `script.js` (após importar `GLTFLoader`):

```javascript
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ... dentro da função de inicialização da cena ...

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('three/addons/libs/draco/'); // Caminho para os decoders DRACO
loader.setDRACOLoader(dracoLoader);
```

Certifique-se de que os arquivos de decodificação DRACO (`draco_decoder.js`, `draco_wasm_wrapper.js`, etc.) estejam acessíveis no caminho `three/addons/libs/draco/`. Você pode obtê-los do pacote Three.js ou CDN.

## Acessibilidade

-   **Texto Alternativo**: O `aria-label` no `div` do canvas (`#canvas-container`) fornece uma descrição para usuários de leitores de tela.
-   **Indicador de Carregamento**: O `div` `#loading-indicator` informa ao usuário que o modelo está sendo carregado, melhorando a experiência.

## Limitações e Sugestões para Melhoria

-   **Otimização GLTF**: Para modelos muito complexos, considere otimizar o GLTF com ferramentas como `gltf-pipeline` para reduzir o número de polígonos e o tamanho do arquivo.
-   **Compressão**: Além do DRACO, outras formas de compressão (como `meshopt`) podem ser exploradas.
-   **Light Baking**: Para iluminação mais realista e performática em cenas estáticas, a iluminação pode ser "assada" (baked) em texturas de antemão, em vez de ser calculada em tempo real.
-   **Controles de Câmera**: Os `OrbitControls` são básicos. Para uma experiência mais refinada, você pode customizar os controles ou implementar seus próprios.

