import {ElementRef} from '@angular/core';
import {EmotionClassifier} from './emotionClassifier';
const Tracker = require('./lib/clmtrackr.js');
//const Nativemodel = require('./lib/model_pca_20_svm.js');
const faceModel = require('./lib/model_pca_20_svm.js');
export class FaceTracker {

  private _video: ElementRef;
  private _videoReady: boolean = false;
  private _overlayCC: ElementRef;
  private _picture: ElementRef;
  private _ctracker: any;
  private _positions: any;
  private _emotion: EmotionClassifier;

  constructor(video: ElementRef, overlayCC: ElementRef, picture: ElementRef, videoReady: boolean) {
    this._video = video;
    this._overlayCC = overlayCC;
    this._videoReady = videoReady;
    this._picture = picture;
    this._emotion = new EmotionClassifier();
  }


  public startTracke() {
    this._ctracker = new Tracker.tracker();
    this._ctracker.init(faceModel);

    this._ctracker.start(this._video.nativeElement);

    this.drawLoop();
    //  this.positionLoop();
  }

  private drawLoop = () => {
    var canvasInput = this._overlayCC.nativeElement;

    if (this._ctracker.getCurrentPosition()) {


      var cc = canvasInput.getContext('2d');


      cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
      this._ctracker.draw(canvasInput);
      var positions = this._ctracker.getCurrentParameters();
      var er = this._emotion.meanPredict(positions)

      var positions = this._ctracker.getCurrentParameters();
      var er = this._emotion.meanPredict(positions)

      if (er) {
        var positionString = "";
        for (var p = 0; p < er.length; p++) {

          positionString += "emotion " + er[p]["emotion"] + " : [" + er[p]["value"].toFixed(1) + "]<br/>";
          if (er[p]["emotion"] == "happy") {
            console.log(er[p]["value"].toFixed(1))
            if (er[p]["value"].toFixed(1) > 70) {
              this.takeApicture(canvasInput);
            }
          }
        }


        document.getElementById('positions').innerHTML = positionString;
      }
    }

    requestAnimationFrame(this.drawLoop);
  }

  private positionLoop = () => {


    var positions = this._ctracker.getCurrentPosition();
    //    console.log(" position " +positions)
    // do something with the positions ...
    // print the positions
    var positionString = "";
    if (positions) {
      for (var p = 0; p < 36; p++) {
        positionString += "featurepoint " + p + " : [" + positions[p][0].toFixed(2) + "," + positions[p][1].toFixed(2) + "]<br/>";
      }
      document.getElementById('positions').innerHTML = positionString;
    }
    requestAnimationFrame(this.positionLoop);
  }

  private takeApicture(canvasInput:any) {
    var picture = this._picture.nativeElement;
    var picturcc = picture.getContext('2d');

    picturcc.drawImage(this._video.nativeElement, 0, 0, canvasInput.width, canvasInput.height);
  }

}
