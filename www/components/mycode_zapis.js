//global variables 
var clicks = 1;

var time;
var email_content = [];

//Timeout zaby serwer zdazyl przyjac zapytania
function doSetTimeout(m) {
    var a = 0;
  setTimeout(function() {a= a + 1 }, 1000);
}

//sprawdzam czy uzytkopwnik przed wyslaniem alertu dla KAM'a zdefiniowal cene i nazwe lub ean konkurenta
function validate_form(){
    var bool = 1; 
    var liczba_pytan = $("#_1 #elements").length;
            for ( m = 0; m < liczba_pytan ; m++){
                if (document.getElementById('alert_a'+m) != null || document.getElementById('alert_b'+m) != null || document.getElementById('alert_c'+m) != null) {    
                    if (document.getElementById('alert_a'+m).checked){
                        if (document.getElementById('in_ck1'+m).value.length < 1 || document.getElementById('in_nk1'+m).value.length < 1 )  {
                          ons.createDialog('mail_alert2.html').then(function(dialog) { dialog.show() ; });
                          bool = 0;//zmien na zero
                        }
                    }else if (document.getElementById('alert_b'+m).checked){
                        if (document.getElementById('in_ck2'+m).value.length < 1 || document.getElementById('in_nk2'+m).value.length < 1) {
                          ons.createDialog('mail_alert2.html').then(function(dialog) { dialog.show() ; });
                          bool = 0;//zmien na zero
                        }
                    }else if (document.getElementById('alert_c'+m).checked){
                        if (document.getElementById('in_ck3'+m).value.length < 1  || document.getElementById('in_nk3'+m).value.length < 1) {
                          ons.createDialog('mail_alert2.html').then(function(dialog) { dialog.show() ; });
                          bool = 0;//zmien na zero
                        }
                    }
                    
                }
            }
    if (bool != 0){ 
        zapisz_odpowiedzi("https://thatquery.com/insert_data_poll3.php");
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if (states[networkState] == 'No network connection'){
        connection = false; 
    };
}


// Handle the offline event
   document.addEventListener("offline", onOffline, false);

    function onOffline() {
    // Handle the offline event
    connection = false;
    }
    
//zapis do bazy danych
function zapisz_odpowiedzi(url_){
    
    checkConnection();
    
    var liczba_pytan = $("#_1 #elements").length;
    var bool = true;
	var pollname = nazwa_ankiety;
	var end = performance.now();
	var time = parseInt((end - start)/1000, 10); //time of po
    var bool_alert = 0;
    
    var answer = {
        product_name: '',
        poll_id : '',
        wholesale_id : '',
        chb_mc : '',
        chb_o : '',
        price : '',
        comment: '',
        name_competitor1: '',
        name_competitor2: '',
        name_competitor3: '',
        price_competitor1: '',
        price_competitor2: '',
        price_competitor3: '', 
        order: ''
    };
    answer.poll_id = document.getElementById("poll_id").innerHTML;
    answer.wholesale_id = hurtownia_id;    
    
 
//whether offline/online connection
     
 
   //zapis do listy wizyt
    if (connection){
        zapis_do_listy_wizyt(mail, answer.wholesale_id, time); 
    }else {
         var time_ = JSON.stringify(time); // storing time poll
         window.localStorage.setItem('time', time);//key to store
    }
    //for loop
		for ( m = 0; m < liczba_pytan ; m++){
			var alert_def1 = document.getElementById('alert_a'+m);
            var alert_def2 = document.getElementById('alert_b'+m);
            var alert_def3 = document.getElementById('alert_c'+m);

            answer.order = m; // zeby lawtwiej bylo robic update
			doSetTimeout(500); // timeout zeby serwer sie nie wywalal
			//czesc kodu odpowiedzialna za sprawdzenie wybranej opcji checkbox

            if(document.getElementById('chb_o'+m) != null){
                if(document.getElementById('chb_o'+m).checked){
                    answer.chb_o = "1";
                }else {
                    answer.chb_o = "0";
                }
                if(document.getElementById('chb_mc'+m).checked){
                    answer.chb_mc = "1";
                }else {
                    answer.chb_mc = "0";
                }
            }
            
			if  (document.getElementById('p_chb'+m) != null) {
				answer.product_name =  document.getElementById('p_chb'+m).innerHTML;
			}else {
			    answer.product_name = null;
			}
            //price PH procucts
            if (document.getElementById('in_c'+m) != null) {
				answer.price = document.getElementById('in_c'+m).value;
			}else {
				answer.price  = null;
			}
            //comment PH procucts
            if (document.getElementById('in_k'+m) != null) {
				answer.comment = document.getElementById('in_k'+m).value;
			}else {
				answer.comment = null;
			}
            //price_competitor 1
            if (document.getElementById('in_ck1'+m) != null) {
				answer.price_competitor1 = document.getElementById('in_ck1'+m).value;
			}else {
				answer.price_competitor1 = null;
			}
            //price_competitor 2
            if (document.getElementById('in_ck2'+m) != null) {
				answer.price_competitor2 = document.getElementById('in_ck2'+m).value;
			}else {
				answer.price_competitor2 = null;
			}
			//price_competitor 3
            if (document.getElementById('in_ck3'+m) != null) {
				answer.price_competitor3 = document.getElementById('in_ck3'+m).value;
			}else {
				answer.price_competitor3 = null;
			}
			//name_competitor 1			
			if (document.getElementById('in_nk1'+m) != null) {
				answer.name_competitor1 = document.getElementById('in_nk1'+m).value;
			}else {
				answer.name_competitor1 = null;
			}
			//name_competitor 2			
            if (document.getElementById('in_nk2'+m) != null) {
				answer.name_competitor2 = document.getElementById('in_nk2'+m).value;
			}else {
				answer.name_competitor2 = null;
			}
			//name_competitor 3			
            if (document.getElementById('in_nk3'+m) != null) {
				answer.name_competitor3 = document.getElementById('in_nk3'+m).value;
			}else {
				answer.name_competitor3 = null;
			}
            //alerts block        
           if (alert_def1 != null) {    
                if (alert_def1.checked){
                    bool_alert = 1;
                    email_content[email_content.length + 1] = "nasz produkt: " + answer.product_name + " cena naszego produktu: " + answer.price + " gdzie konkurent(nazwa lub EAN): " + answer.name_competitor1 + " cena konkurenta " + answer.price_competitor1 + "<br />"; 
                }
                if (alert_def2.checked){
                    bool_alert = 1;
                    email_content[email_content.length + 1] = "nasz produkt: " + answer.product_name + " cena naszego produktu: " + answer.price + " gdzie konkurent(nazwa lub EAN): " + answer.name_competitor2 + " cena konkurenta " + answer.price_competitor2 + "<br />";
                }
                if (alert_def3.checked){
                    bool_alert = 1;
                    email_content[email_content.length + 1] = "nasz produkt: " + answer.product_name + " cena naszego produktu: " + answer.price + " gdzie konkurent(nazwa lub EAN): " + answer.name_competitor3 + " cena konkurenta " + answer.price_competitor3 + "<br />";
                }
            } 
            //send alert
            if (m == liczba_pytan - 1) {
                if (bool_alert == 1){
                    send_alert();
                }
            }
				
        //save data to database or store it locally
        if (connection == true){
             var dataString = "poll_id="+ answer.poll_id +"&hurtownia_id="+ answer.wholesale_id +"&geo_city="+ geo_city +"&mail="+ mail +"&product_name="+ answer.product_name +"&cena_nasza="+answer.price+"&komentarz_nasz="+ answer.comment +"&konkuerecja1_cena="+ answer.price_competitor1 +"&konkuerecja1_nazwa="+ answer.name_competitor1 +"&konkuerecja2_cena="+ answer.price_competitor2 +"&konkuerecja2_nazwa="+ answer.name_competitor2 +"&konkuerecja3_cena="+ answer.price_cotitor3 +"&konkuerecja3_nazwa="+ answer.name_competitor3 +"&chb_o="+answer.chb_o+"&chb_mc="+answer.chb_mc+"&order_col="+ answer.order +"&date_add="+ date_visit +"&insert=";
               ajax_calls("POST",url_,dataString, function (result_ajax_calls){
                    if(!result_ajax_calls){
                       bool = false; 
                    }  
                });
        }else {
         //brak polaczenia z siecia - zapisz lokalnie dane   
            var dataToStore = JSON.stringify(answer); // storing data answer
            window.localStorage.setItem('answer'+ m, dataToStore);//key to store
        }
		//end loop
		};
        
		modal.show();
		setTimeout(function(){
			modal.hide();
			if (bool){
				fromTemplate('successfull');
                if(url_ == "https://thatquery.com/insert_data_poll3.php"){
                    pokaz_wybrana_ankiete2();
                }else{
                    update_answer();
                }
			}else {
				fromTemplate('login_failed');
			} 		
		}, 2000); 
}


function zapis_do_listy_wizyt(mail_,id_,time_) {
    var dataString ="mail="+mail_+"&hurtownia_id="+id_+"&time="+time_+"&insert=";
	ajax_calls("POST","https://thatquery.com/visitation_date2.php", dataString, function(result){}); 
}

function send_alert(){
var new_string = nazwa_hurtowni + " " + adres_hurtowni + " " + miasto;
var email_ctn;
email_ctn = email_content.toString();
    var template_params = {
            name: mail,
            mail_send: 'damian.reszuta@outlook.com',//mail
            reply_email: 'damian.reszuta@philips.com',
            dane_hurtowni: new_string,
            rtam_name: mail,
            message_html: email_ctn
        };
        
    emailjs.send("default_service","template_I0R2D2aD",template_params);
}

String.prototype.replaceAllSplitAndJoin = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}; 
  
//funkcja wypisuje nazwe hurtowni z geolokalizacji - nazwa plus ulica i miasto 
function showId(hurtownia_id_) {

hurtownia_id = hurtownia_id_;    
var str = document.getElementById(hurtownia_id).innerHTML;
nazwa_hurtowni = str.substring(str.lastIndexOf("<b>")+3,str.lastIndexOf("</b>"));
adres_hurtowni = str.substring(str.lastIndexOf("<i>")+3,str.lastIndexOf("</i>"));
$('#localize_me').html('<b>Miasto: </b>'+ miasto +'<b> Hurtownia: </b>'+ nazwa_hurtowni + '<br /><b> Adres: </b>'+ adres_hurtowni +' </ons-icon><button type="button" onclick="get_my_location()" class="btn btn-info"><ons-icon icon="ion-android-pin" class="ons-icon ons-icon-- ion-android-pin "></ons-icon> Zmień lokalizację</button><br /><b> Użytkownik: </b> '+ mail);
// sprawdzenie czy hurtownia była odwiedzona w ciągu 30 dni 


var dataString = "id="+hurtownia_id;
var urlname = "https://thatquery.com/visitation_check.php?id="+hurtownia_id;

hideDialog('gps');

ajax_calls("POST", urlname, dataString, function (callback){
            if (callback){
                fromTemplate('komunikat_hurtownia'); 
            }  
        });
}

function closeAndgoMain() {
hideDialog('komunikat_hurtownia');
menu.setMainPage('admin.html', {closeMenu: true});
}

//function add questionary to database
function create_form() {
var number = document.getElementById("clicks").innerHTML;
var pollname = document.getElementById("pollname");
var selected_RTAM = $("#select_RTAM_options :selected").text();

var qname = document.getElementById("question1").value;
    if (qname.length < 1){
        ons.notification.alert('Musisz wpisać treść pytania');
    }else if(pollname.value.length < 1) {
        ons.notification.alert('Musisz wpisać nazwę ankiety');
    }else {
		pollname.disabled = true;
		number = clicks;
		var count = 1;
        var html_string;
        html_string += document.getElementById('_'+clicks).outerHTML;
	    var dataString="pollname="+pollname.value+"&q_name="+qname+"&html_string="+html_string+"&receiver="+selected_RTAM+"&insert=";

	    if($.trim(pollname.value).length>0 & $.trim(qname).length>0)
	    {
            ajax_calls("POST","https://thatquery.com/poll_products_insert.php",dataString, function(result){
                if(result){
                    var l= 0;
                    while (l< licznik_klikow ){ 
	                    removeElement_without() ;
	                    l++; 
                        clicks++;
                        number = clicks;
	                    qname = "";
	                    //getformfromdatbase();
                    }
                }else {
                    ons.notification.alert('Cos poszlo nie tak... sproboj ponownie!');
                }   
            });
	    }
    }
}
var n = 0;     
var licznik_klikow = 0;
function create_html_element(){
    count = 0;
    licznik_klikow++;  
 //z listy wyboru wybierz nazwe pola i dodaj ich ilosc
    var choice_field = document.getElementById("choice_field");
    var str_selected = choice_field.options[choice_field.selectedIndex].text;
 //sprawdz jaki element 
   if (str_selected == "Pytanie1") {
        var produkt_vs_konkurent = '<br /><br /><div id="question_'+n+'"><div style="clear:both"><p id="p_chb'+n+'" style="font-weight: bold;">Moj text</p></div><ons-col><div style="float: left;">Dostępność : <br /><label class="checkbox" style="margin-right: 4px; font-size: 12px;"><ons-input type="checkbox" id="chb_o'+n+'">Oddział</label><label class="checkbox" style="font-size: 12px;"><ons-input type="checkbox" id="chb_mc'+n+'"> Magazyn centralny</label><input type="number" step="0.01" id="in_c'+n+'" class="text-input text-input--underbar" placeholder="cena" value="" style="width: 50px; margin-left: 4px; margin-top: 5px; font-size: 11px;"><input type="text" id="in_k'+n+'" class="text-input text-input--underbar" placeholder="komentarz" value="" style="margin-left: 4px; margin-top: 5px; font-size: 11px; width: 110px;"></div></ons-col><ons-col><div style="float: left;"><b>Konkurencja1 : </b><div class = "input-group"><span class = "input-group-btn"><button style="height: 50px" class = "btn btn-default" type = "button" id="nk1'+n+'" onclick="scanBarcode(this.id)"> <i class="fa fa-barcode" style="font-size:20px"></i> </button></span><input style="height: 50px" type = "text" class =" form-control" id="in_nk1'+n+'"  placeholder="Konkurent(EAN - scan lub nazwa)"><span class="input-group-addon" style="border-left: 0; border-right: 0; height: 50px">Cena:</span><input style="height: 50px" type="number" step="0.01" id="in_ck1'+n+'" class ="form-control" placeholder="cena" value=""><span class = "input-group-addon"><input type = "checkbox" style="display: none;"><label style="margin: 0" class="checkbox"><ons-input id = "alert_a'+n+'" type="checkbox"><i class="fa fa-bell" style="font-size:20px"></i></label></span></div><div style="float: left;"><b>Konkurencja2: </b><div class = "input-group"><span class = "input-group-btn"><button style="height: 50px" class = "btn btn-default" type = "button" id="nk2'+n+'" onclick="scanBarcode(this.id)"> <i class="fa fa-barcode" style="font-size:20px"></i> </button></span><input style="height: 50px" type = "text" class =" form-control" id="in_nk2'+n+'"  placeholder="Konkurent(EAN - scan lub nazwa)"><span style="height: 50px" class="input-group-addon" style="border-left: 0; border-right: 0;">Cena:</span><input style="height: 50px" type="number" step="0.01" id="in_ck2'+n+'" class ="form-control" placeholder="cena" value=""><span class = "input-group-addon"><input  type = "checkbox" style="display: none;"><label style="margin: 0" class="checkbox"><ons-input id = "alert_b'+n+'" type="checkbox"><i class="fa fa-bell" style="font-size:20px"></i></label></span></div><div style="float: left;"><b>Konkurencja3: </b><div class = "input-group"><span class = "input-group-btn"><button style="height: 50px" class = "btn btn-default" type = "button" id="nk3'+n+'" onclick="scanBarcode(this.id)"> <i class="fa fa-barcode" style="font-size:20px"></i> </button></span><input style="height: 50px" type = "text" class =" form-control" id="in_nk3'+n+'"  placeholder="Konkurent(EAN - scan lub nazwa)"><span class="input-group-addon" style="height: 50px" style="border-left: 0; border-right: 0;">Cena:</span><input style="height: 50px" type="number" step="0.01" id="in_ck3'+n+'" class ="form-control" placeholder="cena" value=""><span class = "input-group-addon"><input  type = "checkbox" style="display: none;"><label style="margin: 0" class="checkbox"><ons-input id = "alert_c'+n+'" type="checkbox"><i class="fa fa-bell" style="font-size:20px"></i></label></span></div></div></div></div></div><button type="button" class="btn btn-primary btn-lg btn-block" onclick="type_polka()"><ons-icon icon="ion-ios-camera-outline" class="ons-icon ons-icon--ion ion-ios-camera-outline"></ons-icon> Zrób zdjęcie</button>';
        add_element(produkt_vs_konkurent);
    }else if(str_selected == "TAK/NIE") {
        var yes_no = '<div class="row"><div class="col-md-6"><div id="question_'+n+'"><div class="form-group" ng-controller="RadioController"><label for="happy" class="col-sm-4 col-md-4 control-label text-right"><p id="p_chb'+n+'" style="font-weight: bold;">Moj text</p></label><div class="col-sm-7 col-md-7"><div class="button-bar"  style="width:80%;"><div class="button-bar__item"><input type="radio" name="'+n+'" id="Check_'+n+'" onclick="yesnoCheck(this.id);" ><button class="button-bar__button">TAK</button></div><div class="button-bar__item"><input type="radio" name="'+n+'" onclick="yesnoCheck(this.id);" id="yesCheck_'+n+'"><button class="button-bar__button">NIE</button></div></div></div></div></div></div><div id="element_yesCheck_'+n+'" style="display:none" class="col-md-6"><label class="checkbox" style="margin-top: 15px;"><ons-input type="checkbox" id="possible_'+n+'">Czy jest możliwość wstawienia ?</label><br /><br/></div></div>';
        add_element(yes_no);
    }else if(str_selected == "dostepnosc") {
        var str_dostepnosc = '<div id="question_'+n+'" style="font-size: 14px;"><div style="clear:both"><p id="p_chb'+n+'" style="font-weight: bold;">Moj text</p></div><p style="font-size: 14px; margin-bottom: 5px;">Dostępność :</p><label class="checkbox" style="margin-right: 8px; font-size: 12px;"><ons-input type="checkbox" id="chb_o'+n+'"> Oddział</label><label class="checkbox" style="font-size: 12px;"> <ons-input type="checkbox" id="chb_mc'+n+'">Magazyn centralny</label></div>'; var div = document.createElement('div');
        add_element(str_dostepnosc);
    }else if(str_selected == "cena_dostepnosc") {
        var str_cena_dostep = '<div id="question_'+n+'"><div style="clear:both"><p id="p_chb'+n+'" style="font-weight: bold;">Moj text</p></div><ons-col><div style="float: left;">Dostępność : <br /><label class="checkbox" style="margin-right: 4px; font-size: 12px;"><ons-input type="checkbox" id="chb_o'+n+'">Oddział</label><label class="checkbox" style="font-size: 12px;"><ons-input type="checkbox" id="chb_mc'+n+'"> Magazyn centralny</label><input type="number" step="0.01" id="in_c'+n+'" class="text-input text-input--underbar" placeholder="cena" value="" style="width: 50px; margin-left: 4px; margin-top: 5px; font-size: 11px;"><input type="text" id="in_k'+n+'" class="text-input text-input--underbar" placeholder="komentarz" value="" style="margin-left: 4px; margin-top: 5px; font-size: 11px; width: 110px;"></div></ons-col></div>'; 
        add_element(str_cena_dostep);
    }
 }
function add_element(element_){
    var div1 = document.createElement('div');
    div1.id = '_'+clicks;
    document.getElementById('form-element').appendChild(div1); 
    var div = document.createElement('div');
    div.id = 'elements';
    div.innerHTML += element_ ;
    document.getElementById('_'+clicks).appendChild(div); 
    i++;
}
function removeElement() {
    var d = document.getElementById("_1"); 
    var d_zagniezdzony = document.getElementById("_1").lastChild; 
    var usuwany_wezel = d.removeChild(d_zagniezdzony);
	if (n > 0) {
		n = n - 1;
	}else {
        n = 0;
    }
}

function removeElement_without() 
{
    // Removes an element from the document
    var d = document.getElementById("_1"); 
    var d_zagniezdzony = document.getElementById("_1").lastChild; 
    var usuwany_wezel = d.removeChild(d_zagniezdzony);
}
