/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.API");
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.detail.Detail", {

    onInit: function() {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            controller.oRouteArguments = oEvent.getParameters().arguments;
            if(!controller.oRouteArguments.id) {
                controller.oAppController.oEventBus.publish('selectRoles',[]); // New Role
            }
        });
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('deleteSelectedRoles', function() {
            controller.onDeletePress();
        });
        this.oAppController.oEventBus.subscribe('selectRoles', function() {
            var aRoles = arguments[2],
                oRole,
                oData;

            switch(aRoles.length) {
            case 0:
                oData = {
                    headerTitle: 'New Role',
                    headerDesctiption: '',
                    headerUnit: 'Object',
                    headerNumber: '1',
                    generalName: 'New Role',
                    generalId: '',
                    propertiesRoleMode: '',
                    propertiesRoleCreator: '',
                    editMode: true,
                    newMode: true,
                    allowAssign: false,
                    deleteDialogTitle: "Delete Role?",
                    deleteDialogText: "Are you sure you want to delete role?"
                };
                break;
            case 1:
                oRole = aRoles[0];
                oData = {
                    headerTitle: oRole.objectName,
                    headerDesctiption: oRole.roleId,
                    headerUnit: 'Object',
                    headerNumber: '1',
                    generalName: oRole.objectName,
                    generalId: oRole.roleId,
                    propertiesRoleMode: oRole.roleMode,
                    propertiesRoleCreator: oRole.roleCreator,
                    editMode: false,
                    newMode: false,
                    allowAssign: true,
                    deleteDialogTitle: "Delete Role?",
                    deleteDialogText: "Are you sure you want to delete role\n" + oRole.objectName + "?"
                };
                break;
            default:
                oData = {
                    headerTitle: 'Collective Selection',
                    headerDesctiption: aRoles.map(function(item) {
                        return item.objectName
                    }).join(', '),
                    headerUnit: 'Objects',
                    headerNumber: aRoles.length,
                    generalName: '',
                    generalId: '',
                    propertiesRoleMode: '',
                    propertiesRoleCreator: '',
                    editMode: false,
                    newMode: false,
                    allowAssign: false,
                    deleteDialogTitle: "Delete Roles?",
                    deleteDialogText: "Are you sure you want to delete roles:\n" + aRoles.map(function(item) {
                        return item.objectName
                    }).join(', ') + "?"
                };
                break;
            }

            this.getView().setModel(new sap.ui.model.json.JSONModel(oData));

        }, this);
    },

    onSavePress: function() {
        var oController = this,
            oModel = this.getView().getModel(),
            oView = this.oAppController.getView(),
            sName = oModel.getProperty('/generalName'),
            API = tests.adminconsole.apps.RoleEditor.utils.API;
        oView.setBusy(true);
        if(oModel.getProperty('/newMode')) {
            oController._createRole(sName).
                done(function() {
                    oController._getRole(sName).
                        done(function(oRole) {
                            oRole = API.normalizeRole(oRole);
                            oModel.setData({
                                headerTitle: oRole.objectName,
                                headerDesctiption: oRole.roleId,
                                headerUnit: 'Object',
                                headerNumber: '1',
                                generalName: oRole.objectName,
                                generalId: oRole.roleId,
                                propertiesRoleMode: oRole.roleMode,
                                propertiesRoleCreator: oRole.roleCreator,
                                editMode: false,
                                newMode: false,
                                deleteDialogTitle: "Delete Role?",
                                deleteDialogText: "Are you sure you want to delete role\n" + oRole.objectName + "?"
                            });
                            oController.oAppController.oEventBus.publish('addRole', oRole);
                        }).
                        fail(function() {
                            console.error('Get role failed!');
                        }).
                        always(function() {
                            oView.setBusy(false);
                            oModel.setProperty('/editMode', false);
                        });
                }).
                fail(function() {
                    console.error('Create role failed!');
                });
        }
    },

    onCancelPress: function() {
        this.getView().getModel().setProperty("/editMode", false);
        this.router.navTo('empty');
    },

    onDeletePress: function() {
        var oView = this.getView(),
            oData = oView.getModel().getData(),
            oDialog = oView.oDeleteDialog;

        oDialog.setTitle(oData.deleteDialogTitle);
        oDialog.getContent()[0].setText(oData.deleteDialogText);
        oDialog.open();
    },

    onDeleteDialogDeletePress: function() {
        var oRouter = this.router,
            oEventBus = this.oAppController.oEventBus,
            oView = this.getView(),
            aNames,
            sName,
            i, l, c;

        if(sName = this.getView().getModel().getProperty('/generalName')) {
            aNames = [sName];
        } else {
            aNames = this.getView().getModel().getProperty('/headerDesctiption').split(', ');
        }

        for(i=0, c=0, l=aNames.length; i<l; i++) {
            this._deleteRole(sName = aNames[i]).
                done(function(sName) { // Wrap with closure, otherwise sName will always be the last one
                    return function () {
                        oEventBus.publish('deleteRole', {
                            roleName: sName
                        });
                    }
                }(sName)).
                always(function () {
                    c++;
                    if(c === l) {
                        oRouter.navTo('empty');
                        oView.oDeleteDialog.close();
                    }
                });
        }
    },

    _createRole: function(sRoleName) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.RoleEditor.utils.API;

        oModel.attachRequestCompleted(function(oEvent) {
            if(oEvent.getParameter('success')) {
                oDeferred.resolve(oModel.getData());
            } else {
                oDeferred.reject();
            }
        }, this);

        oModel.attachRequestFailed(function() {
            oDeferred.reject();
        }, this);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                "absoluteFunctionName": API.getAbsoluteFunctionName("updatePrivilege4Role"),
                "inputObject": {
                    "roleInfo": {
                        "roleName": sRoleName,
                        "state": "new"
                    },
                    privilegesToGrant: [],
                    privilegesToRevoke: []
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

    _getRole: function(sRoleName) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.RoleEditor.utils.API;

        oModel.attachRequestCompleted(function(oEvent) {
            if(oEvent.getParameter('success')) {
                oDeferred.resolve(oModel.getData());
            } else {
                oDeferred.reject();
            }
        }, this);

        oModel.attachRequestFailed(function() {
            oDeferred.reject();
        }, this);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                "absoluteFunctionName": API.getAbsoluteFunctionName("getRole"),
                "inputObject": {
                    "roleName": sRoleName
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

    _deleteRole: function(sRoleName) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.RoleEditor.utils.API;

        oModel.attachRequestCompleted(function(oEvent) {
            if(oEvent.getParameter('success')) {
                oDeferred.resolve(oModel.getData());
            } else {
                oDeferred.reject();
            }
        }, this);

        oModel.attachRequestFailed(function() {
            oDeferred.reject();
        }, this);

        this.oAppController.getCsrfToken(function(csrfToken) {
            var oParams,
                oHeaders;

            oParams = JSON.stringify({
                "absoluteFunctionName": API.getAbsoluteFunctionName("deleteRole"),
                "inputObject": {
                    "roleName": sRoleName
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