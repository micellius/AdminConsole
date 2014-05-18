/**
 * Created by vadimto on 10.05.14.
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.Privileges");
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.API");
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.detail.Assignment", {

    onInit: function() {
        var oController = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            // Avoid double route match
            if(oEvent.getParameter('name') !== 'master') {
                // Remember old arguments to avoid redundant ajax calls on internal route change
                oController.oOldRouteArguments = oController.oRouteArguments;
                oController.oRouteArguments = oEvent.getParameters().arguments;
            }
        });
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('selectRoles', function () {
            var aRoles = arguments[2],
                oRole,
                oData,
                oView = this.getView(),
                loadedTabsCouter = 0,
                API = tests.adminconsole.apps.RoleEditor.utils.API;

            function onTabLoaded() {
                var sTab = oController.oRouteArguments.tab || 'roles',
                    numberOfItems,
                    oModel = oView.getModel();

                loadedTabsCouter++;
                if(loadedTabsCouter === 5) {
                    oView.oIconTabBar.setSelectedKey(sTab);
                    numberOfItems = oView.oIconTabBar.getItems().filter(function(item) {
                        return item.getKey() === sTab;
                    })[0].getContent()[0].getItems().length;
                    oModel.setProperty('/headerNumber', numberOfItems);
                    oModel.setProperty('/headerUnit', numberOfItems === 1 ? "Object" : "Objects");
                }
            }

            if(!oController.oOldRouteArguments ||
                oController.oOldRouteArguments.id !== oController.oRouteArguments.id
            ) {

                this.oRole = oRole = aRoles[0];

                if(oRole) {
                    oData = {
                        headerTitle: oRole.objectName,
                        headerDesctiption: oRole.roleId
                    };

                    oView.setModel(new sap.ui.model.json.JSONModel(oData));

                    // Granted Roles
                    this._loadData(oView.oTableRoles, {
                        "absoluteFunctionName": API.getAbsoluteFunctionName("getRolesByGrantee"),
                        "inputObject": {
                            "grantee": oRole.objectName
                        }
                    }).done(onTabLoaded);

                    // System Privileges
                    this._loadData(oView.oTableSystem, {
                        "absoluteFunctionName": API.getAbsoluteFunctionName("getSystemPrivilegesByGrantee"),
                        "inputObject": {
                            "grantee": oRole.objectName
                        }
                    }).done(onTabLoaded);

                    // SQL Privileges
                    this._loadData(oView.oTableSql, {
                        "absoluteFunctionName": API.getAbsoluteFunctionName("getPrivilegesByGrantee"),
                        "inputObject": {
                            "grantee": oRole.objectName,
                            "type": "object"
                        }
                    }).done(onTabLoaded);

                    // Package
                    this._loadData(oView.oTablePackage, {
                        "absoluteFunctionName": API.getAbsoluteFunctionName("getPrivilegesByGrantee"),
                        "inputObject": {
                            "grantee": oRole.objectName,
                            "type": "package"
                        }
                    }).done(onTabLoaded);

                    // Application
                    this._loadData(oView.oTableApplication, {
                        "absoluteFunctionName": API.getAbsoluteFunctionName("getPrivilegesByGrantee"),
                        "inputObject": {
                            "grantee": oRole.objectName,
                            "type": "application"
                        }
                    }).done(onTabLoaded);
                }
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

    onSavePress: function() {
        console.log('Save:', this.getView().getModel().getData());
        this.toggleEditMode();
    },

    onCancelPress: function() {
        this._reset();
        this.toggleEditMode();
    },

    onDeletePress: function() {
        this.oAppController.oEventBus.publish('deleteSelectedRoles');
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
                oHeaders,
                API = tests.adminconsole.apps.RoleEditor.utils.API;

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
                API.netServiceUrl,                          // URL
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
        var aSelectedItems = oEvent.getParameter('selectedItems'),
            privilegesToGrant,
            privilegesToGrantIds,
            oModel = this.getView().getModel(),
            oTableModel, sTableModelRoot, oData, sType, sPath, oPrivilege,
            i, l, createPrivilege;

        sType = this.getView().oIconTabBar.getSelectedKey();
        sPath = '/modified_' + sType + '_privilegesToGrant';
        oTableModel = this.getView().oIconTabBar.getItems().filter(function(item) {
            return item.getKey() === sType;
        })[0].getContent()[0].getModel();
        sTableModelRoot = oEvent.oSource.getModel().getData().opts.root.substring(1);
        createPrivilege = this._privelegeToGrantFactory(sType);
        privilegesToGrant = (oModel.getProperty(sPath) || []);
        privilegesToGrantIds = $.map(privilegesToGrant, function(item) {
            return item.objectId;
        });

        for(i=0, l=aSelectedItems.length; i<l; i++) {
            oData = aSelectedItems[i].getBindingContext().getObject();
            oPrivilege = createPrivilege(oData);
            if(privilegesToGrantIds.indexOf(oPrivilege.objectId) === -1) { // Don't add duplicates
                privilegesToGrant.push(oPrivilege);
            }
        }

        if(privilegesToGrant.length > 0) {
            oModel.setProperty(sPath, privilegesToGrant);
            oModel.setProperty('/isModified', true);
            oTableModel.getData()[sTableModelRoot] = oTableModel.getData()[sTableModelRoot].concat(privilegesToGrant);
            oTableModel.refresh(true);
        }

    },

    getOpts: function(sKey) {
        switch(sKey) {
            case 'roles':
                return {
                    title: "Granted Roles",
                    root: "/roles",
                    addSearchRoot: "/roles",
                    addSearchFunction: "sap.hana.ide.core.base.server.getAllRoles",
                    addSearchName: "roleName"
                };
            case 'system':
                return {
                    title: "System Privileges",
                    root: "/privileges",
                    addSearchRoot: "/systems",
                    addSearchFunction: "sap.hana.ide.core.base.server.getSystemPrivileges",
                    addSearchName: "sysName"
                };
            case 'sql':
                return {
                    title: "SQL Privileges",
                    root: "/privileges",
                    addSearchRoot: "/objects",
                    addSearchFunction: "sap.hana.ide.core.base.server.getSqlObjects",
                    addSearchName: "objectName"
                };
            case 'package':
                return {
                    title: "Package Privileges",
                    root: "/privileges",
                    addSearchRoot: "/packageInfos",
                    addSearchFunction: "sap.hana.ide.core.base.server.getPackages",
                    addSearchName: "packageName"
                };
            case 'application':
                return {
                    title: "Application Privileges",
                    root: "/privileges",
                    addSearchRoot: "/apps",
                    addSearchFunction: "sap.hana.ide.core.base.server.getApplicationPrivileges",
                    addSearchName: "appName"
                };
            default:
                return {};
        }
    },

    _reset: function() {
        var oModel = this.getView().getModel();
        this.getView().oIconTabBar.getItems().forEach(function(item) {
            var oTableModel = item.getContent()[0].getModel(),
                sType = item.getKey(),
                sRoot = this.getOpts(sType).root.substring(1);

            oTableModel.getData()[sRoot] = oTableModel.getData()[sRoot].filter(function(item) {
                return item.state !== 'new';
            });

            oTableModel.refresh(true);

            oModel.setProperty('/modified_' + sType + '_privilegesToGrant', []);

        }, this);
        oModel.setProperty('/isModified', false);
    },

    _privelegeToGrantFactory: function(sType) {
        switch(sType) {
            case 'roles':
                return function(oData) {
                    return {
                        detailedItems: null,
                        grantor: oData.roleCreator,
                        isGrantable: 'FALSE',
                        objectId: oData.objectName + '-' + oData.roleCreator,
                        objectName: oData.objectName,
                        objectType: 'ROLE',
                        privilege: 'role',
                        state: 'new'
                    };
                };
            case 'system':
                return function(oData) {
                    return {
                        detailedItems: {},
                        grantor: 'SYSTEM',
                        isGrantable: 'FALSE',
                        objectId: oData.objectName + '-SYSTEM',
                        objectName: oData.objectName,
                        objectType: 'SYSTEMPRIVILEGE',
                        privilege: '',
                        state: 'new'
                    };
                };
            case 'sql':
                return function(oData) {
                    return {
                        grantor: 'SYSTEM',
                        isGrantable: 'FALSE',
                        objectId: oData.objectName + '-SYSTEM',
                        objectName: oData.objectName,
                        objectType: oData.type,
                        privilege: '',
                        schemaName: oData.schemaName,
                        state: 'new'
                    };
                };
            case 'package':
                return function(oData) {
                    return {
                        grantor: 'SYSTEM',
                        isGrantable: 'FALSE',
                        objectId: oData.objectName + '-SYSTEM',
                        objectName: oData.packageName,
                        objectType: 'REPO',
                        privilege: '',
                        schemaName: oData.packageName,
                        state: 'new'
                    };
                };
            case 'application':
                return function(oData) {
                    return {
                        detailedItems: {},
                        grantor: '_SYS_REPO',
                        isGrantable: 'FALSE',
                        objectId: oData.objectName + '-_SYS_REPO',
                        objectName: oData.objectName,
                        objectType: 'APPLICATIONPRIVILEGE',
                        privilege: '',
                        state: 'new'
                    };
                };
            default:
                return function() {return null;}
        }
    },

    _loadData: function(component, opts) {
        var oModel,
            oDeferred,
            API = tests.adminconsole.apps.RoleEditor.utils.API;

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
                API.netServiceUrl,                          // URL
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
            oDeferred,
            API = tests.adminconsole.apps.RoleEditor.utils.API;

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
                absoluteFunctionName: API.getAbsoluteFunctionName("getDetailedPrivilegesByGrantee"),
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
                API.netServiceUrl,                          // URL
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