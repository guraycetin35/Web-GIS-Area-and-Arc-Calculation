/**
 * Created by Güray on 30.10.2016.
 */
//Global değişken tanımları ellipsiod types
var elipsoid={
    "grs80":{
        "a":6378137,"b":6356752.314,"c":6399593.626,
        "e2":0.00669438,"ei2":0.0067394968,
        "alfa":6367449.145771,"beta":16038.508742,"gama":16.832613,"teta":0.021984,"eta":0.000031},
   "hayford":{
       "a":6378388,"b":6356911.946,"c":6399936.608,
       "e2":0.00672267,"ei2":0.00676817,
       "alfa":6367654.500058,"beta":16107.034679,"gama":16.976211,"teta":0.022266,"eta":0.000032
   },

    "bessel":{
        "a":6377397.155,"b":6356078.963,"c":6398786.849,
        "e2":0.00667437,"ei2":0.00671922,
        "alfa":6366742.519778,"beta":15988.639219,"gama":16.729955,"teta":0.021785,"eta":0.000031
    }
}


//cos ve sin degerleri radyan aldığı için çevirici oluşturuyoruz

function der2rad(a){return (Math.PI*parseFloat(a))/180;}
function rad2der(a){return (180*parseFloat(a))/Math.PI;}

// V değerimizi global değişken tanımladık
function V(enlem,ei2) {
    return Math.sqrt(1 + ei2 * Math.pow(Math.cos(enlem), 2));
}

//Alan Hesabı formülü
function alanhesapla() {
    var enlem1 = document.getElementById("enlem1").value;
    enlem1 = parseFloat(enlem1);
    var boylam1 = document.getElementById("boylam1").value;
    boylam1 = parseFloat(boylam1);
    var enlem2 = document.getElementById("enlem2").value;
    enlem2 = parseFloat(enlem2);
    var boylam2 = document.getElementById("boylam2").value;
    boylam2 = parseFloat(boylam2);
    var elipsoidadi = document.getElementById("elipsoitlistesi").value;

    //pafta çizimi için 4 nokta tanımladık
    pafta = {
        nokta1:{enlem:enlem1,boylam:boylam1},
        nokta2:{enlem:enlem2,boylam:boylam1},
        nokta3:{enlem:enlem2,boylam:boylam2},
        nokta4:{enlem:enlem1,boylam:boylam2}};
    paftaortasi();

    var enlem1 = der2rad(enlem1);
    var boylam1 = der2rad(boylam1);
    var enlem2 = der2rad(enlem2);
    var boylam2 = der2rad(boylam2);



    var b = elipsoid[elipsoidadi].b / 1000;
    var e2 = elipsoid[elipsoidadi].e2;
    var deltarad=boylam2-boylam1;

    var islem1 = ((Math.pow(b,2)*deltarad)/2);
    var islem2 = (Math.sin(enlem2)/(1-e2*Math.pow(Math.sin(enlem2),2)))+((1/(2*Math.sqrt(e2)))*Math.log((1+Math.sqrt(e2)*Math.sin(enlem2))/(1-Math.sqrt(e2)*Math.sin(enlem2))));
    var islem3 = (Math.sin(enlem1)/(1-e2*Math.pow(Math.sin(enlem1),2)))+((1/(2*Math.sqrt(e2)))*Math.log((1+Math.sqrt(e2)*Math.sin(enlem1))/(1-Math.sqrt(e2)*Math.sin(enlem1))));
    var sonuc = islem1*(islem2-islem3);

    var sonuc=Math.abs(sonuc);


    document.getElementById("alansonucu").innerHTML = sonuc+" km2";

}


//haritayı ve nokta tanımı yaptık. False diyerek içinin boş olduğunu varsaydırdık false ise 0 dır


    var map,noktalar={nokta1:{durum:false,enlem:0,boylam:0},nokta2:{durum:false,enlem:0,boylam:0}};

//çizilecek paftada  bir tanımlama yaptık
    var pafta = {
        nokta1:{enlem:0,boylam:0},
        nokta2:{enlem:0,boylam:0},
        nokta3:{enlem:0,boylam:0},
        nokta4:{enlem:0,boylam:0}};

    var alanolc = false; var uzunlukolc = false;


    function initialize() {
        var myLatLng = new google.maps.LatLng(38.02693029736395, 32.51078939450963);
        var mapdiv = document.getElementById('map');
        var mapOptions = {
            center: myLatLng
            , zoom: 15
            , scaleControl: true
            , zoomControl: true
            , panControl: true
            , map: mapdiv
            , mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapdiv,mapOptions);
        map.setOptions({ draggableCursor: 'crosshair' });

        //haritadan tıklamayla enlem boylam bilgilerini alma

        google.maps.event.addListener(map, 'click', function(event) {
            var deger = event.latLng;
            var enlem = deger.lat();
            var boylam = deger.lng();

            if(noktalar.nokta1.durum==false){
                noktalar.nokta1.enlem=enlem;
                noktalar.nokta1.boylam=boylam;
                noktalar.nokta1.durum=true;
                document.getElementById("enlem1").value = enlem;
                document.getElementById("boylam1").value = boylam;
            }
            else{
                if(noktalar.nokta2.durum==false){
                    noktalar.nokta2.enlem=enlem;
                    noktalar.nokta2.boylam=boylam;
                    noktalar.nokta2.durum=true;
                    document.getElementById("enlem2").value = enlem;
                    document.getElementById("boylam2").value = boylam;
                }
            }


        });
}

var poligon;
var acizgi,acizgi2,bcizgi,ccizgi;

document.getElementById("alanhesapla").addEventListener("click", function(){
    var elipsoidadi = document.getElementById("elipsoitlistesi").value;
    if(elipsoidadi!=="0"){

        if(noktalar.nokta1.durum==true && noktalar.nokta2.durum==true){
            if(alanolc==false){
                alanolc=true;

                alanhesapla();
                var cizilecekalan = [
                    {lat: pafta.nokta1.enlem, lng: pafta.nokta1.boylam},
                    {lat: pafta.nokta3.enlem, lng: pafta.nokta3.boylam}
                ];

                    poligon = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map:map,
                    bounds:new google.maps.LatLngBounds(
                        new google.maps.LatLng(Math.min(pafta.nokta1.enlem,pafta.nokta3.enlem),Math.min(pafta.nokta1.boylam,pafta.nokta3.boylam) ),
                        new google.maps.LatLng(Math.max(pafta.nokta1.enlem,pafta.nokta3.enlem),Math.max(pafta.nokta1.boylam,pafta.nokta3.boylam) )
                    )

                });
                poligon.setMap(map);
                map.setCenter(new google.maps.LatLng(pafta.ortaenlem,pafta.ortaboylam));
            }

        }
    }
});


//uzunluk hesabı formülü

function uzunlukhesapla(){
    var elipsoidadi = document.getElementById("elipsoitlistesi").value;
    var enlem1 = document.getElementById("enlem1").value; enlem1 = parseFloat(enlem1);
    var boylam1 = document.getElementById("boylam1").value; boylam1 = parseFloat(boylam1);
    var enlem2 = document.getElementById("enlem2").value; enlem2 = parseFloat(enlem2);
    var boylam2 = document.getElementById("boylam2").value; boylam2 = parseFloat(boylam2);

    pafta = {
        nokta1:{enlem:enlem1,boylam:boylam1},
        nokta2:{enlem:enlem2,boylam:boylam1},
        nokta3:{enlem:enlem2,boylam:boylam2},
        nokta4:{enlem:enlem1,boylam:boylam2}};
    paftaortasi();

    enlem1 = der2rad(enlem1);
    boylam1 = der2rad(boylam1);
    enlem2 = der2rad(enlem2);
    boylam2 = der2rad(boylam2);

    var g1 = elipsoid[elipsoidadi].alfa*enlem1-elipsoid[elipsoidadi].beta*Math.sin(2*enlem1)+elipsoid[elipsoidadi].gama*Math.sin(4*enlem1)-elipsoid[elipsoidadi].teta*Math.sin(6*enlem1)+elipsoid[elipsoidadi].eta*Math.sin(8*enlem1);
    var g2 = elipsoid[elipsoidadi].alfa*enlem2-elipsoid[elipsoidadi].beta*Math.sin(2*enlem2)+elipsoid[elipsoidadi].gama*Math.sin(4*enlem2)-elipsoid[elipsoidadi].teta*Math.sin(6*enlem2)+elipsoid[elipsoidadi].eta*Math.sin(8*enlem2);
    var a = g1-g2; a = Math.abs(a);

    var v = V(enlem1,elipsoid[elipsoidadi].ei2);
    var N = elipsoid[elipsoidadi].c/v;
    var L = N*Math.cos(enlem1)*(boylam2-boylam1); L = Math.abs(L);

    var v2 = V(enlem2,elipsoid[elipsoidadi].ei2);
    var N2 = elipsoid[elipsoidadi].c/v2;
    var L2 = N2*Math.cos(enlem2)*(boylam2-boylam1); L2 = Math.abs(L2);

    document.getElementById("uzunluksonucu").innerHTML='<span style="color: red;">a:</span>'+a+' m <br>'+'<span style="color: green;">b:</span>'+L+' m <br>'+'<span style="color: blue;">c:</span>'+L2+" m ";
}



document.getElementById("uzunlukhesapla").addEventListener("click", function() {
    var elipsoidadi = document.getElementById("elipsoitlistesi").value;
    if(elipsoidadi!=="0"){
        if(noktalar.nokta1.durum==true && noktalar.nokta2.durum==true){
            if (uzunlukolc == false) {
                uzunlukolc=true;
                var enlem1denetle = document.getElementById("enlem1").value;
                enlem1denetle = parseFloat(enlem1denetle);
                var enlem2denetle = document.getElementById("enlem2").value;
                enlem2denetle = parseFloat(enlem2denetle);
                var renkb = '#00FF00';
                var renkc = '#0000FF';
                if (enlem1denetle > enlem2denetle) {
                    renkc = '#00FF00';
                    renkb = '#0000FF';
                }
                uzunlukhesapla();
                var acizgisi = [
                    {lat: pafta.nokta3.enlem, lng: pafta.nokta3.boylam},
                    {lat: pafta.nokta4.enlem, lng: pafta.nokta4.boylam}
                ];
                acizgi = new google.maps.Polyline({
                    path: acizgisi,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                acizgi.setMap(map);

                var a2cizgisi = [
                    {lat: pafta.nokta1.enlem, lng: pafta.nokta1.boylam},
                    {lat: pafta.nokta2.enlem, lng: pafta.nokta2.boylam}
                ];
                acizgi2 = new google.maps.Polyline({
                    path: a2cizgisi,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                acizgi2.setMap(map);

                var bcizgisi = [
                    {lat: pafta.nokta4.enlem, lng: pafta.nokta4.boylam},
                    {lat: pafta.nokta1.enlem, lng: pafta.nokta1.boylam}
                ];
                bcizgi = new google.maps.Polyline({
                    path: bcizgisi,
                    geodesic: true,
                    strokeColor: renkb,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                bcizgi.setMap(map);


                var ccizgisi = [
                    {lat: pafta.nokta3.enlem, lng: pafta.nokta3.boylam},
                    {lat: pafta.nokta2.enlem, lng: pafta.nokta2.boylam}
                ];
                ccizgi = new google.maps.Polyline({
                    path: ccizgisi,
                    geodesic: true,
                    strokeColor: renkc,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                ccizgi.setMap(map);
                map.setCenter(new google.maps.LatLng(pafta.ortaenlem,pafta.ortaboylam));
            }else{
                alert("For second calculation , please clean the inputs");
            }
        }else{
            alert("Be sure adding inputs, in case of problem refresh the page");
        }
    }else{

        alert("Please choose an ellipsoid");
    }
});

document.getElementById("temizle").addEventListener("click", function(){
    if(alanolc==true){
        poligon.setMap(null);
        alanolc=false;
    }
    if(uzunlukolc==true){
        acizgi.setMap(null);
        acizgi2.setMap(null);
        bcizgi.setMap(null);
        ccizgi.setMap(null);
        uzunlukolc=false;
        document.getElementById("uzunluksonucu").innerHTML='';
    }


});




setTimeout(function(){
    document.getElementById("map").removeAttribute("style");
    document.getElementById("map").setAttribute("class","map2");
},200);




function formutemizle() {
    document.getElementById("enlem1").value = '';
    document.getElementById("boylam1").value = '';
    document.getElementById("enlem2").value = '';
    document.getElementById("boylam2").value = '';
    document.getElementById("alansonucu").innerHTML = '';
    document.getElementById("uzunluksonucu").innerHTML = '';
    noktalar={nokta1:{durum:false,enlem:0,boylam:0},nokta2:{durum:false,enlem:0,boylam:0}};
}

function paftaortasi(){
    var enlem1 = pafta.nokta1.enlem;
    var boylam1 = pafta.nokta1.boylam;
    var enlem3 = pafta.nokta3.enlem;
    var boylam3 = pafta.nokta3.boylam;
    var ortaenlem = (enlem3+enlem1)/2; ortaenlem=Math.abs(ortaenlem);
    var ortaboylam = (boylam3+boylam1)/2; ortaboylam=Math.abs(ortaboylam);
    pafta.ortaenlem = ortaenlem;
    pafta.ortaboylam = ortaboylam;
}





