import {
    loadProjectCards,
    enableCardHover,
    enableCardFlip,
    enableCardParallax
} from "./cardSystem.js";

const apertar = document.getElementById('apertar');
const btnJornada = document.getElementById('inicio-jornada');

apertar.addEventListener('click', () => {
    alert('Você apertou o botão!');
});

btnJornada.addEventListener('click', () => {
    alert('Bem-vindo ao meu portfólio!');
})


const cards = await loadProjectCards(projects, scene);

enableCardHover(cards, camera);
enableCardFlip(cards, camera);
enableCardParallax(cards);
