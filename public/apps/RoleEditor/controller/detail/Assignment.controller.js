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
                oView = this.getView();

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
                    oController._reload();
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
        var oController = this;
        oController._save().done(function() {
            oController.toggleEditMode();
        });
    },

    onCancelPress: function() {
        this._reset();
        this.toggleEditMode();
    },

    onDeletePress: function() {
        this.oAppController.oEventBus.publish('deleteSelectedRoles');
    },

    onDetailedPrivilegeSelect: function(oCheckBox) {
        var oParentPrivilege,
            oPrivilege,
            oData,
            sPrivilege,
            bIsGrantable,
            sType;

        sType = this.getView().oIconTabBar.getSelectedKey();
        oData = oCheckBox.getBindingContext().getObject();
        sPrivilege = oData.privilege;
        bIsGrantable = oData.isGrantable;
        oParentPrivilege = this.getView().oPopover.getModel().getData().item;
        oPrivilege = $.extend({}, oParentPrivilege, {
            privilege: sPrivilege,
            isGrantable: bIsGrantable,
            objectId: [oParentPrivilege.objectName, oParentPrivilege.grantor, sPrivilege].join('-'),
            state: 'new'
        });

        this['_addPrivilegesTo' + (oCheckBox.getSelected() ? 'Grant' : 'Revoke')](sType, oPrivilege);
    },

    onPopoverOkPress: function() {
        this.getView().oPopover.close();
        this.getView().getModel().setProperty('/isModified', true);
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

        // Apply defaults
        oView.oPopover.setModel(oModel = new sap.ui.model.json.JSONModel({
            title: oData.objectName,
            item: oData,
            editMode: oView.getModel().getProperty('/editMode'),
            detailedPrivileges: Privileges.getDefaultPrivilegesByObjectType(oData.objectType)
        }));

        // Apply persisted data
        this._loadDetailedPrivileges(oModel, oData, this.oRole.objectName).done(function() {
            var index,
                aGranted,
                aGrantedPrivileges,
                aRevoked,
                aRevokedPrivileges,
                sType;

            sType = oView.oIconTabBar.getSelectedKey();
            aGranted = oView.getModel().getData()['modified_'+sType+'_privilegesToGrant'] || [];
            aGrantedPrivileges = aGranted.map(function(item) {
                return item.privilege;
            });
            aRevoked = oView.getModel().getData()['modified_'+sType+'_privilegesToRevoke'] || [];
            aRevokedPrivileges = aRevoked.map(function(item) {
                return item.privilege;
            });

            // Apply not persisted changes
            oModel.getData().detailedPrivileges.forEach(function(item, idx, detailedPrivileges) {
                if((index = aGrantedPrivileges.indexOf(item.privilege)) !== -1
                    && aGranted[index].objectName === oData.objectName
                ) {
                    $.extend(item, aGranted[index]);
                } else if((index = aRevokedPrivileges.indexOf(item.privilege)) !== -1) {
                    detailedPrivileges[idx] = {
                        privilege: item.privilege,
                        isGrantable: false
                    }
                }

                oView.oPopover.getModel().refresh(true);
            });

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
            opts = oModel.getData().opts,
            API = tests.adminconsole.apps.RoleEditor.utils.API;

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = {
                "absoluteFunctionName": API.getAbsoluteFunctionName(opts.addSearchFunction),
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
        var Privileges = tests.adminconsole.apps.RoleEditor.utils.Privileges,
            aSelectedItems = oEvent.getParameter('selectedItems'),
            oModel = this.getView().getModel(),
            oTableModel, sTableModelRoot, oData, sType, oPrivilege, aObjectNames,
            i, l, createPrivilege;

        // Key of selected tab
        sType = this.getView().oIconTabBar.getSelectedKey();
        // Model of the table located in selected tab
        oTableModel = this.getView().oIconTabBar.getItems().filter(function(item) {
            return item.getKey() === sType;
        })[0].getContent()[0].getModel();
        // Property in the table model containing all items
        sTableModelRoot = oEvent.oSource.getModel().getData().opts.root.substring(1);
        // Names of the objects already added to the table
        aObjectNames = oTableModel.getData()[sTableModelRoot].map(function(item) {
            return item.objectName
        });
        // Function to be used to create privilege
        createPrivilege = this._privelegeToGrantFactory(sType);

        // Iterate over selected items
        for(i=0, l=aSelectedItems.length; i<l; i++) {
            // Data binded to selected item
            oData = aSelectedItems[i].getBindingContext().getObject();
            // Create privilege object
            oPrivilege = createPrivilege(oData);
            if(aObjectNames.indexOf(oPrivilege.objectName) === -1) {
                // Add item to table
                oTableModel.getData()[sTableModelRoot].push(oPrivilege);
                if(Privileges.getDefaultPrivilegesByObjectType(oPrivilege.objectType).length === 0) {
                    // Add privilege object to save request payload
                    this._addPrivilegesToGrant(sType, oPrivilege);
                }
            }
        }

        // Exit from edit mode
        oModel.setProperty('/isModified', true);
        // Update bindings and UI
        oTableModel.refresh(true);
    },

    deleteObject: function(opts) {
        var oController,
            sType,
            oTable,
            oTableModel,
            oTableData,
            aSelectedItems,
            oPrivilege,
            oModel,
            sTableModelRoot,
            i, l, Privileges;

        // Define Aliases
        oController = this;
        Privileges = tests.adminconsole.apps.RoleEditor.utils.Privileges;
        // Root view model
        oModel = this.getView().getModel();
        // Key of selected tab
        sType = this.getView().oIconTabBar.getSelectedKey();
        // Table located in selected tab
        oTable = this.getView().oIconTabBar.getItems().filter(function(item) {
            return item.getKey() === sType;
        })[0].getContent()[0];
        // Table model
        oTableModel = oTable.getModel();
        // Property in the table model containing all items
        sTableModelRoot = opts.root.substring(1);
        // Selected items in the table located in selected tab
        aSelectedItems = oTable.getSelectedItems();
        // Table data
        oTableData = oTableModel.getData()[sTableModelRoot];

        for(i=0, l=aSelectedItems.length; i<l; i++) {
            // Data binded to selected item
            oPrivilege = aSelectedItems[i].getBindingContext().getObject();
            if(Privileges.getDefaultPrivilegesByObjectType(oPrivilege.objectType).length === 0) {
                // Add privilege to revoke
                this._addPrivilegesToRevoke(sType, oPrivilege);
            } else {
                // Collect all assigned detailed privileges to revoke
                this._getDetailedPrivileges(oPrivilege, this.oRole.objectName, function(data) {
                    var oPrivilege, i, l;
                    for(i=0, l=data.detailedPrivileges.length; i<l; i++) {
                        oPrivilege = data.detailedPrivileges[i];
                        oController._addPrivilegesToRevoke(sType, oPrivilege);
                    }
                });
            }
            // Remove item from table data model
            oTableData.splice(oTableData.indexOf(oPrivilege),1);
        }

        // Clear table selection
        oTable.removeSelections();
        // Update bindings and UI
        oTableModel.refresh(true);
        // Exit from edit mode
        oModel.setProperty('/isModified', true);
    },

    getOpts: function(sKey) {
        switch(sKey) {
            case 'roles':
                return {
                    title: "Granted Roles",
                    root: "/roles",
                    addSearchRoot: "/roles",
                    addSearchFunction: "getAllRoles",
                    addSearchName: "roleName"
                };
            case 'system':
                return {
                    title: "System Privileges",
                    root: "/privileges",
                    addSearchRoot: "/systems",
                    addSearchFunction: "getSystemPrivileges",
                    addSearchName: "sysName"
                };
            case 'sql':
                return {
                    title: "SQL Privileges",
                    root: "/privileges",
                    addSearchRoot: "/objects",
                    addSearchFunction: "getSqlObjects",
                    addSearchName: "objectName"
                };
            case 'package':
                return {
                    title: "Package Privileges",
                    root: "/privileges",
                    addSearchRoot: "/packageInfos",
                    addSearchFunction: "getPackages",
                    addSearchName: "packageName"
                };
            case 'application':
                return {
                    title: "Application Privileges",
                    root: "/privileges",
                    addSearchRoot: "/apps",
                    addSearchFunction: "getApplicationPrivileges",
                    addSearchName: "appName"
                };
            default:
                return {};
        }
    },

    _addPrivilegesToGrant: function(sType, oPrivilege) {
        var oModel = this.getView().getModel(),
            privilegesToGrant = oModel.getProperty('/modified_' + sType + '_privilegesToGrant') || [],
            privilegesToGrantIds = $.map(privilegesToGrant, function(item) {
                return item.objectId;
            }),
            privilegesToRevoke = oModel.getProperty('/modified_' + sType + '_privilegesToRevoke') || [],
            privilegesToRevokeIds = $.map(privilegesToRevoke, function(item) {
                return item.objectId;
            }),
            index;

        if((index = privilegesToRevokeIds.indexOf(oPrivilege.objectId)) !== -1) {
            privilegesToRevoke.splice(index, 1);
        } else if(privilegesToGrantIds.indexOf(oPrivilege.objectId) === -1) {
            privilegesToGrant.push(oPrivilege);
        }

        oModel.setProperty('/modified_' + sType + '_privilegesToGrant', privilegesToGrant);
        oModel.setProperty('/modified_' + sType + '_privilegesToRevoke', privilegesToRevoke);
    },

    _addPrivilegesToRevoke: function(sType, oPrivilege) {
        var oModel = this.getView().getModel(),
            privilegesToGrant = oModel.getProperty('/modified_' + sType + '_privilegesToGrant') || [],
            privilegesToGrantIds = $.map(privilegesToGrant, function(item) {
                return item.objectId;
            }),
            privilegesToRevoke = oModel.getProperty('/modified_' + sType + '_privilegesToRevoke') || [],
            privilegesToRevokeIds = $.map(privilegesToRevoke, function(item) {
                return item.objectId;
            }),
            index;

        if((index = privilegesToGrantIds.indexOf(oPrivilege.objectId)) !== -1) {
            privilegesToGrant.splice(index, 1);
        } else if(privilegesToRevokeIds.indexOf(oPrivilege.objectId) === -1) {
            privilegesToRevoke.push(oPrivilege);
        }

        oModel.setProperty('/modified_' + sType + '_privilegesToGrant', privilegesToGrant);
        oModel.setProperty('/modified_' + sType + '_privilegesToRevoke', privilegesToRevoke);
    },

    _save: function() {
        var oController = this,
            aTypes = ['roles', 'system', 'sql', 'package', 'application'],
            sType, i, l, inputObject,
            API = tests.adminconsole.apps.RoleEditor.utils.API,
            oDeferred,
            oModel,
            oData = this.getView().getModel().getData();

        oDeferred = $.Deferred();

        oModel = new sap.ui.model.json.JSONModel();

        oModel.attachRequestCompleted(function() {
            oController._reset(true); // Apply changes and delete temporary objects from model
            oController._reload();
            oDeferred.resolve(oModel.getData());
        }, this);

        inputObject = {
            privilegesToGrant: [],
            privilegesToRevoke: [],
            roleInfo: {
                roleName: this.oRole.objectName,
                state: 'edit'
            }
        };

        for(i=0, l=aTypes.length; i<l; i++) {
            sType = aTypes[i];
            inputObject.privilegesToGrant = inputObject.privilegesToGrant.concat(oData['modified_'+sType+'_privilegesToGrant'] || []);
            inputObject.privilegesToRevoke = inputObject.privilegesToRevoke.concat(oData['modified_'+sType+'_privilegesToRevoke'] || []);
        }

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                absoluteFunctionName: API.getAbsoluteFunctionName('updatePrivilege4Role'),
                inputObject: inputObject
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

        return oDeferred.promise();
    },

    _reload: function() {
        var oController = this,
            oView = this.getView(),
            API = tests.adminconsole.apps.RoleEditor.utils.API,
            loadedTabsCouter = 0,
            oRole = oController.oRole;

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
    },

    _reset: function(bApplyChanges) {
        var oModel = this.getView().getModel();
        this.getView().oIconTabBar.getItems().forEach(function(item) {
            var oTableModel = item.getContent()[0].getModel(),
                sType = item.getKey(),
                sRoot = this.getOpts(sType).root.substring(1);

            if(bApplyChanges) {
                oTableModel.getData()[sRoot].forEach(function(item) {
                    item.state = 'edit';
                });
            } else {
                oTableModel.getData()[sRoot] = oTableModel.getData()[sRoot].filter(function (item) {
                    return item.state !== 'new';
                });
            }

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
                false,                                      // merge
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
    },

    _getDetailedPrivileges: function(oData, sRoleName, callback) {
        var API = tests.adminconsole.apps.RoleEditor.utils.API;
        this.oAppController.getCsrfToken(function(csrfToken) {
            $.ajax({
                type: "POST",
                url: API.netServiceUrl,
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "x-sap-dont-debug": 1,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    absoluteFunctionName: API.getAbsoluteFunctionName("getDetailedPrivilegesByGrantee"),
                    inputObject: {
                        grantee: sRoleName,
                        objectName: oData.objectName,
                        objectType: oData.objectType
                    }
                })
            }).done(function (data) {
                callback(data);
            });
        });
    }

});