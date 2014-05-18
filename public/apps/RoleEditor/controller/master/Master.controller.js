/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.API");
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.master.Master", {
    onInit : function () {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._onRouteMatched, this);
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('deleteRole', function() {
            var sRoleName = arguments[2].roleName,
                oData = controller.getView().getModel().getData(),
                oRole,
                i, l;

            controller.getView().oList.removeSelections(true);

            for(i = 0, l = oData.roles.length; i < l; i++) {
                oRole = oData.roles[i];
                if(oRole.roleName === sRoleName) {
                    oData.roles.splice(i, 1);
                    controller.getView().getModel().refresh(true);
                    break;
                }
            }

        });
        this.oAppController.oEventBus.subscribe('addRole', function() {
            var oRole = arguments[2];
                oModel = controller.getView().getModel();
            oModel.getData().roles.push(oRole);
            oModel.refresh(true);
            controller.router.navTo('detail', {
                id: oRole.roleId
            })
        });
        this._loadData();
    },

    onListSelect: function() {
        var aSelectedItems = this.getView().oList.getSelectedItems();
        if(aSelectedItems.length > 0) {
            this._showDetail.apply(this, aSelectedItems);
        } else {
            this.router.navTo("empty");
        }
    },

    onListItemPress: function(oEvent) {
        this._showDetail(oEvent.getParameter("listItem"));
    },

    onAddRolePress: function() {
        this.getView().oList.removeSelections(true);
        this.router.navTo("detail", {
            id: ''
        });
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
            oDeferred,
            API = tests.adminconsole.apps.RoleEditor.utils.API;

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
                "absoluteFunctionName": API.getAbsoluteFunctionName("getAllRoles"),
                "inputObject":{}
            });

            oHeaders = {
                "X-CSRF-Token": csrfToken,
                "x-sap-dont-debug": 1,
                "Content-Type": "application/json"
            };

            oModel.loadData(
                API.netServiceUrl,                          // URL
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