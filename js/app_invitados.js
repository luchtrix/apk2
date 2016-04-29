var app = angular.module('secreto', [])
var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';
var socket = io.connect(url_server);
/* Controlador para secretario */
/*$('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        min:new Date(),
        firstDay: 1,
        format: 'dd/mm/yyyy',
        formatSubmit: 'dd/mm/yyyy'
    });
*/
//Para abrir los modales
$(document).on("click","#confirmarInv", function(){
    $("#confirmacion").openModal()// Abrimos la ventana
});

//app.controller('secretarioController', ['$scope', '$http', function($scope, $http) {
app.controller('invitadosController', function($scope, $http){
	var usuario = localStorage.getItem("usuario")
	$scope.usuario = JSON.parse(usuario);
	$scope.empresa = {};
    $scope.junta = null;
    //var juntaEsp = null;
	//var empresa = localStorage.getItem("empresa")
	//var empresa = $scope.usuario.empresa
    var empresa = $scope.usuario.EMPIDC;
	   
    $scope.nuevoInvitado = function(idEmp,idJunta,ne,nj) {
        //alert("nuevoInvitado");
        /*$scope.juntaN.JUTHOR = getHora();*/
        var datosInvit = {
            //empresa:empresa,
            INVIDC:empresa,
            INVJUN:idJunta,
            INVEMP:idEmp,
            INVJNO:nj,
            INVEMN:ne
        }

        if(localStorage.getItem("invitados") === null){
            //alert("1");
            var invt = [];
            invt.push(datosInvit);
            $scope.allInv = invt;
            //alert(invt)
            $().toastmessage('showSuccessToast', "Empleado Agregado a la lista de invitados");
            localStorage.setItem("invitados", JSON.stringify(invt));
        }else{
            //alert("2 ,");
            var invt = [];
            var invt = JSON.parse(localStorage.getItem("invitados"));
            //alert("--->"+invt)
            //bandera = invt.indexOf(datosInvit);
            for(var i = 0 ; i < invt.length;i++){
                if(invt[i].INVEMP == datosInvit.INVEMP){
                    //alert("lo encontro");
                    $().toastmessage('showSuccessToast', "Ya existe el Empleado en la lista de invitados");
                    return;
                }
            }
            //alert("bandera "+bandera)
            invt.push(datosInvit);
            //alert("---> ----> "+invt)
            $scope.allInv = invt;
            localStorage.removeItem("invitados");
            localStorage.setItem("invitados", JSON.stringify(invt));
            $().toastmessage('showSuccessToast', "Empleado Agregado a la lista de invitados");
        }
        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        /*
        //if(localStorage.getItem("usuario") !== null){
        //    window.location.href = 'vistas/home.html'
        //}
        //localStorage.removeItem("usuario");

        $http.post(url_server+"invit/crear", datosInvit).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                var idNuevo = {
                    id:idJ,
                    bandera:1
                }
                //var idNuevo.id = response.data._id;
                $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                    if(response.status == "OK"){
                        alert("1");
                        $().toastmessage('showSuccessToast', "Empleado Agregado");
                        getInvitadosByJunta();
                    }
                });
            }
        });*/
    }
    
    $scope.enviarInvitaciones = function() {
    //$scope.enviarInvitaciones = function(junta) {
        //alert("enviarInvitaciones --> "+$scope.allInv);

        var invitados = [];
        invitados = JSON.parse(localStorage.getItem("invitados"));
        //alert("len "+invitados.length);
        for (var i = 0; i < invitados.length; i++) {
            //alert("i E "+invitados[i].INVEMP);
            //alert("i J "+invitados[i].INVJUN);
            //alert("i EMP "+invitados[i].empresa);
            //guardar todos los empleados en la base de datos, uno por uno....
            guardarInvitados(invitados[i]);
            //alert("0");
            //if(!booleano){}
        }
        //alert("Termine de guardar los datos");
        var idNuevo = {
            id:idJ,
            bandera:1
        }
        //var idNuevo.id = response.data._id;
        $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
            if(response.status == "OK"){
                //alert("1");
                console.log("Actualizacion de Estado de 0 a 1 exitosa");
                //$().toastmessage('showSuccessToast', "Empleado Agregado");
                //getInvitadosByJunta();
                getJuntaUnica();
            }
        });
        //luego obtener la informacion de una junta especifica mediante el id
        //getJuntaUnica();
        //alert("Motivo de la junta "+$scope.junta.JUNMOT);
        for (var i = 0; i < invitados.length; i++){
            socket.emit("nueva_junta", idJ, invitados[i].INVEMP, $scope.junta.JUNMOT);
        }
        $().toastmessage('showSuccessToast', "Se enviaron las invitaciones");
        //localStorage.removeItem("invitados");
        $("#confirmacion").closeModal()// Abrimos la ventana
        //getJuntaUnica();
        /*var invitados = junta.JUTINV;
        //alert("invitados "+invitados[0].id);
        for (var i = 0; i < invitados.length; i++){
            socket.emit("nueva_junta", junta._id, invitados[i].id, junta.JUTMOT);
        }
        $("#mensaje").empty();
        $("#mensaje").append('<div class="chip">Invitaciones enviadas <i class="material-icons">Cerrar</i></div>');
        $("#mensaje").css('color', '#FFF');
        $(".card-reveal").fadeOut()           
        $('#sendInv').closeModal();*/
    }

    $scope.prueba = function(){
        //alert("pruebaSocket 1 "+$scope.allInv);
        //socket.emit("prueba","Hola Jotos");
        
        getJuntaUnica();
        //alert("Motivo de la junta "+$scope.junta.JUNMOT);
        for (var i = 0; i < $scope.allInv.length; i++){
            //alert(idJ+" ----- "+$scope.allInv[i].INVEMP+" --- "+$scope.junta.JUNMOT);
            socket.emit("nueva_junta", idJ, $scope.allInv[i].INVEMP, $scope.junta.JUNMOT);
        }
    }

    function guardarInvitados(datos){
        $http.post(url_server+"invit/crear", datos).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                //$scope.booleano = true
                console.log("Guardado con exito");
                /*var idNuevo = {
                    id:idJ,
                    bandera:1
                }
                //var idNuevo.id = response.data._id;
                $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                    if(response.status == "OK"){
                        alert("1");
                        $().toastmessage('showSuccessToast', "Empleado Agregado");
                        getInvitadosByJunta();
                    }
                });*/
            }
        });
    }

    $scope.deleteInvitado = function(id) {
        //alert("delete "+id)
        var invt = [];
        var invt = JSON.parse(localStorage.getItem("invitados"));
        //alert("--->"+invt)
        //bandera = invt.indexOf(datosInvit);
        for(var i = 0 ; i < invt.length;i++){
            if(invt[i].INVEMP == id){
                //alert("lo encontro");
                $().toastmessage('showSuccessToast', "Empleado eliminado de la lista de invitados");
                invt.splice(i,1);
                if(invt.length > 0){
                    $scope.allInv = invt;
                    localStorage.removeItem("invitados");
                    localStorage.setItem("invitados", JSON.stringify(invt));
                }else{
                    $scope.allInv = invt;
                    localStorage.removeItem("invitados");
                }
                
                return;
            }
        }
        //primero buscamos el puesto para verificar que no este ocupado
        /*$http.delete(url_server+"invit/eliminar", { params : {identificador: id}}).success(function(response) {
            //console.log("function");
            if(response.status === "OK") { // Si la API nos devuelve un OK...
                $().toastmessage('showSuccessToast', "Invitacion Eliminada para el Empleado");
                //$('#'+id+"-Delete").modal('hide');
                getInvitadosByJunta(); // Actualizamos la lista de ToDo's
            }
        });*/
    }

    $scope.deleteSecureInvitado = function(id) {
        
        //primero buscamos el puesto para verificar que no este ocupado
        $http.delete(url_server+"invit/eliminar", { params : {identificador: id}}).success(function(response) {
            //console.log("function");
            if(response.status === "OK") { // Si la API nos devuelve un OK...
                $().toastmessage('showSuccessToast', "Invitacion Eliminada para el Empleado");
                //$('#'+id+"-Delete").modal('hide');
                getInvitadosByJunta(); // Actualizamos la lista de ToDo's
            }
        });
    }

    getDirectivos();
    getPuesto();
    
    /* Obtenemos a todos los directivos */
    function getDirectivos() {
        //alert("getDirectivos")
        //var invitados_lista = $scope.junta.JUTINV;
        $http.get(url_server+"user/usuario/2/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                //alert("response.data "+response.data[0].EMPNOM)
                $scope.directivos = response.data;
            }
        })
        $http.get(url_server+"user/usuario/1/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.director = response.data;
            }
        });
    }

    function getEmpresa(){
        $http.get(url_server+"empresa/find/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.empresa = response.data[0];
            }
        })
    }

    function getPuesto(){
        $http.get(url_server+"puesto/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                $scope.puestos = response.data;
            }
        }) 
    }
    
    //var nuevo = getUrlParameter('new')
    //if (nuevo == undefined)
        //alert("nuevo undefined");
    //    getJuntas(); // Obtenemos la lista de ToDo al cargar la página
    
    var idJ = getUrlParameter('id');
    /* Llamamos a la función para obtener la lista de usuario al cargar la pantalla */
    if (idJ == undefined) {
        //alert("edit undefined");
        //getJuntas();
    }else{
        //alert("edit no undefined");
        getJuntaUnica();
        //getInvitadosByJunta();
        //getOrdenByJunta();
    }
    getSelectInvitados();
    function getUrlParameter(sParam) {
        //alert("sParam "+sParam)
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function getSelectInvitados(){
        if(localStorage.getItem("invitados") !== null){
            //alert("1");
            var invt = [];
            var invt = JSON.parse(localStorage.getItem("invitados"));
            $scope.allInv = invt; 

            //alert("info "+$scope.allInv+" tam "+$scope.allInv.length)   
        }else{
            //alert("2 "+idJ)
            $http.get(url_server+"invit/findByJunta/"+idJ).success(function(response) {
                if(response.status == "OK") { // Si nos devuelve un OK la API...
                    //alert("aaa " + response.data.length);
                    $scope.allInv = response.data;
                }
            })
        }
    }

    function getInvitadosByJunta(){
        //alert("ID "+idJ)
        $http.get(url_server+"invit/findByJunta/"+idJ).success(function(response) {
            if(response.status == "OK") { // Si nos devuelve un OK la API...
                //alert("aaa " + response.data.length);
                $scope.allInv = response.data;
                if(response.data.length == 0){

                    var idNuevo = {
                        id:idJ,
                        bandera:3
                    }
                    //var idNuevo.id = response.data._id;
                    $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                        if(response.status == "OK"){
                            console.log("OK");
                            //alert("1");
                            //$().toastmessage('showSuccessToast', "Empleado Agregado");
                            //getInvitadosByJunta();
                        }
                    });

                }
            }
        })
    }

    /* Método para obtener información de una junta específica */
    function getJuntaUnica() {
        $http.get(url_server+"junta/find/"+idJ).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.junta = response.data[0];
                //alert("junta "+$scope.junta.STATINV)
                /*today = get_today()
                var dias_diferencias = restaFechas(today, response.data[0].JUTFEC)
                if (dias_diferencias == 0) {
                    $scope.dias_para_junta = "Hoy se llevará acabo esta junta en "+response.data[0].JUTLUG+" a las "+response.data[0].JUTHOR+" hrs."
                }else if (dias_diferencias == 1) {
                    $scope.dias_para_junta = "Mañana se llevará acabo esta junta en "+response.data[0].JUTLUG+" a las "+response.data[0].JUTHOR+" hrs."
                }else if (dias_diferencias > 0) {
                    $scope.dias_para_junta = "Esta junta se llevará acabo en "+dias_diferencias+" días en "+response.data[0].JUTLUG+" a las "+response.data[0].JUTHOR+" hrs."
                }else if (dias_diferencias < 0) {
                    $scope.dias_para_junta = "Esta junta se llevó acabo hace "+Math.abs(dias_diferencias)+" días en "+response.data[0].JUTLUG+" a las "+response.data[0].JUTHOR+" hrs."
                };
                //$scope.junta.JUTINV = JSON.parse($scope.junta.JUTINV)
                if ($scope.junta.JUTINV.length == 0) {
                    $("#boton_invitados").show()
                    //$("#invitados").show()
                }else{
                    $("#boton_invitados").empty()
                }
                getDirectivos();*/
            }
        });
    }

});