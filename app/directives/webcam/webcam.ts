import {Component, Input, OnDestroy, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FaceTracker} from "./FaceTracker"
@Component({

  selector: 'webcam',
  templateUrl: './app/directives/webcam/webcam.html',
  styleUrls: ['./app/directives/webcam/webcam.css']
})

export class Webcam implements OnInit, AfterViewInit {
  private _videosrc: string;
  @ViewChild("video") private _videoCamElem: ElementRef;
  @ViewChild("overlay") private _overlay: ElementRef;
  @ViewChild("picture") private _picture: ElementRef;
  private _overlayCC: ElementRef;
  private _constraints: any = {
    video: {
      mandatory: { minAspectRatio: 1.333, maxAspectRatio: 1.334 },
      optional: [
        { minFrameRate: 60 },
        { maxWidth: 900 },
        { maxHeigth: 1000 },
        { minWidth: 120 },
        { minHeigth: 300 }
      ]
    }
  };
  constructor(myElement: ElementRef) {

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
    //  this._videoCamElem = myElement;

    this.startVideo();

  }

  private startVideo() {

    var promise = new Promise<MediaStream>((resolve, reject) => {
      navigator.getUserMedia(this._constraints, (stream) => {
        resolve(stream);
      }, (err) => reject(err));
    }).then((stream) => {
      this._videosrc = URL.createObjectURL(stream);
    }
      ).catch(this.logError);
  }

  private ctrack() {
    var track = new FaceTracker(this._videoCamElem, this._overlay,this._picture, true);
    track.startTracke();
  }
  private gotStream(stream: any) {
    stream.getTracks().forEach(function(track: any) {
      track.onended = function() {

      };
    });
  }

  private logError(error: any) {
    console.log(error.name + ": " + error.message);
  }

  ngOnInit() {
    var el = this._videoCamElem;

    //    console.log(el);
  }
  ngAfterViewInit() {
    var el = this._overlay;
    this._overlayCC = this._overlay.nativeElement.getContext('2d');
    this.ctrack();
  }
  get videosrc(): string {
    return this._videosrc;
  }
  set videosrc(videosrc: string) {
    this._videosrc = videosrc;
  }

}
