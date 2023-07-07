import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  canvas!: fabric.Canvas;
  tshirtImage!: fabric.Image;
  tshirtColor: string = 'black'; // Default t-shirt color
  overlayRect!: fabric.Rect;
  selectedImage!: fabric.Image;


  constructor(){
    this.loadTshirtImage('../../assets/white_t-shirt.png', 200 , 200);
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: 500, // adjust dimensions as per your requirements
      height: 500,
    });

    this.setupDragAndDrop();
    this.loadTshirtImage('../../assets/white_t-shirt.png', 200 , 200); // Replace 'tshirt-image.jpg' with the actual URL or file path of the t-shirt image
  }

  setupDragAndDrop() {
    const container = this.canvasContainer.nativeElement;

    // Set up drag and drop event handlers
    container.addEventListener('dragover', this.handleDragOver.bind(this));
    container.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const imageUrl = loadEvent.target?.result as string;

        if (imageUrl) {
          this.loadSelectedImage(imageUrl);
        }
      };

      reader.readAsDataURL(file);
    }
  }
  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const imageUrl = loadEvent.target?.result as string;

        if (imageUrl) {
          const width = 200; // Specify the desired width
          const height = 300; // Specify the desired height
          this.loadTshirtImage(imageUrl, width, height);
        }
      };

      reader.readAsDataURL(file);
    }
  }


  loadTshirtImage(imageUrl: string, width: number, height: number) {
    fabric.Image.fromURL(imageUrl, (image) => {
      image.set({
        width: width,
        height: height
      });
      this.canvas.add(image);
      this.canvas.requestRenderAll();
    });
  }

  loadSelectedImage(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (image) => {
      this.selectedImage = image;
      this.canvas.add(this.selectedImage);
      this.canvas.renderAll();
    });
  }

  hexToRgb(hex: string) {
    // Remove the leading '#' if present
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }

    // Split the hex color into RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  }

  updateTshirtColor() {
    if (this.tshirtImage) {
      const canvasElement = this.canvas.getElement();
      const context: any = canvasElement.getContext('2d');
      const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const { data } = imageData;

      const { r, g, b }: any = this.hexToRgb(this.tshirtColor);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] / 255) * r; // Red channel
        data[i + 1] = (data[i + 1] / 255) * g; // Green channel
        data[i + 2] = (data[i + 2] / 255) * b; // Blue channel
      }

      context.putImageData(imageData, 0, 0);
      this.canvas.renderAll();
    }
  }

}
