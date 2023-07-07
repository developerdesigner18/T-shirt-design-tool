import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss'],
})
export class ThirdComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;
  canvas!: fabric.Canvas;
  text: string = '';
  textColor: string = '#000000';
  textFontSize: number = 20;
  textFontFamily: string = 'Arial';
  showPreview: boolean = false;
  previewImageUrl: string = '';

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasEl.nativeElement);
    this.canvas.setWidth(223);
    this.canvas.setHeight(430);

    // fabric.Image.fromURL('../../assets/white_t-shirt.png', (tshirtImg) => {
    //   this.canvas.setBackgroundImage(tshirtImg, this.canvas.renderAll.bind(this.canvas));
    // });
  }

  handleUserImageUpload(event: any) {
    const files = event.target.files;
    const fileCount = files.length;
    let filesProcessed = 0;

    for (let i = 0; i < fileCount; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const userImage = new Image();
        userImage.src = e.target.result;

        userImage.onload = () => {
          const fabricUserImage = new fabric.Image(userImage);

          // Calculate the scale based on canvas and image dimensions
          const canvasWidth = this.canvas.getWidth();
          const canvasHeight = this.canvas.getHeight();
          const imageWidth = userImage.width;
          const imageHeight = userImage.height;
          let scaleX = 1;
          let scaleY = 1;

          // Calculate the desired width and height for the image
          let desiredWidth = canvasWidth * 0.5; // Adjust the scaling factor as needed
          let desiredHeight = canvasHeight * 0.5; // Adjust the scaling factor as needed

          // Adjust the desired dimensions to maintain the image's aspect ratio
          const imageAspectRatio = imageWidth / imageHeight;
          const canvasAspectRatio = canvasWidth / canvasHeight;

          if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than the canvas
            desiredHeight = desiredWidth / imageAspectRatio;
          } else {
            // Image is taller or has a similar aspect ratio to the canvas
            desiredWidth = desiredHeight * imageAspectRatio;
          }

          // Resize the image to the desired dimensions
          const resizedImage = this.resizeImage(
            userImage,
            desiredWidth,
            desiredHeight
          );

          // Calculate the scale based on the resized image dimensions
          scaleX = desiredWidth / imageWidth;
          scaleY = desiredHeight / imageHeight;

          fabricUserImage.set({
            scaleX: scaleX,
            scaleY: scaleY,
          });

          this.canvas.add(fabricUserImage);
          this.canvas.centerObject(fabricUserImage);
          this.canvas.renderAll();
          filesProcessed++;

          if (filesProcessed === fileCount) {
            // All images have been processed
            // Perform any additional actions here
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }

  resizeImage(
    image: HTMLImageElement,
    width: number,
    height: number
  ): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context: any = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    const resizedImage = new Image();
    resizedImage.src = canvas.toDataURL('image/png');

    return resizedImage;
  }

  addText() {
    if (this.canvas) {
      const canvasWidth = this.canvas.width || 0;
      const canvasHeight = this.canvas.height || 0;

      const textObject = new fabric.Text(this.text, {
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'black',
      });

      this.canvas.add(textObject);
      this.canvas.renderAll();
      this.text = ''; // Clear the text input after adding text
    }
  }

  changeTextColor() {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.set('fill', this.textColor);
        this.canvas.renderAll();
      }
    }
  }

  changeTextFontSize() {
    if (this.canvas) {
      const activeObject: any = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.set({ fontSize: this.textFontSize });
        this.canvas.renderAll();
      }
    }
  }

  changeTextFontFamily() {
    if (this.canvas) {
      const activeObject: any = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.set({ fontFamily: this.textFontFamily });
        this.canvas.renderAll();
      }
    }
  }

  previewDesign() {
    if (this.canvas) {
      const previewCanvas = this.canvas.toDataURL('image/png' as any);
      this.previewImageUrl = previewCanvas;
      this.showPreview = true;
    }
  }
}
