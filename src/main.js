import { defineCustomElement } from 'vue';
import WcsList from './App.vue';

const WcsListCE = defineCustomElement(WcsList);

customElements.define('wcs-list-widget', WcsListCE);