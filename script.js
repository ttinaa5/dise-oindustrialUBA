const materias = [

{
id:"TDI1",
nombre:"Taller de Diseño Industrial 1",
ciclo:"2°",
tpReq:[],
finalReq:[]
},

{
id:"T1",
nombre:"Tecnología 1",
ciclo:"2°",
tpReq:[],
finalReq:[]
},

{
id:"M1",
nombre:"Morfología 1",
ciclo:"2°",
tpReq:[],
finalReq:[]
},

{
id:"F1",
nombre:"Física 1",
ciclo:"2°",
tpReq:[],
finalReq:[]
},

{
id:"AP",
nombre:"Análisis de Productos",
ciclo:"2°",
tpReq:[],
finalReq:[]
},

{
id:"TDI2",
nombre:"Taller de Diseño Industrial 2",
ciclo:"3°",
tpReq:["TDI1","AP"],
finalReq:["T1"]
},

{
id:"T2",
nombre:"Tecnología 2",
ciclo:"3°",
tpReq:["T1","F1"],
finalReq:["T1","F1"]
},

{
id:"M2",
nombre:"Morfología 2",
ciclo:"3°",
tpReq:["TDI1","M1"],
finalReq:[]
},

{
id:"HDI1",
nombre:"Historia del Diseño Industrial 1",
ciclo:"3°",
tpReq:[],
finalReq:[]
},

{
id:"EyFH",
nombre:"Ergonomía y Factores Humanos",
ciclo:"3°",
tpReq:["TDI1","AP"],
finalReq:["F1"]
},

{
id:"TDI3",
nombre:"Taller de Diseño Industrial 3",
ciclo:"4°",
tpReq:["TDI2","M1"],
finalReq:["T2","EyFH","T1","MAT1","F1"]
},

{
id:"T3",
nombre:"Tecnología 3",
ciclo:"4°",
tpReq:["TDI1","M1","MAT1","T1","F1","AP"],
finalReq:["T2"]
}

];

let estado = JSON.parse(
localStorage.getItem("estadoDI18")
) || {};

function guardar(){
localStorage.setItem(
"estadoDI18",
JSON.stringify(estado)
);
}

function obtenerEstado(id){
return estado[id] || 0;

/*
0 bloqueada/disponible
1 TP
2 FINAL
*/
}

function tieneFinal(id){
return obtenerEstado(id) === 2;
}

function tieneTP(id){
return obtenerEstado(id) >= 1;
}

function puedeCursar(m){

return m.tpReq.every(req =>
tieneFinal(req) || tieneTP(req)
);

}

function puedeFinal(m){

return m.finalReq.every(req =>
tieneFinal(req)
);

}

function render(){

const malla =
document.getElementById("malla");

malla.innerHTML = "";

const ciclos =
[...new Set(
materias.map(m=>m.ciclo)
)];

ciclos.forEach(ciclo=>{

const col =
document.createElement("div");

col.className="ciclo";

col.innerHTML=
`<h2>${ciclo}</h2>`;

const materiasCiclo =
materias.filter(
m=>m.ciclo===ciclo
);

materiasCiclo.forEach(m=>{

const div =
document.createElement("div");

div.classList.add("materia");

let clase="";

const estadoActual =
obtenerEstado(m.id);

if(
estadoActual===0
){

if(
m.tpReq.length===0 ||
puedeCursar(m)
){
clase="disponible";
}else{
clase="bloqueada";
}

}

if(estadoActual===1)
clase="tp";

if(estadoActual===2)
clase="final";

div.classList.add(clase);

div.innerHTML=`

<div class="codigo">
${m.id}
</div>

<div class="nombre">
${m.nombre}
</div>

<div class="requisitos">
TP: ${m.tpReq.join(", ") || "Ninguno"}
<br>
Final: ${m.finalReq.join(", ") || "Ninguno"}
</div>

`;

div.addEventListener(
"click",
()=>{

if(
clase==="bloqueada"
)
return;

let actual =
obtenerEstado(m.id);

actual++;

if(actual>2)
actual=0;

estado[m.id]=actual;

guardar();
render();

}
);

col.appendChild(div);

});

malla.appendChild(col);

});

actualizarContador();

}

function actualizarContador(){

const total =
materias.length;

const finales =
Object.values(estado)
.filter(v=>v===2)
.length;

document.getElementById(
"contador"
).textContent=
`${finales} / ${total} Finales`;

}

document
.getElementById("reset")
.addEventListener(
"click",
()=>{

if(
confirm(
"¿Borrar todo el progreso?"
)
){

estado={};

guardar();

render();

}

}
);

render();
