const {
  Uppload,
  Instagram,
  Facebook,
  Camera,
  URL,
  Local,
  GIPHY,
  Unsplash,
  Pixabay,
  Pexels,
  Screenshot,
  Crop,
  Rotate,
  Flip,
  Blur,
  Flickr,
  NineGag,
  Pinterest,
  en,
  DeviantArt,
  ArtStation,
  Twitter,
  Flipboard,
  Fotki,
  LinkedIn,
  Reddit,
  Tumblr,
  WeHeartIt,
  Brightness,
  Contrast,
  Grayscale,
  HueRotate,
  Invert,
  Saturate,
  Sepia,
  xhrUploader,
} = require('uppload');

let uploadButtons = [],
  hiddenInputElement,
  shownMedia;
document.querySelectorAll('button.mkd-uppload-image-button').forEach(function (btn) {
  uploadButtons.push(btn);
  btn.addEventListener('click', function () {
    hiddenInputElement = document.getElementById(`file_${this.dataset.uploadFor}`);
    shownMedia = document.getElementById(`media_${this.dataset.uploadFor}`);
  });
});
const uploader = new Uppload({
  call: uploadButtons,
  lang: en,
  uploader: xhrUploader({
    endpoint: '/v1/upload/file',
    fileKeyName: 'file',
    responseFunction: (responseText) => {
      const data = JSON.parse(responseText);
      console.log('data', data);
      hiddenInputElement.value = data.id;

      if (shownMedia) {
        shownMedia.src = data.url;
        if (shownMedia.nodeName == 'SOURCE') {
          const videoPlaying = shownMedia.parentNode;
          videoPlaying.load();
          videoPlaying.play();
        }
      }
    },
  }),
});

// These are our public demo API keys
// You should create your own (free!) account on these services and use your own API keys

uploader.use([
  new Local({
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/ogg'],
  }),
  new Camera(),
  new Instagram(),
  new URL(),
  new Facebook(),
  new Screenshot(),
  new Pinterest(),
  new Flickr(),
  new Twitter(),
  new NineGag(),
  new DeviantArt(),
  new ArtStation(),
  new Flipboard(),
  new Fotki(),
  new LinkedIn(),
  new Reddit(),
  new Tumblr(),
  new WeHeartIt(),
]);

uploader.use([
  new Crop({
    aspectRatio: 1,
  }),
  new Rotate(),
  new Blur(),
  new Brightness(),
  new Flip(),
  new Contrast(),
  new Grayscale(),
  new HueRotate(),
  new Invert(),
  new Saturate(),
  new Sepia(),
]);
