if (document.getElementById('mkd-suneditor')) {
  SUNEDITOR.create(document.getElementById('mkd-suneditor') || 'mkd-suneditor', {
    // All of the plugins are loaded in the "window.SUNEDITOR" object in dist/suneditor.min.js file
    // Insert options
    // Language global object (default: en)
    height: 500,
    width: '100%',
    buttonList: [
      // Default
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video', 'audio'],
      ['imageGallery'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
    ],
  });
}
