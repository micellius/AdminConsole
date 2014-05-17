/**
 * Created by vadimto on 10.05.14.
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.Privileges");
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.detail.Assignment", {

    onInit: function() {
        var oController = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            // Remember old arguments to avoid redundant ajax calls
            oController.oOldRouteArguments = oController.oRouteArguments;
            oController.oRouteArguments = oEvent.getParameters().arguments;
        });
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('selectRoles', function () {
            var aRoles = arguments[2],
                oRole,
                oData,
                oView = this.getView(),
                loadedTabsCouter = 0;

            function onTabLoaded() {
                var sTab = oController.oRouteArguments.tab || 'roles';

                loadedTabsCouter++;
                if(loadedTabsCouter === 5) {
                    oView.oIconTabBar.setSelectedKey(sTab);
                }
            }

            if(!oController.oOldRouteArguments ||
                oController.oOldRouteArguments.id !== oController.oRouteArguments.id
            ) {

                this.oRole = oRole = aRoles[0];
                oData = {
                    headerTitle: oRole.objectName,
                    headerDesctiption: oRole.roleId
                };

                oView.setModel(new sap.ui.model.json.JSONModel(oData));

                // Granted Roles
                this._loadData(oView.oTableRoles, {
                    "absoluteFunctionName": "sap.hana.ide.core.base.server.getRolesByGrantee",
                    "inputObject": {
                        "grantee": oRole.objectName
                    }
                }).done(onTabLoaded);

                // System Privileges
                this._loadData(oView.oTableSystem, {
                    "absoluteFunctionName": "sap.hana.ide.core.base.server.getSystemPrivilegesByGrantee",
                    "inputObject": {
                        "grantee": oRole.objectName
                    }
                }).done(onTabLoaded);

                // SQL Privileges
                this._loadData(oView.oTableSql, {
                    "absoluteFunctionName": "sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                    "inputObject": {
                        "grantee": oRole.objectName,
                        "type": "object"
                    }
                }).done(onTabLoaded);

                // Package
                this._loadData(oView.oTablePackage, {
                    "absoluteFunctionName": "sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                    "inputObject": {
                        "grantee": oRole.objectName,
                        "type": "package"
                    }
                }).done(onTabLoaded);

                // Application
                this._loadData(oView.oTableApplication, {
                    "absoluteFunctionName": "sap.hana.ide.core.base.server.getPrivilegesByGrantee",
                    "inputObject": {
                        "grantee": oRole.objectName,
                        "type": "application"
                    }
                }).done(onTabLoaded);

            } else {
                if(oView.oIconTabBar.getSelectedKey() !== oController.oRouteArguments.tab) {
                    // Synch URL -> tab
                    oView.oIconTabBar.setSelectedKey(oController.oRouteArguments.tab);
                }
            }

        }, this);
    },

    onIconBarSelect: function(oEvent) {
        var oModel = this.getView().getModel(),
            numberOfItems = oEvent.getParameter('selectedItem').getContent()[0].getItems().length;
        this.router.navTo('assignment', {
            id: this.oRouteArguments.id,
            tab: this.getView().oIconTabBar.getSelectedKey()
        });
        oModel.setProperty('/headerNumber', numberOfItems);
        oModel.setProperty('/headerUnit', numberOfItems === 1 ? "Object" : "Objects");
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
            oData = oItem.getBindingContext().getObject(),
            oView = this.getView(),
            oModel;

        oView.oPopover.setModel(oModel = new sap.ui.model.json.JSONModel({
            title: oData.objectName,
            editMode: oView.getModel().getProperty('/editMode'),
            detailedPrivileges: Privileges.getDefaultPrivilegesByObjectType(oData.objectType)
        }));

        this._loadDetailedPrivileges(oModel, oData, this.oRole.objectName).done(function() {
            oView.oPopover.openBy(oItem);
        });


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

    openAddDialog: function(opts) {
        var oModel = new sap.ui.model.json.JSONModel({
                opts: opts
            }),
            oDialog = this.getView().oAddDialog;

        oDialog.unbindAggregation('items');
        oDialog.bindAggregation('items', {
            path: opts.addSearchRoot,
            factory: function(sId) {
                return new sap.m.ColumnListItem(sId, {
                    cells: [new sap.m.Text({
                        text: '{'+opts.addSearchName+'}'
                    })]
                });
            }
        });
        oDialog.setModel(oModel);
        oDialog.open();
    },

    addDialogSearch: function(sText) {
        var oView = this.getView(),
            oModel = oView.oAddDialog.getModel(),
            opts = oModel.getData().opts;

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = {
                "absoluteFunctionName": opts.addSearchFunction,
                "inputObject":{}
            };
            oParams.inputObject[opts.addSearchName] = sText;
            oParams = JSON.stringify(oParams);

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

        return oDeferred.promise();
    },

    _loadDetailedPrivileges: function(oTargetModel, oData, sRoleName) {
        var oModel,
            oDeferred;

        oDeferred = $.Deferred();

        oModel = new sap.ui.model.json.JSONModel();

        oModel.attachRequestCompleted(function() {
            var i, l,
                detailedPrivileges = oModel.getData().detailedPrivileges,
                privilegesMap = {},
                privilege;

            for(i=0, l=detailedPrivileges.length; i<l; i++) {
                privilegesMap[detailedPrivileges[i].privilege] = detailedPrivileges[i];
            }

            detailedPrivileges = oTargetModel.getData().detailedPrivileges; // Reuse detailedPrivileges
            for(i=0, l=detailedPrivileges.length; i<l; i++) {
                privilege = detailedPrivileges[i].privilege;
                detailedPrivileges[i] = privilegesMap[privilege] || detailedPrivileges[i];
            }
            oTargetModel.refresh(true);

            oDeferred.resolve(oModel.getData());
        }, this);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                absoluteFunctionName: "sap.hana.ide.core.base.server.getDetailedPrivilegesByGrantee",
                inputObject: {
                    grantee: sRoleName,
                    objectName: oData.objectName,
                    objectType: oData.objectType
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

        return oDeferred.promise();
    }

});