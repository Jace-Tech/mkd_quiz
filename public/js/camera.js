const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
if(webcamElement && canvasElement && snapSoundElement){
  const webcam = new Webcam(
    webcamElement,
    'user',
    canvasElement,
    snapSoundElement,
  );
  
  webcam
    .start()
    .then((result) => {
      console.log('webcam started');
    })
    .catch((err) => {
      console.log(err);
    });
  
  var picture = webcam.snap();
}
