/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
jQuery.sap.require("tests.adminconsole.apps.UserEditor.utils.API");
sap.ui.controller("tests.adminconsole.apps.UserEditor.controller.master.Master", {
    onInit : function () {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._onRouteMatched, this);
        this.oAppController = sap.ui.getCore().byId('userEditorApp').getController();
        this.oAppController.oEventBus.subscribe('deleteUser', function() {
            var sUserName = arguments[2].userName,
                oData = controller.getView().getModel().getData(),
                oUser,
                i, l;

            controller.getView().oList.removeSelections(true);

            for(i = 0, l = oData.users.length; i < l; i++) {
                oUser = oData.users[i];
                if(oUser.userName === sUserName) {
                    oData.users.splice(i, 1);
                    controller.getView().getModel().refresh(true);
                    break;
                }
            }

        });
        this.oAppController.oEventBus.subscribe('addUser', function() {
            var oUser = arguments[2],
                oModel = controller.getView().getModel();
            oModel.getData().users.push(oUser);
            oModel.refresh(true);
            controller.router.navTo('detail', {
                id: oUser.userName
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

    onAddUserPress: function() {
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
                oFilter = new sap.ui.model.Filter("userName", sap.ui.model.FilterOperator.Contains, sText);
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
            oSorter = new sap.ui.model.Sorter("userName", sSortingOrder === "DESC");
            oBinding.sort([oSorter]);
        }
    },

    onSettingsPress: function() {
        this.getView().oSettingsDialog.open();
    },

    onSettingsDialogResetPress: function() {
        var oController = this,
            oView = this.getView(),
            API = tests.adminconsole.apps.UserEditor.utils.API,
            sIotUser = oView.oSettingsDialogIotUserInput.getValue(),
            sLumiraTechUser = oView.oSettingsDialogLumiraTechUserInput.getValue(),
            sLumiraAnalystUser = oView.oSettingsDialogLumiraAnalystUserInput.getValue();

        this.oAppController.getCsrfToken(function(csrfToken) {

            // IOT User
            $.ajax({
                type: "POST",
                url: API.netServiceUrl,
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "x-sap-dont-debug": 1,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "absoluteFunctionName": API.getAbsoluteFunctionName("updatePrivilege4User"),
                    "inputObject":{
                        privilegesToGrant: [],
                        privilegesToRevoke: [{
                            grantee: sIotUser,
                            granteeType: "USER",
                            grantor: "_SYS_REPO",
                            isGrantable: "FALSE",
                            objectId: "adminconsole::IOT-_SYS_REPO",
                            objectName: "adminconsole::IOT",
                            objectType: "ROLE",
                            roleName: "adminconsole::IOT",
                            state: "edit"
                        }],
                        userInfo: {
                            state: "edit",
                            userName: sIotUser
                        }
                    }
                })
            }).done(function () {
                jQuery.sap.log.info("Reset IOT user permissions successful!");
                oController.getView().oSettingsDialog.close();
            }).fail(function() {
                jQuery.sap.log.error("Reset IOT user permissions failed!");
                oController.getView().oSettingsDialog.close();
            });

            // Lumira Technical User
            $.ajax({
                type: "POST",
                url: API.netServiceUrl,
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "x-sap-dont-debug": 1,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "absoluteFunctionName": API.getAbsoluteFunctionName("updatePrivilege4User"),
                    "inputObject":{
                        privilegesToGrant: [],
                        privilegesToRevoke: [{
                            grantee: sLumiraTechUser,
                            granteeType: "USER",
                            grantor: "_SYS_REPO",
                            isGrantable: "FALSE",
                            objectId: "sap.bi.common::BI_TECH_USER-_SYS_REPO",
                            objectName: "sap.bi.common::BI_TECH_USER",
                            objectType: "ROLE",
                            roleName: "sap.bi.common::BI_TECH_USER",
                            state: "edit"
                        }, {
                            grantee: "SAP_BI_TECH_USER",
                            granteeType: "USER",
                            grantor: "_SYS_REPO",
                            isGrantable: "FALSE",
                            objectId: "sap.bi.discover::BI_DISCOVER_SCHEDULER_PRIV-_SYS_REPO",
                            objectName: "sap.bi.discover::BI_DISCOVER_SCHEDULER_PRIV",
                            objectType: "ROLE",
                            roleName: "sap.bi.discover::BI_DISCOVER_SCHEDULER_PRIV",
                            state: "edit"
                        }],
                        userInfo: {
                            state: "edit",
                            userName: sLumiraTechUser
                        }
                    }
                })
            }).done(function () {
                jQuery.sap.log.info("Reset Lumira technical user permissions successful!");
                oController.getView().oSettingsDialog.close();
            }).fail(function() {
                jQuery.sap.log.error("Reset Lumira technical user permissions failed!");
                oController.getView().oSettingsDialog.close();
            });

            // Lumira Analyst User
            $.ajax({
                type: "POST",
                url: API.netServiceUrl,
                headers: {
                    "X-CSRF-Token": csrfToken,
                    "x-sap-dont-debug": 1,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "absoluteFunctionName": API.getAbsoluteFunctionName("updatePrivilege4User"),
                    "inputObject":{
                        privilegesToGrant: [],
                        privilegesToRevoke: [{
                            grantee: sLumiraAnalystUser,
                            granteeType: "USER",
                            grantor: "_SYS_REPO",
                            isGrantable: "FALSE",
                            objectId: "sap.bi.common::BI_DATA_ANALYST-_SYS_REPO",
                            objectName: "sap.bi.common::BI_DATA_ANALYST",
                            objectType: "ROLE",
                            roleName: "sap.bi.common::BI_DATA_ANALYST",
                            state: "edit"
                        }],
                        userInfo: {
                            state: "edit",
                            userName: sLumiraAnalystUser
                        }
                    }
                })
            }).done(function () {
                jQuery.sap.log.info("Reset Lumira analyst user permissions successful!");
                oController.getView().oSettingsDialog.close();
            }).fail(function() {
                jQuery.sap.log.error("Reset Lumira analyst user permissions failed!");
                oController.getView().oSettingsDialog.close();
            });
        });
    },

    onSettingsDialogCancelPress: function() {
        this.getView().oSettingsDialog.close();
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

            this.controller.oAppController.oEventBus.publish('selectUsers', aSelectedItems);

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
            API = tests.adminconsole.apps.UserEditor.utils.API;

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
                "absoluteFunctionName": API.getAbsoluteFunctionName("getUsers"),
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