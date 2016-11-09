'use babel';
import eyedropper from './image-eyedropper'

module.exports.activate = function(){
    /*
        observ for pane change and look for images
    */
    atom.workspace.observeActivePaneItem(function(pane){
        var EditorView = atom.views.getView(pane);
        if(EditorView){
            var image = EditorView.querySelectorAll('img:not(.image-eyedropper)');
            if(image.length > 0){
                try{
                    new eyedropper(image[0]);
                }catch(e){
                    console.log(e);
                }
            }
        }
  });
};
