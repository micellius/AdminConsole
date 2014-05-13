/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.master.Master", {
    onInit : function () {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._onRouteMatched, this);
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
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

    search: function(sText) {
        var oList = this.getView().oList,
            oBinding = oList.getBinding("items"),
            oFilter;

        if (oBinding) {
            if (sText.length !== 0) {
                oFilter = new sap.ui.model.Filter("objectName", sap.ui.model.FilterOperator.Contains, sText);
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        }
    },

    sort: function() {
        var oModel = this.getView().getModel(),
            sSortingOrder = oModel.getProperty("/sortingOrder") === "DESC" ? "ASC" : "DESC",
            oList = this.getView().oList,
            oBinding = oList.getBinding("items"),
            oSorter;

        oModel.setProperty("/sortingOrder", sSortingOrder);

        if(oBinding) {
            oSorter = new sap.ui.model.Sorter("objectName", sSortingOrder === "DESC");
            oBinding.sort([oSorter]);
        }
    },

    _selectItems: function(ids) {
        this.loadDataPromise.done(function() {
            var oList = this.controller.getView().oList,
                aItems = oList.getItems(),
                aSelectedItems = [],
                i, sId, bSelected;

            for(i=0; i<aItems.length; i++) {
                sId = aItems[i].getCustomData()[0].getValue();
                bSelected = this.ids.indexOf(sId) >= 0;
                oList.setSelectedItem(aItems[i], bSelected);
                bSelected && aSelectedItems.push(aItems[i].getBindingContext().getObject());
            }

            this.controller.oAppController.oEventBus.publish('selectRoles', aSelectedItems);

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

        var oModel,
            oDeferred;

        oDeferred = $.Deferred();

        this.loadDataPromise = oDeferred.promise();

        oModel = new sap.ui.model.json.JSONModel();

        oModel.attachRequestCompleted(function() {
            oDeferred.resolve(oModel.getData());
        }, this);

        this.getView().setModel(oModel);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

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