import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ToastController, ActionSheetController, ModalController } from '@ionic/angular';

import { ProfilePictureComponent } from '../modals/profile-picture/profile-picture.component';
import { profilePhotoModalID } from 'src/app/models/components-id';
import { isDefaultImage } from 'src/app/models/list-models';

@Component({
  selector: 'app-view-profile-pic',
  templateUrl: './view-profile-pic.component.html',
  styleUrls: ['./view-profile-pic.component.scss'],
})
export class ViewProfilePicComponent implements OnInit {

  public hasImage: boolean = false;
  public lastImgSrc: string = "";
  public formData: FormData;

  @Input() icon = "person";
  @Input() userId = "";
  @Input() updateType: 'student' | 'teacher' | ''  = "";
  @Input() public imgSrc: string;
  @Input() canView: boolean = false;
  @Input() type: 'view' | 'upload' = 'view';
  @Input() showEditBtn: boolean = true;
  @Output('changes') changeEvent = new EventEmitter<any>();

  public uploadedImg: string;
  public hasUploadedImage: boolean = false;

  @Output() modalClosed: EventEmitter<any> = new EventEmitter<any>(); 

  constructor(
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() { }

  imgErr(e) {
    this.hasImage = false;
  } 

  imgLoaded(e) {
    this.hasImage = true;
    if(isDefaultImage(this.imgSrc)){
      this.imgSrc = "";
      this.hasImage = false;
    }
  }

  async choosePictureAsync(){
    // if(this.hasUploadedImage) return;
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          icon: 'image',
          text: 'Choose from Gallery',
          cssClass: 'profile-action-sheet-button',
          handler: () => {
            if(!this.canView) {
              this.choosePicture();
            }
            else {
              this.viewPictureAsync('choose');
            }
          }
        },
        {
          icon: 'camera',
          text: 'Take a photo',
          cssClass: 'profile-action-sheet-button',
          handler: () => {
            if(!this.canView) {
              this.takePicture();
            }
            else {
              this.viewPictureAsync('capture');
            }
          }
        },
      ],
      header: 'Profile Photo',
   });

    return await actionSheet.present();
  }

  onPictureChange(event) {
    var fileList = event.target.files;
    var myFile = fileList[0];

    if(!myFile) return;
    
    var fileSize = myFile.size;

    if (fileSize > (1024 * 5000)){
      this.showToast("Choose an image below 5mb");
      return;
    }

    this.formData = new FormData();
    Array.from(event.target.files).forEach((file: File) => {
      this.formData.append('photos', file, file.name);
    });


    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
  
      reader.onload = (loadevent:any) => {
        this.imgSrc = loadevent.target.result;
        this.hasUploadedImage = true;

        this.changeEvent.emit({ event, formData: this.formData, imgSrc: this.imgSrc, hasImg: this.hasUploadedImage });
      }
      reader.readAsDataURL(event.target.files[0]);
    }
   
  }

  async viewPictureAsync(action?: string) {
    if(!this.canView) return;

    const modal = await this.modalCtrl.create({
      component: ProfilePictureComponent,
      id: profilePhotoModalID,
      componentProps: {
        'imgSrc': this.imgSrc,
        'userId': this.userId,
        'updateType': this.updateType,
        action,
      }
    });

    await modal.present();
    await modal.onWillDismiss();
    this.modalClosed.emit();
  }

  takePicture() {
    const input = document.querySelector('#pick-picture-epm') as HTMLInputElement;
    
    input.click();
  }

  choosePicture() {
    const input = document.querySelector('#camera-picture-epm') as HTMLInputElement;
    
    input.click();
  }

  async showToast(message: string) {
    if(!message) message = "";

    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000,
    });

    return await toast.present();
  }

}
