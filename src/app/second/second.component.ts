import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { tshirt } from '../t-shirts';
import { DataService } from './../service/data.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss']
})
export class SecondComponent implements OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  canvas!: fabric.Canvas | any;
  tshirt!: fabric.Object | any;
  tshirtArea!: fabric.Rect | any; // Add tshirtArea property
  position = { top: 0, left: 0 };
  tshirtGroup!: fabric.Group | any;
  showPreview = false;
  previewImageUrl = '';
  t_shirt: any = tshirt
  displayT_shirt: any
  selectedTshirt:any;
  textColor = '#000000';

  constructor(private DataService: DataService) { }

  ngOnInit() {
    this.displayT_shirt= this.t_shirt[0].src
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasRef?.nativeElement);
    this.createTshirt();
    this.createTshirtArea(); // Create the t-shirt area on the canvas

  }

  changeColor(data: any) {
    this.selectedTshirt = data;
    this.displayT_shirt = data.src;
    this.createTshirt();
  }


  createTshirtArea() {
    this.tshirtArea = new fabric.Rect({
      left: 100, // Define the left position of the t-shirt area
      top: 100, // Define the top position of the t-shirt area
      width: 400, // Define the width of the t-shirt area
      height: 500, // Define the height of the t-shirt area
      fill: 'transparent', // Set the fill color of the t-shirt area to transparent
      selectable: false, // Make the t-shirt area not selectable
      evented: false // Make the t-shirt area not trigger events
    });

    this.canvas?.add(this.tshirtArea);
    this.canvas?.sendToBack(this.tshirtArea); // Send the t-shirt area to the back of the canvas
  }

  createTshirt() {
    // Remove previous t-shirt from canvas
    if (this.tshirt) {
      this.canvas.remove(this.tshirt);
    }

    fabric.Image.fromURL(this.displayT_shirt, (img) => {
      const tshirtWidth = img.width;
      const tshirtHeight = img.height;

      this.canvas.setDimensions({
        width: tshirtWidth,
        height: tshirtHeight
      });

      img.set({
        selectable: false,
        left: 0,
        top: 0
      });

      this.tshirt = img;
      this.canvas.add(this.tshirt);
    }, { crossOrigin: 'Anonymous' });
  }




  changeTshirtColor(event: any) {
    const color = event.target.value;
    if (this.tshirt !== null) {
      this.tshirt.set('fill', color);
      this.canvas.renderAll();
    }
  }



  uploadImage(event: any) {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imgObj = new Image();
      imgObj.src = e.target.result;

      imgObj.onload = () => {
        const desiredWidth = 200; // Specify the desired width
        const desiredHeight = 200; // Specify the desired height

        fabric.Image.fromURL(imgObj.src, (fabricImg) => {
          fabricImg.scaleToWidth(desiredWidth);
          fabricImg.scaleToHeight(desiredHeight);

          // Center the image in the canvas
          fabricImg.set({
            left: (this.canvas?.getWidth() ?? 0) / 2 - fabricImg.getScaledWidth() / 2,
            top: (this.canvas?.getHeight() ?? 0) / 2 - fabricImg.getScaledHeight() / 2,
            selectable: true,
            lockMovementX: false, // Enable movement along the X axis
            lockMovementY: false // Enable movement along the Y axis
          });

          this.canvas?.add(fabricImg);
          this.canvas?.setActiveObject(fabricImg);
        });
      };
    };

    reader.readAsDataURL(file);
  }









  isImageWithinTshirtArea(image: fabric.Image): boolean {
    const tshirtAreaBounds = this.tshirtArea.getBoundingRect();
    const imageBounds = image.getBoundingRect();

    const imageCenterX = imageBounds.left + imageBounds.width / 2;
    const imageCenterY = imageBounds.top + imageBounds.height / 2;

    return (
      imageCenterX >= tshirtAreaBounds.left &&
      imageCenterX <= tshirtAreaBounds.left + tshirtAreaBounds.width &&
      imageCenterY >= tshirtAreaBounds.top &&
      imageCenterY <= tshirtAreaBounds.top + tshirtAreaBounds.height
    );
  }

  addText() {
    const text = new fabric.IText('Enter text', {
      left: (this.canvas?.getWidth() ?? 0) / 2,
      top: (this.canvas?.getHeight() ?? 0) / 5,
      fontSize: 20
    });

    this.canvas?.add(text);
    this.canvas?.setActiveObject(text);
  }

  previewTshirt() {
    this.showPreview = true;
    this.previewImageUrl = this.canvas.toDataURL();
  }

  changeTextColor() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject instanceof fabric.IText) {
      activeObject.set('fill', this.textColor);
      this.canvas.renderAll();
    }
  }


}
