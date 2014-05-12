sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.detail.Detail", {

	getControllerName: function() {
		return "tests.adminconsole.apps.RoleEditor.controller.detail.Detail";
	},

	createContent : function() {

        var view = this;

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
            }), new sap.m.Text({
                text: "{/generalName}"
            }), new sap.m.Label({
                text: "ID"
            }), new sap.m.Text({
                text: "{/generalId}"
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
                }), new sap.m.Text({
                    text: "{/propertiesRoleMode}"
                }), new sap.m.Label({
                    text: "Role Creator"
                }), new sap.m.Text({
                    text: "{/propertiesRoleCreator}"
                })]
            })
        });

        this.oIconTabBar = new sap.m.IconTabBar({
            items: [new sap.m.IconTabFilter({
                icon: "sap-icon://hint",
                content: [this.oGeneralInfo]
            })]
        });

		this.page = new sap.m.Page({
			title: "Role",
			content: [
                this.oObjectHeader,
                this.oIconTabBar,
                this.oProperties
            ]
		});

		return this.page;
	}
});
