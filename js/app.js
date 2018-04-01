//Asignar variables.
var tiempo = 0;
    min = 2;
    seg = 0;
    i = 0;
    dulceAleatorio = 0;
    lasFilas = 0;
    lasColumnas = 0;
    limite = 0;
    matriz = 0;
    espacio = 0;
    desaparecer = 0;
    aparecer = 0;
    llenadoFilas = [""];
    llenadoColumnas = [""];
    swap = 0;
    puntaje = 0;
    score = 0;
    delay = 0;

// Cambio de color del titulo.
var elJuego = {
  cambioColor: function(){
    setInterval(function(){
      $(".main-titulo").animate({color: "#DCFF0E"}, 1000),
      $(".main-titulo").animate({color: "#FFFFFF"}, 1000)
    }, 300);
  },
}

// Timer
function timer(){
	var cero = '';
	if(seg < 10){
		cero = '0';
	} else {
		cero = '';
	}
	$("#timer").html("0"+min+" : "+cero+seg);
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min===seg){
			clearInterval(desaparecer);
			clearInterval(aparecer);
			clearInterval(espacio);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",gameOver);
			$(".time").hide();
		}
		seg=59;
		min=min-1;
	}
};

// Boton iniciar
$(".btn-reinicio").click(function(){
	$(".panel-score").css("width","25%");
	$(".panel-tablero").show();
	$(".time").show();
	$("#score-text").html("0");
	$("#movimientos-text").html("0");
	$(this).html('<a href="" class="reinicio">Reiniciar</a>');
	espacio=setInterval(function(){
		interCambio()
	},500);
	tiempo=setInterval(function(){
		timer()
	},1000);
});

// Intercambio de dulces
function interCambio(){
	i=i+1
	var numero=0;
	var imagen=0;
	$(".elemento").draggable({disabled:true});
	if(i<8){
		for(var j=1;j<8;j++){
			if($(".col-"+j).children("img:nth-child("+i+")").html()==null){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
			}}}
	if(i==8){
		clearInterval(espacio);
		desaparecer=setInterval(function(){
			despejar()
		},150);
	}
};

// Desaparecer dulces
function despejar(){
	matriz=0;
	lasFilas=filas();
	lasColumnas=columnas();
	for(var j=1;j<8;j++){
		matriz=matriz+$(".col-"+j).children().length;
	}
	if(lasFilas==0 && lasColumnas==0 && matriz!=49){
		clearInterval(desaparecer);
		dulceAleatorio=0;
		aparecer=setInterval(function(){
			dulces()
		},600);
	}
	if(lasFilas==1||lasColumnas==1){
		$(".elemento").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			var scoretmp=$(".activo").length;
			$(".activo").remove("img");
			score=score+scoretmp*100;
			$("#score-text").html(score);
		});
	}
	if(lasFilas==0 && lasColumnas==0 && matriz==49){
		$(".elemento").draggable({
			disabled:false,
			containment:".panel-tablero",
			revert:true,
			revertDuration:0,
			snap:".elemento",
			snapMode:"inner",
			snapTolerance:40,
			start:function(event,ui){
				swap=swap+1;
				$("#movimientos-text").html(swap);}
		});
	}
  
// Reponer dulces
	$(".elemento").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			delay=0;
			do{
				delay=dropped.swap($(droppedOn));}
			while(delay==0);
			lasFilas=filas();
			lasColumnas=columnas();
			if(lasFilas==0 && lasColumnas==0){
				dropped.swap($(droppedOn));}
			if(lasFilas==1 || lasColumnas==1){
				clearInterval(aparecer);
				clearInterval(desaparecer);
				desaparecer=setInterval(function(){
					despejar()
				},50);}},
	});
};

jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

// Aparecen dulces
function dulces(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var j=1;j<8;j++){
		llenadoColumnas[j-1]=$(".col-"+j).children().length;
	}
	if(dulceAleatorio==0){
		for(var j=0;j<7;j++){
			llenadoFilas[j]=(7-llenadoColumnas[j]);}
		limite=Math.max.apply(null,llenadoFilas);
		puntaje=limite;
	}
	if(limite!=0){
		if(dulceAleatorio==1){
			for(var j=1;j<8;j++){
				if(puntaje>(limite-llenadoFilas[j-1])){
					$(".col-"+j).children("img:nth-child("+(llenadoFilas[j-1])+")").remove("img");}}
		}
		if(dulceAleatorio==0){
			dulceAleatorio=1;
			for(var k=1;k<8;k++){
				for(var j=0;j<(llenadoFilas[k-1]-1);j++){
					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
				}
			}
		}
		for(var j=1;j<8;j++){
			if(puntaje>(limite-llenadoFilas[j-1])){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");
			}
		}
	}
	if(puntaje==1){
		clearInterval(aparecer);
		desaparecer=setInterval(function(){
			despejar()
		},50);
	}
	puntaje=puntaje-1;
};

function filas(){
	var dulcesFilas=0;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
			var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
			var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
			var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				dulcesFilas=1;
			}
		}
	}
	return dulcesFilas;
};

function columnas(){
	var dulcesColumnas=0;
	for(var l=1;l<6;l++){
		for(var k=1;k<8;k++){
			var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
			var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
			var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
				dulcesColumnas=1;
			}
		}
	}
	return dulcesColumnas;
};

//Score
function gameOver(){
	$(".panel-score").animate({width:'100%'},2500);
	$(".termino").css({"display":"block","text-align":"center"});
};

$(function(){
  elJuego.cambioColor();
});
