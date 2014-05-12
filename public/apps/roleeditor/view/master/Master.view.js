sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.master.Master", {
	getControllerName: function() {
		return "tests.adminconsole.apps.RoleEditor.controller.master.Master";
	},
	createContent : function(oController) {
        var oList;

        // Workaround for UI5 bug - itemPress event never fired
        $(document).on('click', '.sapMLIB.sapMSLI.sapMLIBTypeInactive', function(evt) {
            var isCheckBox = ($(evt.target).closest('.sapMCbMark').length > 0),
                oItem = sap.ui.getCore().byId($(this).closest('li').attr('id'));

            if(!isCheckBox) {
                oList._onItemPressed(oItem, {});
            }
        });

        oList = this.oList = new sap.m.List({
            mode: sap.m.ListMode.MultiSelect,
            select: [oController.onListSelect, oController],
            itemPress: [oController.onListItemPress, oController]
        });

        this.oList.bindAggregation("items", {
            path: "/roles",
            factory: function(sId){
                return new sap.m.StandardListItem(sId, {
                    title: "{objectName}",
                    tooltip: "{objectName}",
                    description: "{roleId}",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "id",
                            value: "{roleId}"
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
            icon: "sap-icon://settings"
        });

        this.oFilterButton = new sap.m.Button({
            icon: "sap-icon://filter"
        });

        this.oSortButton = new sap.m.Button({
            icon: "sap-icon://sort"
        });

        this.oAddButton = new sap.m.Button({
            icon: "sap-icon://add"
        });

        this.oPage = new sap.m.Page({
            title: "Roles",
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

        this.oPage.bindProperty("title", "/roles", function(roles) {
            return "Roles (" + (roles ? roles.length : 0) + ")";
        });

		return this.oPage;
	}
});