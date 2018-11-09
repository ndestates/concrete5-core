!function(a,b){"use strict";function c(a,c){var d=this;return c=c||{},c.sitemapIndex=Math.max(0,parseInt(c.sitemapIndex,10)||0),c=b.extend({displayNodePagination:!1,cParentID:0,siteTreeID:0,cookieId:"ConcreteSitemap"+(c.sitemapIndex>0?"-"+c.sitemapIndex:""),includeSystemPages:!1,displaySingleLevel:!1,persist:!0,minExpandLevel:!1,dataSource:CCM_DISPATCHER_FILENAME+"/ccm/system/page/sitemap_data",ajaxData:{},selectMode:!1,onClickNode:!1,onSelectNode:!1,init:!1},c),c.sitemapIndex>0&&(c.ajaxData.sitemapIndex=c.sitemapIndex),d.options=c,d.$element=a,d.$sitemap=null,d.homeCID=null,d.setupTree(),d.setupTreeEvents(),Concrete.event.publish("ConcreteSitemap",this),d.$element}c.prototype={sitemapTemplate:'<div class="ccm-sitemap-wrapper"><div class="ccm-sitemap-tree-selector-wrapper"></div><div class="ccm-sitemap-tree"></div></div>',localesWrapperTemplate:'<select data-select="site-trees"></select>',getTree:function(){var a=this;return a.$sitemap.fancytree("getTree")},setupSiteTreeSelector:function(a){var c=this;if(!a)return!1;if(a.displayMenu&&c.options.siteTreeID<1&&!c.$element.find("div.ccm-sitemap-tree-selector-wrapper select").length){c.$element.find("div.ccm-sitemap-tree-selector-wrapper").append(b(c.localesWrapperTemplate));var d=c.$element.find("div.ccm-sitemap-tree-selector-wrapper select"),e=[];b.each(a.entries,function(a,b){b.isSelected&&e.push(b.siteTreeID)}),d.selectize({maxItems:1,valueField:"siteTreeID",searchField:"title",options:a.entries,items:e,optgroups:a.entryGroups,optgroupField:"class",onItemAdd:function(a){var b=a,d=c.getTree().options.source;c.options.siteTreeID=b,d.data.siteTreeID=b,c.getTree().reload(d)},render:{option:function(a,b){return'<div class="option">'+a.element+"</div>"},item:function(a,b){return'<div class="item">'+a.element+"</div>"}}})}},setupTree:function(){var a,c=this,d=!0,e=1,f=!1,g=!1,h=!1;"single"==c.options.selectMode?(f=!0,g={checkbox:"fancytree-radio"}):"multiple"==c.options.selectMode?(e=2,f=!0):"hierarchical-multiple"==c.options.selectMode&&(e=3,f=!0),f&&(d=!1),c.options.minExpandLevel!==!1?a=c.options.minExpandLevel:c.options.displaySingleLevel?(a=c.options.cParentID?3:2,d=!1):a=c.options.selectMode?2:1,c.options.persist||(d=!1);var i=b.extend({displayNodePagination:c.options.displayNodePagination?1:0,cParentID:c.options.cParentID,siteTreeID:c.options.siteTreeID,displaySingleLevel:c.options.displaySingleLevel?1:0,includeSystemPages:c.options.includeSystemPages?1:0},c.options.ajaxData),j=["glyph","dnd"];d&&j.push("persist");var k=_.template(c.sitemapTemplate);c.$element.append(k),c.$sitemap=c.$element.find("div.ccm-sitemap-tree"),c.$sitemap.fancytree({tabindex:null,titlesTabbable:!1,extensions:j,glyph:{map:{doc:"fa fa-file-o",docOpen:"fa fa-file-o",checkbox:"fa fa-square-o",checkboxSelected:"fa fa-check-square-o",checkboxUnknown:"fa fa-share-square",dragHelper:"fa fa-share",dropMarker:"fa fa-angle-right",error:"fa fa-warning",expanderClosed:"fa fa-plus-square-o",expanderLazy:"fa fa-plus-square-o",expanderOpen:"fa fa-minus-square-o",loading:"fa fa-spin fa-refresh"}},persist:{cookieDelimiter:"~",cookiePrefix:c.options.cookieId,cookie:{path:CCM_REL+"/"}},autoFocus:!1,classNames:g,source:{url:c.options.dataSource,data:i},init:function(){c.options.init&&c.options.init.call(),c.options.displayNodePagination&&c.setupNodePagination(c.$sitemap,c.options.cParentID);var a=c.getTree().data;c.homeCID="homeCID"in a?a.homeCID:null,c.setupSiteTreeSelector(a.trees)},selectMode:e,checkbox:f,minExpandLevel:a,clickFolderMode:2,lazyLoad:function(a,b){return!c.options.displaySingleLevel&&void(b.result=c.getLoadNodePromise(b.node))},click:function(a,d){var e=d.node;if("title"==d.targetType&&e.data.cID){if(c.options.selectMode)return!1;if(c.options.onClickNode)return c.options.onClickNode.call(c,e);var f=new ConcretePageMenu(b(e.li),{menuOptions:c.options,data:e.data,sitemap:c,onHide:function(a){a.$launcher.each(function(){b(this).unbind("mousemove.concreteMenu")})}});f.show(a)}else if(e.data.href)window.location.href=e.data.href;else if(c.options.displaySingleLevel)return c.displaySingleLevel(e),!1},select:function(a,b,d){c.options.onSelectNode&&c.options.onSelectNode.call(c,b.node,b.node.isSelected())},dnd:{focusOnClick:!0,preventRecursiveMoves:!1,preventVoidMoves:!1,dragStart:function(a,b){return!c.options.selectMode&&(!!a.data.cID&&(h=!0,c.$sitemap.addClass("ccm-sitemap-dnd"),!0))},dragEnter:function(a,b){if(!b.otherNode)return!1;var c=parseInt(a.data.cID),d=parseInt(b.otherNode.data.cID),e=!a.parent||!a.parent.data.cID;return!(!c||!d)&&(a.data.cAlias?["before","after"]:c===d?"over":!e||"over")},dragDrop:function(a,b){a.parent.data.cID==b.otherNode.parent.data.cID&&"over"!=b.hitMode?(b.otherNode.moveTo(a,b.hitMode),c.rescanDisplayOrder(b.otherNode.parent)):c.selectMoveCopyTarget(b.otherNode,a,b.hitMode)},dragStop:function(){c.$sitemap.removeClass("ccm-sitemap-dnd"),setTimeout(function(){h=!1},0)}}}),ConcreteEvent.subscribe("ConcreteMenuShow",function(a,b){h&&b.menu.hide()})},setupTreeEvents:function(){var a=this;return!a.options.selectMode&&!a.options.onClickNode&&(ConcreteEvent.unsubscribe("SitemapDeleteRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapDeleteRequestComplete.sitemap",function(c){var d=a.$sitemap.fancytree("getActiveNode"),e=d.parent;a.reloadNode(e),b(a.$sitemap).fancytree("getTree").visit(function(b){if(b.data.isTrash){var c=b.expanded;return a.getLoadNodePromise(b).done(function(a){b.removeChildren(),b.addChildren(a),c&&b.setExpanded(!0,{noAnimation:!0})}),!1}})}),ConcreteEvent.unsubscribe("SitemapAddPageRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapAddPageRequestComplete.sitemap",function(b,c){var d=a.getTree().getNodeByKey(c.cParentID);d&&a.reloadNode(d),jQuery.fn.dialog.closeAll()}),ConcreteEvent.subscribe("SitemapUpdatePageRequestComplete.sitemap",function(b,c){try{var d=a.getTree().getNodeByKey(c.cID),e=d.parent;e&&a.reloadNode(e)}catch(a){}}),ConcreteEvent.unsubscribe("PageVersionChanged.deleted"),ConcreteEvent.unsubscribe("PageVersionChanged.duplicated"),void Concrete.event.subscribe(["PageVersionChanged.deleted","PageVersionChanged.duplicated"],function(b,c){a.reloadSelfNodeByCID(c.cID)}))},rescanDisplayOrder:function(a){var c,d=a.getChildren(),e=[];for(a.setStatus("loading"),c=0;c<d.length;c++){var f=d[c];e.push({name:"cID[]",value:f.data.cID})}b.concreteAjax({dataType:"json",type:"POST",data:e,url:CCM_TOOLS_PATH+"/dashboard/sitemap_update",success:function(b){a.setStatus("ok"),ConcreteAlert.notify({message:b.message})}})},selectMoveCopyTarget:function(a,c,d){var e=this,f=ccmi18n_sitemap.moveCopyPage;d||(d="");var g=CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/page/drag_request?origCID="+a.data.cID+"&destCID="+c.data.cID+"&dragMode="+d,h="auto",i=520;b.fn.dialog.open({title:f,href:g,width:i,modal:!1,height:h}),ConcreteEvent.unsubscribe("SitemapDragRequestComplete.sitemap"),ConcreteEvent.subscribe("SitemapDragRequestComplete.sitemap",function(b,f){switch(f.task){case"COPY_VERSION":e.reloadSelfNode(c);break;default:var g=c.parent;"over"==d&&(g=c),"MOVE"==f.task&&a.remove(),g.removeChildren(),e.reloadNode(g,function(){c.bExpanded||c.setExpanded(!0,{noAnimation:!0})})}})},setupNodePagination:function(a){a.find(".ccm-pagination-bound").remove();var c=a.find("div.ccm-pagination-wrapper"),d=this;c.length&&(c.find("a:not([disabled])").unbind("click").on("click",function(){var a=b(this).attr("href"),c=d.$sitemap.fancytree("getRootNode");return jQuery.fn.dialog.showLoader(),b.ajax({dataType:"json",url:a,success:function(a){jQuery.fn.dialog.hideLoader(),c.removeChildren(),c.addChildren(a),d.setupNodePagination(d.$sitemap)}}),!1}),c.addClass("ccm-pagination-bound").appendTo(a))},displaySingleLevel:function(a){var c=this,d=c.options;(c.options.onDisplaySingleLevel||b.noop).call(this,a);var e=c.$sitemap.fancytree("getRootNode"),f=b.extend({dataType:"json",displayNodePagination:d.displayNodePagination?1:0,siteTreeID:d.siteTreeID,cParentID:a.data.cID,displaySingleLevel:!0,includeSystemPages:d.includeSystemPages?1:0},d.ajaxData);return jQuery.fn.dialog.showLoader(),b.ajax({dataType:"json",url:d.dataSource,data:f,success:function(b){jQuery.fn.dialog.hideLoader(),e.removeChildren(),e.addChildren(b),c.setupNodePagination(c.$sitemap,a.data.key)}})},getLoadNodePromise:function(a){var c=this,d=c.options,e=b.extend({cParentID:a.data.cID?a.data.cID:0,siteTreeID:d.siteTreeID,reloadNode:1,includeSystemPages:d.includeSystemPages?1:0,displayNodePagination:d.displayNodePagination?1:0},d.ajaxData),f={dataType:"json",url:d.dataSource,data:e};return b.ajax(f)},reloadNode:function(a,b){this.getLoadNodePromise(a).done(function(c){a.removeChildren(),a.addChildren(c),a.setExpanded(!0,{noAnimation:!0}),b&&b()})},getLoadSelfNodePromise:function(a){return b.ajax({dataType:"json",url:this.options.dataSource,data:b.extend({cID:a.data.cID,reloadNode:1,reloadSelfNode:1},this.options.ajaxData)})},reloadSelfNode:function(a,b){this.getLoadSelfNodePromise(a).done(function(c){var d=c[0];a.setTitle(d.title),b&&b()})},reloadSelfNodeByCID:function(a,b){var c=a?this.getTree().getNodeByKey(a.toString()):null;c&&this.reloadSelfNode(c,b)}},c.exitEditMode=function(a){b.get(CCM_TOOLS_PATH+"/dashboard/sitemap_check_in?cID="+a+"&ccm_token="+CCM_SECURITY_TOKEN)},c.refreshCopyOperations=function(){ccm_triggerProgressiveOperation(CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/page/drag_request/copy_all",[],ccmi18n_sitemap.copyProgressTitle,function(){b(".ui-dialog-content").dialog("close"),window.location.reload()})},c.submitDragRequest=function(a){var c={ccm_token:a.find('input[name="validationToken"]').val(),dragMode:a.find('input[name="dragMode"]').val(),destCID:a.find('input[name="destCID"]').val(),destSibling:a.find('input[name="destSibling"]').val()||"",origCID:a.find('input[name="origCID"]').val(),ctask:b("input[name=ctask]:checked").val()};switch(c.ctask){case"MOVE":c.saveOldPagePath=a.find('input[name="saveOldPagePath"]').is(":checked")?1:0;break;case"a-copy-operation":c.ctask=b('input[name="dtask"]:checked').val()}var d=[];b.each(c,function(a,b){d.push({name:a,value:b})}),"COPY_ALL"===c.ctask?ccm_triggerProgressiveOperation(CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/page/drag_request/copy_all",d,ccmi18n_sitemap.copyProgressTitle,function(){b(".ui-dialog-content").dialog("close"),ConcreteEvent.publish("SitemapDragRequestComplete",{task:c.ctask})}):(jQuery.fn.dialog.showLoader(),b.getJSON(CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/page/drag_request/submit",c,function(a){ccm_parseJSON(a,function(){jQuery.fn.dialog.closeAll(),jQuery.fn.dialog.hideLoader(),ConcreteAlert.notify({message:a.message}),ConcreteEvent.publish("SitemapDragRequestComplete",{task:c.ctask}),jQuery.fn.dialog.closeTop(),jQuery.fn.dialog.closeTop()})}).error(function(a,b,c){jQuery.fn.dialog.hideLoader();var d=c,e=a?a.responseJSON:null;e&&e.error&&(d=e.errors instanceof Array?e.errors.join("\n"):e.error),window.alert(d)}))},b.fn.concreteSitemap=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteSitemap=c}(this,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=c||{},c=b.extend({sitemap:!1,data:{},menuOptions:{}},c),ConcreteMenu.call(d,a,c),0!=c.sitemap&&(d.$menu=b(_.template(ConcretePageAjaxSearchMenu.get(),{item:c.data})))}c.prototype=Object.create(ConcreteMenu.prototype),c.prototype.setupMenuOptions=function(a){var b=this,c=ConcreteMenu.prototype,d=a.attr("data-search-page-menu");c.setupMenuOptions(a),b.options.sitemap&&0!=b.options.sitemap.options.displaySingleLevel||a.find("[data-sitemap-mode=explore]").remove(),a.find("a[data-action=delete-forever]").on("click",function(){return ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_delete_forever",[{name:"cID",value:d}],ccmi18n_sitemap.deletePages,function(){if(b.options.sitemap){var a=b.options.sitemap.getTree(),c=a.getNodeByKey(d);c.remove()}ConcreteAlert.notify({message:ccmi18n_sitemap.deletePageSuccessMsg})}),!1}),a.find("a[data-action=empty-trash]").on("click",function(){return ccm_triggerProgressiveOperation(CCM_TOOLS_PATH+"/dashboard/sitemap_delete_forever",[{name:"cID",value:d}],ccmi18n_sitemap.deletePages,function(){if(b.options.sitemap){var a=b.options.sitemap.getTree(),c=a.getNodeByKey(d);c.removeChildren()}}),!1})},b.fn.concretePageMenu=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageMenu=c}(this,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({mode:"menu",searchMethod:"get"},c),d.options=c,d._templateSearchResultsMenu=_.template(e.get()),ConcreteAjaxSearch.call(d,a,c),d.setupEvents()}var d={externalLink:{width:350,height:270}};c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupEvents=function(){var a=this;ConcreteEvent.subscribe("SitemapDeleteRequestComplete",function(b){a.refreshResults()}),ConcreteEvent.fire("ConcreteSitemapPageSearch",a)},c.prototype.updateResults=function(a){var c=this,d=c.$element;ConcreteAjaxSearch.prototype.updateResults.call(c,a),"choose"==c.options.mode&&(d.find(".ccm-search-results-checkbox").parent().remove(),d.find("select[data-bulk-action]").parent().remove(),d.unbind(".concretePageSearchHoverPage"),d.on("mouseover.concretePageSearchHoverPage","tr[data-launch-search-menu]",function(){b(this).addClass("ccm-search-select-hover")}),d.on("mouseout.concretePageSearchHoverPage","tr[data-launch-search-menu]",function(){b(this).removeClass("ccm-search-select-hover")}),d.unbind(".concretePageSearchChoosePage").on("click.concretePageSearchChoosePage","tr[data-launch-search-menu]",function(){return ConcreteEvent.publish("SitemapSelectPage",{instance:c,cID:b(this).attr("data-page-id"),title:b(this).attr("data-page-name")}),!1}))},c.prototype.handleSelectedBulkAction=function(a,c,d,e){if("movecopy"==a||"Move/Copy"==a){var f,g=[];b.each(e,function(a,c){g.push(b(c).val())}),ConcreteEvent.unsubscribe("SitemapSelectPage.search");var h=function(a,c){Concrete.event.unsubscribe(a),f=CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/page/drag_request?origCID="+g.join(",")+"&destCID="+c.cID,b.fn.dialog.open({width:520,height:"auto",href:f,title:ccmi18n_sitemap.moveCopyPage,onDirectClose:function(){ConcreteEvent.subscribe("SitemapSelectPage.search",h)}})};ConcreteEvent.subscribe("SitemapSelectPage.search",h)}ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},ConcreteAjaxSearch.prototype.createMenu=function(a){var c=this;a.concretePageMenu({container:c,menu:b("[data-search-menu="+a.attr("data-launch-search-menu")+"]")})},c.launchDialog=function(a){var c=b(window).width()-53;b.fn.dialog.open({width:c,height:"100%",href:CCM_TOOLS_PATH+"/sitemap_search_selector",modal:!0,title:ccmi18n_sitemap.pageLocationTitle,onClose:function(){ConcreteEvent.fire("PageSelectorClose")},onOpen:function(){ConcreteEvent.unsubscribe("SitemapSelectPage"),ConcreteEvent.subscribe("SitemapSelectPage",function(b,c){jQuery.fn.dialog.closeTop(),a(c)})}})},c.getPageDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/page/get_json",data:{cID:a},error:function(a){ConcreteAlert.dialog(ccmi18n.error,a.responseText)},success:function(a){c(a)}})};var e={get:function(){return["",'<div class="popover fade" data-search-page-menu="<%=item.cID%>" data-search-menu="<%=item.cID%>">','<div class="arrow"></div>','<div class="popover-inner">','<ul class="dropdown-menu">',"<% if (item.isTrash) { %>",'<li><a data-action="empty-trash" href="javascript:void(0)">'+ccmi18n_sitemap.emptyTrash+"</a></li>","<% } else if (item.isInTrash) { %>",'<li><a data-action="delete-forever" href="javascript:void(0)">'+ccmi18n_sitemap.deletePageForever+"</a></li>","<% } else if (item.cAlias == 'LINK' || item.cAlias == 'POINTER') { %>",'<li><a href="<%- item.link %>">'+ccmi18n_sitemap.visitExternalLink+"</a></li>","<% if (item.cAlias == 'LINK' && item.canEditPageProperties) { %>",'<li><a class="dialog-launch" dialog-width="'+d.externalLink.width+'" dialog-height="'+d.externalLink.height+'" dialog-title="'+ccmi18n_sitemap.editExternalLink+'" dialog-modal="false" dialog-append-buttons="true" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/edit_external?cID=<%=item.cID%>">'+ccmi18n_sitemap.editExternalLink+"</a></li>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageAttributesTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/attributes?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageAttributes+"</a></li>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="630" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.setPagePermissions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/permissions?cID=<%=item.cID%>">'+ccmi18n_sitemap.setPagePermissions+"</a></li>","<% } %>","<% if (item.canDeletePage) { %>",'<li><a class="dialog-launch" dialog-width="360" dialog-height="150" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.deleteExternalLink+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/delete_alias?cID=<%=item.cID%>">'+ccmi18n_sitemap.deleteExternalLink+"</a></li>","<% } %>","<% } else { %>",'<li><a href="<%- item.link %>">'+ccmi18n_sitemap.visitPage+"</a></li>","<% if (item.canEditPageProperties || item.canEditPageSpeedSettings || item.canEditPagePermissions || item.canEditPageDesign || item.canViewPageVersions || item.canDeletePage) { %>",'<li class="divider"></li>',"<% } %>","<% if (item.canEditPageProperties) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="640" dialog-height="360" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.seo+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/seo?cID=<%=item.cID%>">'+ccmi18n_sitemap.seo+"</a></li>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="500" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageLocationTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/location?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageLocation+"</a></li>",'<li class="divider"></li>','<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageAttributesTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/attributes?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageAttributes+"</a></li>","<% } %>","<% if (item.canEditPageSpeedSettings) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="550" dialog-height="280" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.speedSettingsTitle+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/caching?cID=<%=item.cID%>">'+ccmi18n_sitemap.speedSettings+"</a></li>","<% } %>","<% if (item.canEditPagePermissions) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="500" dialog-height="630" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.setPagePermissions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/details/page/permissions?cID=<%=item.cID%>">'+ccmi18n_sitemap.setPagePermissions+"</a></li>","<% } %>","<% if (item.canEditPageDesign || item.canEditPageType) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="350" dialog-height="500" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageDesign+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/design?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageDesign+"</a></li>","<% } %>","<% if (item.canViewPageVersions) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="640" dialog-height="340" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.pageVersions+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/panels/page/versions?cID=<%=item.cID%>">'+ccmi18n_sitemap.pageVersions+"</a></li>","<% } %>","<% if (item.canDeletePage) { %>",'<li><a class="dialog-launch" dialog-on-close="ConcreteSitemap.exitEditMode(<%=item.cID%>)" dialog-width="360" dialog-height="250" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.deletePage+'" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/delete_from_sitemap?cID=<%=item.cID%>">'+ccmi18n_sitemap.deletePage+"</a></li>","<% } %>",'<li class="divider" data-sitemap-mode="explore"></li>','<li data-sitemap-mode="explore"><a class="dialog-launch" dialog-width="90%" dialog-height="70%" dialog-modal="false" dialog-title="'+ccmi18n_sitemap.moveCopyPage+'" href="'+CCM_TOOLS_PATH+'/sitemap_search_selector?sitemap_select_mode=move_copy_delete&cID=<%=item.cID%>">'+ccmi18n_sitemap.moveCopyPage+"</a></li>",'<li data-sitemap-mode="explore"><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore?cNodeID=<%=item.cID%>&task=send_to_top">'+ccmi18n_sitemap.sendToTop+"</a></li>",'<li data-sitemap-mode="explore"><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore?cNodeID=<%=item.cID%>&task=send_to_bottom">'+ccmi18n_sitemap.sendToBottom+"</a></li>","<% if (item.numSubpages > 0) { %>",'<li class="divider"></li>','<li><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/search/?submitSearch=1&field[]=parent_page&cParentAll=1&cParentIDSearchField=<%=item.cID%>">'+ccmi18n_sitemap.searchPages+"</a></li>",'<li><a href="'+CCM_DISPATCHER_FILENAME+'/dashboard/sitemap/explore/-/<%=item.cID%>">'+ccmi18n_sitemap.explorePages+"</a></li>","<% } %>","<% if (item.canAddExternalLinks || item.canAddSubpages) { %>",'<li class="divider"></li>',"<% if (item.canAddSubpages > 0) { %>",'<li><a class="dialog-launch" dialog-width="350" dialog-modal="false" dialog-height="350" dialog-title="'+ccmi18n_sitemap.addPage+'" dialog-modal="false" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/add?cID=<%=item.cID%>">'+ccmi18n_sitemap.addPage+"</a></li>","<% } %>","<% if (item.canAddExternalLinks > 0) { %>",'<li><a class="dialog-launch" dialog-width="'+d.externalLink.width+'" dialog-modal="false" dialog-height="'+d.externalLink.height+'" dialog-title="'+ccmi18n_sitemap.addExternalLink+'" dialog-modal="false" href="'+CCM_DISPATCHER_FILENAME+'/ccm/system/dialogs/page/add_external?cID=<%=item.cID%>">'+ccmi18n_sitemap.addExternalLink+"</a></li>","<% } %>","<% } %>","<% } %>","</ul>","</div>","</div>",""].join("")}};b.fn.concretePageAjaxSearch=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageAjaxSearch=c,a.ConcretePageAjaxSearchMenu=e}(this,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({chooseText:ccmi18n_sitemap.choosePage,loadingText:ccmi18n_sitemap.loadingText,inputName:"cID",cID:0},c),d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._pageLoadedTemplate=_.template(d.pageLoadedTemplate),d._pageMenuTemplate=_.template(ConcretePageAjaxSearchMenu.get()),d.$element.append(d._chooseTemplate),d.$element.on("click","a[data-page-selector-link=choose]",function(a){a.preventDefault(),ConcretePageAjaxSearch.launchDialog(function(a){d.loadPage(a.cID)})}),d.options.cID&&d.loadPage(d.options.cID)}c.prototype={chooseTemplate:'<div class="ccm-item-selector"><input type="hidden" name="<%=options.inputName%>" value="0" /><a href="#" data-page-selector-link="choose"><%=options.chooseText%></a></div>',loadingTemplate:'<div class="ccm-item-selector"><div class="ccm-item-selector-choose"><input type="hidden" name="<%=options.inputName%>" value="<%=cID%>"><i class="fa fa-spin fa-spinner"></i> <%=options.loadingText%></div></div>',pageLoadedTemplate:'<div class="ccm-item-selector"><div class="ccm-item-selector-item-selected"><input type="hidden" name="<%=inputName%>" value="<%=page.cID%>" /><a data-page-selector-action="clear" href="#" class="ccm-item-selector-clear"><i class="fa fa-close"></i></a><div class="ccm-item-selector-item-selected-title launch-tooltip" title="<%- page.url %>"><%=page.name%></div></div></div>',loadPage:function(a){var c=this;c.$element.html(c._loadingTemplate({options:c.options,cID:a})),ConcretePageAjaxSearch.getPageDetails(a,function(a){var d=a.pages[0];c.$element.html(c._pageLoadedTemplate({inputName:c.options.inputName,page:d}));var e=c.$element.find(".launch-tooltip");if(e.length&&e.tooltip){var f={},g=b("#ccm-tooltip-holder");g.length&&(f.container=g),e.tooltip(f)}c.$element.on("click","a[data-page-selector-action=clear]",function(a){a.preventDefault(),c.$element.html(c._chooseTemplate)})})}},b.fn.concretePageSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageSelector=c}(this,jQuery),function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({mode:"single",inputName:"cID",selected:0,startingPoint:1,siteTreeID:0,token:"",filters:{}},c),d.$element=b("<div />",{class:"ccm-page-sitemap-selector-inner"}),d.$element.appendTo(a),d.options=c,d.$element.concreteSitemap({selectMode:d.options.mode,minExpandLevel:0,siteTreeID:d.options.siteTreeID,dataSource:CCM_DISPATCHER_FILENAME+"/ccm/system/page/select_sitemap",ajaxData:{startingPoint:d.options.startingPoint,ccm_token:d.options.token,selected:d.options.selected,filters:d.options.filters},init:function(){if(c.selected)if("multiple"==c.mode)b.each(c.selected,function(a,b){var c=d.$element.find(".ccm-sitemap-tree").fancytree("getTree").getNodeByKey(String(b));c&&c.setSelected(!0)});else{var a=d.$element.find(".ccm-sitemap-tree").fancytree("getTree"),e=a.getNodeByKey(String(c.selected));e&&e.setSelected(!0)}},onSelectNode:function(a,b){return!a.data.hideCheckbox&&void(b?("single"==d.options.mode&&d.deselectAll(),d.select(a)):d.deselect(a))}})}c.prototype={deselectAll:function(){var a=this,b=a.$element.find("input[data-sitemap-selector-page-id]");b.remove()},deselect:function(a){var b=this,c=b.$element.find("input[data-sitemap-selector-page-id="+a.data.cID+"]");c.remove()},select:function(a){var c=this,d=c.options.inputName;"multiple"==c.options.mode&&(d+="[]");var e=b("<input />",{"data-sitemap-selector-page-id":a.data.cID,type:"hidden",name:d});e.val(a.data.cID),e.appendTo(c.$element)}},b.fn.concretePageSitemapSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcretePageSitemapSelector=c}(this,jQuery);