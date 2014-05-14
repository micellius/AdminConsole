/**
 * Created by vadimto on 10.05.14.
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.Privileges");
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.detail.Assignment", {

    onInit: function() {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('selectRoles', function () {
            var aRoles = arguments[2],
                oRole,
                oData,
                oView = this.getView();

            oRole = aRoles[0];
            oData = {
                headerTitle: oRole.objectName,
                headerDesctiption: oRole.roleId
            };

            oView.setModel(new sap.ui.model.json.JSONModel(oData));

            // Granted Roles
            this._loadData(oView.oTableRoles, {
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getRolesByGrantee",
                "inputObject":{
                    "grantee": oRole.objectName
                }
            });

            this.loadDataPromise.done(function(data) {
                oView.getModel().setProperty('/headerNumber', data.roles.length);
                oView.getModel().setProperty('/headerUnit', data.roles.length === 1 ? "Object" : "Objects");
            });

            // System Privileges
            this._loadData(oView.oTableSystem, {
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getSystemPrivilegesByGrantee",
                "inputObject":{
                    "grantee": oRole.objectName
                }
            });

            // SQL Privileges
            this._loadData(oView.oTableSql, {
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                "inputObject":{
                    "grantee": oRole.objectName,
                    "type": "object"
                }
            });

            // Package
            this._loadData(oView.oTablePackage, {
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                "inputObject":{
                    "grantee": oRole.objectName,
                    "type": "package"
                }
            });

            // Application
            this._loadData(oView.oTableApplication, {
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                "inputObject":{
                    "grantee": oRole.objectName,
                    "type": "application"
                }
            });

        }, this);
    },

    search: function(oTable, sText) {
        var oBinding = oTable.getBinding("items"),
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

    openPopover: function(oItem) {
        var Privileges = tests.adminconsole.apps.RoleEditor.utils.Privileges,
            oData = oItem.getBindingContext().getObject();

        this.getView().oPopover.setModel(new sap.ui.model.json.JSONModel({
            detailedPrivileges: Privileges.getDefaultPrivilegesByObjectType(oData.objectType)
        }));
        this.getView().oPopover.openBy(oItem);
    },

    toggleEditMode: function() {
        var oView = this.getView(),
            bMode = oView.getModel().getProperty('/editMode');

        // Toggle model
        bMode = !bMode;
        oView.getModel().setProperty('/editMode', bMode);

        // Update tables
        oView.oTableRoles.getModel().setProperty('/editMode', bMode);
        oView.oTableSystem.getModel().setProperty('/editMode', bMode);
        oView.oTableSql.getModel().setProperty('/editMode', bMode);
        oView.oTablePackage.getModel().setProperty('/editMode', bMode);
        oView.oTableApplication.getModel().setProperty('/editMode', bMode);
    },

    openAddDialog: function() {
        var oView = this.getView(),
            oModel = new sap.ui.model.json.JSONModel();

        oView.oAddDialog.setModel(oModel);
        oView.oAddDialog.open();
    },

    addDialogSearch: function(sText) {
        var oView = this.getView(),
            oModel = oView.oAddDialog.getModel();

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                "absoluteFunctionName":"sap.hana.ide.core.base.server.getSqlObjects",
                "inputObject":{
                    "objectName": sText
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
                true,                                       // merge
                false,                                      // cache
                oHeaders                                    // request headers
            );
        });
    },

    addObject: function(oEvent) {

    },

    _loadData: function(component, opts) {
        var oModel,
            oDeferred;

        oDeferred = $.Deferred();

        this.loadDataPromise = oDeferred.promise();

        component.setModel(oModel = new sap.ui.model.json.JSONModel());

        oModel.attachRequestCompleted(function() {
            oDeferred.resolve(oModel.getData());
        }, this);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify(opts);

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
                true,                                       // merge
                false,                                      // cache
                oHeaders                                    // request headers
            );
        });
    }

});