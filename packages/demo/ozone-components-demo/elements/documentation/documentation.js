
    import "polymer/polymer.html"
    import "polymer/polymer-element.html"
    import "marked-element/marked-element.html"
    import './documentation.html'

    class OzoneDocumentation extends Polymer.Element {
        static get is() {
            return 'ozone-documentation';
        }
    }
    window.customElements.define(OzoneDocumentation.is, OzoneDocumentation);