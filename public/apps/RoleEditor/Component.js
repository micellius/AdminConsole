/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 1:26 PM
 */
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.declare("tests.adminconsole.apps.RoleEditor.Component");

sap.ui.core.UIComponent.extend("tests.adminconsole.apps.RoleEditor.Component", {
    metadata : {
        version : "@version@",

        library : "tests.adminconsole.apps.RoleEditor",
        includes : [ "styles/style.css" ],

        dependencies : {
            libs : [ "sap.m", "sap.ui.layout", "sap.ui.commons" ],
            components : []
        },
        routing : {
            config : {
                viewType : "JS",
                viewPath : "tests.adminconsole.apps.RoleEditor.view",
                targetControl : "splitControl",
                clearTarget : false
            },
            routes : [
                {
                    pattern: "",
                    name: "empty",
                    viewPath: "tests.adminconsole.apps.RoleEditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages",
                    subroutes: [{
                        pattern: "",
                        view: "Empty",
                        viewPath: "tests.adminconsole.apps.RoleEditor.view.detail",
                        targetAggregation: "detailPages"
                    }]
                }, {
                    pattern: "roles/:id:",
                    name: "master",
                    viewPath: "tests.adminconsole.apps.RoleEditor.view.master",
                    view: "Master",
                    targetAggregation: "masterPages",
                    subroutes: [
                        {
                            pattern: "roles/:id:",
                            name: "detail",
                            view: "Detail",
                            viewPath: "tests.adminconsole.apps.RoleEditor.view.detail",
                            targetAggregation: "detailPages"
                        }, {
                            pattern: "roles/{id}/assignment/:tab:",
                            name: "assignment",
                            view: "Assignment",
                            viewPath: "tests.adminconsole.apps.RoleEditor.view.detail",
                            targetAggregation: "detailPages"
                        }
                    ]
                }
            ]
        }
    },
    init : function () {
        jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var oRouter = this.getRouter();
        new sap.m.routing.RouteMatchedHandler(oRouter);
        oRouter.register("router");
        oRouter.initialize();
    },
    createContent : function () {
        return sap.ui.view({
            id: "roleEditorApp",
            viewName: "tests.adminconsole.apps.RoleEditor.view.App",
            type: "JS",
            viewData: { component: this }
        });
    }
});