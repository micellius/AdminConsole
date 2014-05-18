sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.detail.Detail", {

	getControllerName: function() {
		return "tests.adminconsole.apps.RoleEditor.controller.detail.Detail";
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
                text: "Role Name"
            }), new sap.m.Input({
                value: "{/generalName}",
                editable: "{/editMode}"
            }), new sap.m.Label({
                text: "ID"
            }), new sap.m.Input({
                value: "{/generalId}",
                editable: false
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
                    text: "Role Mode"
                }), new sap.m.Input({
                    value: "{/propertiesRoleMode}",
                    editable: "{/editMode}"
                }), new sap.m.Label({
                    text: "Role Creator"
                }), new sap.m.Input({
                    value: "{/propertiesRoleCreator}",
                    editable: "{/editMode}"
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
            text: "Assignment",
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
            enabled: false,
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

        this.oActionButton = new sap.m.Button({
            //visible: not("/editMode"),
            icon: "sap-icon://action",
            enabled: false,
            visible: false
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
			title: "Role",
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
                    this.oActionButton,
                    this.oSaveButton,
                    this.oCancelButton
                ]
            })
		});

		return this.page;
	}
});
