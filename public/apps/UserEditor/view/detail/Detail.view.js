sap.ui.jsview("tests.adminconsole.apps.UserEditor.view.detail.Detail", {

	getControllerName: function() {
		return "tests.adminconsole.apps.UserEditor.controller.detail.Detail";
	},

	createContent : function(oController) {

        var view = this;

        function not(sPath) {
            return {
                path: sPath,
                formatter: function (bValue) {
                    return !bValue;
                }
            };
        }

        this.oObjectHeader = new sap.m.ObjectHeader({
            condensed: true,
            title: "{/headerTitle}",
            number: "{/headerNumber}",
            numberUnit: "{/headerUnit}",
            attributes: [new sap.m.ObjectAttribute({
                text: "{/headerDesctiption}"
            })]
        });

        this.oGeneralInfo = new sap.ui.layout.form.SimpleForm({
            maxContainerCols: 2,
            content: [new sap.ui.core.Title({
                text: "General Info"
            }), new sap.m.Label({
                text: "User Name"
            }), new sap.m.Input({
                value: "{/generalName}",
                editable: "{/editMode}"
            }), new sap.m.Label({
                visible: '{/editMode}',
                text: "Password"
            }), new sap.m.Input({
                visible: '{/editMode}',
                value: "{/generalPassword}",
                editable: "{/editMode}",
                type: sap.m.InputType.Password
            }), new sap.m.Label({
                text: "Valid From"
            }), new sap.m.DateTimeInput({
                value: "{/generalValidFrom}",
                valueFormat: "dd/MM/yyyy hh:mm:ss",
                editable: "{/editMode}"
            }), new sap.m.Label({
                text: "Valid Until"
            }), new sap.m.DateTimeInput({
                value: "{/generalValidUntil}",
                valueFormat: "dd/MM/yyyy hh:mm:ss",
                editable: "{/editMode}"
            })]
        });

        this.oCollapseExpandButton = new sap.m.Button({
            text: "Hide",
            icon: "sap-icon://up",
            iconFirst: false,
            press: function() {
                var collapsed = view.oProperties.hasStyleClass('collapsed');
                if(collapsed) {
                    view.oCollapseExpandButton.setIcon('sap-icon://up');
                    view.oCollapseExpandButton.setText('Hide');
                    view.oProperties.removeStyleClass('collapsed');
                } else {
                    view.oCollapseExpandButton.setIcon('sap-icon://down');
                    view.oCollapseExpandButton.setText('Show');
                    view.oProperties.addStyleClass('collapsed');
                }
            }
        });

        function stringToBooleanFormatter(sValue) {
            return sValue === "TRUE";
        }

        function bindSelected(sPath, fnCallback) {
            return typeof fnCallback == 'function' ? function(oEvent) {
                this.getModel().setProperty(sPath, this.getSelected() ? "TRUE" : "FALSE");
                fnCallback(oEvent);
            } : function() {
                this.getModel().setProperty(sPath, this.getSelected() ? "TRUE" : "FALSE");
            }
        }

        this.oProperties = new sap.m.Panel({
            headerToolbar: new sap.m.Toolbar({
                content: [
                    new sap.m.Label({
                        text: "More Properties"
                    }),
                    new sap.m.ToolbarSpacer(),
                    this.oCollapseExpandButton
                ]
            }),
            content: new sap.ui.layout.form.SimpleForm({
                maxContainerCols: 2,
                content: [new sap.m.Label({
                    text: "Password Enabled"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesPasswordEnabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesPasswordEnabled')
                }), new sap.m.Label({
                    text: "Kerberos"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesKerberosEnabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesKerberosEnabled')
                }), new sap.m.Label({
                    text: "SAML"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesSAMLEnabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesSAMLEnabled')
                }), new sap.m.Label({
                    text: "X509"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesX509Enabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesX509Enabled')
                }), new sap.m.Label({
                    text: "SAP Logon Ticket"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesSapLogonTicketEnabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesSapLogonTicketEnabled')
                }), new sap.m.Label({
                    text: "SAP Assertion Ticket"
                }), new sap.m.CheckBox({
                    selected: {
                        path:"/propertiesSapAssertionTicketEnabled",
                        formatter: stringToBooleanFormatter
                    },
                    enabled: "{/editMode}",
                    select: bindSelected('/propertiesSapAssertionTicketEnabled')
                })]
            })
        });

        this.oIconTabBar = new sap.m.IconTabBar({
            items: [new sap.m.IconTabFilter({
                icon: "sap-icon://hint",
                content: [this.oGeneralInfo]
            })]
        });

        this.oAssignButton = new sap.m.Button({
            visible: not("/editMode"),
            enabled: "{/allowAssign}",
            text: "User Assignment",
            icon: "sap-icon://slim-arrow-right",
            iconFirst: false,
            press: function() {
                oController.router.navTo("assignment", {
                    id: oController.oRouteArguments.id,
                    tab: 'roles'
                });
            }
        });

        this.oEditButton = new sap.m.Button({
            visible: not("/editMode"),
            text: "Edit",
            press: function() {
                view.getModel().setProperty("/editMode", true);
            }
        });

        this.oDeleteDialog = new sap.m.Dialog({
            content: [new sap.m.Text()],
            beginButton: new sap.m.Button({
                text: "Delete",
                press: [oController.onDeleteDialogDeletePress, oController]
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function() {
                    view.oDeleteDialog.close();
                }
            })
        });

        this.oDeleteButton = new sap.m.Button({
            visible: not("/editMode"),
            text: "Delete",
            press: [oController.onDeletePress, oController]
        });

        this.oSaveButton = new sap.m.Button({
            visible: "{/editMode}",
            text: "Save",
            press: [oController.onSavePress, oController]
        });

        this.oSaveButton.setVisible(false);

        this.oCancelButton = new sap.m.Button({
            visible: "{/editMode}",
            text: "Cancel",
            press: [oController.onCancelPress, oController]
        });

        this.oCancelButton.setVisible(false);

		this.page = new sap.m.Page({
			title: "User",
			content: [
                this.oObjectHeader,
                this.oIconTabBar,
                this.oProperties
            ],
            footer: new sap.m.Bar({
                contentLeft: [
                    this.oAssignButton
                ],
                contentRight: [
                    this.oEditButton,
                    this.oDeleteButton,
                    this.oSaveButton,
                    this.oCancelButton
                ]
            })
		});

		return this.page;
	}
});