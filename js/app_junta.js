/* Controllers */
var app = angular.module('secreto', [])
var url_server = 'http://159.203.128.165:8080/';
//var url_server = 'http://127.0.0.1:8080/';
var socket = io.connect(url_server);

app.controller('juntaController', ['$scope', '$http', function($scope, $http) {

    //----------------------------------------------------
    var usuario = localStorage.getItem("usuario")///nuevo|
    $scope.usuario = JSON.parse(usuario);//NUEVO         |
    // ---------------------------------------------------
    //var empresa = $scope.usuario.empresa;
    var empresa = $scope.usuario.EMPIDC;
    //var empresa = localStorage.getItem("empresa")
    //alert("empresa "+empresa);
    $scope.juntaN = {}
    getJuntas();

    if(localStorage.getItem("invitados") !== null){
        localStorage.removeItem("invitados");
    }

    $scope.openModalCancel = function(id){
        var idCancel = "#"+id+"-Cancel";
        //$(idCancel).modal()// Abrimos la ventana
        $(idCancel).openModal()// Abrimos la ventana
    }

    $scope.cancelJunta = function(id){
        var idCancel = "#"+id+"-Cancel";
        //$(idCancel).modal()// Abrimos la ventana
        $http.get(url_server+"junta/find/"+id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                var jnt = response.data;
                $http.get(url_server+"invit/findByJunta/"+id).success(function(response) {
                    if(response.status == "OK") { // Si nos devuelve un OK la API...
                        for (var i = 0; i < response.data.length; i++){
                            socket.emit("cancel_junta", id, response.data[i].INVEMP, jnt[0].JUNNUM);
                        }
                    }
                });
            }
        });

        $http.get(url_server+'junta/actualizarStatus', { params : {junta: id, status:'F'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
            //if(datos.status === 'OK'){
                $().toastmessage('showSuccessToast', "Junta Cancelada");
                getJuntas();
            }
        });
        $(idCancel).closeModal()// Abrimos la ventana
    }
    // Funcionalidad del controlador
    $scope.nuevaJunta = function() {
        /*$scope.juntaN.JUTHOR = getHora();*/

        //agregar tambien la fecha (en el momento exacto) en la que se registro la junta
        var a_dat = get_today();
        var a_datII = a_dat.split("/");
        var a_dia = a_datII[1] - 1;
        var fecha_register = new Date(a_datII[2],a_dia,a_datII[0]).toISOString();//mes 
        $scope.juntaN.JUNCRE = fecha_register;

        //NUEVA LINEA
        $scope.juntaN.JUNIDE = $scope.usuario._id;        

        //JUTFEC
        var fec_junta = document.getElementById('fec').value;
        //alert(fec_junta);
        $scope.juntaN.JUNFEC = fec_junta;
        //alert($scope.juntaN.JUNFEC);
        //la fecha del acuerdo se transforma asi, esto para poder hacer los reportes, buscando mas facil la info. en un rango de datos
        var dat = $scope.juntaN.JUNFEC;
        var datII = dat.split("/");
        var dia = datII[1] - 1;
        var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        //$scope.juntaN.fechaJ = fechaISO;
        $scope.juntaN.JUNRANF = fechaISO;
        
        //$scope.juntaN.JUNSTA = "En Proceso";//Azul
        $scope.juntaN.JUNSTA = "C";//Azul ----> En Proceso
        //$scope.juntaN.empresa = empresa;
        $scope.juntaN.JUNIDC = empresa;

        $scope.juntaN.STATINV = 0;
        $scope.juntaN.STATORD = 0;

        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        $http.post(url_server+"junta/crear", $scope.juntaN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                $().toastmessage('showSuccessToast', "Se creo la Junta "+$scope.juntaN.JUNNUM);
                $scope.juntaN = {}; // Limpiamos el scope
            }
        });
    }

    $scope.updateJunta = function() {
        var dat = $scope.junta.JUNFEC;
        var datII = dat.split("/");
        var dia = datII[1] - 1;
        var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        $scope.junta.JUNRANF = fechaISO;

        var junta = $scope.junta;
        junta.id = junta._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete junta._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos

        // Hacemos una petición PUT para hacer el update a un documento de la base de datos.
        $http.put(url_server+"junta/actualizar", junta).success(function(response) {
            if(response.status === "OK") {
                $().toastmessage('showSuccessToast', "Información de la Junta actualizada exitosamente!");
                $(".card-reveal").fadeOut()
                getJuntaUnica(); // Actualizamos la lista de ToDo's
            }
        });
    }

    $scope.openModalDelete = function(id){
        var idDelete = "#"+id+"-Delete";
        //$(idDelete).modal()// Abrimos la ventana
        $(idDelete).openModal()// Abrimos la ventana
    }

    $scope.deleteJunta = function(id) {
        //alert("delete id" + id);
        $http.get(url_server+"orden/buscarJunta", { params : {miJunta: id}}).success(function(response){
            console.log("data "+response);
            if(response.status === "OK"){//Encontro el registro que se esta buscando
                $().toastmessage('showSuccessToast', 'La junta no puede ser eliminada porque ya cuenta con una orden del dia');
            }else{//no encontro el registro que se esta buscando
                $http.get(url_server+"acuerdo/buscarJunta", { params : {miJunta: id}}).success(function(response){
                    if(response.status === "OK"){//Encontro el registro que se esta buscando
                        $().toastmessage('showSuccessToast', 'La junta no puede ser eliminada porque ya tiene acuerdos que se estan realizando');
                    }else{
                        $http.delete(url_server+"junta/eliminar", { params : {identificador: id}}).success(function(response) {
                            //console.log("function");
                            if(response.status === "OK") { // Si la API nos devuelve un OK...
                                $().toastmessage('showSuccessToast', 'Junta Eliminada Correctamente');
                                //$('#'+id+"-Delete").modal('hide');
                                $('#'+id+"-Delete").closeModal();
                                //$scope.junta = {}
                                getJuntas();
                            }
                        });
                    }
                });
            }
        })
    }

    function getJuntas() {
        $http.get(url_server+"junta/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                $scope.juntas = response.data;
            }
        })
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


    var nuevo = getUrlParameter('new')
    if (nuevo == undefined)
        //alert("nuevo undefined");
        getJuntas(); // Obtenemos la lista de ToDo al cargar la página
    
    var edit = getUrlParameter('id');
    /* Llamamos a la función para obtener la lista de usuario al cargar la pantalla */
    if (edit == undefined) {
        //alert("edit undefined");
        getJuntas();
    }else{
        //alert("edit no undefined");
        getJuntaUnica();
        //getOrdenByJunta();
    }

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

    /* Método para obtener información de una junta específica */
        function getJuntaUnica() {
            $http.get(url_server+"junta/find/"+edit).success(function(response) {
                if(response.type) { // Si nos devuelve un OK la API...
                    $scope.junta = response.data[0];
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

        socket.on("cancel_junta", function (idj, clave, id) {
        //playBeep()
        //vibrate()
        var myName = $scope.usuario._id;
        if (myName == id) {
            var numNotificaciones = parseInt($("#noti").text())
            numNotificaciones++;
            //$(".noti").html(numNotificaciones)
            $("#noti").html(numNotificaciones)
            //$("#nothing").empty();
            //var htmlText = '<li><a href="junta.html?id='+idj+'"><i class="mdi-social-notifications"></i> '+clave+'</a></li>'
            var htmlText = '<li><i class="fa fa-bell"></i>Se canceló la junta '+clave+'</li>'
            $("#notifications-dropdown").append(htmlText);
            $().toastmessage('showSuccessToast', "Junta de Trabajo Cancelada");
        };
    });
    // Funcion de escucha ante una nueva junta
    socket.on("nueva_junta", function (idj, motivo, id) {
        //playBeep()
        //vibrate()
        //alert("idReceived = "+id+" IDUSER = "+$scope.usuario._id);
        //var myName = $("#nombre_usuario").val();
        var myName = $scope.usuario._id;
        if (myName == id) {
            total_juntas()
            $().toastmessage('showSuccessToast', "Nueva Junta de Trabajo");
        };
    });
    socket.on("nuevo_acuerdo", function (data) {
        //alert("nuevo EMP "+data.ACUEMP+" idUsuario "+$scope.usuario._id);
        //var myName = $("#nombre_usuario").val();
        var myName = $scope.usuario._id;
        if (myName == data.ACUEMP) {
            //playBeep()
            //vibrate()
            total_acuerdos()
            $().toastmessage('showSuccessToast', "Nuevo Acuerdo Asignado");
        };
    });    

    // Metodo para obtener la cantidad de acuerdos del usuario
    function total_acuerdos(){
        var user = JSON.parse(usuario)
        var myName = user._id;
        $http.get(url_server+"acuerdo/buscar/"+myName).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.acuerdos = response.data;
                /*var total_acuerdos = response.data.length;
                $("#num-notifications").html(total_acuerdos);*/
                total_juntas();
            }
        });
    }
    
    // Metodo para obtener la cantidad de juntas del usuario
    function total_juntas(){
        var user = JSON.parse(usuario)
        var myName = user._id;
        $http.get(url_server+"invit/findInvitados/"+myName).success(function(response) {
            if(response.status == 'OK') { // Si nos devuelve un OK la API...
                $scope.juntas = response.data;
            }
        });
    }
}]);