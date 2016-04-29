var app = angular.module('secreto', [])
var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';
//var socket = io.connect(url_server);
/* Controlador para secretario */
/*$('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        min:new Date(),
        firstDay: 1,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy'
    });
//Para abrir los modales
$(document).on("click","#eliminar", function(){
    $("#delete").openModal()// Abrimos la ventana
});*/

// Logout
$(document).on("click", ".logout", function(){
    localStorage.removeItem("usuario")
    window.location.href = '../index.html'
})
//app.controller('secretarioController', ['$scope', '$http', function($scope, $http) {
app.controller('secretarioController', function($scope, $http){
	var usuario = localStorage.getItem("usuario")
	$scope.usuario = JSON.parse(usuario);
	$scope.empresa = {};
	//var empresa = localStorage.getItem("empresa")
	var empresa = $scope.usuario.EMPIDC
    
    getEmpresa();
	
    getPuesto();

    getJuntas();

	function getEmpresa(){
		$http.get(url_server+"empresa/find/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.empresa = response.data[0];
                $scope.urlFinal = url_server+"Empresas/"+$scope.empresa.CIALOG; 
            }
    	})
	}

	function getPuesto(){
        $http.get(url_server+"puesto/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                //alert("en "+response.data[0].nombreP)
                $scope.puestos = response.data;
            }
        }) 
    }

    function getJuntas() {
        //alert("hola");
        $http.get(url_server+"junta/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                var jnt = response.data;
                var sinOrden = 0;
                var sinInvit = 0;
                for (var i = 0; i < jnt.length ; i++) {
                    if(jnt[i].STATINV == 0){
                        sinInvit++;
                    }
                    if(jnt[i].STATORD == 0){
                        sinOrden++;
                    }
                }
                $("#ord").empty();
                $("#invit").empty();
                $("#invit").append(sinInvit)
                $("#ord").append(sinOrden)
                //$scope.juntas = response.data;
                //$scope.invt = sinInvit;
                //$scope.jnts = sinOrden;
            }
        })
    }

    getJuntasActuales();

    //ahora solo obtnego las juntas de un solo dia....el dia de hoy
    function getJuntasActuales(){

        var aux_f1 = get_today();
        //var aux_f1 = "31/03/2016";
        var f1 = aux_f1.split("/");
        var dia = f1[1] - 1;
        var fechaI = new Date(f1[2],dia,f1[0]);
        

        //var aux_f2 = get_today();
        /*var aux_f2 = "31/03/2016";
        var f2 = aux_f2.split("/");
        var dia2 = f2[1] - 1;
        var fechaII = new Date(f2[2],dia2,f2[0]);*/
        
        //if(fechaI - fechaII > 0){
        //    $("#mensajeError").empty();
        //    $("#errorRango").empty();
        //    $("#errorRango").append('<div class="row"><div class="col s12 m12 l12"><div class="blue blue-grey darken-1"><div class="card-content white-text"><span class="card-title">Ops!</span><p>Error en el rango de Fechas. La fecha de inicio debe ser mayor que el de fin.</p></div></div></div></div>');
        //    $("#errorRango").css('color', '#d50000');
        //    return;
        //}
        
        //alert("Fin "+$scope.fechaFin);
        var fecI = new Date(f1[2],dia,f1[0]).toISOString();//mes 
        var fecII = new Date(f1[2],dia,f1[0]).toISOString();//mes 
        //var fecII = new Date(f2[2],dia2,f2[0]).toISOString();//mes 
        
        $http.get(url_server+'junta/buscarDatosActuales', { params : {inicio: fecI, fin: fecII}}).success(function (response){        
        //$http.get(url_server+'acuerdo/buscarDatosByFecha', { params : {inicio: fecI, fin: fecII}}).success(function (response){
            if(response.type) { // Si nos devuelve un OK la API...
                //$("#errorRango").empty();
                $scope.allJuntasAct = {};
                //alert("total "+response.data.length);
                var auxiliarJuntas = response.data;
                var juntasAct = [];
                if(response.data.length > 5){
                    //alert("mayor")
                    for(var i = 0 ; i < 5 ; i++){
                        juntasAct.push(response.data[i]);
                    }
                    //alert(juntasAct)
                    $scope.allJuntasAct = juntasAct;
                }else{
                    $scope.allJuntasAct = response.data;
                }
                /*if(response.data.length == 0){
                    $("#msjAlertaJ").empty();
                    $("#msjAlertaJ").append('<div class="alert alert-danger">No hay juntas nuevas</div>');
                }*/
                //$scope.allJuntasAct = response.data;
            }
        });

    }

    function get_today(){
        // Obtenemos la fecha de hoy con el formato dd/mm/yyyy
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        //alert(today);
        return today;
    }

    get_hour();

    function get_hour(){
        var tiempo = new Date();
        var hora = tiempo.getHours();
        if(hora >= 0 && hora <= 5){
            $("#saludo").empty();
            $("#saludo").append("Buena Madrugada ");         
        }else if(hora >= 6 && hora <= 11){
            $("#saludo").empty();
            $("#saludo").append("Buenos Días ");
        }else if(hora >= 12 && hora <= 18){
            $("#saludo").empty();
            $("#saludo").append("Buenas Tardes ");
        }else if(hora >= 19 && hora <= 23){
            $("#saludo").empty();
            $("#saludo").append("Buenas Noches ");
        }
    }

    /* Obtenemos a todos los directivos */
    function getDirectivos() {
        //var invitados_lista = $scope.junta.JUTINV;
        $http.get(url_server+"user/usuario/2/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.directivos = response.data;
            }
        })
        $http.get(url_server+"user/usuario/1/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.director = response.data;
            }
        });
    }
    
});