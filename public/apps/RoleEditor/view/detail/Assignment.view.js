/**
 * Created by vadimto on 10.05.14.
 */
jQuery.sap.require("tests.adminconsole.apps.RoleEditor.utils.Privileges");
sap.ui.jsview("tests.adminconsole.apps.RoleEditor.view.detail.Assignment", {

    getControllerName: function () {
        return "tests.adminconsole.apps.RoleEditor.controller.detail.Assignment";
    },

    createContent: function (oController) {

        // Workaround for UI5 bug - itemPress event never fired
        $(document).on('click', '.assignedObjects .sapMListTbl.sapMListUl .sapMListTblRow', function(evt) {
            var isCheckBox = ($(evt.target).closest('.sapMCbMark').length > 0),
                oItem = sap.ui.getCore().byId($(this).closest('tr').attr('id')),
                oTable = sap.ui.getCore().byId($(this).closest('table').parent().attr('id'));

            if(isCheckBox) {
                oTable.setSelectedItem(oItem, !oItem.getSelected());
                evt.preventDefault();
                evt.stopPropagation();
            } else {
                oTable._onItemPressed(oItem, {});
            }
        });

        var oView = this,
            Privileges = tests.adminconsole.apps.RoleEditor.utils.Privileges;

        function editModeBinding(bInvert) {
            return {
                path: '/editMode',
                formatter: function(bEditMode) {
                    return !bEditMode !== !bInvert; // XOR with conversion of undefined values to false
                }
            }
        }

        function createTable(sType) {

            var opts = oController.getOpts(sType),
                table = new sap.m.Table({
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({
                            text: opts.title
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            enabled: false,
                            icon: "sap-icon://action"
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            icon: "sap-icon://add",
                            press: function() {
                                oController.openAddDialog(opts);
                            }
                        }),
                        new sap.m.Button({
                            visible: editModeBinding(),
                            icon: "sap-icon://delete",
                            press: function() {
                                oController.deleteObject(opts);
                            }
                        }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.SearchField({
                            width: '250px',
                            search: function(oEvent) {
                                oController.search(table, oEvent.getParameter('query'));
                            }
                        })
                    ]
                }),
                mode: sap.m.ListMode.SingleSelectMaster,
                columns: [new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Name"
                    })
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Type"
                    })
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "ID"
                    })
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Grantor"
                    })
                })],
                itemPress: function(oEvent) {
                    var oItem = oEvent.getParameter('listItem');
                    if(oItem.getType() === sap.m.ListType.Navigation) {
                        oController.openPopover(oItem);
                    }
                }
            });

            table.addStyleClass('assignedObjects');

            table.bindProperty("mode", {
                path: "/editMode",
                formatter: function(bMode) {
                    return bMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;
                }
            });

            table.bindAggregation("items", {
                path: opts.root,
                factory: function(sId){
                    return new sap.m.ColumnListItem(sId, {
                        type: {
                            path: '/objectType',
                            formatter: function() {
                                var objectType = this.getBindingContext().getObject().objectType;
                                return Privileges.getDefaultPrivilegesByObjectType(objectType).length > 0 ?
                                    sap.m.ListType.Navigation : sap.m.ListType.Inactive;
                            }
                        },
                        cells: [new sap.m.Text({
                            text: '{objectName}'
                        }), new sap.m.Text({
                            text: '{objectType}'
                        }), new sap.m.Text({
                            text: '{objectId}'
                        }), new sap.m.Text({
                            text: '{grantor}'
                        })]
                    });
                }
            });

            return table;
        }

        // Header

        this.oObjectHeader = new sap.m.ObjectHeader({
            condensed: true,
            title: "{/headerTitle}",
            number: "{/headerNumber}",
            numberUnit: "{/headerUnit}",
            attributes: [new sap.m.ObjectAttribute({
                text: "{/headerDesctiption}"
            })]
        });

        // Popover

        this.oPopover = new sap.m.ResponsivePopover({
            title: "Object Privileges",
            modal: true,
            offsetX: -500,
            content: [new sap.m.Table({
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({
                            text: "{/title}"
                        })
                    ]
                }),
                columns: [new sap.m.Column({
                    width: "50px"
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Privilege"
                    }),
                    vAlign: sap.ui.core.VerticalAlign.Middle
                }), new sap.m.Column({
                    header: new sap.m.Text({
                        text: "Grantable to others"
                    }),
                    width: "150px"
                })],
                items: {
                    path: '/detailedPrivileges',
                    factory: function(sId) {
                        return new sap.m.ColumnListItem(sId, {
                            cells: [new sap.m.CheckBox({
                                enabled: editModeBinding(),
                                selected: {
                                    path: 'objectId',
                                    formatter: function(sObjectId) {
                                        return !!sObjectId; // convert to boolean
                                    }
                                }
                            }), new sap.m.Text({
                                text: '{privilege}'
                            }), new sap.m.Select({
                                enabled: editModeBinding(),
                                selectedKey: '{isGrantable}',
                                items: [new sap.ui.core.Item({
                                    key: "TRUE",
                                    text: "Yes"
                                }), new sap.ui.core.Item({
                                    key: "FALSE",
                                    text: "No"
                                })]
                            })]
                        });
                    }
                }
            })],
            beginButton: new sap.m.Button({
                text: "OK",
                visible: editModeBinding(),
                press: [oController.onPopoverOkPress, oController]
            }),
            endButton: new sap.m.Button({
                text: {
                    path: '/editMode',
                    formatter: function(bEditMode) {
                        return bEditMode ? 'Cancel' : 'Close'
                    }
                },
                press: function() {
                    oView.oPopover.close();
                }
            })
        });

        // Add Object

        this.oAddDialog = new sap.m.TableSelectDialog({
            title: "Select Objects",
            multiSelect: true,
            search: function (oEvent) {
                oController.addDialogSearch(oEvent.getParameter('value'));
            },
            confirm: [oController.addObject, oController],
            close: function () {
                oView.oAddDialog.close();
            },
            columns: [new sap.m.Column({
                header: new sap.m.Text({
                    text: "Object Name"
                })
            })],
            items: []
        });

        // Granted Roles

        this.oTableRoles = createTable('roles');

        // System Privileges

        this.oTableSystem = createTable('system');

        // SQL Privileges

        this.oTableSql = createTable('sql');

        // Package Privileges

        this.oTablePackage = createTable('package');

        // Application Privileges

        this.oTableApplication = createTable('application');

        // Tabs

        this.oIconTabBar = new sap.m.IconTabBar({
            expandable: false,
            items: [new sap.m.IconTabFilter({
                key: "roles",
                icon: "sap-icon://role",
                text: "Roles",
                content: [this.oTableRoles]
            }), new sap.m.IconTabFilter({
                key: "system",
                icon: "sap-icon://it-system",
                text: "System",
                content: [this.oTableSystem]
            }), new sap.m.IconTabFilter({
                key: "sql",
                icon: "sap-icon://product",
                text: "SQL",
                content: [this.oTableSql]
            }), new sap.m.IconTabFilter({
                key: "package",
                icon: "sap-icon://suitcase",
                text: "Package",
                content: [this.oTablePackage]
            }), new sap.m.IconTabFilter({
                key: "application",
                icon: "sap-icon://header",
                text: "Application",
                content: [this.oTableApplication]
            })],
            select: [oController.onIconBarSelect, oController]
        });

        // Toolbar Items

        this.oEditButton = new sap.m.Button({
            visible: editModeBinding(true),
            text: "Edit",
            press: function() {
                oController.toggleEditMode();
            }
        });

        this.oSaveButton = new sap.m.Button({
            visible: editModeBinding(),
            enabled: {
                path: '/isModified',
                formatter: function(isModified) {
                    return !!isModified; // Convert to boolean with default false
                }
            },
            text: "Save",
            press: [oController.onSavePress, oController]
        });

        this.oCancelButton = new sap.m.Button({
            visible: editModeBinding(),
            text: "Cancel",
            press: [oController.onCancelPress, oController]
        });

        // Page

        this.page = new sap.m.Page({
            title: "Role Assignment",
            showNavButton: true,
            navButtonPress: function() {
                history.back();
            },
            content: [
                this.oObjectHeader,
                this.oIconTabBar
            ],
            footer: new sap.m.Bar({
                contentRight: [
                    this.oEditButton,
                    this.oSaveButton,
                    this.oCancelButton
                ]
            })
        });

        return this.page;
    }

});