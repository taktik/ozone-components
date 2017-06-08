export interface Grants {
    id?: string;
    grants?: Array<Grants.GrantsEnum>;
    fieldGrants?: {
        [key: string]: Array<string>;
    };
}
export declare namespace Grants {
    enum GrantsEnum {
        AUTHENTICATE,
        ADMIN,
        UPLOAD,
        ENTITYVIEW,
        ENTITYCREATE,
        ENTITYEDIT,
        ENTITYDELETE,
        ITEMVIEW,
        ITEMCREATE,
        ITEMEDIT,
        ITEMDELETE,
        ITEMPUBLISH,
        FILEDOWNLOAD,
        FIELDVIEW,
        FIELDEDIT,
    }
    enum FieldGrantsEnum {
        AUTHENTICATE,
        ADMIN,
        UPLOAD,
        ENTITYVIEW,
        ENTITYCREATE,
        ENTITYEDIT,
        ENTITYDELETE,
        ITEMVIEW,
        ITEMCREATE,
        ITEMEDIT,
        ITEMDELETE,
        ITEMPUBLISH,
        FILEDOWNLOAD,
        FIELDVIEW,
        FIELDEDIT,
    }
}
