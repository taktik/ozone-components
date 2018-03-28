import * as ClapprMarkersPlugin from 'clappr-markers-plugin'

export type MarkerOnVideo = {
    time: number,
    duration: number,
}

export class ClapprMarkerFactory {
    parent: PolymerElement;
    constructor(parent: PolymerElement){
        this.parent = parent;
    }

    private computeMove(element: HTMLDivElement, e: MouseEvent) {
        const parentElement = element.parentElement as HTMLElement;
        const movePc = (e.movementX / parentElement.clientWidth) * 100;
        return movePc;
    }

    createMarker (marker: MarkerOnVideo, index: number): ClapprMarkersPlugin.CropMarker{
        const myClapprMarkersPlugin =  ClapprMarkersPlugin;
        var aMarker = new myClapprMarkersPlugin.CropMarker(marker.time, marker.duration);

        const element = document.createElement('div');
        element.className = 'element';

        var resizer = document.createElement('div');
        resizer.className = 'resizer';
        resizer.style.right = '0';

        element.appendChild(resizer);
        resizer.addEventListener('mousedown', (e) => {
            initResize(e)
        }, false);
        var resizerL = document.createElement('div');
        resizerL.className = 'resizer';
        resizerL.id = 'resizerL';
        element.appendChild(resizerL);

        resizerL.addEventListener('mousedown', (e) => {
            initResizeLeft(e)
        }, false);


        element.addEventListener('mousedown', (e) => {
            initTranslate(e)
        }, false);

        const updateMarker= ()=> {
            this.parent.set(`markers.${index}.duration`, aMarker.getDuration());
            this.parent.set(`markers.${index}.time`, aMarker.getTime());
        };

        const self = this;
        function initResize(e: Event)
        {
            e.stopPropagation();
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }
        function Resize(e: MouseEvent)
        {
            e.stopPropagation();
            const markerTime = aMarker.getDuration() + aMarker.getTime();
            resizer.classList.add('moving-tooltip');
            resizer.setAttribute('data-attr', '' + secondsToHms(markerTime));
            const movePc = self.computeMove(element, e);
            element.style.width =  parseFloat(element.style.width || '') +  movePc + '%';
            updateMarker();
            (aMarker as any).core.mediaControl
                .setTime(aMarker.getDuration() + aMarker.getTime())
        }
        function stopResize(e: Event)
        {
            e.stopPropagation();
            resizer.classList.remove('moving-tooltip');
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
        }

        function initResizeLeft(e: Event)
        {
            e.stopPropagation();
            window.addEventListener('mousemove', ResizeLeft, false);
            window.addEventListener('mouseup', stopResizeLeft, false);
        }
        function ResizeLeft(e: MouseEvent)
        {
            e.stopPropagation();
            let left = parseFloat(element.style.left || '');
            if (isNaN(left)) {
                left = 0;
            }
            const movePc = self.computeMove(element, e);
            resizerL.classList.add('moving-tooltip');
            resizerL.setAttribute('data-attr', '' + secondsToHms(aMarker.getTime()));
            element.style.left = left + movePc + '%';
            element.style.width =  parseFloat(element.style.width || '') -  movePc + '%';
            updateMarker();
            (aMarker as any).core.mediaControl
                .setTime(aMarker.getTime())
        }
        function stopResizeLeft(e: Event)
        {
            e.stopPropagation();
            resizerL.classList.remove('moving-tooltip');
            window.removeEventListener('mousemove', ResizeLeft, false);
            window.removeEventListener('mouseup', stopResizeLeft, false);
        }
        function initTranslate(e: Event)
        {
            e.stopPropagation();
            window.addEventListener('mousemove', transtlate, false);
            window.addEventListener('mouseup', stopTranstlate, false);
        }
        function transtlate(e: MouseEvent )
        {
            e.stopPropagation();
            let left = parseFloat(element.style.left || '');
            if (isNaN(left)) {
                left = 0;
            }
            const movePc = self.computeMove(element, e);


            element.style.left = left + movePc + '%';

            updateMarker();
            const parentElement = element.parentElement as Element;
            const markerLeft = (element.offsetLeft / parentElement.clientWidth) * 100;
            const shiftPc = (e.offsetX / parentElement.clientWidth) * 100;
            (aMarker as any).core.mediaControl
                .setTime(aMarker.getDuration() /2 + aMarker.getTime())
        }
        function stopTranstlate(e: Event)
        {
            e.stopPropagation();
            window.removeEventListener('mousemove', transtlate, false);
            window.removeEventListener('mouseup', stopTranstlate, false);
        }
        function secondsToHms(d: number) {
            d = Number(d);
            const h = Math.floor(d / 3600);
            const m = Math.floor(d % 3600 / 60);
            const s = Math.floor(d % 3600 % 60);
            let hours = ('0' + h).slice(-2) + ":";
            let minutes = ('0' + m).slice(-2) + ":";
            if(h <= 1) {
                hours = "";
            }
            return  hours + minutes + ('0' + s).slice(-2);
        }

        aMarker._$marker = element;
        return aMarker;
    }
}