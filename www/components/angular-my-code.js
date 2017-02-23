//definicja moduu
var mail;
var module = angular.module('my-app', ['onsen', 'bootstrapLightbox']);
 
//glowny kontoler 
module.controller('AppController', [function() {
    angular.element(document).ready(function () {
        var storage_login = window.localStorage.getItem('login');
        mail = storage_login;
        var storage_password = window.localStorage.getItem('password');
        var permissions = window.localStorage.getItem('permissions');
        loginuser(storage_login, storage_password, 1, permissions);
        createDB();
    });
    
}]);
 
//module.controller('AppController', function($scope) { });

//kontroler do zdjec
module.controller('PageController', function ($scope, $http, $timeout, Lightbox) {
    $scope.loadPeople = function() {
        showimages();  
        $timeout(function() { 
            $scope.images = JSON.parse(next_json);
        }, 2000);
    };
         
    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
    };  
});

//kontroler do kreatora ankiet
module.controller('PageController2', function ($scope) {
    $scope.SetText = function() {
        var n = i - 1;
        var myEl = angular.element( document.querySelector('#p_chb'+n) );
        $scope.name;
        myEl.text($scope.name);   
        $scope.name = '';
    };
});  




//kontroler karty klienta
module.controller('ClientCard', ['$scope', '$http', function ($scope, $http, $localstorage) {
    $scope.myData = {};
    var dialog = document.getElementById("gps");
    if (!dialog) {
        ons.notification.alert("Musisz rozpoczac wizyte i wybrac oddzial aby miec wglad i mozliwosc edycji tych danych!");
    }
  
    var data = $.param({
        ch_hurtownia_nazwa: nazwa_hurtowni,
        ch_hurtownia_miasto: miasto,
        ch_hurtownia_ulica: adres_hurtowni
    });
    
      
    var config = {
        headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }; 
    var url = 'https://thatquery.com/client_card2.php';
        
    $http.post(url, data, config)
    .success(function (data, status, headers, config) {
                $scope.myData = data; 
            })
            .error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
                    //alert($scope.ResponseDetails);
            });

 
 
    $scope.update_client_card =  function(person_,email_,phone_,person_phone_,rating_,type_contact_,employee_number_, visits_monthly_,telemarketing_bool_,telemarketer_contact_person_,telemarketer_contact_phone_){
    //pseudo obiekt
        var wholesale = {
            person: person_,
            email: email_,
            phone: phone_,
            person_phone: person_phone_,
            rating: rating_,
            type_contact: type_contact_,
            employee_number: employee_number_,
            visits_monthly: visits_monthly_,
            telemarketing_bool: telemarketing_bool_,
            telemarketer_contact_person: telemarketer_contact_person_,
            telemarketer_contact_phone: telemarketer_contact_phone_,
        };
    
        ons.notification.confirm({
            message: 'Czy jesteś pewien wprowadzonych zmian ?',
            callback: function(idx) {
                switch (idx) {
                    case 0:
                        break;
                    case 1:
                        //update danych
                        alert(JSON.stringify(wholesale, null, 4));
                        break;
                }
            }
        }); 
    }; 
}]);


module.controller('PromotionCard', function ($scope, $http) {
  get_pdf_files_promo();
});
 
module.controller('KnowledgeCard', function ($scope, $http) {
  get_pdf_files();
});       
module.controller('EditCard', function ($scope, $http) {
    var url='https://thatquery.com/get_polls_edit.php?mail='+mail;
    $http.get(url)
       .then(function(res){
            data = res.data;
            $scope.myData = data; 
        }); 
});         
