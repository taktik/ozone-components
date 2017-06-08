export interface Sort {
    field: string;
    order?: Sort.OrderEnum;
    missing?: Sort.MissingEnum;
}
export declare namespace Sort {
    enum OrderEnum {
        ASC,
        DESC,
        NONE,
    }
    enum MissingEnum {
        FIRST,
        LAST,
    }
}
