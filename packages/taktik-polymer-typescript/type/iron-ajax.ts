/**
 * Created by hubert on 8/06/17.
 */


declare class IronAjax  extends PolymerElement{
    url:string;
    body:string;
    method:string;
    generateRequest():{
        completes:Promise<any>
    }


}

declare const IronAjaxInstance:IronAjax;