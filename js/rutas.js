var app = angular.module('secreto', [])
var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';
/* Controlador de login */
app.controller('loginController', function($scope, $http){
	var usuario = localStorage.getItem('usuario')
	if (usuario != null) {
		//alert("usuario ")
		var user = JSON.parse(usuario)
		if(user.EMPTIP === 2){
			//window.location.href = 'pages_empleado/empleado.html'
			window.location.href = 'gerente/inicio.html';
		}else if (user.EMPTIP === 3) {
			window.location.href = 'operador/inicio.html'
			//window.location.href = 'pages_directivo/directivo.html'
		}else if (user.EMPTIP === 4) {
			//window.location.href = 'secretario/inicio_secretario.html'
			window.location.href = 'secretario/inicio.html'
		}
	};
	//localStorage.removeItem('usuario')
	$scope.datos = {}
	/* Funcion de login */
	$scope.login = function(){
		$("#msjError").empty();
		$http.get(url_server+'signup', { params : {EMPCEE: $scope.datos.EMPCEE, EMPPAS: $scope.datos.EMPPAS, EMPRFC : $scope.datos.EMPRFC}}).success(function(datos){//Nomenclatura nueva
		//$http.get(url_server+'login', { params : {celular: $scope.datos.celular, clave: $scope.datos.clave, EMPRFC : $scope.datos.EMPRFC}}).success(function(datos){
		//$http.get(url_server+'login', { params : {correo: $scope.datos.correo, clave: $scope.datos.clave, empresa : $scope.datos.empresa}}).success(function(datos){
			if(!datos.type){
				$scope.mensaje = datos.data;
				$("#msjError").empty();
				$("#msjError").append('<div style="color:red;font-weight:bolder;"><strong>Error!...</strong>no esta registrado o ingreso un dato erroneo. Verifique!.</div>');
				//$("#error").append("<div class='yellow center-align'><i class='mdi-alert-warning'></i> No estas autorizado para ingresar.</div>");
			}else{
				if(typeof(Storage) !== "undefined") {
					// Alamcenamos la información del usuario
					localStorage.setItem("usuario", JSON.stringify(datos.data));
					//localStorage.setItem("empresa", $scope.datos.empresa);
					//localStorage.setItem("empresa", $scope.datos.EMPRFC);
				}
				//alert("puesto old "+datos.data.puesto+" puesto new "+datos.data.EMPPUE)
				$http.get(url_server+"puesto/buscar/"+datos.data.EMPPUE).success(function(response) {
			    	if(response.type) { // Si nos devuelve un OK la API...
			        	//var data = response.data[0];
			        	var data = response.data;
						//if(data.nivel === 2){
						if(data.PUENIV === 2){
							//alert("GERENTE");
							window.location.href = 'gerente/inicio.html';
						}else if (data.PUENIV === 3) {
							//alert("OPERADOR")
							window.location.href = 'operador/inicio.html'
						}else if (data.PUENIV === 4) {
							//SECRETARIO
							//window.location.href = 'secretario/inicio_secretario.html'
							window.location.href = 'secretario/inicio.html'
						}
			        }else{
						$("#msjError").empty();
						$("#msjError").append('<div style="color:red;font-weight:bolder;"><strong>Error!...</strong>no esta registrado o ingreso un dato erroneo. Verifique!.</div>');
			        }
			    });
			}
		}).error(function(data, status, headers, config){
			$("#msjError").empty();
			$("#msjError").append('<div style="color:red;font-weight:bolder;"><strong>Error!...</strong>no esta registrado o ingreso un dato erroneo. Verifique!.</div>');
		})
	}
});