export interface ListSearchResult {
    id?: number;
    total?: number;
    size?: number;
    results?: Array<Array<any>>;
}
export interface ListSearchResultTyped<T> {
    id?: number;
    total?: number;
    size?: number;
    results?: Array<Array<T>>;
}
