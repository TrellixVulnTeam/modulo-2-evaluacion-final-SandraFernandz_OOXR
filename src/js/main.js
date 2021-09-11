"use strict";

const button = document.querySelector(".js_button");
const givenInput = document.querySelector(".js_input");
const ulList = document.querySelector(".js_ulList");
const ulListFavs = document.querySelector(".js_ulList2");

//variable local que almacena el resultado de la búsqueda de las series introducida en el input de texto
let series = [];
let favorites = [];

//función manejadora del evento click de button.addEventListener para que al hacer click en el botón, la aplicación se conecte a la api de TVMaze
function handleConnectTv(ev) {
  //variable que recoge el valor introducido por usuaria
  let textInput = givenInput.value.toLowerCase();
  //parámetros a la URL de tipo clave=valor, siempre tras ? y separados por &,
  // p.e. para pedir string con longitud determinada, la url quedaría así https://api.rand.fun/text/password?length=20

  fetch(`https://api.tvmaze.com/search/shows?q=${textInput}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      series = data;
      console.log(series);
      //función para que la búsqueda del input resulte en un listado de series con título y cartel (imagen)
      paintSeries();
    });
}

button.addEventListener("click", handleConnectTv);

//función para que la búsqueda del input resulte en un listado de series con título y cartel (imagen) y lo pinte en la constante global arreglo series =[];
function paintSeries() {
  let html = "";
  let favClass = "";
  //verifico que el elemento x el q me estoy paseando es favorito
  //si es favorito,
  for (const serie of series) {
    const isFav = isFavorite(serie);
    //si es favorito, le añado la clase
    if (isFav) {
      favClass = "main_ulList_container_li_title";
    } else {
      favClass = "";
    }
    html += `<li class= 'listItem js_listItem main_ulList_container_li ${favClass}' id='${serie.show.id}'>`;

    console.log(serie.show.name);
    //bucle con if para caso en el que no exista cartel de la serie.
    html += `<div main_ulList_container_li_div>`;
    html += `<h2>${serie.show.name}</h2>`;
    if (serie.show.image) {
      html += `<img src="${serie.show.image.original}" class="main_ulList_container_li_img"/>`;
    } else {
      html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="image of series" class="main_ulList_container_li_img">`;
    }
    html += `</div>`;
    html += `</li>`;
  }
  ulList.innerHTML = html;
  console.log(html);
  //escucha el click sobre cada elemento de la lista
  listenListedSeries();
}

//creamos una función para poder escuchar en cada una de las series y poder marcarlas con su id si el usuario las elige como favoritas
function listenListedSeries() {
  //selecciono todos los li pintados de la lista
  const listSeries = document.querySelectorAll(".js_listItem");
  //recorro el array de los li para escuchar eventos en cada uno de ellos
  for (const listEl of listSeries) {
    //escucho el evento sobre cada serie de la lista
    listEl.addEventListener("click", handleList);
  }
}

//función manejadora del evento de escuchar en cada serie y entre ellas elegir una y añadirla a favoritos
function handleList(ev) {
  //obtengo el id de la serie clickada
  const selectedSeries = ev.currentTarget.id;
  //quizá haya que comentarlo después ???????????????????????????
  //ev.currentTarget.classList.toggle("main_ulList_container_li_title");

  console.log(ev.currentTarget.id);
  //busco la serie clickada en el array de series paso una función que tiene como parámetro cada serie
  const clickedItem = series.find((serie) => {
    //el id de la serie corresponde al id del elemento clickado
    return serie.show.id === parseInt(selectedSeries);
  });

  //busco si la serie clickada está en el array de favoritos; Si no está, el valor de vuelta será -1, sino devuelve la posición. busco dentro de mi array de favoritos "favorites". "fav" hace referencia a cada uno de los elementos de del array favorites

  const favoritesFound = favorites.findIndex((fav) => {
    return fav.show.id === parseInt(selectedSeries);
  });

  if (favoritesFound === -1) {
    favorites.push(clickedItem);
  } else {
    favorites.splice(favoritesFound, 1);
  }

  console.log(favorites);
  //función que añade o quita clase según si es o no favorito. está definida más abajo. la llamo cd vez que modifico el array de favoritos
  paintSeries();
  //pinta las favoritas en nueva sección
  printFavoriteList();

  console.log(selectedSeries);
  console.log(favoritesFound);
}

//creo una función que verifica si ese li(elemento que quiero pintar es un favorito), me retorna un valor y luego yo le añado la clase. Le pasamos como parámetro cuál es la serie del objeto que quiero ver si es favorito o no(en la función isFavorite)

function isFavorite(serie) {
  const favoriteFound = favorites.find((fav) => {
    return fav.show.id === serie.show.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}
//función que permite hacer una petición al servidor si no tengo datos en el local storage:
function getFromApi() {}
//función para buscar en localStorage si hay info guardada y no hacer la petición al servidor cada vez q recargue la pág
function getLocalStorage() {
  //obtenemos lo que hay en el LS
  const localStorageSeries = localStorage.getItem("series");
  //siempre q cojo datos del localStorage tengo q comprobar si son válidos
  //es decir, si es la primera vez que entro en la pág
  if (localStorageSeries === null) {
    //no tengo datos en el local storage, así q llamo al API
    getFromApi();
  } else {
    //sí tengo datos en el localStorage, así lo parseo a un array y
    const arraySeries = JSON.parse(localStorageSeries);
    //lo guardo en la var global de series
    series = arraySeries;
    //cada vez que modifico los arrays de palettes o de favorites vuelvo a pintar y escuchar eventos:
    //???? este nombre ya está
    //paintSeries();//este nombre ya está
    //y que pintefavoritos la segunda lista pedir las dos o una?
  }
}

////////función para pintar series en lista de favoritos

function printFavoriteList() {
  let favsHtml = "";
  for (const eachFav of favorites) {
    favsHtml += `<li class= 'listItem js_listItem main_ulList_container_li' id='${eachFav.show.id}'>`;
    favsHtml += `<h2>${eachFav.show.name}</h2>`;
    console.log(eachFav.show.name);
    //bucle con if para caso en el que no exista cartel de la serie.
    favsHtml += `<div main_ulList_container_li_div>`;
    if (eachFav.show.image) {
      favsHtml += `<img src="${eachFav.show.image.original}" class="main_ulList_container_li_img" width="500" height="600"/>`;
    } else {
      favsHtml += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="image of series" class="main_ulList_container_li_img"/>`;
    }
    favsHtml += `</div>`;
    favsHtml += `</li>`;
  }
  console.log(favsHtml);
  ulListFavs.innerHTML = favsHtml;
  //listenListedSeries();
}
