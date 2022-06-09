var tela
var c;

var canhao;
var laser;
var alien;
var explosao;

var canhaoX = 180;
var canhaoY = 529;
var laserX = 193;
var laserY = 520;
var alienX = 0;
var alienY = 0;
var inicioLaser = false;
var impactoLaserX;
var laserMovendo;
var intervalo = 10;
var posicao = 0;

var alienLinhas = [10, 38, 66, 94, 122, 150, 178, 206, 234, 262, 290];
var alienColunas = [55, 85, 115, 145, 175];
var aliensRestantes = [];

const C_ALTURA = 600; 
const C_LARGURA = 400;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ESPACO = 32; // keycode números de referencias  ex: 32 - botão espaço


onkeydown = moverCanhao; // Define função chamada ao se pressionar uma tecla

const placar = 0;

iniciar(); // Chama função inicial do jogo


// Sub-rotinas (funções)
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function iniciar() {
    window.audioTiro = new Audio('sound/tiro.mp3');
    tela = document.getElementById("tela");
    c = tela.getContext("2d");
    tela.with = 600;
    tela.height = 600;
    tela.src = "glx.png";
    
	
	c.fillStyle = "black";
	c.fillRect(0, 0, C_LARGURA, C_ALTURA);

    posicionarAlien();
    carregarImagens();

	setInterval("moverAliens()", intervalo);
    setInterval("alienAtingido()", 6);
}    

function carregarImagens() {
    canhao = new Image();
    canhao.src = "image/falcon.png";
    canhao.onload = function(){
        c.drawImage(canhao, canhaoX, canhaoY);
    }
    
    laser = new Image();
    laser.src = "image/laser.png";

    explosao = new Image();
    explosao.src = "image/explosao.png";
    

} 


function posicionarAlien() {
    var estrela = new Image();
    estrela.src = "image/estrela.png";

    var tie = new Image();
    tie.src = "image/tie.png";

    var vader = new Image();
    vader.src = "image/vader.png";
    var icones = {
        55: vader,
        85: estrela,
        115: tie,
        145: tie,
        175: tie
    }
    for (var i = 0; i < alienLinhas.length; i++){
        for (var j = 0; j < alienColunas.length; j++){
            var novoAlien = {
                posX : alienLinhas[i],
                posY : alienColunas[j],
                foiAtingido : false,
                icone: icones[alienColunas[j]]
			};
			
            aliensRestantes[aliensRestantes.length] = novoAlien;
        }
    }
}    

function moverAliens(){
        if (posicao <= 65){
            alienX += 0.7;
            posicao += 1;
        } else if ((posicao > 65) && (posicao <= 80)){
            alienX += 0.7;
            alienY += 0.8;
            posicao += 1;            
        } else if ((posicao > 80) && (posicao <= 147)){
            alienX -= 0.7;
            posicao += 1;
        } else if ((posicao > 147) && (posicao < 162)){
            alienX -= 0.7;
            alienY += 0.8;
            posicao += 1;
        } else{
            posicao = 0;
        }
        
        for (var i = 0; i < aliensRestantes.length; i++){
            if (!aliensRestantes[i].foiAtingido){
                c.fillRect((alienX + aliensRestantes[i].posX - 1), (alienY + aliensRestantes[i].posY - 1), 35, 35);
                c.drawImage(aliensRestantes[i].icone, (alienX + aliensRestantes[i].posX), (alienY + aliensRestantes[i].posY));
				
                if ((aliensRestantes[i].posY + alienY + 23) >= 530){
                    fimDeJogo();
                }
            }
        }
}

function alienAtingido(){
    for(var i = 0; i < aliensRestantes.length; i++){
        if ((laserY >= (alienY + aliensRestantes[i].posY)) && (laserY <= (alienY + aliensRestantes[i].posY + 20)) && 
            (impactoLaserX >= (alienX + aliensRestantes[i].posX - 5)) && (impactoLaserX <= (alienX + aliensRestantes[i].posX + 18))){
            if (!aliensRestantes[i].foiAtingido){
                    c.drawImage(explosao, (alienX + aliensRestantes[i].posX - 1), (alienY + aliensRestantes[i].posY - 1), 30, 35);
                    c.fillStyle = "black";
                    c.fillRect((alienX + aliensRestantes[i].posX - 1), (alienY + aliensRestantes[i].posY - 1), 20, 25);
                    aliensRestantes[i].foiAtingido = true;
                    c.fillRect(impactoLaserX, laserY, 6, 19);
                    laserY = 0;
            }
        }
    }    
}

function fimDeJogo(){
    canhaoX = 180;
    laserX = 193;
    laserY = 520;
    alienX = 0;
    alienY = 0;
    posicao = 0;
    aliensRestantes = [];
    inicioLaser = false;
	
    c.fillStyle = "black";
	c.fillRect(0, 0, C_LARGURA, C_ALTURA);
    
    c.textAlign = "center";
    c.font = "16px Arial";
    c.fillStyle = "white";
    c.fillText("“Não. Não tente. Faça ou não faça, mas não tente.”", C_LARGURA/2, C_ALTURA/2);

    onkeydown = null;
}

function moverCanhao(tecla){
    var codigo = tecla.keyCode;
    
    if ((codigo == TECLA_DIREITA) && (canhaoX <= 360)){
        c.fillStyle = "black";
        c.fillRect(canhaoX, 520, 50, 50);
        canhaoX += 8;
        laserX += 8;
		c.drawImage(canhao, canhaoX, canhaoY);
    }
    
    if ((codigo == TECLA_ESQUERDA) && (canhaoX >= 9)){
        c.fillStyle = "black";
        c.fillRect(canhaoX, 520, 50, 50);
        canhaoX -= 8;
        laserX -= 8;
		c.drawImage(canhao, canhaoX, canhaoY);
    }
    
    if ((codigo == TECLA_ESPACO) && !inicioLaser){
        inicioLaser = true;
        c.drawImage(laser, laserX, laserY);
        impactoLaserX = laserX;
        laserMovendo = setInterval("dispararLaser()", 5);
    }
}

function dispararLaser(){
    window.audioTiro.play();
    if (inicioLaser && (laserY >= 60)){
        laserY -= 10;
        c.fillStyle = "black";
        c.fillRect(impactoLaserX, (laserY + 10), 6, 19);
		
        if (laserY >= 70){
            c.drawImage(laser, impactoLaserX, laserY);
        }
    }
	
    if (laserY < 60){
        clearInterval(laserMovendo);
        inicioLaser = false;
        laserY = 520;
    }
}
    function criarplacar(){
        const placar = {
            pontuacao: 0,
        }
    }
