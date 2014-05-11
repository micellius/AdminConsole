/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
sap.ui.controller("sap.adminconsole.apps.roleeditor.controller.master.Master", {
    onInit : function () {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._onRouteMatched, this);
        this._loadData();
    },

    onListSelect: function() {
        this._showDetail.apply(this, this.getView().oList.getSelectedItems());
    },

    onListItemPress: function(oEvent) {
        this._showDetail(oEvent.getParameter("listItem"));
    },

    _onRouteMatched: function(oEvent) {
        var id = oEvent.getParameter('arguments').id;
        id && this._selectItems(id.split(','));
    },

    _selectItems: function(ids) {
        this.loadDataPromise.done(function() {
            var oList = this.controller.getView().oList,
                aItems = oList.getItems(),
                i, id;

            for(i=0; i<aItems.length; i++) {
                id = aItems[i].getCustomData()[0].getValue();
                oList.setSelectedItem(aItems[i], this.ids.indexOf(id) >=0);
            }

        }.bind({
            controller: this,
            ids: ids
        }));
    },

    _showDetail: function () {
        var i, ids = [];
        for(i=0; i<arguments.length; i++) {
            ids.push(arguments[i].data("id"));
        }
        this.router.navTo("detail", {
            id: ids.join(',')
        });
    },

    _loadData: function() {

        var oAppController,
            oModel,
            oParams,
            oHeaders,
            oDeferred;

        oDeferred = $.Deferred();

        this.loadDataPromise = oDeferred.promise();

        oModel = new sap.ui.model.json.JSONModel();

        oModel.attachRequestCompleted(function() {
            oDeferred.resolve(oModel.getData());
        }, this);

        this.getView().setModel(oModel);

        oAppController = sap.ui.getCore().byId('roleEditorApp').getController();

        oAppController.getCsrfToken(function(csrfToken) {
            oParams = JSON.stringify({
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getAllRoles",
                "inputObject":{}
            });

            oHeaders = {
                "X-CSRF-Token": csrfToken,
                "x-sap-dont-debug": 1,
                "Content-Type": "application/json"
            };

            oModel.loadData(
                "/sap/hana/ide/core/base/server/net.xsjs",  // URL
                oParams,                                    // parameters map
                true,                                       // async
                "POST",                                     // method
                false,                                      // merge
                false,                                      // cache
                oHeaders                                    // request headers
            );
        });
    }
});