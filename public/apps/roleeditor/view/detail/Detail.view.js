sap.ui.jsview("sap.adminconsole.apps.roleeditor.view.detail.Detail", {

	getControllerName: function() {
		return "sap.adminconsole.apps.roleeditor.controller.detail.Detail";
	},

	createContent : function(oController) {

        this.oObjectHeader = new sap.m.ObjectHeader({
            condensed: true,
            title: "Role A",
            number: "16",
            numberUnit: "Objects",
            attributes: [new sap.m.ObjectAttribute({
                text: "12345"
            })]
        });

        this.oGeneralInfo = new sap.ui.layout.form.SimpleForm({
            maxContainerCols: 2,
            content: [new sap.ui.core.Title({
                text: "General Info"
            }), new sap.m.Label({
                text: "Role Name"
            }), new sap.m.Text({
                text: "Role A"
            }), new sap.m.Label({
                text: "ID"
            }), new sap.m.Text({
                text: "12345"
            })]
        });

        this.oProperties = new sap.m.Panel({
            headerToolbar: new sap.m.Toolbar({
                content: [new sap.m.Label({
                    text: "More Properties"
                }), new sap.m.ToolbarSpacer(), new sap.m.Button({
                    text: "Hide",
                    icon: "sap-icon://up",
                    iconFirst: false
                })]
            }),
            content: new sap.ui.layout.form.SimpleForm({
                maxContainerCols: 2,
                content: [new sap.m.Label({
                    text: "Role Mode"
                }), new sap.m.Text({
                    text: "LOCAL"
                }), new sap.m.Label({
                    text: "Role Creator"
                }), new sap.m.Text({
                    text: "SYSTEM"
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
