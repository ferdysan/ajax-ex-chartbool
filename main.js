
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

      console.log(label_mesi);
      console.log(dati_mesi);

    },
    'error':function(){
      alert('qualcosa non ha funzionato');
    }

  });

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
