_baseUrl="http://127.0.0.1:9527/service";

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("div");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

function loadPrintSettingWin() {
  console.log("printsetting");
  $.ajax({
      type: 'GET',
      url: _baseUrl+'/print/pslist',
      dataType: 'json',
      success: function (result) {
        result.forEach(function (val) {
          $("#settingPagePrinterName").append("<option value='"+val.name+"'>" + val.name + "</option>");
        });
      },
      error:function () {
        alert("获取数据失败","error");
      }
  });
  $("#jd_open_printsetting").css({
    display:"block"
  });
  $('#jd_open_printsetting').show();
  //打印机切换事件
  $('#settingPagePrinterName').on('change',function () {
    onPrinterChangeEvent();
  });
  //打印设置界面确定事件
  $('.jd_printsetting_confirm').on('click',function () {
    onDetermineEvent();
  });
}

function onPrinterChangeEvent() {
  var selName = $("#settingPagePrinterName").children('option:selected').val();
  $.ajax({
    type: 'GET',
    url: _baseUrl+'/print/psattributes',
    data: {psName:selName},
    dataType: 'json',
    success: function (result) {
      if (result) {
        //1.设置纸张大小
        $("#jd_select_pageSize").empty();
        var mediaSizeName = result["javax.print.attribute.standard.MediaSizeName"];
        mediaSizeName.forEach(function (val,i) {
          $("#jd_select_pageSize").append("<option value='"+val.value+"'>" + val.text + "</option>");
        });
      }
    },
    error:function () {
      alert("获取数据失败","error");
    }
  });
}

function onDetermineEvent() {
  var data = {url:'https://baidu.com'};
  $.ajax({
    type: 'POST',
    url: _baseUrl+'/print/urltopdf',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json',
    success: function (result) {
      PDFViewerApplication.open(_baseUrl+"/print/pdf?id="+result.pdfUrl.values[1]);
      $('#jd_printsetting').hide();
    },
    error:function () {
      alert("获取数据失败","error");
    }
  });
}

$(document).ready(function(){
  includeHTML();
  //打开设置界面
  $('#jd_printsetting').on('click',function () {
    loadPrintSettingWin();
  });

  $('#jd_print').on('click',function () {
    $("#jd_open_print").css({
      display:"block"
    });
    $('#jd_open_print').show();
  });
});
