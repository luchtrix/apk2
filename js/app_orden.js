var app = angular.module('secreto', [])
var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';

//Para cerrar los modales
$(document).on("click","#open_modal", function(){
	$("#abrir_modal").openModal()// Abrimos la ventana
});

app.controller('ordenController', ['$scope', '$http', function($scope, $http) {
		//alert("asasdsadasdsadasdas");
        var nuevaClave = 0;
        var usuario = localStorage.getItem("usuario")
        $scope.usuario = JSON.parse(usuario);
        //$scope.empresa = {};
        //var empresa = localStorage.getItem("empresa")
        //var empresa = $scope.usuario.empresa
        var empresa = $scope.usuario.EMPIDC;
        //var empresa = localStorage.getItem("empresa")
        $scope.ordenN = {}

        $scope.nuevaOrden = function() {
            //alert("aaa");
            /*$scope.juntaN.JUTHOR = getHora();*/
            $scope.ordenN.ORDSTA = "C";
            //$scope.ordenN.ORDSTA = "En Proceso";
            //$scope.ordenN.ORDEMP = empresa;
            $scope.ordenN.ORDIDC = empresa;
            //$scope.ordenN.CLVJUT = document.getElementById('id').value;
            $scope.ordenN.ORDJUN = edit;
            $scope.ordenN.ORDCON = nuevaClave;
            // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
            $http.post(url_server+"orden/crear", $scope.ordenN).success(function(response) {
                if(response.status === "OK") { // Si nos devuelve un OK la API...
                    //alert("Ok");
                    //alert("response "+response.data._id);
                    var idNuevo = {
                        id:edit,
                        bandera:0
                    }
                    //var idNuevo.id = response.data._id;
                    $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                        if(response.status == "OK"){
                            //alert("1");
                            $scope.ordenN = {}; // Limpiamos el scope
                            $().toastmessage('showSuccessToast', "Se creo el punto de la Orden de dia");
                            getJuntaUnica();
                            getOrdenUnica();
                        }
                    })
                    //$scope.ordenN = {}; // Limpiamos el scope
                    //$().toastmessage('showSuccessToast', "Se creo el punto de la Orden de dia");
                    //getJuntaUnica();
                }
            })
        }

        $scope.updateOrden = function(ordenA) {
            //var orden = $scope.orden;
            //alert(ordenA.ORDDES)
            var orden = ordenA;
            //$('#'+orden._id+"-Update").closeModal();
            //$('#'+junta._id+"-Update").modal('hide');
            //var id = orden._id;
            orden.id = orden._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
            $('#'+orden.id+"-Update").closeModal();
            delete orden._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos
            //alert("Id "+junta.id+" email "+junta.email);
            // Hacemos una petición PUT para hacer el update a un documento de la base de datos.
            $http.put(url_server+"orden/actualizar", orden).success(function(response) {
                if(response.status === "OK") {
                    //$("#mensaje").empty();
                    //$("#mensaje").append('<div class="chip">Información actualizada <i class="material-icons">Cerrar</i></div>');
                    //$("#mensaje").css('color', '#FFF');
                    //$(".card-reveal").fadeOut()
                    $().toastmessage('showSuccessToast', "Se Actualizo el punto de la Orden de dia");
                    //$('#'+orden.id+"-Update").modal();
                    //getJuntaUnica();
                    getOrdenUnica(); // Actualizamos la lista de ToDo's
                }
            });
        }

        $scope.deleteOrden = function(id) {
        //$scope.deleteOrden = function(id,clvJunta) {
            //primero buscamos el puesto para verificar que no este ocupado
            $http.delete(url_server+"orden/eliminar", { params : {identificador: id}}).success(function(response) {
                //console.log("function");
                if(response.status === "OK") { // Si la API nos devuelve un OK...
                    //$('#'+id+"-Delete").modal('hide');
                    //$("#mensaje").empty();
                    //$("#mensaje").append('<div class="chip">Junta eliminada <a href="orden_del_dia.html?id='+clvJunta+'">Volver a lista de ordenes</a></div>');
                    //$("#mensaje").css('color', '#FFF');
                    //$(".card-reveal").fadeOut()
                    //$scope.orden = {}
                    $().toastmessage('showSuccessToast', "Se Eliminó el punto de la Orden de dia");
                    //$('#'+id+"-Delete").modal('hide');
                    $('#'+id+"-Delete").closeModal();
                    getJuntaUnica();
                    getOrdenUnica(); // Actualizamos la lista de ToDo's
                }
            });
        }

        $scope.openModalDelete = function(id){
            var idDelete = "#"+id+"-Delete";
            //$(idDelete).modal()// Abrimos la ventana
            $(idDelete).openModal()// Abrimos la ventana
        }

        $scope.openModalUpdate = function(id){
            var idUpdate = "#"+id+"-Update";
            //$(idUpdate).modal()// Abrimos la ventana
            $(idUpdate).openModal()// Abrimos la ventana
        }

        var getOrden = function() {
            $http.get(url_server+"orden/listar/"+empresa).success(function(response) {
                if(response.status == "OK") {
                    $scope.ordenes = response.data;
                    if($scope.ordenes.length == 0){
                        $("#error").empty();
                        $("#error").append('<div class="row"><div class="col s12 m12 l12"><div class="card blue-grey darken-1"><div class="card-content white-text"><span class="card-title">Ops</span><p>Aún no hay Ordenes registradas en el sistema.</p></div></div></div></div>');
                        $("#error").css('color', '#d50000');
                    }else{
                        $("#error").empty();
                    }
                }
            })
        }

        /*var getJuntas = function() {
        	//alert("juntas");
            $http.get(url_server+"junta/listar/"+empresa).success(function(response) {
                if(response.status == "OK") {
                    $scope.juntas = response.data;
                    if($scope.juntas.length == 0){
                        $("#error").empty();
                        $("#error").append('<div class="row"><div class="col s12 m12 l12"><div class="card blue-grey darken-1"><div class="card-content white-text"><span class="card-title">Ops</span><p>Aún no hay juntas registradas en el sistema.</p></div></div></div></div>');
                        $("#error").css('color', '#d50000');
                    }else{
                        $("#error").empty();
                    }
                }
            })
        }
        */

        /* Método para obtener información de una orden específica */
        function getOrdenUnica() {
            //alert(edit);
            //para obtener los datos de un punto de la orden del dia en especifico
            $http.get(url_server+"orden/find/"+edit).success(function(response) {
                if(response.type) { // Si nos devuelve un OK la API...
                    //alert("response "+response.data[0])
                    if(response.data[0] != undefined){
                        //alert("no tiene nada")
                        $scope.orden = response.data[0];
                    }
                    //$scope.orden = response.data[0];
                    //getDirectivos();
                    //getJuntas();
                }
            });

            //para obtener toda la orden del dia (todos los puntos de la orden del dia) de una junta
            $http.get(url_server+"orden/byJunta/"+edit).success(function(response) {
                if (response.status == "OK") {
                    //alert("response 1 "+response.data)
                    $scope.listOrden = response.data;

                    if(response.data.length == 0){
                        //$("#avisoOrdenByJunta").empty();
                        //$("#avisoOrdenByJunta").append('<div class="alert alert-danger">Todavia no hay puntos de la orden del dia</div>');
                        var idNuevo = {
                            id:edit,
                            bandera:2
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
            });
        }
        //getJuntas();
        //getOrden()
        var nuevo = getUrlParameter('new')
        if (nuevo == undefined){
            //alert("nuevo undefinedasdsad");
            //getJuntas(); // Obtenemos la lista de ToDo al cargar la página
        	getOrden();
        }
        var edit = getUrlParameter('id');
        //alert("EDIT ID "+edit);
        /* Llamamos a la función para obtener la lista de usuario al cargar la pantalla */
        if (edit == undefined) {
            //alert("edit undefined|12213");
            getOrden();
            //getJuntas();
        }else{
            //alert("edit no undefinedasdsa");
        	getOrdenUnica();
            getJuntaUnica();
        }

        function getUrlParameter(sParam) {
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
        
        //Método para obtener información de una junta específica
        function getJuntaUnica() {
            //alert("getJuntaUnica");
            $http.get(url_server+"junta/find/"+edit).success(function(response) {
                if(response.type) { // Si nos devuelve un OK la API...
                    $scope.junta = response.data[0];
                    
                    //alert("ID = "+response.data[0]._id);

                    //document.getElementById('id').value = response.data[0]._id;
                    var idt = response.data[0]._id;
                    //alert("idt "+idt);
                    $http.get(url_server+"orden/allOrden", { params : {identificador: idt}}).success(function(response){

                        var indice = response.data;
                        //alert("entro indice "+indice.length);
                        //nuevaClave = 0;
                        if (indice == 0) {
                            nuevaClave = 1;
                        }else{
                            nuevaClave = getNewIndice(indice);
                        }
                        //alert("nuevaClave "+nuevaClave);
                        $scope.consecutivo = nuevaClave;
                    });
                }
            });
        }

        function getNewIndice(data){
            var contador = 1;
            var nuevaClave = -1;
            var booleano = true;
            var bandera;
            while(booleano){
                bandera = 0;
                for (var i = 0; i < data.length ; i++) {
                    if(data[i].ORDCON == contador){
                    //if(data[i].ORDNUM == contador){
                        bandera = 1;
                    }
                }
                if (bandera == 1) {
                    contador++;
                    booleano = true;
                }else{
                    booleano = false;
                }
            }
            return contador;
        }
}]);