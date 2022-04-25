/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2019*/
$(document).ready(function() {
  var page = 0;
  var num_page = 0;
  var image_selected = "";
  var field = "";
});

// ====== Assets ===========
window.asset_page = 0;
window.asset_num_page = 0;
window.asset_per_page = 0;
window.asset_num_item = 0;
window.asset_selected_id = 0;
window.asset_selected_img = "";

// ====== CROPPING ===========
window.crop_object = null;
window.crop_width = 500;
window.crop_height = 500;
window.crop_boundary_width = 500;
window.crop_boundary_height = 500;
window.crop_output_image = "output_image";
window.crop_image_id = 0;
window.crop_image_url = "";

$(document).ready(function() {
  $(".mkd-close-modal").click(function() {
    $("#mkd-media-gallery-wrapper").html("");

    window.asset_page = 0;
    window.asset_num_page = 0;
    window.asset_per_page = 0;
    window.asset_num_item = 0;
    window.asset_selected_id = 0;
    window.asset_selected_img = "";

    if (window.crop_object) {
      window.crop_object.destroy();
    }
    window.crop_object = null;
    window.crop_width = 500;
    window.crop_height = 500;
    window.crop_boundary_width = 500;
    window.crop_boundary_height = 500;
    window.crop_output_image = "output_image";
    window.crop_image_id = 0;
    window.crop_image_url = "";
    $("#mkd-media-gallery-container").show();
    $(".mkd-media-panel-1").show();
    $(".mkd-media-panel-3").hide();
    $("#mkd-media-upload-container").hide();
    $("#mkd-media-crop-container").hide();
    $(".mkd-media-panel-2").hide();
  });
  $("#mkd-media-choose").click(function() {
    if (window.asset_selected_id != 0) {
      $("#" + window.crop_image_id).val(window.asset_selected_id);
      $("#" + window.crop_image_url).val(window.asset_selected_img);
      $("#" + window.crop_output_image).attr("src", window.asset_selected_img);
      $("#mkd-media-gallery").modal("hide");
      $("#mkd-media-upload-container").hide();
      $("#mkd-media-crop-container").hide();
      $("#mkd-media-gallery-container").show();
      $(".mkd-media-panel-1").show();
      $(".mkd-media-panel-2").hide();
      $(".mkd-media-panel-3").hide();
      $("#mkd-media-gallery-wrapper").html("");

      window.asset_page = 0;
      window.asset_num_page = 0;
      window.asset_per_page = 0;
      window.asset_num_item = 0;
      window.asset_selected_id = 0;
      window.asset_selected_img = "";

      window.crop_object = null;
      window.crop_width = 500;
      window.crop_height = 500;
      window.crop_boundary_width = 500;
      window.crop_boundary_height = 500;
      window.crop_output_image = "output_image";
      window.crop_image_id = 0;
      window.crop_image_url = "";
    }
  });
  $("#mkd-load-more").click(function() {
    if (window.asset_page + window.asset_per_page >= window.asset_num_item) {
      $("#mkd-load-more-container").hide();
    }
    $.ajax({
      type: "GET",
      url: "/v1/api/assets/" + window.asset_page
    }).done(function(result) {
      window.asset_page = result.page;
      window.asset_num_page = result.num_page;
      window.asset_num_item = result.num_item;
      window.asset_per_page = result.per_page;
      var items = result.item;
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        $("#mkd-media-gallery-wrapper").append(
          '<div class="col-md-2 mb-2"><img data-id="' +
            element.id +
            '"src="' +
            element.url +
            '" alt="" onerror="if (this.src != \'/uploads/placeholder.jpg\') this.src = \'/uploads/placeholder.jpg\';" class="img-fluid mkd-gallery-image-image"></div>'
        );
      }

      if (window.asset_page + window.asset_per_page >= window.asset_num_item) {
        $("#mkd-load-more-container").hide();
      }
      window.asset_page = window.asset_page + window.asset_per_page;

      $(".mkd-gallery-image-image").click(function() {
        var id = Number($(this).attr("data-id"));
        $(this).addClass("active");
        window.asset_selected_id = id;
        window.asset_selected_img = $(this).attr("src");
      });
    });
  });

  $(".mkd-choose-image").click(function() {
    var view_width = Number($(this).attr("data-view-width"));
    var view_height = Number($(this).attr("data-view-height"));
    var boundary_width = Number($(this).attr("data-boundary-width"));
    var boundary_height = Number($(this).attr("data-boundary-height"));
    var image_preview = $(this).attr("data-image-preview");
    var image_id = $(this).attr("data-image-id");
    var image_url = $(this).attr("data-image-url");
    window.crop_output_image = image_preview;
    window.crop_image_id = image_id;
    window.crop_image_url = image_url;

    if (Number.isInteger(view_width)) {
      window.crop_width = Number(view_width);
    }
    if (Number.isInteger(view_height)) {
      window.crop_height = Number(view_height);
    }
    if (Number.isInteger(boundary_width)) {
      window.crop_boundary_width = Number(boundary_width);
    }
    if (Number.isInteger(boundary_height)) {
      window.crop_boundary_height = Number(boundary_height);
    }
    $("#mkd-media-gallery").modal("show");
    $("#mkd-load-more-container").show();

    $.ajax({
      type: "GET",
      url: "/v1/api/assets/0"
    }).done(function(result) {
      window.asset_page = result.page;
      window.asset_num_page = result.num_page;
      window.asset_num_item = result.num_item;
      window.asset_per_page = result.per_page;
      var items = result.item;
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        $("#mkd-media-gallery-wrapper").append(
          '<div class="col-md-2 mb-2"><img data-id="' +
            element.id +
            '"src="' +
            element.url +
            '" alt="" onerror="if (this.src != \'/uploads/placeholder.jpg\') this.src = \'/uploads/placeholder.jpg\';" class="img-fluid mkd-gallery-image-image"></div>'
        );
      }

      if (result.page + result.per_page >= result.num_item) {
        $("#mkd-load-more-container").hide();
      }

      window.asset_page = window.asset_page + window.asset_per_page;

      $(".mkd-gallery-image-image").click(function() {
        var id = Number($(this).attr("data-id"));
        $(this).addClass("active");
        window.asset_selected_id = id;
        window.asset_selected_img = $(this).attr("src");
      });
    });
  });

  $("#mkd-media-upload").click(function() {
    $("#mkd-media-gallery-container").hide();
    $(".mkd-media-panel-1").hide();
    $(".mkd-media-panel-3").hide();
    $("#mkd-media-upload-container").show();
    $(".mkd-media-panel-2").show();
  });

  mkd_events.subscribe("crop_image", function(e) {
    $("#mkd-media-upload-container").hide();
    $("#mkd-media-crop-container").show();
    $(".mkd-media-panel-1").hide();
    $(".mkd-media-panel-2").hide();
    $(".mkd-media-panel-3").show();

    var el = document.getElementById("mkd-crop-upload-container");
    window.crop_object = new Croppie(el, {
      enableExif: true,
      viewport: {
        width: window.crop_width,
        height: window.crop_height
      },
      boundary: {
        width: window.crop_boundary_width,
        height: window.crop_boundary_height
      }
    });

    window.crop_object.bind({
      url: e.url
    });

    $("#mkd-media-crop").click(function() {
      window.crop_object
        .result({
          type: "base64",
          format: "png"
        })
        .then(function(base64) {
          $.ajax({
            type: "POST",
            url: "/v1/api/image/upload",
            data: {
              image: base64
            }
          })
            .done(function(result) {
              mkd_events.publish("image_uploaded", result);
            })
            .fail(function(jqXHR, textStatus) {
              alert("Image Upload Failed");
            });
        });
    });
  });

  mkd_events.subscribe("file_upload", function(e) {
    var formData = new FormData();
    formData.append("file", e.url, "file");
    $.ajax({
      url: "/v1/api/file/upload",
      type: "post",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      async: false,
      success: function(data) {
        $("#" + e.id).val(data.file);
        $("#" + e.id + "_id").val(data.id);
        $("#" + e.id + "_text").html(data.file);
      }
    });
  });

  mkd_events.subscribe("image_uploaded", function(e) {
    $("#mkd-media-gallery").modal("hide");
    $("#mkd-media-upload-container").hide();
    $("#mkd-media-crop-container").hide();
    $("#mkd-media-gallery-container").show();
    $(".mkd-media-panel-1").show();
    $(".mkd-media-panel-2").hide();
    $(".mkd-media-panel-3").hide();
    $("#" + window.crop_output_image).attr("src", e.image);
    $("#" + window.crop_image_id).val(e.id);
    $("#" + window.crop_image_url).val(e.image);
    $("#mkd-media-gallery-wrapper").html("");

    window.asset_page = 0;
    window.asset_num_page = 0;
    window.asset_num_item = 0;
    window.asset_selected_id = 0;
    window.asset_selected_img = "";

    if (window.crop_object) {
      window.crop_object.destroy();
    }
    window.crop_object = null;
    window.crop_width = 500;
    window.crop_height = 500;
    window.crop_boundary_width = 500;
    window.crop_boundary_height = 500;
    window.crop_output_image = "output_image";
    window.crop_image_id = 0;
    window.crop_image_url = "";
  });

  mkd_events.subscribe("file_import", function(e) {
    var formData = new FormData();
    formData.append("file", e.url, "file");
    $.ajax({
      url: "/v1/api/file/import/" + e.model,
      type: "post",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      async: false,
      success: function(data) {
        alert("Imported Data successfully");
      },
      error: function(error) {
        alert("Error: " + error.responseJSON.message);
      }
    });
  });
});

function onFileSelected(event) {
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    mkd_events.publish("crop_image", {
      url: e.target.result
    });
  };
  reader.readAsDataURL(selectedFile);
}

function onFileUploaded(event, id) {
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    mkd_events.publish("file_upload", {
      url: selectedFile,
      id: id
    });
  };
  reader.readAsDataURL(selectedFile);
}

function onFileImport(event, model) {
  alert(
    "Remember to have to the following in CSV: \n1.All field seperate by ;. \n2.ID is first field. \n3.All field wrap around with double quotes.\n4.1 line per row.\n5.No header row."
  );
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    mkd_events.publish("file_import", {
      url: selectedFile,
      model: model
    });
  };
  reader.readAsDataURL(selectedFile);
}

function fixBrokenImages(url) {
  var img = document.getElementsByTagName("img");
  var i = 0,
    l = img.length;
  for (; i < l; i++) {
    var t = img[i];
    if (t.naturalWidth === 0) {
      //this image is broken
      t.src = url;
    }
  }
}
