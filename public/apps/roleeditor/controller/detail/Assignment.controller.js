/**
 * Created by vadimto on 10.05.14.
 */
sap.ui.controller("sap.adminconsole.apps.roleeditor.controller.detail.Assignment", {

    onInit: function() {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._onRouteMatched, this);
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('selectRoles', function () {
            var aRoles = arguments[2],
                oRole,
                oData;

            oRole = aRoles[0];
            oData = {
                headerTitle: oRole.objectName,
                headerDesctiption: oRole.roleId,
                headerUnit: 'Object',
                headerNumber: '1'
            };

            this.getView().setModel(new sap.ui.model.json.JSONModel(oData));

            this._loadData(oRole.objectName);
        }, this);
    },

    _onRouteMatched: function() {

    },

    _loadData: function(grantee) {
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
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getRolesByGrantee",
                "inputObject":{
                    "grantee":grantee
                }
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