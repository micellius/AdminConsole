/**
 * Created in SAP Labs Israel.
 * Author: Vadim Tomnikov (i070970)
 * Date: 5/8/14
 * Time: 10:53 AM
 */
sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
        appWidthLimited: false,
        app: new sap.m.Page({
            enableScrolling: false,
            customHeader: new sap.m.Bar ("header", {
                contentLeft: [new sap.m.Button({
                    icon: "sap-icon://menu2"
                }), new sap.m.Image("logo", {
                    src: "/resources/sap/ui/core/mimes/logo/sap_50x26.png"
                })],
                contentRight: [new sap.m.Button({
                    icon: "sap-icon://account"
                })]
            }),
            content: new sap.m.TileContainer({
                tiles: [new sap.m.StandardTile({
                    icon: "sap-icon://person-placeholder",
                    title: "Users",
                    info: "User Creator & Editor",
                    number: "16",
                    numberUnit: "Users",
                    press: function() {
                        location.href = "/UserEditor"
                    }
                }), new sap.m.StandardTile({
                    icon: "sap-icon://role",
                    title: "Roles",
                    info: "Role Creator & Editor",
                    number: "50",
                    numberUnit: "Roles",
                    press: function() {
                        location.href = "/RoleEditor"
                    }
                })]
            })
        })
    }).placeAt("content");
});