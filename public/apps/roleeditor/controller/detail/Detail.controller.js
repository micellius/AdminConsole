/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:50 PM
 */
sap.ui.controller("tests.adminconsole.apps.RoleEditor.controller.detail.Detail", {

    onInit: function() {
        var controller = this;
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRouteMatched(function(oEvent) {
            controller.oRouteArguments = oEvent.getParameters().arguments;
        });
        this.oAppController = sap.ui.getCore().byId('roleEditorApp').getController();
        this.oAppController.oEventBus.subscribe('selectRoles', function() {
            var aRoles = arguments[2],
                oRole,
                oData;

            switch(aRoles.length) {
            case 0:
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
                    propertiesRoleCreator: oRole.roleCreator
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
                    propertiesRoleCreator: ''
                };
                break;
            }

            this.getView().setModel(new sap.ui.model.json.JSONModel(oData));

        }, this);
    }

});