var $ = require("jquery");
require('codemirror/lib/codemirror.css');
var CodeMirror = require("codemirror");
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/scroll/simplescrollbars.js');

var markupText = "";
var confirmOnPageExit = function (e)
{
  if (markupText != myCodeMirror.getValue()) {
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'Document has not been saved';

    // For IE6-8 and Firefox prior to version 4
    if (e)
    {
        e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
  }
};
// Turn it on - assign the function that returns the string
window.onbeforeunload = confirmOnPageExit;
// Turn it off - remove the function entirely
//window.onbeforeunload = null;

// nouwiki-init will call window.ready once its done
if (window.nouwiki.ready == true) {
  start();
} else {
  window.nouwiki.ready = start;
}
function start() {
  window.nouwiki.ready = true;
  $("#controles").removeClass("disabled");
}

var myCodeMirror = CodeMirror.fromTextArea($("#editor textarea")[0], {
  lineWrapping: true,
  theme: 'prose-bright',
  mode: "markdown",
  scrollbarStyle: "overlay"
});
var fragment;
var first = true;
myCodeMirror.on("change", function(cm, change) {
  if (first) {
    first = false;
  } else {
    window.nouwiki.plugins = [];
  }
  fragment = window.nouwiki.parse.parse(window.nouwiki.origin.page, myCodeMirror.getValue(), window.nouwiki.config, undefined).fragment;
  $("#preview").html(fragment);
});

$("#edit").click(function() {
  if (window.nouwiki.ready == true) {
    edit();
  }
});
function edit() {
  $(".view").hide();
  $(".edit").show();
  getMarkupFile();
}
function getMarkupFile() {
  $.ajax(window.nouwiki.origin.markup_loc, {
    dataType : 'text',
    type : 'GET',
    cache: false,
    success: function(text) {
      markupText = text;
      myCodeMirror.setValue(text);
      myCodeMirror.clearHistory();
  }});
}

$("#discard").click(function() {
  var yes_discard = true;
  if (markupText != myCodeMirror.getValue()) {
    yes_discard = confirm("Are you sure you want to discard your edit?");
  }
  if (yes_discard) {
    discard();
  }
});
function discard() {
  $(".view").show();
  $(".edit").hide();

  var empty = "";
  markupText = empty;
  myCodeMirror.setValue(empty)
  myCodeMirror.clearHistory();
}

$("#save").click(function() {
  save();
});
function save() {
  $(".view").show();
  $(".edit").hide();
  var markup = myCodeMirror.getValue();
  markupText = markup;
  $.ajax({
      url: '/api/modify',
      type: 'PUT',
      data: markup,
      contentType: "text/plain",
      success: function(result) {
        document.location.reload(true);
      }
  });
}

$("#create").click(function() {
  create();
});
function create() {
  $.ajax({
      url: '/api/create',
      type: 'POST',
      data: window.nouwiki.origin.page,
      contentType: "text/plain",
      success: function(result) {
        document.location.reload(true);
      }
  });
}

$("#remove").click(function() {
  remove();
});
function remove() {
  var result = confirm("Are you sure you want to remove this page?");
  if (result) {
    $.ajax({
        url: '/api/remove',
        type: 'POST',
        data: window.nouwiki.origin.page,
        contentType: "text/plain",
        success: function(result) {
          document.location.reload(true);
        }
    });
  }
}

$("#search_pages").keyup(function() {
  var val = $(this).val();
  if (val != "" && val != undefined && val != null) {
    $.ajax({
        url: '/api/search_pages',
        type: 'POST',
        data: val,
        contentType: "text/plain",
        success: function(result) {
          var matches = result.matches;
          var lis = "";
          for (var p in matches) {
            var matchLower = matches[p].toLowerCase();
            var valLower = val.toLowerCase();
            var i = matchLower.indexOf(valLower);
            var ie = i+val.length;
            var s = "";
            if (i > 0) {
              s = matches[p].substring(0, i);
            }
            var m = matches[p].substring(i, ie);
            var e = matches[p].substring(ie);
            var bold = s+"<b>"+m+"</b>"+e;
            lis += "<li><a href='/wiki/"+matches[p]+"'>"+bold+"</a></li>";
          }
          $("#matches").html(lis);
        }
    });
  } else {
    $("#matches").html("");
  }
});