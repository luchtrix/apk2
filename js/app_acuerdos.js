var app = angular.module('secreto', [])
//var url_server = 'http://192.168.1.103:8080/';

var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';
var socket = io.connect(url_server);

//Para cerrar los modales
$(document).on("click","#open_Modal", function(){
	$("#abrir_Modal").openModal()// Abrimos la ventana
});

app.controller('acuerdoController', ['$scope', '$http', function($scope, $http) {
	var lista_ordenes = [];
	var usuario = localStorage.getItem("usuario")
	$scope.usuario = JSON.parse(usuario);
	//$scope.listOrden = {};
	//var empresa = $scope.usuario.empresa;
    var empresa = $scope.usuario.EMPIDC;

	var idO = getUrlParameter('idO');
	if(idO == undefined){

    }else{
		//getJuntaUnica();
		getOrdenUnica();
		getJuntaUnica();
		getAcuerdoByOrden();
	}
	var id = getUrlParameter('id');
    //alert("id ID "+id);
	//Llamamos a la función para obtener la lista de usuario al cargar la pantalla
	if (id == undefined) {
		//id = 
		//alert("id undefined|12213");
        //getOrden();
		//getJuntas();
	}else{
		//alert("id no undefinedasdsa");
		getOrdenUnica();
		//alert("fin getOrdenUnica");
		getJuntaUnica();
		getAcuerdoByOrden();
	}
	//getAcuerdos();	
	getAcuerdoByJunta();
	//alert("nnnn");
	$scope.nuevoAcuerdo = function(){
        $("#errorAcuerdo").empty();
		$scope.acuerdoN.ACUIDC = empresa;
		$scope.acuerdoN.ACUPUN = idO;
		$scope.acuerdoN.ACUJUN = id;
        $scope.acuerdoN.ACUSTA = 'A';//Asignada
        //Agregar al del servidor
        $scope.acuerdoN.ACUENT = '';
        
        var fec_limiteAcuerdo = document.getElementById('fec').value;
        
        if($scope.acuerdoN.ACUEMP == undefined){
            $("#errorAcuerdo").append('<div class="alert alert-danger">Seleccione a un Encargado para el Acuerdo</div>');
            return;
        }

        if (fec_limiteAcuerdo == ""){
            //alert("->"+fec_limiteAcuerdo);
            $("#errorAcuerdo").append('<div class="alert alert-danger">Seleccione una Fecha Limite</div>');
            return;
        }
		
        //alert(fec_junta);
        $scope.acuerdoN.ACUTIM = fec_limiteAcuerdo;
        //alert($scope.juntaN.JUNFEC);
        //la fecha del acuerdo se transforma asi, esto para poder hacer los reportes, buscando mas facil la info. en un rango de datos
        var dat = $scope.acuerdoN.ACUTIM;
        var datII = dat.split("/");
        var dia = datII[1] - 1;
        var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        //$scope.juntaN.fechaJ = fechaISO;
        $scope.acuerdoN.ACUFEC = fechaISO;
        $scope.acuerdoN.ACUST1 = 'C';//Azul --- en proceso
        $scope.acuerdoN.ACUST2 = 'C';//Azul --- en proceso
        //$scope.acuerdoN.ACUPUN = idO;
        $scope.acuerdoN.ACUCON = $scope.consecutivo;
        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        $http.post(url_server+"acuerdo/crear", $scope.acuerdoN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                //alert("s "+$scope.juntaN.JUTSTA);
                $().toastmessage('showSuccessToast', "Se creo el Acuerdo "+$scope.acuerdoN.ACUCON);
                //$().toastmessage('showSuccessToast', "Para crear la Orden del dia de la Junta Nueva, vaya a Ver Todas las Juntas");
                $scope.acuerdoN = {}; // Limpiamos el scope
                getJuntaUnica();
                $("#abrir_Modal").closeModal()// Abrimos la ventana
                getAcuerdoByOrden();
                //window.location.href = "juntas_de_trabajo.html";
            }
        });

	}

	$scope.updateAcuerdo = function(acuerdo) {
		//alert("update "+acuerdo.ACUTIM)
		//var fec_limiteAcuerdo = document.getElementById('fecU').value;
        //alert(fec_junta);
        //$scope.acuerdo.ACUTIM = fec_limiteAcuerdo;
        //alert($scope.juntaN.JUNFEC);
        //la fecha del acuerdo se transforma asi, esto para poder hacer los reportes, buscando mas facil la info. en un rango de datos
        var dat = acuerdo.ACUTIM;
        var datII = dat.split("/");
        var dia = datII[1] - 1;
        var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        //$scope.juntaN.fechaJ = fechaISO;
        acuerdo.ACUFEC = fechaISO;
        //$scope.acuerdoN.ACUST1 = 0;
        //$scope.acuerdoN.ACUST2 = 0;
        //$scope.acuerdoN.ACUPUN = idO;
        $("#"+acuerdo._id+"-Update").closeModal()
        var acuerdo = acuerdo;
        acuerdo.id = acuerdo._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete acuerdo._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos

        // Hacemos una petición PUT para hacer el update a un documento de la base de datos.
        $http.put(url_server+"acuerdo/actualizar", acuerdo).success(function(response) {
            if(response.status === "OK") {
                $().toastmessage('showSuccessToast', "Información del Acuerdo actualizada exitosamente!");
                $(".card-reveal").fadeOut()
                //getJuntaUnica(); // Actualizamos la lista de ToDo's
                getAcuerdoByOrden();
                getOrdenUnica();
            }
        });
    }

	$scope.openModalDelete = function(id){
		//alert("delete "+id)
        var idDelete = "#"+id+"-Delete";
        //$(idDelete).modal()// Abrimos la ventana
        $(idDelete).openModal()// Abrimos la ventana
    }

    $scope.openModalUpdate = function(id){
    	//alert("Update "+id)
		var idUpdate = "#"+id+"-Update";
		//$(idUpdate).modal()// Abrimos la ventana
		$(idUpdate).openModal()// Abrimos la ventana
	}

    $scope.deleteAcuerdo = function(idA) {
        //alert("delete id" + idA);
    	$http.delete(url_server+"acuerdo/eliminar", { params : {identificador: idA}}).success(function(response) {
			//console.log("function");
			if(response.status === "OK") { // Si la API nos devuelve un OK...
				$().toastmessage('showSuccessToast', 'Acuerdo Eliminado Correctamente');
				//$('#'+id+"-Delete").modal('hide');
				$('#'+id+"-Delete").closeModal();
				//$scope.junta = {}
				getAcuerdoByOrden();
                getOrdenUnica();
			}
		});
    }

    $scope.enviarAcuerdos = function(sendAcuerdos){
    	//alert("1 --> send Acuerdos "+sendAcuerdos);

        for(var i = 0 ; i < $scope.listOrden.length ; i++){
            actualizarStatusOrden($scope.listOrden[i]._id,"A");//A es asignada
        }
        $http.get(url_server+'junta/actualizarStatus', { params : {junta: id, status:'A'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                $().toastmessage('showSuccessToast', "Se enviaron los acuerdos y acaba de cerrar la junta");
                getJuntaUnica();
            }
        });
        
    	for(var i = 0 ; i < sendAcuerdos.length ; i++){
    		socket.emit("nuevo_acuerdo", sendAcuerdos[i]);
    	}
    }
    $scope.cerrarJunta = function(){
        //alert("aa close "+id);
        for(var i = 0 ; i < $scope.listOrden.length ; i++){
            actualizarStatusOrden($scope.listOrden[i]._id,"O");//O es acordado
        }
        $http.get(url_server+'junta/actualizarStatus', { params : {junta: id, status:'O'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                $().toastmessage('showSuccessToast', "Junta Acordada");
                getJuntaUnica();
            }
        })
    }
    function actualizarStatusOrden(id,status){
        $http.get(url_server+'orden/actualizarStatus', { params : {orden: id, status:status}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                console.log("actualizado con exito");
            }
        });   
    }
	getDirectivos();
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
	function getOrdenUnica() {
        //alert(idO);
        if(idO != undefined){
        	//alert("idO es no undefined")
            //para obtener los datos de un punto de la orden del dia en especifico
            $http.get(url_server+"orden/find/"+idO).success(function(response) {
                if(response.type) { // Si nos devuelve un OK la API...
                    //alert("response "+response.data[0].ORDCON)
                    if(response.data[0] != undefined){
                        //alert("no tiene nada")
                        $scope.orden = response.data[0];
                        id = response.data[0].ORDJUN;
                        //alert("junta = "+id)
                        getJuntaUnica();
                    }
                    //$scope.orden = response.data[0];
                    //getDirectivos();
                    //getJuntas();
                }else{
                    console.log("ERROR en getOrdenUnica")
                }
            });
        }
        if(id != undefined){
        	//alert("es no undefined")
            //para obtener toda la orden del dia (todos los puntos de la orden del dia) de una junta
            $http.get(url_server+"orden/byJunta/"+id).success(function(response) {
                if (response.status == "OK") {
                    //tamanio = response.data.length;
                    $scope.listOrden = response.data;
                    lista_ordenes = response.data;
                    //alert("listOrden "+lis);
                    /*for (var i = 0; i < response.data.length; i++) {
						alert(response.data[i]._id);
						alert("return "+get_AcuerdoByOrden(response.data[i]._id))
					}*/
                    /*if(response.data.length == 0){
                        $("#avisoOrdenByJunta").empty();
                        $("#avisoOrdenByJunta").append('<div class="alert alert-danger">Todavia no hay puntos de la orden del dia</div>');
                        var idNuevo = {
                            id:id,
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
                    }*/
                }
                getAcuerdos($scope.listOrden)
                /*var acuerdos_orden = [];
                for(var i = 0 ; i < $scope.listOrden.length ; i++){
            		$http.get(url_server+"acuerdo/findByOrden/"+$scope.listOrden[i]._id).success(function(response){
						if (response.type) {
							acuerdos_orden.push(response.data);
							//alert(i+" ---- response data "+response.data[0]._id)
							//$scope.acuerdoByOrden = response.data;
						}else{
							console.log("Error en getAcuerdoByOrden II");
						}
					});    	
                }
                alert("acuerdos_orden "+acuerdos_orden);*/
            });
		}
			/*alert("listOrden II "+$scope.listOrden);
			var datosOfAcuerdosByOrden = [];
			for (var i = 0; i < $scope.listOrden.length; i++) {
				alert($scope.listOrden[i]._id)
				datosOfAcuerdosByOrden.push(get_AcuerdoByOrden($scope.listOrden[i]._id));
			}
			$scope.allAcuerdosByOrden = datosOfAcuerdosByOrden;
			alert($scope.allAcuerdosByOrden);*/
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
            //alert("getJuntaUnica s");
            $http.get(url_server+"junta/find/"+id).success(function(response) {
                if(response.type) { // Si nos devuelve un OK la API...
                    $scope.junta = response.data[0];
                    //alert("ID = "+response.data[0]._id);
                    //document.getElementById('id').value = response.data[0]._id;
                    //var idt = response.data[0]._id;
                    //alert("idt "+idO);
                }
            });
        }

        function getAcuerdos(datos){
        	$http.get(url_server+"acuerdo/listar/"+empresa).success(function(response){
				var acuerdos_orden = [];
				for (var i = 0; i < datos.length ; i++) {
					for (var j = 0; j < response.data.length; j++) {
						if(response.data[j].ACUPUN == datos[i]._id){
							acuerdos_orden.push(response.data[j]);
						}
					}
				};
				$scope.allAcuerdosByEmpresa = acuerdos_orden;
			});
        }
        
        function getAcuerdoByOrden(){
        	//alert("getAcuerdoByOrden");
        	if(idO != undefined){
	        	$http.get(url_server+"acuerdo/findByOrden/"+idO).success(function(response){
					if (response.type) {
						if (response.data == 0) {
							nuevaClave = 1;
						}else{
							nuevaClave = getNewIndice(response.data);
						}
						$scope.acuerdoByOrden = response.data;
						//alert("nuevaClave "+nuevaClave+" scope "+$scope.acuerdoByOrden);
						$scope.consecutivo = nuevaClave;
					}else{
						console.log("Error en getAcuerdoByOrden");
					}			
				});
	        }
        }

        function getAcuerdoByJunta(){
        	//alert("getAcuerdoByJunta");
        	$http.get(url_server+"acuerdo/findByJunta/"+id).success(function(response){
        		if (response.type) {
        			//alert("response "+response.data+" tam "+response.data.length);
        			$scope.tamAcuerdosByJunta = response.data.length;
        		}else{
        			console.log("Error en getAcuerdoByJunta");
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
                    if(data[i].ACUCON == contador){
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