import {Component} from '@angular/core';
import {Webcam} from './directives/webcam/webcam';
@Component({
    selector: 'faceTrack-app',
    template: '<webcam></webcam>',
    directives: [Webcam]
})
export class AppComponent {
         title="faceTrack";
 }
