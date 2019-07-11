!function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({breadcrumbElement:"div.ccm-search-results-breadcrumb.ccm-file-manager-breadcrumb",bulkParameterName:"fID",searchMethod:"get",appendToOuterDialog:!0,selectMode:"multiple"},c),d.currentFolder=0,d.interactionIsDragging=!1,d.$breadcrumb=b(c.breadcrumbElement),d._templateFileProgress=_.template('<div id="ccm-file-upload-progress" class="ccm-ui"><div id="ccm-file-upload-progress-bar"><div class="progress progress-striped active"><div class="progress-bar" style="width: <%=progress%>%;"></div></div></div></div>'),ConcreteAjaxSearch.call(d,a,c),ConcreteTree.setupTreeEvents(),d.setupEvents(),d.setupItemsPerPageOptions(),d.setupAddFolder(),d.setupFolderNavigation(),d.setupFileUploads(),d.setupFileDownloads()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupRowDragging=function(){var a=this,c=a.$element.find("tr[data-file-manager-tree-node-type!=file_folder]"),d=navigator.appVersion,e=/android/gi.test(d),f=/iphone|ipad|ipod/gi.test(d),g=e||f||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);g||(a.$element.find("tr[data-file-manager-tree-node-type]").each(function(){var d,e=b(this);switch(b(this).attr("data-file-manager-tree-node-type")){case"file_folder":d="ccm-search-results-folder";break;case"file":d="ccm-search-results-file"}d&&e.draggable({delay:300,start:function(d){a.interactionIsDragging=!0,b("html").addClass("ccm-search-results-dragging"),c.css("opacity","0.4"),d.altKey&&a.$element.addClass("ccm-search-results-copy"),a.$element.find(".ccm-search-select-hover").removeClass("ccm-search-select-hover"),b(window).on("keydown.concreteSearchResultsCopy",function(b){18==b.keyCode?a.$element.addClass("ccm-search-results-copy"):a.$element.removeClass("ccm-search-results-copy")}),b(window).on("keyup.concreteSearchResultsCopy",function(b){18==b.keyCode&&a.$element.removeClass("ccm-search-results-copy")})},stop:function(){b("html").removeClass("ccm-search-results-dragging"),b(window).unbind(".concreteSearchResultsCopy"),c.css("opacity",""),a.$element.removeClass("ccm-search-results-copy"),a.interactionIsDragging=!1},revert:"invalid",helper:function(){var c=a.$element.find(".ccm-search-select-selected");return b('<div class="'+d+' ccm-draggable-search-item"><span>'+c.length+"</span></div>").data("$selected",c)},cursorAt:{left:-20,top:5}})}),a.$element.find("tr[data-file-manager-tree-node-type=file_folder], ol[data-search-navigation=breadcrumb] a[data-file-manager-tree-node]").droppable({tolerance:"pointer",hoverClass:"ccm-search-select-active-droppable",drop:function(c,d){var e=d.helper.data("$selected"),f=[],g=b(this).data("file-manager-tree-node"),h=c.altKey;e.each(function(){var a=b(this),c=a.data("file-manager-tree-node");c==g?e=e.not(this):f.push(b(this).data("file-manager-tree-node"))}),0!==f.length&&(h||e.hide(),new ConcreteAjaxRequest({url:CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/drag_request",data:{ccm_token:a.options.upload_token,copyNodes:h?"1":0,sourceTreeNodeIDs:f,treeNodeParentID:g},success:function(b){h||a.reloadFolder(),ConcreteAlert.notify({message:b.message,title:b.title})},error:function(a){e.show();var b=a.responseText;a.responseJSON&&a.responseJSON.errors&&(b=a.responseJSON.errors.join("<br/>")),ConcreteAlert.dialog(ccmi18n.error,b)}}))}}))},c.prototype.setupBreadcrumb=function(a){var c=this;if(a.breadcrumb&&(c.$breadcrumb.html(""),a.breadcrumb.length)){var d=b('<ol data-search-navigation="breadcrumb" class="breadcrumb" />');b.each(a.breadcrumb,function(a,e){var f="";e.active&&(f=' class="active"');var g=b(b.parseHTML('<a data-file-manager-tree-node="'+e.folder+'" href="'+e.url+'"></a>'));g.text(e.name),b("<li"+f+'><a data-file-manager-tree-node="'+e.folder+'" href="'+e.url+'"></a></li>').append(g).appendTo(d),d.find("li.active a").on("click",function(a){if(a.stopPropagation(),a.preventDefault(),e.menu){var f=b(e.menu);c.showMenu(d,f,a)}})}),d.appendTo(c.$breadcrumb),d.on("click.concreteSearchBreadcrumb","a",function(){return c.loadFolder(b(this).attr("data-file-manager-tree-node"),b(this).attr("href")),!1})}},c.prototype.setupFileDownloads=function(){var a=this;b("#ccm-file-manager-download-target").length?a.$downloadTarget=b("#ccm-file-manager-download-target"):a.$downloadTarget=b("<iframe />",{name:"ccm-file-manager-download-target",id:"ccm-file-manager-download-target"}).appendTo(document.body)},c.onDragOver=function(a){if(!c.openingFileImporter){var d=a.originalEvent&&a.originalEvent.dataTransfer;d&&b.inArray("Files",d.types)!==-1&&0===b("div.ccm-file-manager-import-files").length&&(a.stopPropagation(),b("a[data-dialog=add-files]").trigger("click"))}},c.prototype.setupFileUploads=function(){var a=this;b(document).off("dragover",c.onDragOver).on("dragover",c.onDragOver),b("a[data-dialog=add-files]").on("click",function(d){c.openingFileImporter=!0,d.preventDefault(),b.fn.dialog.open({width:620,height:400,modal:!0,title:ccmi18n_filemanager.addFiles,href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/import?currentFolder="+a.currentFolder,onOpen:function(){c.openingFileImporter=!1}})})},c.prototype.refreshResults=function(a){var c=this;this.currentFolder?c.loadFolder(this.currentFolder,!1,!0):b("div[data-header=file-manager] form").trigger("submit")},c.prototype._launchUploadCompleteDialog=function(a){var b=this;c.launchUploadCompleteDialog(a,b)},c.prototype.setupFolders=function(a){var c=this,d=c.$element.find("tbody tr");a.folder&&(c.currentFolder=a.folder.treeNodeID),c.$element.find("tbody tr").on("dblclick",function(){var a=d.index(b(this));if(a>-1){var e=c.getResult().items[a];e&&e.isFolder&&c.loadFolder(e.treeNodeID)}})},c.prototype.setupEvents=function(){var a=this;ConcreteEvent.subscribe("AjaxFormSubmitSuccess",function(b,c){"add-folder"!=c.form&&"move-to-folder"!=c.form||a.reloadFolder()}),ConcreteEvent.unsubscribe("FileManagerAddFilesComplete"),ConcreteEvent.subscribe("FileManagerAddFilesComplete",function(b,c){a._launchUploadCompleteDialog(c.files)}),ConcreteEvent.unsubscribe("FileManagerDeleteFilesComplete"),ConcreteEvent.subscribe("FileManagerDeleteFilesComplete",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("ConcreteTreeAddTreeNode.concreteTree"),ConcreteEvent.subscribe("ConcreteTreeAddTreeNode.concreteTree",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("ConcreteTreeUpdateTreeNode.concreteTree"),ConcreteEvent.subscribe("ConcreteTreeUpdateTreeNode.concreteTree",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("FileManagerJumpToFolder.concreteTree"),ConcreteEvent.subscribe("FileManagerJumpToFolder.concreteTree",function(b,c){a.loadFolder(c.folderID)}),ConcreteEvent.unsubscribe("ConcreteTreeDeleteTreeNode.concreteTree"),ConcreteEvent.subscribe("ConcreteTreeDeleteTreeNode.concreteTree",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("FileManagerUpdateFileProperties"),ConcreteEvent.subscribe("FileManagerUpdateFileProperties",function(a,c){c.file.fID&&b("[data-file-manager-file="+c.file.fID+"]").find(".ccm-search-results-name").text(c.file.title)})},c.prototype.setupImageThumbnails=function(){b(".ccm-file-manager-list-thumbnail[data-hover-image]").each(function(a){var c=b(this),d=[],e=c.data("hover-maxwidth"),f=c.data("hover-maxheight");e&&d.push("max-width: "+e),f&&d.push("max-height: "+f),d=0===d.length?"":' style="'+d.join("; ")+'"',c.popover({animation:!0,html:!0,content:'<img class="img-responsive" src="'+c.data("hover-image")+'" alt="Thumbnail"'+d+"/>",container:"body",placement:"auto",trigger:"manual"}),c.hover(function(){var a=new Image;a.src=c.data("hover-image"),a.complete?c.popover("toggle"):a.addEventListener("load",function(){c.popover("toggle")})}),c.closest(".ui-dialog").on("dialogclose",function(){c.popover("destroy")})})},c.prototype.showMenu=function(a,b,c){var d=this,e=new ConcreteFileMenu(a,{menu:b,handle:"none",container:d});e.show(c)},c.prototype.activateMenu=function(a){var c=this;if(c.getSelectedResults().length>1&&a.find("a").on("click.concreteFileManagerBulkAction",function(a){var d=b(this).attr("data-bulk-action"),e=b(this).attr("data-bulk-action-type"),f=[];b.each(c.getSelectedResults(),function(a,b){f.push(b.fID)}),c.handleSelectedBulkAction(d,e,b(this),f)}),"choose"!=c.options.selectMode){var d=a.find("a[data-file-manager-action=choose-new-file]").parent(),e=a.find("a[data-file-manager-action=clear]").parent();d.next("li.divider").remove(),e.remove(),d.remove()}},c.prototype.setupBulkActions=function(){var a=this;a.$element.on("click","button.btn-menu-launcher",function(c){var d=a.getResultMenu(a.getSelectedResults());if(d){d.find(".dialog-launch").dialog();var e=d.find("ul");e.attr("data-search-file-menu",d.attr("data-search-file-menu")),b(this).parent().find("ul").remove(),b(this).parent().append(e);var f=new ConcreteFileMenu;f.setupMenuOptions(b(this).next("ul")),ConcreteEvent.publish("ConcreteMenuShow",{menu:a,menuElement:b(this).parent()})}})},c.prototype.handleSelectedBulkAction=function(a,c,d,e){var f=this,g=[];"choose"==a?(ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:e}),ConcreteEvent.publish("FileManagerSelectFile",{fID:e})):"download"==a?(b.each(e,function(a,b){g.push({name:"fID[]",value:b})}),f.$downloadTarget.get(0).src=CCM_DISPATCHER_FILENAME+"/ccm/system/file/download?"+b.param(g)):ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},c.prototype.reloadFolder=function(){this.loadFolder(this.currentFolder)},c.prototype.setupAddFolder=function(){var a=this,c={treeNodeID:a.currentFolder};b("a[data-dialog=add-file-manager-folder]").on("click",function(a){a.preventDefault(),b.fn.dialog.open({width:550,height:"auto",modal:!0,title:ccmi18n_filemanager.addFiles,data:c,href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/tree/node/add/file_folder"})})},c.prototype.setupFolderNavigation=function(){b("a[data-launch-dialog=navigate-file-manager]").on("click",function(a){a.preventDefault(),b.fn.dialog.open({width:"560",height:"500",modal:!0,title:ccmi18n_filemanager.jumpToFolder,href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/jump_to_folder"})})},c.prototype.hoverIsEnabled=function(a){var b=this;return!b.interactionIsDragging},c.prototype.setupItemsPerPageOptions=function(){var a=this;a.$element.on("click",".dropdown-menu li",function(){var c=b(this).parent().attr("data-action"),d=parseInt(b(this).data("items-per-page"));return c&&d&&(a.ajaxUpdate(c+"?fSearchItemsPerPage="+d),b(this).parents(".input-group-btn").removeClass("open"),a.updateActiveItemsPerPageOption(parseInt(b(this).text()))),!1})},c.prototype.updateActiveItemsPerPageOption=function(a){var b=this;b.$element.find(".dropdown-menu li").removeClass("active"),b.$element.find(".dropdown-menu li[data-items-per-page="+a+"]").addClass("active"),b.$element.find(".dropdown-toggle #selected-option").text(a)},c.prototype.updateResults=function(a){var c=this;ConcreteAjaxSearch.prototype.updateResults.call(c,a),c.setupFolders(a),c.setupBreadcrumb(a),c.setupRowDragging(),c.setupImageThumbnails(),a.itemsPerPage&&c.updateActiveItemsPerPageOption(parseInt(a.itemsPerPage)),a.baseUrl&&c.$element.find(".dropdown-menu").attr("data-action",a.baseUrl),"choose"==c.options.selectMode&&(c.$element.unbind(".concreteFileManagerHoverFile"),c.$element.on("mouseover.concreteFileManagerHoverFile","tr[data-file-manager-tree-node-type]",function(){b(this).addClass("ccm-search-select-hover")}),c.$element.on("mouseout.concreteFileManagerHoverFile","tr[data-file-manager-tree-node-type]",function(){b(this).removeClass("ccm-search-select-hover")}),c.$element.unbind(".concreteFileManagerChooseFile").on("click.concreteFileManagerChooseFile","tr[data-file-manager-tree-node-type=file]",function(a){return ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:b(this).attr("data-file-manager-file")}),ConcreteEvent.publish("FileManagerSelectFile",{fID:b(this).attr("data-file-manager-file")}),c.$downloadTarget.remove(),!1}),c.$element.unbind(".concreteFileManagerOpenFolder").on("click.concreteFileManagerOpenFolder","tr[data-file-manager-tree-node-type=search_preset],tr[data-file-manager-tree-node-type=file_folder]",function(a){a.preventDefault(),c.loadFolder(b(this).attr("data-file-manager-tree-node"))}))},c.prototype.loadFolder=function(a,c,d){var e=this,f=e.getSearchData();c?e.options.result.baseUrl=c:c=e.options.result.baseUrl,f.push({name:"folder",value:a}),e.options.result.filters&&b.each(e.options.result.filters,function(a,b){var c=b.data;f.push({name:"field[]",value:b.key});for(var d in c)f.push({name:d,value:c[d]})}),d&&(f.push({name:"ccm_order_by",value:"folderItemModified"}),f.push({name:"ccm_order_by_direction",value:"desc"})),e.currentFolder=a,e.ajaxUpdate(c,f),e.$element.find("#ccm-file-manager-upload input[name=currentFolder]").val(e.currentFolder)},c.prototype.getResultMenu=function(a){var b=this,c=ConcreteAjaxSearch.prototype.getResultMenu.call(this,a);return c&&b.activateMenu(c),c},c.launchDialog=function(a,c){var d,e=b(window).width()-100,f={},g={filters:[],multipleSelection:!1};if(b.extend(g,c),g.filters.length>0)for(f["field[]"]=[],d=0;d<g.filters.length;d++){var h=b.extend(!0,{},g.filters[d]);f["field[]"].push(h.field),delete h.field,b.extend(f,h)}b.fn.dialog.open({width:e,height:"80%",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/search",modal:!0,data:f,title:ccmi18n_filemanager.title,onOpen:function(c){ConcreteEvent.unsubscribe("FileManagerSelectFile"),ConcreteEvent.subscribe("FileManagerSelectFile",function(c,d){var e="[object Array]"===Object.prototype.toString.call(d.fID);if(g.multipleSelection&&!e)d.fID=[d.fID];else if(!g.multipleSelection&&e){if(d.fID.length>1)return b(".ccm-search-bulk-action option:first-child").prop("selected","selected"),void window.alert(ccmi18n_filemanager.chosenTooMany);d.fID=d.fID[0]}b.fn.dialog.closeTop(),a(d)})}})},c.getFileDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/get_json",data:{fID:a},error:function(a){ConcreteAlert.dialog(ccmi18n.error,a.responseText)},success:function(a){c(a)}})},c.launchUploadCompleteDialog=function(a,c){if(a&&a.length&&a.length>0){var d="";_.each(a,function(a){d+="fID[]="+a.fID+"&"}),d=d.substring(0,d.length-1),b.fn.dialog.open({width:"660",height:"500",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/upload_complete",modal:!0,data:d,onClose:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogClose",a)},onOpen:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogOpen",a)},title:ccmi18n_filemanager.uploadComplete})}},b.fn.concreteFileManager=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileManager=c}(window,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({chooseText:ccmi18n_filemanager.chooseNew,inputName:"concreteFile",fID:!1,filters:[]},c),d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._fileLoadedTemplate=_.template(d.fileLoadedTemplate),d.$element.append(d._chooseTemplate),d.$element.on("click","div.ccm-file-selector-choose-new",function(a){a.preventDefault(),d.chooseNewFile()}),d.options.fID&&d.loadFile(d.options.fID)}c.prototype={chooseTemplate:'<div class="ccm-file-selector-choose-new"><input type="hidden" name="<%=options.inputName%>" value="0" /><%=options.chooseText%></div>',loadingTemplate:'<div class="ccm-file-selector-loading"><input type="hidden" name="<%=inputName%>" value="<%=fID%>"><img src="'+CCM_IMAGE_PATH+'/throbber_white_16.gif" /></div>',fileLoadedTemplate:'<div class="ccm-file-selector-file-selected"><input type="hidden" name="<%=inputName%>" value="<%=file.fID%>" /><div class="ccm-file-selector-file-selected-thumbnail"><%=file.resultsThumbnailImg%></div><div class="ccm-file-selector-file-selected-title"><div><%=file.title%></div></div><div class="clearfix"></div></div>',chooseNewFile:function(){var a=this;ConcreteFileManager.launchDialog(function(b){a.loadFile(b.fID,function(){a.$element.closest("form").trigger("change")})},{filters:a.options.filters})},loadFile:function(a,c){var d=this;d.$element.html(d._loadingTemplate({inputName:d.options.inputName,fID:a})),ConcreteFileManager.getFileDetails(a,function(a){var e=a.files[0];d.$element.html(d._fileLoadedTemplate({inputName:d.options.inputName,file:e})),d.$element.find(".ccm-file-selector-file-selected").on("click",function(a){var c=e.treeNodeMenu;if(c){var f=new ConcreteFileMenu(b(this),{menuLauncherHoverClass:"ccm-file-manager-menu-item-hover",menu:b(c),handle:"none",container:d});f.show(a)}}),ConcreteEvent.unsubscribe("ConcreteTreeDeleteTreeNode"),ConcreteEvent.subscribe("ConcreteTreeDeleteTreeNode",function(a,c){if(c.node&&c.node.treeJSONObject){var e=c.node.treeJSONObject.fID;e&&b("[data-file-selector]").find(".ccm-file-selector-file-selected input[value="+e+"]").each(function(a,b){_.defer(function(){d.$element.html(d._chooseTemplate)})})}}),c&&c(a)})}},b.fn.concreteFileSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileSelector=c}(this,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=c||{},c=b.extend({container:!1},c),d.options=c,a&&ConcreteMenu.call(d,a,c)}c.prototype=Object.create(ConcreteMenu.prototype),c.prototype.setupMenuOptions=function(a){var c=this,d=ConcreteMenu.prototype,e=a.attr("data-search-file-menu"),f=c.options.container;d.setupMenuOptions(a),a.find("a[data-file-manager-action=clear]").on("click",function(){var a=ConcreteMenuManager.getActiveMenu();return a&&a.hide(),_.defer(function(){f.$element.html(f._chooseTemplate)}),!1}),a.find("a[data-file-manager-action=choose-new-file]").on("click",function(a){a.preventDefault();var b=ConcreteMenuManager.getActiveMenu();b&&b.hide(),f.chooseNewFile()}),a.find("a[data-file-manager-action=download]").on("click",function(a){a.preventDefault(),window.frames["ccm-file-manager-download-target"].location=CCM_DISPATCHER_FILENAME+"/ccm/system/file/download?fID="+e}),a.find("a[data-file-manager-action=duplicate]").on("click",function(){return b.concreteAjax({url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/duplicate",data:{fID:e},success:function(a){"undefined"!=typeof f.refreshResults&&f.refreshResults()}}),!1})},b.fn.concreteFileMenu=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileMenu=c}(this,jQuery);