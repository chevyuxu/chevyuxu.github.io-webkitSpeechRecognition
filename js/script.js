$(function(){

  var led,
      $show=$('#show'),
      $on = $('#on'), 
      $off = $('#off'),
      a = 0,
      result;

  var recognition = new webkitSpeechRecognition(); //new 一個語音辨識物件

  //語音辨識參數設定
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "cmn-Hant-TW";
  recognition.status = true;  //手動添加判斷，避免如果五分鐘沒有語音，就會自動停止
  recognition.onstart=function(){
    $show.text('語音辨識中...');
  };
  recognition.onend=function(){
    if(recognition.status === true){
      recognition.start();
    }else{
      $show.text('停止辨識!');
    }
  };

  //裝置連線
  boardReady('你的裝置 ID', function (board) {
    board.systemReset();
    board.samplingInterval = 250;
    led = getLed(board, 10); //設定 LED 為 10 號腳
    recognition.onresult=function(event){
      var i = event.resultIndex;
      var j = event.results[i].length-1;
      result = event.results[i][j].transcript; //取出語音辨識結果
      $show.text(result); //顯示語音辨識結果
      if(result.indexOf('開燈')!== -1){
        led.on();
        $on.addClass('show');
        $off.removeClass('show');
      }else if(result.indexOf('關燈')!== -1){
        led.off();
        $on.removeClass('show');
        $off.addClass('show');
      }
    };
    recognition.start(); 
  });

});