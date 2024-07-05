document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const updateParticipantsButton = document.getElementById('updateParticipantsButton');
    const participantsInput = document.getElementById('participantsInput');
    const podioDiv = document.getElementById('podio');
    
    let nombres = ['ID1', 'ID2', 'ID3', 'ID4', 'ID5'];
    let numSerpientes = nombres.length;
    const longitud = 20;
    const colores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];
    
    let posiciones = [];
    let velocidades = [];
    let ganadores = [];
    let enCarrera = false;

    function inicializarCarrera() {
        posiciones = [];
        velocidades = [];
        ganadores = [];
        for (let i = 0; i < numSerpientes; i++) {
            const posicionInicial = [];
            for (let j = 0; j < longitud; j++) {
                posicionInicial.push({ x: 50 - j * 10, y: (canvas.height / (numSerpientes + 1)) * (i + 1) });
            }
            posiciones.push(posicionInicial);
            velocidades.push(Math.random() * 3 + 1);
        }
    }

    function dibujarSerpientes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < numSerpientes; i++) {
            if (posiciones[i][0].x < canvas.width - 20) {
                const nuevaCabeza = { x: posiciones[i][0].x + velocidades[i], y: posiciones[i][0].y };
                posiciones[i].unshift(nuevaCabeza);
                posiciones[i].pop();
            } else {
                if (!ganadores.includes(nombres[i])) {
                    ganadores.push(nombres[i]);
                }
            }
            ctx.fillStyle = colores[i % colores.length];
            posiciones[i].forEach(segmento => {
                ctx.fillRect(segmento.x, segmento.y, 10, 10);
            });
            ctx.fillText(nombres[i], posiciones[i][0].x - 30, posiciones[i][0].y - 10);
        }
        if (ganadores.length >= 3) {
            enCarrera = false;
            mostrarPodio();
        }
    }

    function mostrarPodio() {
        podioDiv.innerHTML = `
            <p>Ganador: ${ganadores[0]}</p>
            <p>Segundo: ${ganadores[1]}</p>
            <p>Tercero: ${ganadores[2]}</p>
        `;
    }

    startButton.addEventListener('click', () => {
        if (!enCarrera) {
            enCarrera = true;
            podioDiv.innerHTML = '';
            inicializarCarrera();
            const intervalId = setInterval(() => {
                if (enCarrera) {
                    dibujarSerpientes();
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
        }
    });

    resetButton.addEventListener('click', () => {
        enCarrera = false;
        podioDiv.innerHTML = '';
        inicializarCarrera();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    updateParticipantsButton.addEventListener('click', () => {
        const input = participantsInput.value.trim();
        if (input) {
            nombres = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            numSerpientes = nombres.length;
            inicializarCarrera();
        }
    });

    inicializarCarrera();
});
