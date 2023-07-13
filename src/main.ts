import { defineCustomElement } from 'vue';
import WcsList from './App.vue';
import * as bootstrap from "bootstrap";

const WcsListCE = defineCustomElement(WcsList);

customElements.define('wcs-list-widget', WcsListCE);