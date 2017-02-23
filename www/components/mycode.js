//global variables
var executed = 0;  
var uprawnienia;
var geo_city;
var id_hurtowni;
var start;
var nazwa_ankiety;
var wholesale_name;
var wholesale_city;
var wholesale_street;
var date_visit;
var miasto;
var ch_hurtownia_miasto;
var ch_hurtownia_nazwa;
var ch_hurtownia_ulica;
var hurtownia_id;
var nazwa_hurtowni; //nazwa hurtowni
var adres_hurtowni; //adres hurtowni
var storage = window.localStorage;
var connection = false;

function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}

if(iOS()){
setTimeout(function() {
   navigator.splashscreen.hide();
}, 2000);
}

var db = window.openDatabase("Database", "1.0", "Wholesale", 2 * 1024 * 1024);

function executeQuery(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Wholesale');
    tx.executeSql('DROP TABLE IF EXISTS Polls');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Wholesale (id, wholesale_name, wholsale_street, wholesale_class, wholesale_city)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Polls (poll_id, pollname, q_name, q_html, mail)');
    errorHandler = function(error){
            document.write("handling error " + error);
        }   
    $.getJSON('https://thatquery.com/local_wholesale_data.php',function(data) {
        db.transaction(function(tx) {
            
            $.each(data, function(i, dat) {
                var id = dat.hurtownia_id;
                var name = dat.hurtownia_nazwa;
                var street = dat.hurtownia_ulica;
                var classyfication = dat.Klasyfikacja;
                var city= dat.hurtownia_miasto;
                tx.executeSql('INSERT INTO Wholesale (id, wholesale_name, wholsale_street, wholesale_class, wholesale_city) VALUES(?,?,?,?,?)', [id, name, street, classyfication, city]);    
            });
            queryDB(tx);
            //alert("completed");
        });
        
    });
    
    $.getJSON('https://thatquery.com/show_certain_poll.php?mail='+ mail,function(data) {
        
        db.transaction(function(tx) {
           
            $.each(data, function(i, field) {
                //var poll_id=field.poll_id;
    		    var pollname=field.pollname;
			    var q_name=field.q_name;
			    var q_html=field.q_html;
                tx.executeSql('INSERT INTO Polls (poll_id, pollname, q_name, q_html, mail) VALUES(?,?,?,?,?)', ['1', pollname, q_name, q_html, mail]);    
            });
            queryDB(tx);
            //alert("completed");
        });   
    });
    
    $.getJSON('https://thatquery.com/show_poll.php?pollname=Inwentaryzacja POS&mail=all',function(data) {
        db.transaction(function(tx) {
            $.each(data, function(i, field) {
                var poll_id=field.poll_id;
        	    var pollname = field.pollname;
			    var q_name = field.q_name;
			    var q_html=field.q_html;
                tx.executeSql('INSERT INTO Polls (poll_id, pollname, q_name, q_html) VALUES(?,?,?,?)', [poll_id, pollname, q_name, q_html]);    
            });
            queryDB(tx);
            //alert("completed");
        });
        
    });
    }
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM Polls', [], querySuccess, errorCB);
    }
    function querySuccess(tx, results) {
        var tab = [];
        for(i = 0; i < results.rows.length; i++){

            tab.push(results.rows.item(i)); 
            
            // <--------
        }
        //alert(JSON.stringify(tab));
        var len = results.rows.length;
        //alert("There are " + len + " rows of records in the database.");
    }
    //Callback function when the transaction is failed.
    function errorCB(err) {
        console.log("Error occured while executing SQL: "+err.code);
    }
    // Callback function when the transaction is success.
    function successCB() {
        var db = window.openDatabase("Database", "1.0", "Wholesale", 200000);
        db.transaction(queryDB, errorCB);
    }
   
    function createDB(){
        var db = window.openDatabase("Database", "1.0", "Wholesale", 200000);
        db.transaction(executeQuery, errorCB, successCB);
 
    }      



//zapis do dodanych i usuwanie local storage 
function relase_local_data(){
    
    var m = 0;
    connection = true;
    //alert(connection);
    
    while(localStorage.getItem('answer'+ m) !== null){
        //local storage data
        var answer = JSON.parse(window.localStorage.getItem('answer'+ m));
        //wypisz wartosci
        var dataString = "poll_id="+ answer.poll_id +"&hurtownia_id="+ answer.wholesale_id +"&geo_city=brak_con&mail="+ mail +"&product_name="+ answer.product_name +"&cena_nasza="+answer.price+"&komentarz_nasz="+ answer.comment +"&konkuerecja1_cena="+ answer.price_competitor1 +"&konkuerecja1_nazwa="+ answer.name_competitor1 +"&konkuerecja2_cena="+ answer.price_competitor2 +"&konkuerecja2_nazwa="+ answer.name_competitor2 +"&konkuerecja3_cena="+ answer.price_cotitor3 +"&konkuerecja3_nazwa="+ answer.name_competitor3 +"&chb_o="+answer.chb_o+"&chb_mc="+answer.chb_mc+"&order_col="+ answer.order +"&date_add="+ date_visit +"&insert=";
        //alert(dataString);
        
        //zappis danych z lokalnie zapisanej bazy 
        /*ajax_calls("POST","https://thatquery.com/insert_data_poll3.php",dataString, function (result_ajax_calls){
                    if(!result_ajax_calls){
                       bool = false; 
                    }  
                });
        //clear local storage */
        localStorage.removeItem('answer'+ m);
        m++;
    }
    
}

document.addEventListener("online", relase_local_data(), false);

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};

//funkcja dodawania użytkowników
function insertuser(){
	var mail = document.getElementById("login1").value;
	var password = document.getElementById("haslo1").value;
	var name = document.getElementById("nadaj_imie").value;
	var surname = document.getElementById("nadaj_nazwisko").value;
	var state1 = document.getElementById("state1");
	var state2 = document.getElementById("state2");
	var state3 = document.getElementById("state3");
	var state4 = document.getElementById("state4");	
	if (state1.checked) {
		uprawnienia = "KAM";
	}else if (state2.checked) {
		uprawnienia = "RTAM";
	}else if (state3.checked) {
		uprawnienia = "RPM";
	}else {
		uprawnienia = "SuperUser";
	}
	
	var dataString="mail="+mail+"&name="+name+"&surname="+surname+"&permissions="+uprawnienia+"&password="+password+"&insert=";
		
    ajax_calls("POST","https://thatquery.com/insert.php",dataString, function (result_ajax_calls){
        if (result_ajax_calls){
            fromTemplate("successfull");  
        }else{
            fromTemplate("login_failed");
        }   
    });    
}

//funkcja logowania	
function loginuser(storage_login, storage_password, auto, permissions_){
var html_list = ''
    +'<ons-list class="menu-list"><ons-list-item class="menu-item" onclick="menu.setMainPage(\'admin.html\', {closeMenu: true})"><ons-icon icon="ion-ios-lightbulb" class="ons-icon ons-icon--ion ion-ios-lightbulb"></ons-icon>&nbsp;Rozpocznij wizytę</ons-list-item>'
    + '<ons-list-item class="menu-item" onclick="menu.setMainPage(\'client_card.html\', {closeMenu: true})"><ons-icon icon="ion-ios-albums" class="ons-icon ons-icon--ion ion-ios-albums-outline"></ons-icon>&nbsp;Karta klienta </ons-list-item>'
    + '<ons-list-item class="menu-item" onclick="menu.setMainPage(\'list_edit_poll.html\', {closeMenu: true})"><ons-icon icon="ion-ios-compose" class="ons-icon ons-icon--ion ion-ios-compos"></ons-icon>&nbsp;Edycja/Podgląd ankiet </ons-list-item>'
    + '</ons-list><ons-list class="bottom-menu-list"><ons-list-item class="bottom-menu-item" onclick="menu.setMainPage(\'baza_wiedzy.html\', {closeMenu: true})"><ons-icon icon="ion-ios-videocam" class="ons-icon ons-icon--ion ion-ios-videocam"></ons-icon>&nbsp;Baza filmów</ons-list-item>'
    + '<ons-list-item class="bottom-menu-item" onclick="menu.setMainPage(\'baza_promo.html\', {closeMenu: true})"><ons-icon icon="ion-ios-star" class="ons-icon ons-icon--ion ion-ios-star"></ons-icon>&nbsp;Baza promocji</ons-list-item>'
    + '<ons-list-item class="bottom-menu-item" onclick="menu.setMainPage(\'baza_prod.html\', {closeMenu: true})"><ons-icon icon="ion-ios-folder" class="ons-icon ons-icon--ionion-ios-folder"></ons-icon>&nbsp;Baza produktów</ons-list-item>'
    + '<ons-list-item class="bottom-menu-item" onclick="menu.setMainPage(\'show_wholesale_photos.html\', {closeMenu: true})"><ons-icon icon="ion-ios-star" class="ons-icon ons-icon--ion ion-images"></ons-icon>&nbsp;Zdjęcia</ons-list-item>'
    + '<ons-list-item class="bottom-menu-item" onclick="logout()"><ons-icon icon="ion-ios-undo-outline" class="ons-icon ons-icon--ion ion-ios-undo"></ons-icon>&nbsp; Wyloguj </ons-list-item></ons-list>';                                           
var SuperUser_list = html_list + '<ons-list-item class="menu-item list__item ons-list-item-inner" onclick="menu.setMainPage(\'register.html\', {closeMenu: true})"><ons-icon icon="ion-ios-personadd" class="ons-icon ons-icon--ion ion-ios-personadd"></ons-icon>&nbsp; Dodaj użytkownika</ons-list-item>'
    + '<ons-list-item class="menu-item list__item ons-list-item-inner" onclick="menu.setMainPage(\'create_poll.html\', {closeMenu: true})"><ons-icon icon="ion-ios-plus" class="ons-icon--ion ion-ios-plus"></ons-icon>&nbsp; Kreator ankiet</ons-list-item>'
    + '<ons-list-item class="menu-item list__item ons-list-item-inner" onclick="menu.setMainPage(\'results_poll.html\', {closeMenu: true})"><ons-icon icon="ion-ios-shuffle-strong" class="ons-icon ons-icon--ion ion-ios-shuffle-strong"></ons-icon>&nbsp; Zobacz wyniki</ons-list-item>'
    + '<ons-list-item class="menu-item list__item ons-list-item-inner" onclick="menu.setMainPage(\'raport_wypelniania.html\', {closeMenu: true})"><ons-icon icon="ion-ios-pie" class="ons-icon ons-icon--ion ion-ios-pie"></ons-icon>&nbsp; Raport wypełniania ankiety</ons-list-item>';    
var password = '';
    if (auto == 1){
        mail = storage_login;
        password = storage_password;
        if (permissions_ == 'RTAM'){
            menu.setMainPage('admin.html', {closeMenu: true});
            document.getElementById("menu_glowne").innerHTML = html_list;
        }else {
              menu.setMainPage('admin.html', {closeMenu: true});
              document.getElementById("menu_glowne").innerHTML = SuperUser_list;
        }
    }else {
        mail = document.getElementById("login1").value;
	    password = document.getElementById("haslo1").value;     
        var dataString="password="+password+"&mail="+mail+"&login=";
		ajax_calls("POST","https://thatquery.com/login.php",dataString, function (result_ajax_calls){
            if (result_ajax_calls){
                storage.setItem('login', mail);
                storage.setItem('password', password);        	
			    if(mail !== "admin"){
                    storage.setItem('permissions', 'RTAM');
					document.getElementById("menu_glowne").innerHTML = html_list; 
                }else{
                    storage.setItem('permissions', 'SUPERUSER');
					document.getElementById("menu_glowne").innerHTML = SuperUser_list; 
                }
                menu.setMainPage('admin.html', {closeMenu: true});
            }else {
	     	ons.createDialog('login_failed.html').then(function(dialog) { dialog.show() ; });
		    } 
		});
    }
}

function ajax_calls(type_, url_, dataString_, callback){
 var value;
 $.ajax({
    	type: type_,
		url: url_,
		data: dataString_,
		crossDomain: true,
		cache: false,
		beforeSend: function(){},
		success: function(data){
			if($.trim(data).toUpperCase() != "FAILED"){
                value = true;
            }else {
                value = false;
			}
            callback(value);
		}
	});       
}

function string_extract(id_, start_char_, end_char_){
    var str = document.getElementById(id_).value;
    var start_pos = str.indexOf(start_char_) + 1;
    var end_pos = str.indexOf(end_char_,start_pos);
    var result = str.substring(start_pos,end_pos);
    return result;
}
//wczytanie ankiety  
function editpoll(id_hurtowni_, id_poll){ 
    modal.show();
    //set for further update in database
    hurtownia_id = id_hurtowni_;
    var str = document.getElementById(id_hurtowni_).innerHTML;
    var lastdate = str.substr(str.length - 10);  
	menu.setMainPage('edit_poll.html', {closeMenu: true});
	
//wybor z ankiet	
db.transaction(function(tx) {
    //miasto = "Warszawa";
    tx.executeSql('SELECT * FROM Polls WHERE mail=?', [mail], function(tx,results){
        for (var i=0; i < results.rows.length; i++){
            row = results.rows.item(i);
            var poll_id=row.poll_id;
    		var pollname=row.pollname;
			var q_name=row.q_name;
			var q_html=row.q_html;
	    	$('.header_questions').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
			$('.questions').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;"><ons-icon icon="ion-alert" class="ng-scope ons-icon ons-icon--ion ion-alert">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
		}
    });
});



/*
	var url='https://thatquery.com/show_poll_edit.php?id_poll='+ id_poll;
		$.getJSON(url,function(result){
			$.each(result, function(i, field){
				var poll_id=field.poll_id;
				var pollname=field.pollname;
				var q_name=field.q_name;
				var q_html=field.q_html;
				$('.header_questions').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
				$('.questions').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;"><ons-icon icon="ion-alert" class="ng-scope ons-icon ons-icon--ion ion-alert">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
			});
		});
*/
	//timeout zeby sie wszystko ładnie wykonało
	setTimeout(function(){ update_answer(id_hurtowni_, lastdate); }, 1000);
	setTimeout(function(){ modal.hide(); }, 1000);
 }
//podgląd - uzupelnia ankiete danymi z bazy
function update_answer(id_hurtowni_, lastdate_){
//klucz do update	
var url='https://thatquery.com/show_poll_answer2.php?hurtownia_id='+ id_hurtowni_ +'&mail='+ mail +'&data='+ lastdate_;

$.getJSON(url,function(result){
	$.each(result, function(i, field){
		var id=field.id;
		var availability_local=field.availability_local;
		var availability_central=field.availability_central;
		var price = field.price;
		var comments = field.comments;
		var competitive_product_name = field.competitive_product_name;
		var competitive_product_price = field.competitive_product_price;
		var competitive_product_name2 = field.competitive_product_name2;
		var competitive_product_price2 = field.competitive_product_price2;
		var competitive_product_name3 = field.competitive_product_name3;
		var competitive_product_price3 =field.competitive_product_price3;
	    if (availability_local == 1){
		    document.getElementById('chb_o'+i).checked = true;
	    }
		    document.getElementById('chb_o'+i).disabled = true;
	    if (availability_central == 1){
		    document.getElementById('chb_mc'+i).checked = true;
	    }
		    document.getElementById('chb_mc'+i).disabled = true;
	    if  (document.getElementById('in_c'+i) != null) {  
	        document.getElementById("in_c"+i).value = price;
	        document.getElementById("in_c"+i).disabled = true;
	        document.getElementById("in_k"+i).value = comments;
	        document.getElementById("in_k"+i).disabled = true;
	        document.getElementById("in_ck1"+i).value = competitive_product_price;
	        document.getElementById("in_ck1"+i).disabled = true;
	        document.getElementById("in_nk1"+i).value = competitive_product_name;
	        document.getElementById("in_nk1"+i).disabled = true;
	        document.getElementById("in_ck2"+i).value = competitive_product_price2;
	        document.getElementById("in_ck2"+i).disabled = true;
	        document.getElementById("in_nk2"+i).value = competitive_product_name2;
	        document.getElementById("in_nk2"+i).disabled = true;
	        document.getElementById("in_ck3"+i).value = competitive_product_price3;
	        document.getElementById("in_ck3"+i).disabled = true;
	        document.getElementById("in_nk3"+i).value = competitive_product_name3;
	        document.getElementById("in_nk3"+i).disabled = true;
	    }
	    document.getElementById("UpdateBtn").disabled = true;
	});
});
}
//odblokowanie do edycji 
function edit_state() {
   
var liczba_pytan = $("#_1 #elements").length;
	if (document.getElementById('EditSwitch').checked == true) {
	    document.getElementById("state").innerHTML = '<ons-icon icon="ion-ios-unlocked" class="ons-icon ons-icon--ion ion-ios-unlocked"></ons-icon> Wyłącz edycję';
	    document.getElementById("UpdateBtn").disabled = false;
	        for (var i = 0; i < liczba_pytan; i++){
			    document.getElementById('chb_o'+i).disabled = false;
			    document.getElementById('chb_mc'+i).disabled = false;
                if  (document.getElementById('in_c'+i) != null) {  
			        document.getElementById("in_c"+i).disabled = false;
    			    document.getElementById("in_k"+i).disabled = false;
			        document.getElementById("in_ck1"+i).disabled = false;
		    	    document.getElementById("in_ck2"+i).disabled = false;
		    	    document.getElementById("in_ck3"+i).disabled = false;
			        document.getElementById("in_nk1"+i).disabled = false;
			        document.getElementById("in_nk2"+i).disabled = false;
			        document.getElementById("in_nk3"+i).disabled = false;
                }   
		    }
    }else {
		  document.getElementById("state").innerHTML = '<ons-icon icon="ion-ios-locked" class="ons-icon ons-icon--ion ion-ios-locked"></ons-icon> Włącz edycję';
		  document.getElementById("UpdateBtn").disabled = true;
	    for (var i = 0; i < liczba_pytan; i++){
            document.getElementById('chb_o'+i).disabled = true;
		    document.getElementById('chb_mc'+i).disabled = true;
                if  (document.getElementById('in_c'+i) != null) {    
		            document.getElementById("in_c"+i).disabled = true;
		            document.getElementById("in_k"+i).disabled = true;
		            document.getElementById("in_ck1"+i).disabled = true;
		            document.getElementById("in_ck2"+i).disabled = true;
		            document.getElementById("in_ck3"+i).disabled = true;
		            document.getElementById("in_nk1"+i).disabled = true;
		            document.getElementById("in_nk2"+i).disabled = true;
		            document.getElementById("in_nk3"+i).disabled = true;
                }
	    }
    }
}
//update rekordow w bazie
function update_answer_in_base() {
	hideDialog('sure');
    zapisz_odpowiedzi("https://thatquery.com/update_data_poll2.php");
}
//czy jestes pewny ze chcesz dokonac zapisu
function window_new(){
    fromTemplate('sure');
}

// kliksz przycisk i pokazuje wybrana ankiete do uzupełnienia
function pokaz_wybrana_ankiete(){
start = performance.now(); //start timera
modal.show();
    
menu.setMainPage('ankieta_1.html', {closeMenu: true});

db.transaction(function(tx) {
    //miasto = "Warszawa";
    tx.executeSql('SELECT * FROM Polls WHERE mail=?', [mail], function(tx,results){
        for (var i=0; i < results.rows.length; i++){
            row = results.rows.item(i);
            var poll_id=row.poll_id;
			var pollname=row.pollname;
			var q_name=row.q_name;
			var q_html=row.q_html;
			$('.header_questions').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
			$('.questions').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
	 }
    });
});


/*
var url='https://thatquery.com/show_poll.php?pollname=Kwestionariusz produktowy 2016 Q4&mail=all_rtam';
	$.getJSON(url,function(result){
		$.each(result, function(i, field){
			var poll_id=field.poll_id;
			var pollname=field.pollname;
			var q_name=field.q_name;
			var q_html=field.q_html;
			$('.header_questions').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
			$('.questions').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
		});
	});
*/
get_my_location();
}
 
function pokaz_wybrana_ankiete2(){
    menu.setMainPage('ankieta_2.html', {closeMenu: true});
    
    db.transaction(function(tx) {
    miasto = "Warszawa";
    tx.executeSql('SELECT * FROM Polls WHERE pollname=?', ["Inwentaryzacja POS"], function(tx,results){
        for (var i=0; i < results.rows.length; i++){
            row = results.rows.item(i);
            var poll_id = row.poll_id;
    		var pollname = row.pollname;
			var q_name = row.q_name;
			var q_html = row.q_html;
			$('.header_questions2').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
			$('.questions2').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
		}
    });
});

  /*  
    
    var url='https://thatquery.com/show_poll.php?pollname=Inwentaryzacja POS&mail=all';
	$.getJSON(url,function(result){
		$.each(result, function(i, field){
			var poll_id=field.poll_id;
			var pollname=field.pollname;
			var q_name=field.q_name;
			var q_html=field.q_html;
			$('.header_questions2').append('<h3>'+ pollname +'<hr></hr></h3><div style="visibility: hidden;" id="poll_id">'+ poll_id +'</div>');
			$('.questions2').append('<div class="alert alert-warning" role="alert"><h6 style="line-height: 110%;">&nbsp;' + q_name +'</h6></div>'+ q_html + '');
		});
	});
    */
 }

//geolocalize
function get_my_location(){
 executed = 0;  

    function onSuccess(position) {
        lat = position.coords.latitude
        lon = position.coords.longitude
        $.getJSON('https://nominatim.openstreetmap.org/reverse?json_callback=?&format=json', {lat: lat, lon: lon}, function(data) { 
            miasto = data.address.city;
            geo_city = miasto;   // this should be your city, depending on where you are
            navigator.geolocation.clearWatch(watchID);
            modal.hide();
            if (executed != 1){
                executed = 1;
                pokaz_dialog();
            }
        }); 
    }
// onError Callback receives a PositionError object
    function onError(error) {
        miasto = "Wybierz recznie";
        navigator.geolocation.clearWatch(watchID);
        pokaz_dialog();
    }
var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true  });
}

function MsgCtrl($scope) 
{
    $scope.msg = "City";
} 
//okno z wyborem hurtowni

 
var fromTemplate = function(id) {
  var dialog = document.getElementById(''+ id +'');

  if (dialog) {
    dialog.show();
  }
  else {
    ons.createDialog(''+ id +'.html')
      .then(function(dialog) {
        dialog.show();
    });
      
  }
  
};
 

var hideDialog = function(id) {
    if (document.getElementById(id)){
  document
    .getElementById(id)
    .hide();
    }
}; 

//wybierz hurtownię z listy gdzie miasto  geolokalizacji
function pokaz_dialog(){
modal.show();
fromTemplate("gps");
setTimeout(function(){
        var scope = angular.element($("#miasto")).scope();
        scope.$apply(function(){
            scope.msg = geo_city;
        });
}, 500);    


db.transaction(function(tx) {
    miasto = "Warszawa";
    tx.executeSql('SELECT * FROM Wholesale WHERE wholesale_city=?', [miasto], function(tx,results){
        for (var i=0; i < results.rows.length; i++){
            row = results.rows.item(i);
            //id, wholesale_name, wholsale_street, wholesale_class, wholesale_city
            var hurtownia_id = row.id;
            var hurtownia_nazwa = row.wholesale_name;
        	var hurtownia_ulica = row.wholsale_street;
            $('.mydiv').append('<button class="button button--large--quiet" id="'+ hurtownia_id +'" onclick="showId(this.id)"><b>'+ hurtownia_nazwa +'</b> <i>'+ hurtownia_ulica + '</i></button>');
        }
    });
});
 /* 
var url='https://thatquery.com/hurtownia.php?hurtownia_miasto='+ miasto;
    $.getJSON(url,function(result){
		$.each(result, function(i, field){
			var hurtownia_id = field.hurtownia_id;
			var hurtownia_nazwa = field.hurtownia_nazwa;
			var hurtownia_ulica = field.hurtownia_ulica;
			$('.mydiv').append('<button class="button button--large--quiet" id="'+ hurtownia_id +'" onclick="showId(this.id)"><b>'+ hurtownia_nazwa +'</b> <i>'+ hurtownia_ulica + '</i></button>');
		});
	}); */
setTimeout('modal.hide();', 2000);

 } 
function manual_choice_dialog() {
//combobox propagation
hideDialog('gps');
fromTemplate('manual_choice');
setTimeout(function(){
    $('.myOptions').empty();
    $('#wholesale_id').empty();
    
     db.transaction(function(tx) {
                 //miasto = "Warszawa";
                tx.executeSql('SELECT DISTINCT wholesale_city FROM Wholesale where 1=? ORDER BY wholesale_city ASC',[1], function(tx,results){
                    for (var i=0; i < results.rows.length; i++){
                        row = results.rows.item(i);
                        //alert(row.id);
            //id, wholesale_name, wholsale_street, wholesale_class, wholesale_city
                        var hurtownia_miasto = row.wholesale_city;
                        $('.myOptions').append(' <option value="option'+ i +'">'+ hurtownia_miasto +'</option>');
                    }
                });
            });/*
    var url='https://thatquery.com/hurtownia_miasto.php';
	$.getJSON(url,function(result){
	$('.myOptions').append('<option value="label">Wybierz miasto z listy</option>');
	    $.each(result, function(i, field){
		    var hurtownia_miasto =field.hurtownia_miasto;
			$('.myOptions').append(' <option value="option'+ i +'">'+ hurtownia_miasto +'</option>');
		});
    });
    */
	var selectmenu=document.getElementById("myOptions");
	selectmenu.onchange=function(){ //run some code when "onchange" event fires
	    var chosenoption=this.options[this.selectedIndex];
		if (chosenoption.text != "Wybierz miasto z listy"){
            miasto = chosenoption.text;
            //alert(miasto);
		    $('.myOptions2').empty();
            $('.myOptions3').empty();
		    $('.myOptions2').append('<option value="label">Wybierz hurtownię z listy</option>');
            db.transaction(function(tx) {
                tx.executeSql('SELECT DISTINCT wholesale_name FROM Wholesale WHERE wholesale_city=? ORDER BY wholesale_name ASC', [miasto], function(tx,results){
                    for (var i=0; i < results.rows.length; i++){
                        row = results.rows.item(i);
            //id, wholesale_name, wholsale_street, wholesale_class, wholesale_city
                        var hurtownia_nazwa = row.wholesale_name;
                        $('.myOptions2').append(' <option value="option'+ i +'">'+ hurtownia_nazwa +'</option>');
                    }
                });
            });
            /*v ar url3='https://thatquery.com/hurtownia_nazwa.php?ch_hurtownia_miasto='+miasto;
            $.getJSON(url3,function(result){
				$.each(result, function(i, field){
					var hurtownia_nazwa = field.hurtownia_nazwa;
					$('.myOptions2').append(' <option value="option'+ i +'">'+ hurtownia_nazwa +'</option>');
				});
			}); */
		}
	    var selectmenu2=document.getElementById("myOptions2");
	    selectmenu2.onchange=function(){ //run some code when "onchange" event fires
	        var chosenoption2=this.options[this.selectedIndex]; //this refers to "selectmenu"
	        nazwa_hurtowni = chosenoption2.text;
		    $('.myOptions3').empty();
		    $('.myOptions3').append('<option value="label">Wybierz ulicę z listy</option>');
            
            
             db.transaction(function(tx) {
                 //miasto = "Warszawa";
                tx.executeSql('SELECT DISTINCT * FROM Wholesale WHERE wholesale_city=? and wholesale_name=?', [miasto, nazwa_hurtowni], function(tx,results){
                    for (var i=0; i < results.rows.length; i++){
                        row = results.rows.item(i);
            //id, wholesale_name, wholsale_street, wholesale_class, wholesale_city
                        var hurtownia_ulica = row.wholsale_street;
                        $('.myOptions3').append(' <option value="option'+ i +'">'+ hurtownia_ulica +'</option>');
                    }
                });
            });
            
            /*
            var url2='https://thatquery.com/hurtownia_ulica.php?ch_hurtownia_miasto='+miasto+'&ch_hurtownia_nazwa='+nazwa_hurtowni;
            $.getJSON(url2,function(result){
			    $.each(result, function(i, field){
				    var hurtownia_ulica = field.hurtownia_ulica;
				    $('.myOptions3').append(' <option value="option'+ i +'">'+ hurtownia_ulica +'</option>');
			    });
		    });	*/
	    };
       //id hurtowni z bazy 
        var selectmenu3=document.getElementById("myOptions3");
        selectmenu3.onchange=function(){
        var chosenoption = this.options[this.selectedIndex];
        if (chosenoption.text != "Wybierz ulicę z listy"){
            adres_hurtowni = chosenoption.text;
            //alert(adres_hurtowni);
            //var url3='https://thatquery.com/hurtownia_id.php?ch_hurtownia_miasto='+miasto+'&ch_hurtownia_nazwa='+nazwa_hurtowni+'&ch_hurtownia_ulica='+adres_hurtowni;
            $('#wholesale_id').empty();
             db.transaction(function(tx) {
                 //miasto = "Warszawa";
                tx.executeSql('SELECT id FROM Wholesale WHERE wholesale_city=? and wholesale_name=? and wholsale_street=?', [miasto, nazwa_hurtowni, adres_hurtowni], function(tx,results){
                    for (var i=0; i < results.rows.length; i++){
                        row = results.rows.item(i);
            //id, wholesale_name, wholsale_street, wholesale_class, wholesale_city
                        var hurtownia_id = row.id;
                        //alert(hurtownia_id);
                        $('#wholesale_id').append(hurtownia_id);
                        //$('.myOptions3').append(' <option value="option'+ i +'">'+ hurtownia_ulica +'</option>');
                    }
                });
            });
            /*$.getJSON(url3,function(result){
                $.each(result, function(i, field){
    		        var hurtownia_id = field.hurtownia_id;
			        $('#wholesale_id').append(hurtownia_id);
		        });
            });	*/
        }
        };   
	}; 
    modal.hide();
},1000);				 	
} 

function confirm_choice(){
modal.show();
setTimeout('modal.hide();', 2000); 

var id = $('#wholesale_id').html();

    if(id > 0){
        var dataString="id="+id;
        var urlname = "https://thatquery.com/visitation_check.php?id="+id;
        hideDialog('manual_choice'); 
        document.getElementById("localize_me").innerHTML = '<b>Miasto: </b>'+ miasto +'<b> Hurtownia: </b>'+ nazwa_hurtowni + '<b> Adres: </b>'+ adres_hurtowni +' </ons-icon><button type="button" onclick="get_my_location()" class="btn btn-info"><ons-icon icon="ion-android-pin" class="ons-icon ons-icon-- ion-android-pin "></ons-icon> Zmień lokalizację</button><br /><b> Użytkownik: </b> '+ mail;
        
        ajax_calls("POST", urlname, dataString, function (callback){
            if (!callback){
                hurtownia_id = id;
            }else {
                hurtownia_id = id;
                fromTemplate('komunikat_hurtownia'); 
            }  
        });
    }else {
        hideDialog('manual_choice'); 
        ons.notification.alert('Musisz wybrać poprawnie hurtownie!'); 
        fromTemplate('manual_choice');
    }
}

function update_client_card() {
    ons.notification.alert('UWAGA funkcjonalnoć w przygotowaniu - jeszcze nie dziala !'); 
    
} 

 
 //do raportu ilosc wypelnien ankiet
function show_report(){
	var time_from = document.getElementById('time_from').value;
	var url='https://thatquery.com/rep1.php?time_from='+ time_from;
	$("#myTable tr").remove();
	$.getJSON(url,function(result){
		$('#myTable').append('<tr><td><b>RTAM</b></td><td><b>Ile wypełnionych ankiet</b></td></tr>');
		console.log(result);
		$.each(result, function(i, field){
			var rtam = field.RTAM;
			var wypelniono_ankiety = field.wypelniono_ankiety;
			$('#myTable').append('<tr><td>'+ rtam +'</td><td>'+ wypelniono_ankiety +'</td></tr>');
		});
	});
}

function scanBarcode(clicked_id) {
   window.plugins.barcodeScanner.scan( 
       function(result) {
            document.getElementById("in_"+ clicked_id).value = result.text;
        }, function(error) {
                    ons.notification.alert("Scanning failed: " + error);
        }   
    ); 
   
}
   
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
 
function clearCache() {
    navigator.camera.cleanup();
}
 
var retries = 0;
var number_photos = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
    clearCache();
    retries = 0;
    number_photos++;  
    fromTemplate('successfull');      
    }
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            fromTemplate('login_failed');
        }
    }
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = type + "!"+ hurtownia_id +"?"+ mail+"?"+number_photos;
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("https://thatquery.com/uploadphoto.php"), win, fail, options);
}
var type; 

function defualt_photo() {
    type = "polka";
    capturePhoto(); 
}

function type_polka() {
    type = "polka";
    hideDialog('photo_choice');
    capturePhoto(); 
}

function type_oddzial() {
    type = "oddzial";
    hideDialog('photo_choice');
    capturePhoto(); 
}

function show_communicate(){
        fromTemplate('photo_choice');
}

function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI
    });
}
 
function onFail(message) {
    ons.notification.alert("Failed because: " + message);
}

function select_wholesale() {
$('.select_wholesale_options').empty();
    
    if (document.getElementById("select_wholesale").checked == true){
	var folder = "https://thatquery.com/wholesale_photo/";

	$.ajax({
		url : folder,
		success: function (data) {
		var hurtownie = [];
		    $(data).find("a").attr("href", function (i, val) {
		    if( val.match(/\.(jpe?g|png|gif)$/) ) { 
				var hurtownia_id = val.substring(val.lastIndexOf("!")+1,val.lastIndexOf("%3f"));
				var url3='https://thatquery.com/id_hurtownia_nazwa.php?hurtownia_id='+hurtownia_id;
						$.getJSON(url3,function(result){
								$.each(result, function(i, field){
										if ($.inArray(field.hurtownia_nazwa, hurtownie) === -1) {
											$('.select_wholesale_options').append(' <option value="option'+ i +'">'+ field.hurtownia_nazwa +'</option>');
											hurtownie.push(field.hurtownia_nazwa);
										}
								});
						});
				};				
			}) 
        }
	});
	}
}


function select_RTAM() {
    $('.select_RTAM_options').empty();
    if (uprawnienia == 'RTAM') {
        $('#select_RTAM')[0].checked = true;
        document.getElementById("select_RTAM").enabled = false;
        $('.select_RTAM_options').append(' <option value="option'+ i +'">'+ mail +'</option>');
        $('.select_RTAM_options').val($(".select_RTAM_options option:first").val());
    }else{
        if (document.getElementById("select_RTAM").checked == true){
        var url='https://thatquery.com/rtam_list.php';
    		$.getJSON(url,function(result){
				console.log(result);
				$('.select_RTAM_options').append(' <option value="option1x">Kliknij i wybierz</option>');
				$.each(result, function(i, field){
					var RTAM = field.RTAM;
					var product_name = field.product_name;
					var product_family = field.product_family;
					
					$('.select_RTAM_options').append(' <option value="option'+ i +'">'+ RTAM +'</option>');
				});
			});
        }
    }
}


var kind_value_filter;
var next_json;
var json_obj = []; 

function showimages(){
var ch_RTAM = document.getElementById("select_RTAM").checked;
var ch_wholesale = document.getElementById("select_wholesale").checked;
var folder = "https://thatquery.com/wholesale_photo/";
    $.ajax({
        url : folder,
        success: function (data) {
            
             $(data).find("a").attr("href", function (i, val) {
                if( val.match(/\.(jpe?g|png|gif)$/) ) { 
				    var data_dodania = val.substring(0,10);
				    var type_name;
					if (val.substring(val.lastIndexOf("_")+1,val.lastIndexOf("_")+ 2) == "p"){
						type_name = "Półka"
					}else {
						type_name = "Oddział"
					}
                kind_value_filter = $("#select_kind_options :selected").text();    
                    
				var rtam_value_filter = $("#select_RTAM_options :selected").text();
				var rtam = val.substring(val.lastIndexOf("%3f")+3,val.lastIndexOf("."));
                

				var wholesale_value_filter = $("#select_wholesale_options :selected").text()
				var hurtownia_id = val.substring(val.lastIndexOf("!")+1,val.lastIndexOf("%3f"));
                
					//filtr hurtownia + rtam
				if (ch_RTAM == true && ch_wholesale == true ){
						if (rtam_value_filter.length > 2 || wholesale_value_filter.length > 1 ){
							if (rtam_value_filter == rtam){
								var url3='https://thatquery.com/id_hurtownia_nazwa.php?hurtownia_id='+hurtownia_id;
								$.getJSON(url3,function(result){
									$.each(result, function(i, field){
										if (wholesale_value_filter == field.hurtownia_nazwa){
											if (type_name === kind_value_filter){
                                                json_obj.push({'url': folder + val, 'caption': field.hurtownia_nazwa+', '+data_dodania});  
                                            }else if (kind_value_filter == "Wszystko") {
                                                json_obj.push({'url': folder + val, 'caption': field.hurtownia_nazwa +', '+field.hurtownia_miasto+', '+data_dodania });  
    	                                    }
										}
									});
								});
							}
						}
                }else if (document.getElementById("select_wholesale").checked == true){
						get_wholesale_data(hurtownia_id, folder, val, type_name, data_dodania, rtam);
				}else if (document.getElementById("select_RTAM").checked == true){	
					if (rtam_value_filter == rtam){
						get_wholesale_data(hurtownia_id, folder, val, type_name, data_dodania, rtam);
					}
				}else {
						get_wholesale_data(hurtownia_id, folder, val, type_name, data_dodania, rtam);
				}
            } 
        });
    }
	});
    modal.show();
    setTimeout(function(){
    next_json = JSON.stringify(json_obj);    
    modal.hide(); 
    }, 2000)
   
}

function get_wholesale_data(ahurtownia_id, folder1, val1, type_name1, data_dodania1, rtam1) {
$('#button_save').empty();
var hurtownia_id = ahurtownia_id;
var folder = folder1;
var val = val1; 
var type_name = type_name1;
var data_dodania = data_dodania1;
var rtam = rtam1;

if (type_name === kind_value_filter){
var url3='https://thatquery.com/id_hurtownia_nazwa.php?hurtownia_id='+hurtownia_id;
	$.getJSON(url3,function(result){
		console.log(result);
		$.each(result, function(i, field){
            json_obj.push({'url': folder + val, 'caption': field.hurtownia_nazwa +', '+field.hurtownia_miasto+', '+data_dodania });  
        });
	});
}else if (kind_value_filter == "Wszystko") {
var url3='https://thatquery.com/id_hurtownia_nazwa.php?hurtownia_id='+hurtownia_id;
	$.getJSON(url3,function(result){
		console.log(result);
		$.each(result, function(i, field){
            json_obj.push({'url': folder + val, 'caption': field.hurtownia_nazwa +', '+field.hurtownia_miasto+', '+data_dodania });  
        });
	});
}

}

function yesnoCheck(id_element) {
    
    if(id_element.substring(0, 3)== "yes") {
        if (document.getElementById(id_element).checked) {
        document.getElementById('element_'+id_element).style.display = 'block';
        }
    }
    else {
        var str1 = "yes"
        var res = str1.concat(id_element)    
        document.getElementById('element_'+res).style.display = 'none';
    }
}
function save_marketing_poll() {
    var yes_or_no;
    var comment_text;
    var yes_or_no_add;
    var liczba_pytan2;
    
    var marketing = {
        yes_or_no: '',
        comment_text: '',
        yes_or_no_add: '',
        liczba_pytan2: '',
        product_name: 'komentarz',
        
        
    };
var bool2 = 1;
var liczba_pytan2 = $("#_1 #elements").length;
    
    for (var m = 0; m < liczba_pytan2; m++){
        if(document.getElementById("Check_"+m) != null){
            if(document.getElementById("Check_"+m).checked){
                marketing.yes_or_no = 1;//TAK
                marketing.yes_or_no_add = "";//nie obowiazuje
            }else {
                marketing.yes_or_no = 0;//NIE
                    if (document.getElementById("possible_"+m).checked){
                        marketing.yes_or_no_add = 1;
                    }else {
                        marketing.yes_or_no_add = 0;
                    }
            }
        }
        if  (document.getElementById('p_chb'+m) != null) {
    					product_name =  document.getElementById('p_chb'+m).innerHTML;
		}
        order_col = m
        comment_text = 'brak'
        if  (document.getElementById('c'+m) != null) {
            product_name = 'komentarz'
            comment_text =  document.getElementById('c'+m).value;
		}
        var dataString = "hurtownia_id="+hurtownia_id+"&geo_city="+geo_city+"&mail="+mail+"&product_name="+product_name+"&yes_or_no="+yes_or_no+"&yes_or_no_add="+yes_or_no_add+"&order_col="+order_col+"&comment_text="+comment_text+"&insert=";
                ajax_calls("POST", "https://thatquery.com/insert_marketing_poll.php", dataString, function (result_ajax_calls){
                    if (!result_ajax_calls){
                        bool2 = 0;   
                    }
                });    
            } 
        if (bool2 == 1){
            ons.notification.alert("Zapis udany !");
            menu.setMainPage('result.html', {closeMenu: true});
            executed = 0; 
        }else {
            fromTemplate('Zapis nie udany');
        }    
}


var path_complete;

function get_pdf_files() {
var pdfFilesDirectory = 'https://thatquery.com/pdf_prod/';
// get auto-generated page 
$.ajax({url: pdfFilesDirectory}).then(function(html) {
    // create temporary DOM element
    var document = $(html);
    // find all links ending with .pdf 
    document.find('a[href$=".pdf"]' ).each(function() {
        var pdfName = $(this).text();
        var pdfUrl = $(this).attr('href');
        var path_complete = pdfFilesDirectory+pdfUrl;
        $("#list_pdf").append('<button type="button" onclick="window_open(this.id)" id="'+ path_complete +'" class="btn btn-secondary btn-lg btn-block">'+ pdfName +'</button><button id= "'+path_complete+'" onclick="send_file_wholesale(this.id)" type="button" class="btn btn-info">Wyślij email z katalogiem</button></a><br />');
        // do what you want here 
    })
});
}
var typed_mail;
var param;
function send_file_wholesale(parameter) {
    param = parameter;
    fromTemplate('type_mail');
}
function typed_mail_val(){
    typed_mail =  $('#typed_email').val();
    
    window.location.href='mailto:'+ typed_mail +'?subject=Philips katalog&body=<a href%3D%22'+ param +'%22>link do pobrania katalogu</a>';
    hideDialog('type_mail');
}
function get_pdf_files_promo() {
    
    var pdfFilesDirectory = 'https://thatquery.com/pdf_promo/';

// get auto-generated page 
$.ajax({url: pdfFilesDirectory}).then(function(html) {
    // create temporary DOM element
    var document = $(html);

    // find all links ending with .pdf 
    document.find('a[href$=".pdf"]' ).each(function() {
        var pdfName = $(this).text();
        var pdfUrl = $(this).attr('href');
        var path_complete = pdfFilesDirectory+pdfUrl;
        
        $("#list_pdf2").append('<button type="button" onclick="window_open(this.id)" id="'+ path_complete +'" class="btn btn-secondary btn-lg btn-block">'+ pdfName +'</button><button id= "'+path_complete+'" onclick="send_file_wholesale(this.id)" type="button" class="btn btn-info">Wyślij email z pdf</button></a><br />');
       
        // do what you want here 
    })
});
}
function window_open(id) {
    
    window.open('https://docs.google.com/viewer?url='+id, '_blank', 'location=yes')
}



function logout() {
document.getElementById("menu_glowne").innerHTML = '<ons-list-item class="menu-item list__item ons-list-item-inner" onclick="menu.setMainPage(\'login.html\', {closeMenu: true})"><ons-icon icon="ion-power"  class="ons-icon ons-icon--ion ion-power"></ons-icon>Logowanie</ons-list-item>';
   menu.setMainPage('login.html', {closeMenu: true});
    $("#login").html('Login');
}
