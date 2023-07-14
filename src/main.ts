// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineCustomElement } from 'vue';
import WcsList from './App.vue';
import * as bootstrap from "bootstrap";

const WcsListCE = defineCustomElement(WcsList);

customElements.define('wcs-list-widget', WcsListCE);