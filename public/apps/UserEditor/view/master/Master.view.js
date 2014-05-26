sap.ui.jsview("tests.adminconsole.apps.UserEditor.view.master.Master", {
	getControllerName: function() {
		return "tests.adminconsole.apps.UserEditor.controller.master.Master";
	},
	createContent : function(oController) {

        // Workaround for UI5 bug - itemPress event never fired
        $(document).off('click.usereditor').on('click.usereditor', '.sapMLIB.sapMSLI.sapMLIBTypeInactive', function(evt) {
            var isCheckBox = ($(evt.target).closest('.sapMCbMark').length > 0),
                oItem = sap.ui.getCore().byId($(this).closest('li').attr('id')),
                oList = sap.ui.getCore().byId($(this).closest('ul').parent().attr('id'));

            if(!isCheckBox) {
                oList._onItemPressed(oItem, {});
            }
        });

        this.oSettingsDialog = new sap.m.Dialog({
            title: "Rest Changes?",
            content: new sap.ui.layout.form.SimpleForm({
                maxContainerCols: 2,
                content: [new sap.m.Label({
                    text: "IOT User"
                }), this.oSettingsDialogIotUserInput = new sap.m.Input({
                    value: "SAPPHIRE",
                    tooltip: "Remove assignment of adminconsole::IOT from specified user"
                }), new sap.m.Label({
                    text: "Lumira Technical User"
                }), this.oSettingsDialogLumiraTechUserInput = new sap.m.Input({
                    value: "SAP_BI_TECH_USER",
                    tooltip: "Remove assignment of sap.bi.common::BI_TECH_USER and sap.bi.discover::BI_DISCOVER_SCHEDULER_PRIV from specified user"
                }), new sap.m.Label({
                    text: "Lumira Analyst User"
                }), this.oSettingsDialogLumiraAnalystUserInput = new sap.m.Input({
                    value: "CHRISTINA",
                    tooltip: "Remove assignment of BI_DATA_ANALYST from specified user"
                }), new sap.m.Label({
                    text: "Custom"
                }), this.oSettingsDialogCustomUserInput = new sap.m.Input({
                    value: "",
                    placeholder: "USER_0, USER_1, USER_2",
                    tooltip: "Remove all role assignments except PUBLIC role for users (use , as delimiter)"
                })]
            }),
            leftButton: new sap.m.Button({
                text: "Reset",
                press: [oController.onSettingsDialogResetPress, oController]
            }),
            rightButton: new sap.m.Button({
                text: "Cancel",
                press: [oController.onSettingsDialogCancelPress, oController]
            })
        });

        this.oList = new sap.m.List({
            mode: sap.m.ListMode.MultiSelect,
            select: [oController.onListSelect, oController],
            itemPress: [oController.onListItemPress, oController]
        });

        this.oList.bindAggregation("items", {
            path: "/users",
            factory: function(sId){
                return new sap.m.StandardListItem(sId, {
                    title: "{userName}",
                    tooltip: "{userName}",
                    description: "{userMode}",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "id",
                            value: "{userName}"
                        })
                    ]
                });
            }
        });

        this.oSynchronizeButton = new sap.m.Button({
            icon: "sap-icon://synchronize"
        });

        this.oSearchField = new sap.m.SearchField({
            search: function(oEvent) {
                oController.search(oEvent.getParameter('query'))
            }
        });

        this.oBar = new sap.m.Bar({
            contentMiddle: [this.oSearchField],
            contentRight: [this.oSynchronizeButton]
        });

        this.oSettingsButton = new sap.m.Button({
            icon: "sap-icon://settings",
            enabled: true,
            press: [oController.onSettingsPress, oController]
        });

        this.oFilterButton = new sap.m.Button({
            icon: "sap-icon://filter",
            enabled: false
        });

        this.oSortButton = new sap.m.Button({
            icon: "sap-icon://sort",
            press: [oController.sort, oController]
        });

        this.oAddButton = new sap.m.Button({
            icon: "sap-icon://add",
            press: [oController.onAddUserPress, oController]
        });

        this.oPage = new sap.m.Page({
            title: "Users",
            subHeader: this.oBar,
            content: [this.oList],
            footer: new sap.m.Bar({
                contentLeft: [
                    this.oSettingsButton,
                    this.oFilterButton,
                    this.oSortButton,
                    this.oAddButton
                ]
            })
        });

        this.oPage.bindProperty("title", "/users", function(users) {
            return "Users (" + (users ? users.length : 0) + ")";
        });

		return this.oPage;
	}
});