
$(document).ready(function(){

  var url_base = 'http://157.230.17.132:4009/sales';



  $.ajax({
    'url': url_base,
    'method': 'GET',
    'success':function(response){

      // GRAFICO1 PER LE VENDITE PER LE VENDITE ANNUALI



      //so che dovrò avere delle label con tutti i mese_vendita
      var mesi={
        'gennaio':0,
        'febbraio':0,
        'marzo':0,
        'aprile':0,
        'maggio':0,
        'giugno':0,
        'luglio':0,
        'agosto':0,
        'settembre':0,
        'ottobre':0,
        'novembre':0,
        'dicembre':0
      };

      // richiamo la funzione che mi popola le select
      disegna_select(response, mesi);

      // ciclo i risultati della risposta
      for (var i = 0; i < response.length; i++) {
        // salvo l'oggetto corrente in una variabile
        var vendita = response[i];
        // di questo oggetto mi prendo l'importo vendite
        var importo = vendita.amount;
        // recupero quindi anche la data nel formato 12/02/2017
        var data_vendita = vendita.date;
        // costruisco un oggetto moment con il formato corretto
        var data_moment = moment(data_vendita,'DD/MM/YYY');
        // mi prendo il mese in formato letterele
        var mese_vendita= data_moment.locale('it').format('MMMM');
        // prenso il l'oggetto mesi di questo prendo il mese_vendita che corrisponde al mese che leggo nell'array del ciclo for e vado a impostare come valore l'amount ovvero l'importo della vendita
        mesi[mese_vendita] += importo;
      }
      // mi preparo le variabili da passare al grafico
      // in pratica con object.keys vado a prendermi le chiavi del mio oggetto e a salvarle in una variabile
      // con object.lavlues mi prendo invecei valoci associati alle mie  chiavi
      var label_mesi = Object.keys(mesi);
      var dati_mesi = Object.values(mesi);

      // quindi ora con i miei dati preparati vado a passarli alla mia funzione
      disegna_grafico_vendite_annuali(label_mesi , dati_mesi);

      // GRAFICO 2 VENDITE PER VENDITORE
      var vendite ={};
      var totale_vendite=0;

      // ciclo i risultati e creo un oggetto con chiavi = a venditore e ovalore = venduto

      for (var i = 0; i < response.length; i++) {
        // prenso l'elemento attuale del mio array
        var vendita = response[i];
        // recupero le vendite e il venditore corrente
        var venditore = vendita.salesman;
        var importo = vendita.amount;
        // recupero le chiavi inserite in vendite
        var venditori_inseriti = Object.keys(vendite);


        // controllo se la chiave è stata aggiunta
        if(!venditori_inseriti.includes(venditore)){
          vendite[venditore]=importo;
        }else{
          vendite[venditore] += importo;
        }
        totale_vendite+=importo;
      }

      // imposto un controllo per vedere se vendite è maggiore di 0
      if(totale_vendite > 0){
        // questo ciclo mi serve per creare le percentuali
        for (var venditore in vendite) {
           var totale_vendite_venditore = vendite[venditore];
           var percentuale_vendite_venditore = totale_vendite_venditore *100 / totale_vendite;
           vendite[venditore]=percentuale_vendite_venditore.toFixed(1);
        }
        // recuper dal mio oggetto vendite prima le chiavi e poi i valori delle chiavi e me li salvo in una variabile così da poter passare questi dati alla funzione che mi disegnerà il
        // grafico
        var label_venditori = Object.keys(vendite);
        var dati_vendite_per_venditore = Object.values(vendite);

        //ora chiamo la funzione che mi disegna il grafico 2
        disegna_grafico_vendite_venditore(label_venditori, dati_vendite_per_venditore);
      }


    },
    'error':function(){
      alert('qualcosa non ha funzionato');
    }

  });

  // FINE CHIAMATA GET

  // EFFETTUO UNA CHIAMATA POST A SALES PER IMPOSTARE NUOVI valori

  $('#invia').click(function(){

    var venditore = $('.venditori').val();
    var mese = $('.mesi').val();
    var data_moment = moment(mese,'MM');
    var mese_vendita= data_moment.locale('it').format('MM');

    var importo= $('#valore_vendita').val();

    $.ajax({
      'url' :url_base,
      'method': 'POST',
      // gli passo il testo scritto in input dall'utente
      'data':{
       'salesman': venditore,
       'amount':importo,
       'date': mese_vendita
      },
      'success': function(data){


      },
      'error': function(){
        alert('qualcosa è andato storto')
      }
    });

  });




// FUNZIONE CHE MI DISEGNA LE SELECT
  function disegna_select(dati_ingresso, mesi){
    // salvo i venditori che trovo in un array
    var venditori =[];
   // mi etraggo le chiavi dall'oggetto mesi così da avere i mesi e salvarli nelle select
    var mese_correnti = Object.keys(mesi);

   // tramite un ciclo mi salvo i venditori in un array che userò per popolare la mia select
    for (var i = 0; i < dati_ingresso.length; i++) {
      var venditore = dati_ingresso[i].salesman;
      if(!venditori.includes(venditore)){
        venditori.push(venditore);
      }
    }
    for (var i = 0; i < venditori.length; i++) {
      $('.venditori').append("<option>"+venditori[i]+"</option>");
    }

      var mese_correnti = Object.keys(mesi);
      for (var i = 0; i < mese_correnti.length; i++) {
        $('.mesi').append("<option>"+mese_correnti[i]+"</option>");
      }


  }


  function disegna_grafico_vendite_venditore(label, data){

    var primo_pie_chart =$('#grafico_2');
    var myChart = new Chart(primo_pie_chart, {
        type: 'pie',
        data: {
          'datasets':[{
            'data': data,
            'backgroundColor':['red','yellow','blue','green']
          }],
          'labels': label
        },
        'options':{
          'title':{
            'display': true,
            'text': 'Vendite per venditore nel 2017',
          },
          'tooltips':{
            'callbacks':{
              'afterLabel':function(tooltipItem, data){
                var dataset = data['datasets'][0];
                return
              }
            }
          }
        }

    });

  }

  // FUNZIONE CHE MI DISEGNA IL GRAFICO DI VENDITE ANNUALI

  function disegna_grafico_vendite_annuali(mesi , importi){

  var primo_chart =$('#grafico_1');
  var chart = new Chart(primo_chart, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: mesi,
        datasets: [{
            label: 'Ventite Totali Anno 2017',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            'fill': 'false',
            data: importi
        }]
    },


    options: {}
});
}


});
