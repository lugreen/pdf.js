$(document).ready(function(){
  _baseUrl='http://127.0.0.1:9527/service';
  //动态追加 div 元素
  dynamicAppendElement();
  //设置界面
  $('#jd_printsetting').on('click',function () {
    loadPrintSettingWin();
  });
  //打印界面
  $('#jd_print').on('click',function () {
    loadPrintWin();
  });

  // http://xxx/service/printviewer/printoptions

  function dynamicAppendElement() {
    var settingBtn = '<button id="jd_printsetting" class="toolbarButton print hiddenMediumView" title="打印设置" tabindex="33" > ' +
                          ' <span data-l10n-id="print_label">设置</span> ' +
                     '</button>' +
                     '<button id="jd_print" class="toolbarButton print hiddenMediumView" title="打印" tabindex="33"> ' +
                          ' <span >打印</span> ' +
                     '</button>';
    $('#print').after(settingBtn);
    function includeHTML() {
      var file = ["jd/viewer-snippet-printsetting.html","jd/viewer-snippet-printdialog.html"];
      file.forEach(function (val) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              $('#printContainer').after(this.responseText);
            }
            if (this.status == 404) {
              $('#printContainer').innerHTML = "Page not found.";
            }
          }
        }
        xhttp.open("GET", val, true);
        xhttp.send();
      });
    }
    includeHTML();
  }

  //显示遮罩
  function showMask() {
    var bh = $("body").height();
    var bw = $("body").width();
    $("#printContainer").css({
      height:bh,
      width:bw,
      display:"block"
    });
  }

  //打印设置界面
  function loadPrintSettingWin() {
    showMask();
    //显示设置界面
    $("#jd_open_printsetting").css({
      display:"block"
    });
    $('#jd_open_printsetting').show();
    if ($('#jd_open_printsetting').hasClass("isHide")) {
      return;
    }
    //加载打印机名称
    loadPrinterNameInfo(".jd_set_select-printerName");
    //打印机名称切换事件
    $('.jd_set_select-printerName').on('change',function () {
      onPrinterChangeEvent();
    });
    function onPrinterChangeEvent() {
      var selName = $(".jd_set_select-printerName").children('option:selected').val();
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
            mediaSizeName.forEach(function (val) {
              $("#jd_select_pageSize").append("<option value='"+val.value+"'>" + val.text + "</option>");
            });
            //2.设置来源
            $('.jd_select-source').empty();
            var mediaTray = result["javax.print.attribute.standard.MediaTray"];
            mediaTray.forEach(function (val) {
              $('.jd_select-source').append("<option value='"+val.value+"'>" + val.text + "</option>");
            });
            //3.打印方向
            $('.jd_table-right').empty();
            var orientation = result["javax.print.attribute.standard.OrientationRequested"];
            orientation.forEach(function (val) {
              $('.jd_table-right').append("<tr><td><input type='radio' style=\"background-color: white\" name='"+val.name+"' value='"+val.value+"'></td><td>"+val.text+"</td></tr>");
            });
          }
        },
        error:function () {
          alert("获取数据失败","error");
        }
      });
    }
    //确定事件
    $('.jd_printsetting_confirm').on('click',function () {
      onDetermineEvent();
    });
    function onDetermineEvent() {
      var data = {url:'https://baidu.com'};
      $.ajax({
        type: 'POST',
        url: _baseUrl+'/print/urltopdf',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
          if (result && result.pdfUrl.values) {
            PDFViewerApplication.open(_baseUrl+"/print/pdf?id="+result.pdfUrl.values[1]);
            $('#jd_open_printsetting,#printContainer').hide();
          } else {
            alert("没有获取到返回的文件信息");
          }
        },
        error:function () {
          alert("获取数据失败","error");
        }
      });
    }
    //取消事件
    $('.jd_printsetting_cancel').on('click',function () {
      $('#jd_open_printsetting').addClass("isHide");
      $('#jd_open_printsetting,#printContainer').hide();
    });

  }

  function loadPrinterNameInfo(clazz) {
    $(clazz).empty();
    $.ajax({
      type: 'GET',
      url: _baseUrl+'/print/pslist',
      dataType: 'json',
      success: function (result) {
        result.forEach(function (val) {
          $(clazz).append("<option value='"+val.name+"'>" + val.name + "</option>");
        });
        $(clazz).trigger("change");
      },
      error:function () {
        alert("获取数据失败","error");
      }
    });
  }

  //打印窗口
  function loadPrintWin() {
    showMask();
    $("#jd_open_print").css({
      display:"block"
    });
    $('#jd_open_print').show();
    if ($('#jd_open_print').hasClass("isHide")) {
      return;
    }
    //设置打印名称
    loadPrinterNameInfo(".jd_pi_select-printerName");
    //选择页面范围功能
    $(":radio").on('click',function () {
      if ($(this).attr("class") === "jd_fromTo") {
        $('.jd_from').removeAttr('disabled');
        $('.jd_to').removeAttr('disabled');
      } else {
        setPageNumber();
      }
    });
    //设置页码
    function setPageNumber() {
      $('.jd_from').attr('disabled',true);
      $('.jd_to').attr('disabled',true);
      $('.jd_from').val(1);
      $('.jd_to').val(1);
    }
    //确定事件
    $('.jd_pi_confirm').on('click',function () {

    });
    //取消事件
    $('.jd_pi_cancel').on('click',function () {
      $('#jd_open_print').addClass("isHide");
      $('#jd_open_print,#printContainer').hide();
    });

  }

});


