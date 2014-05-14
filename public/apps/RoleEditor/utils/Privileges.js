jQuery.sap.declare("tests.adminconsole.apps.RoleEditor.utils.Privileges");

tests.adminconsole.apps.RoleEditor.utils.Privileges = {

    getDefaultPrivilegesByObjectType: function(sObjectType) {
        switch(sObjectType) {
            case 'SCHEMA':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "CREATE ANY"
                }, {
                    isGrantable: "FALSE",
                    privilege: "ALTER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "EXECUTE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "SELECT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INSERT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "UPDATE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DELETE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INDEX"
                }, {
                    isGrantable: "FALSE",
                    privilege: "TRIGGER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DEBUG"
                }, {
                    isGrantable: "FALSE",
                    privilege: "PREFERENCES"
                }];
            case 'TABLE':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "ALTER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "SELECT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INSERT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "UPDATE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DELETE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INDEX"
                }, {
                    isGrantable: "FALSE",
                    privilege: "TRIGGER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REFERENCES"
                }];
            case 'VIEW':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "SELECT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INSERT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "UPDATE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DELETE"
                }];
            case 'MONITORVIEW':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "SELECT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "INSERT"
                }, {
                    isGrantable: "FALSE",
                    privilege: "UPDATE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DELETE"
                }];
            case 'PROCEDURE':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "ALTER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "EXECUTE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DEBUG"
                }];
            case 'FUNCTION':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "ALTER"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "EXECUTE"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DEBUG"
                }];
            case 'SEQUENCE':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "DROP"
                }, {
                    isGrantable: "FALSE",
                    privilege: "SELECT"
                }];
            case 'REPO':
                return [{
                    isGrantable: "FALSE",
                    privilege: "ALL"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.READ"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.EDIT_NATIVE_OBJECTS"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.ACTIVATE_NATIVE_OBJECTS"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.MAINTAIN_NATIVE_PACKAGES"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.EDIT_IMPORTED_OBJECTS"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.ACTIVATE_IMPORTED_OBJECTS"
                }, {
                    isGrantable: "FALSE",
                    privilege: "REPO.MAINTAIN_IMPORTED_PACKAGES"
                }];
            case 'ROLE':
            default:
                return [];
        }
    }

};
