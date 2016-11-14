'use babel';
/*
    Author: Jens Hjalmarsson
    Contact: jens.hjalmarsson@gmail.com

    Description:
    Atom plugin for grabbing pixelcolor(#hex) from image and saved to clipboard.
*/
var eyedropper = function(image){
        if(image.nodeName != 'IMG'){
            throw Error('Invalid argument. Image DOMElement required.');
        }
        /*
            Local variables
        */
        var that = this,
            tooltipId = 'image-eyedropper-tooltip',
            tooltip = document.getElementById(tooltipId);


        if(!tooltip){
            tooltip = document.createElement('div');
            tooltip.setAttribute('id', tooltipId);
            document.getElementsByTagName('body')[0].appendChild(tooltip);
        }

        image.classList.add('image-eyedropper');

        /*
            Object properties
        */
        this.original = {width: image.width, height: image.height};
        this.hex;

        /*
            Canvas element
        */
        this.canvas = document.createElement('canvas');
				//this.canvas.setAttribute('id', 'image-eyedropper-canvas');
        this.context = this.canvas.getContext('2d');

        /* Handle events */
        image.addEventListener('mouseover', function(){
            that.updateCanvas(this);
            tooltip.style.display = 'block';
        });

        image.addEventListener('mouseout', function(){
            tooltip.style.display = 'none';
        });

        image.addEventListener('mousemove', function(e){
            that.hex = that.getColorFromCanvas(e);
            tooltip.style.background = '#' + that.hex;
            tooltip.style.left = (e.pageX + 20) + 'px';
            tooltip.style.top = (e.pageY) + 'px';
        });

        image.addEventListener('click', function(e){
            /*
                Update canvas here aswell. since if you click
                and just swap pane nothing will happend and no
                mouse events will register unless the pane is active.
            */
            that.updateCanvas(this);
            that.hex = that.getColorFromCanvas(e);
            tooltip.style.display = 'block';

            atom.clipboard.write('#' + that.hex);
            atom.notifications.addSuccess('#' + that.hex, {detail: 'Saved to clipboard'});
        });

};

eyedropper.prototype.updateCanvas = function(imageObject){
    /*
        on dragging image to tab the activepane observer does not kick in.
        set the original image width and height from the image
        since its the same anyways. Its needed because of the scaling options
    */
    if(this.original.width < 1){
        this.original.width = imageObject.width;
        this.original.height = imageObject.height;
    }

    this.canvas.width = imageObject.width;
    this.canvas.height = imageObject.height;
    this.context.drawImage(imageObject, 0, 0, this.original.width, this.original.height, 0, 0, imageObject.width, imageObject.height);
};

eyedropper.prototype.rgbToHex = function(r, g, b){
    if (r > 255 || g > 255 || b > 255)
        return false;
    return ((r << 16) | (g << 8) | b).toString(16);
};

eyedropper.prototype.getColorFromCanvas = function(e){
    var data = this.context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
    return ("000000" + this.rgbToHex(data[0], data[1], data[2])).slice(-6);
};

export default eyedropper;
