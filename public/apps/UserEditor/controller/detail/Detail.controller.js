/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
jQuery.sap.require("tests.adminconsole.apps.UserEditor.utils.API");
sap.ui.controller("tests.adminconsole.apps.UserEditor.controller.detail.Detail", {

    onInit: function() {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            controller.oRouteArguments = oEvent.getParameters().arguments;
            if(!controller.oRouteArguments.id) {
                controller.oAppController.oEventBus.publish('selectUsers',[]); // New User
            }
        });
        this.oAppController = sap.ui.getCore().byId('userEditorApp').getController();
        this.oAppController.oEventBus.subscribe('deleteSelectedUsers', function() {
            controller.onDeletePress();
        });
        this.oAppController.oEventBus.subscribe('selectUsers', function() {
            var aUsers = arguments[2],
                oUser,
                oData;

            switch(aUsers.length) {
            case 0:
                oData = {
                    headerTitle: 'New User',
                    headerDesctiption: '',
                    headerUnit: 'User',
                    headerNumber: '1',
                    generalName: 'New User',
                    generalPassword: '',
                    generalValidFrom: null,
                    generalValidUntil: null,
                    propertiesPasswordEnabled: false,
                    propertiesKerberosEnabled: false,
                    propertiesSAMLEnabled: false,
                    propertiesX509Enabled: false,
                    propertiesSapLogonTicketEnabled: false,
                    propertiesSapAssertionTicketEnabled: false,
                    editMode: true,
                    newMode: true,
                    allowAssign: false,
                    deleteDialogTitle: "Delete User?",
                    deleteDialogText: "Are you sure you want to delete user?"
                };
                break;
            case 1:
                oUser = aUsers[0];
                oData = {
                    headerTitle: oUser.userName,
                    headerDesctiption: oUser.userMode,
                    headerUnit: 'User',
                    headerNumber: '1',
                    generalName: oUser.userName,
                    generalPassword: '',
                    generalValidFrom: oUser.validFrom,
                    generalValidUntil: oUser.validUntil,
                    propertiesPasswordEnabled: oUser.isPasswordEnabled,
                    propertiesKerberosEnabled: oUser.isKerberosEnabled,
                    propertiesSAMLEnabled: oUser.isSAMLEnabled,
                    propertiesX509Enabled: oUser.isX509Enabled,
                    propertiesSapLogonTicketEnabled: oUser.isSapLogonTicketEnabled,
                    propertiesSapAssertionTicketEnabled: oUser.isSapAssertionTicketEnabled,
                    editMode: false,
                    newMode: false,
                    allowAssign: true,
                    deleteDialogTitle: "Delete User?",
                    deleteDialogText: "Are you sure you want to delete user\n" + oUser.userName + "?"
                };
                break;
            default:
                oData = {
                    headerTitle: 'Collective Selection',
                    headerDesctiption: aUsers.map(function(item) {
                        return item.userName
                    }).join(', '),
                    headerUnit: 'Users',
                    headerNumber: aUsers.length,
                    generalName: '',
                    generalPassword: '',
                    generalValidFrom: null,
                    generalValidUntil: null,
                    propertiesPasswordEnabled: false,
                    propertiesKerberosEnabled: false,
                    propertiesSAMLEnabled: false,
                    propertiesX509Enabled: false,
                    propertiesSapLogonTicketEnabled: false,
                    propertiesSapAssertionTicketEnabled: false,
                    editMode: false,
                    newMode: false,
                    allowAssign: false,
                    deleteDialogTitle: "Delete Users?",
                    deleteDialogText: "Are you sure you want to delete users:\n" + aUsers.map(function(item) {
                        return item.userName
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
            API = tests.adminconsole.apps.UserEditor.utils.API;
        oView.setBusy(true);
        oController._createUser(oModel.getData(), !oModel.getProperty('/newMode')).
            done(function() {
                oController._getUser(sName).
                    done(function(oUser) {
                        oUser = API.normalizeUser(oUser);
                        oModel.setData({
                            headerTitle: oUser.userName,
                            headerDesctiption: oUser.userMode,
                            headerUnit: 'User',
                            headerNumber: '1',
                            generalName: oUser.userName,
                            generalPassword: '',
                            generalValidFrom: oUser.validFrom,
                            generalValidUntil: oUser.validUntil,
                            propertiesPasswordEnabled: oUser.isPasswordEnabled,
                            propertiesKerberosEnabled: oUser.isKerberosEnabled,
                            propertiesSAMLEnabled: oUser.isSAMLEnabled,
                            propertiesX509Enabled: oUser.isX509Enabled,
                            propertiesSapLogonTicketEnabled: oUser.isSapLogonTicketEnabled,
                            propertiesSapAssertionTicketEnabled: oUser.isSapAssertionTicketEnabled,
                            editMode: false,
                            newMode: false,
                            deleteDialogTitle: "Delete User?",
                            deleteDialogText: "Are you sure you want to delete user\n" + oUser.userName + "?"
                        });
                        oController.oAppController.oEventBus.publish('addUser', oUser);
                    }).
                    fail(function() {
                        console.error('Get user failed!');
                    }).
                    always(function() {
                        oView.setBusy(false);
                        oModel.setProperty('/editMode', false);
                    });
            }).
            fail(function() {
                console.error('Create user failed!');
            });
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
            this._deleteUser(sName = aNames[i]).
                done(function(sName) { // Wrap with closure, otherwise sName will always be the last one
                    return function () {
                        oEventBus.publish('deleteUser', {
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

    _createUser: function(oData, bUpdate) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.UserEditor.utils.API;

        function booleanToString(bValue) {
            return !!bValue ? "TRUE" : "FALSE";
        }

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
                "absoluteFunctionName": API.getAbsoluteFunctionName("updatePrivilege4User"),
                "inputObject": {
                    "userInfo": {
                        isKerberosEnabled: booleanToString(oData.propertiesKerberosEnabled),
                        isPasswordEnabled: booleanToString(oData.propertiesPasswordEnabled),
                        isSAMLEnabled: booleanToString(oData.propertiesSAMLEnabled),
                        isSapAssertionTicketEnabled: booleanToString(oData.propertiesSapAssertionTicketEnabled),
                        isSapLogonTicketEnabled: booleanToString(oData.propertiesSapLogonTicketEnabled),
                        isX509Enabled: booleanToString(oData.propertiesX509Enabled),
                        password: oData.generalPassword,
                        samlInfo: [],
                        state: bUpdate ? "edit" : "new",
                        userName: oData.generalName,
                        validFrom: oData.generalValidFrom,
                        validUntil: oData.generalValidUntil,
                        x509Info: []

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

    _getUser: function(sUserName) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.UserEditor.utils.API;

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
                "absoluteFunctionName": API.getAbsoluteFunctionName("getUser"),
                "inputObject": {
                    "userName": sUserName
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

    _deleteUser: function(sUserName) {
        var oModel = new sap.ui.model.json.JSONModel(),
            oDeferred = $.Deferred(),
            API = tests.adminconsole.apps.UserEditor.utils.API;

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
                "absoluteFunctionName": API.getAbsoluteFunctionName("deleteUser"),
                "inputObject": {
                    "userName": sUserName
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