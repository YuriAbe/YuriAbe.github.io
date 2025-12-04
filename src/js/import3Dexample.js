import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// README.md section in comments for junior developers
/*
README.md

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
│       └── torre.gltf  ← Modelo 3D da torre (coloque seu arquivo aqui)
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
4.  **Inicie o servidor**: Dentro da pasta `meu-projeto`, execute o comando para servir os arquivos da pasta `src`:
    ```bash
    http-server src
    ```
    Isso iniciará um servidor que geralmente estará disponível em `http://127.0.0.1:8080` ou `http://localhost:8080`. Você verá o endereço exato no seu terminal.
5.  **Acesse no Navegador**: Abra seu navegador e navegue para o endereço fornecido pelo `http-server` (ex: `http://localhost:8080`).

## Onde Colocar `torre.gltf`

O arquivo `torre.gltf` (e quaisquer arquivos associados como `.bin` ou texturas) deve ser colocado dentro da pasta `meu-projeto/assets/3dmodels/`. O `GLTFLoader` está configurado para procurar o modelo neste caminho relativo.

## Por que das Escolhas?

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

Certifique-se de que os arquivos de decodificação DRACO (`draco_decoder.js`, `draco_wasm_wrapper.js`, etc.) estejam acessíveis no caminho `three/addons/libs/draco/`.

## Acessibilidade

-   **Texto Alternativo**: O `aria-label` no `div` do canvas (`#canvas-container`) fornece uma descrição para usuários de leitores de tela.
-   **Indicador de Carregamento**: O `div` `#loading-indicator` informa ao usuário que o modelo está sendo carregado, melhorando a experiência.

## Limitações e Sugestões para Melhoria

-   **Otimização GLTF**: Para modelos muito complexos, considere otimizar o GLTF com ferramentas como `gltf-pipeline` para reduzir o número de polígonos e o tamanho do arquivo.
-   **Compressão**: Além do DRACO, outras formas de compressão (como `meshopt`) podem ser exploradas.
-   **Light Baking**: Para iluminação mais realista e performática em cenas estáticas, a iluminação pode ser "assada" (baked) em texturas de antemão, em vez de ser calculada em tempo real.
-   **Controles de Câmera**: Os `OrbitControls` são básicos. Para uma experiência mais refinada, você pode customizar os controles ou implementar seus próprios.
*/

// --- Configuração da Cena Three.js ---

const container = document.getElementById('canvas-container');
const loadingIndicator = document.getElementById('loading-indicator');

let scene, camera, renderer, controls;
let model;

function init() {
    console.log('Inicializando cena Three.js...');

    // 1. Cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87cefa); // Fundo azul claro

    // 2. Câmera Ortográfica para visão isométrica
    // Os parâmetros são left, right, top, bottom, near, far
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 10; // Tamanho do frustum, ajuste conforme necessário
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
    );

    // Configuração para visão isométrica
    // Rotação em Z: 45 graus (PI/4)
    // Rotação em X: 35.264 graus (aproximadamente Math.atan(1 / Math.sqrt(2)))
    camera.rotation.order = 'YXZ'; // Ordem de rotação para evitar gimbal lock
    camera.rotation.y = Math.PI / 4; 
    camera.rotation.x = Math.atan(1 / Math.sqrt(2));
    camera.rotation.z = 0; // Já está implícito na ordem YXZ, mas explicitado para clareza

    // Posicionamento inicial da câmera
    camera.position.set(20, 20, 20); // Ajuste a posição para enquadrar o modelo
    camera.lookAt(scene.position); // Aponta para o centro da cena

    // 3. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; // Para cores mais precisas
    container.appendChild(renderer.domElement);

    // 4. Luzes
    // Luz Direcional (simula o sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Cor branca, intensidade 1
    directionalLight.position.set(5, 10, 7.5); // Posição da luz
    scene.add(directionalLight);

    // Luz Hemisférica (luz ambiente suave)
    const hemisphereLight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.5); // Céu, chão, intensidade
    scene.add(hemisphereLight);

    // 5. Controles de Câmera (OrbitControls)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Desabilita pan para manter a isometria
    controls.enableZoom = true; // Permite zoom
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.enableDamping = true; // Suaviza os movimentos
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.screenSpacePanning = false; // Importante para ortográfica

    // Limita a rotação para manter a sensação isométrica
    controls.minPolarAngle = Math.PI / 4; // Limite inferior da rotação vertical
    controls.maxPolarAngle = Math.PI / 2; // Limite superior da rotação vertical (evita olhar por baixo)
    controls.minAzimuthAngle = -Math.PI / 2; // Limite esquerdo da rotação horizontal
    controls.maxAzimuthAngle = Math.PI / 2; // Limite direito da rotação horizontal

    // 6. Manipulação de redimensionamento da janela
    window.addEventListener('resize', onWindowResize, false);

    // 7. Carregar o modelo GLTF
    loadModel();
}

function loadModel() {
    console.log('Iniciando carregamento do modelo GLTF...');
    loadingIndicator.style.display = 'block'; // Mostra indicador de carregamento

    const loader = new GLTFLoader();

    // Opcional: Configurar DRACOLoader se o modelo usar compressão DRACO
    // import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('three/addons/libs/draco/'); 
    // loader.setDRACOLoader(dracoLoader);

    loader.load(
        '../assets/3dmodels/torre.glb', // Caminho relativo ao index.html
        function (glb) {
            console.log('Modelo GLb carregado com sucesso!', glb);
            model = glb.scene;

            // Ajustar o modelo para caber na view (centralizar e escalar automaticamente)
            const bbox = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            model.position.sub(center); // Centraliza o modelo

            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const desiredSize = 5; // Tamanho desejado na cena, ajuste conforme necessário
            model.scale.multiplyScalar(desiredSize / maxDim); // Escala o modelo

            scene.add(model);
            loadingIndicator.style.display = 'none'; // Esconde indicador
            console.log('Modelo adicionado à cena.');
            animate(); // Inicia a animação após o carregamento
        },
        function (xhr) {
            // Progresso de carregamento (opcional)
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        },
        function (error) {
            console.error('Erro ao carregar o modelo GLTF:', error);
            loadingIndicator.textContent = 'Erro ao carregar o modelo. Verifique o console.';
            loadingIndicator.style.color = 'red';
        }
    );
}

function onWindowResize() {
    console.log('Redimensionando janela...');
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    // Atualiza a proporção da câmera ortográfica
    const aspect = newWidth / newHeight;
    const frustumSize = 10; 
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
    console.log(`Novo tamanho do renderizador: ${newWidth}x${newHeight}`);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Apenas se enableDamping ou autoRotate estiverem ativados
    renderer.render(scene, camera);
}

// Inicia a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', init);
