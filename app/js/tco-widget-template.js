window.Vz = window.Vz || {};
window.Vz.Widgets = window.Vz.Widgets || {};

// Renders the TCO calculator widget markup. Replaces the old EJS-templated
// partial (app/partial/widget.ejs) which required a client-side template
// engine and, previously, a synchronous XHR to fetch it at runtime.
// i18n: texts are looked up by their English original in window.VzTCOi18n
// ({"English text": "Translation"}). Missing map or key -> English as is.
window.Vz.Widgets.tcoT = function (s) {
    var d = window.VzTCOi18n;
    return (d && Object.prototype.hasOwnProperty.call(d, s) && d[s]) ? d[s] : s;
};
// Same, escaped for use inside an HTML attribute.
window.Vz.Widgets.tcoTA = function (s) {
    return String(window.Vz.Widgets.tcoT(s)).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
};

window.Vz.Widgets.renderTcoTemplate = function (data) {
    var t = window.Vz.Widgets.tcoT;
    var ta = window.Vz.Widgets.tcoTA;
    data = data || {};
    var bShowForm = data.bShowForm;
    var bShowBanner = data.bShowBanner;
    var sButtonLink = data.sButtonLink;
    var sButtonText = data.sButtonText;

    return `<form id="tco-calculator-form">
    <input type="hidden" name="calc_info">
    <div class="tco-wrapper">
        <div class="tco-form-half">
            <div class="tco-calc-block">
                <h2>${t('Select Your Infrastructure Setup')}</h2>
                <div class="radio-group">
                    <label>
                        ${t('Edge Deployment')}
                        <input type="radio" name="vz-price" value="edge" checked>
                    </label>
                    <label>
                        ${t('HCI Baseline')}
                        <input type="radio" name="vz-price" value="hci">
                    </label>
                    <label>
                        ${t('SaaS-optimized')}
                        <input type="radio" name="vz-price" value="saas">
                    </label>
                    <label>
                        ${t('Storage-optimized')}
                        <input type="radio" name="vz-price" value="storage">
                    </label>
                    <label>
                        ${t('Custom setup')}
                        <input type="radio" name="vz-price" value="custom">
                    </label>
                    <div id="vz-edge" class="tco-check active">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('Edge Deployment')}</strong>
                                <span class="tooltip-icon">
                                    i
                                    <span class="tooltip-text">${t('Best suited for small-scale deployments and edge locations. Combines compute and hot storage in a compact, cost-efficient 3-node cluster.')}</span>
                                </span>
                            </span>
                            <span>
                                <strong class="edge-nodes">0</strong> ${t('Host Nodes')}
                            </span>
                            <span>
                                <strong class="edge-cpu">0</strong> ${t('CPU Cores')}
                            </span>
                        </div>
                        <div class="check-row">
                            <span><strong>45</strong> ${t('TB Raw Hot Storage')}</span>
                        </div>
                    </div>
                    <div id="vz-hci" class="tco-check">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('HCI Baseline')}</strong>
                                <span class="tooltip-icon">
                                    i
                                    <span class="tooltip-text">${t('Unified cluster combining compute, hot storage, and cold storage in a single setup. Balanced for general-purpose workloads.')}</span>
                                </span>
                            </span>
                            <span>
                                <strong class="hci-nodes">0</strong> ${t('Host Nodes')}
                            </span>
                            <span>
                                <strong class="hci-cpu">0</strong> ${t('CPU Cores')}
                            </span>
                        </div>
                        <div class="check-row">
                            <span><strong>460</strong> ${t('TB Raw Cold Storage')}</span>
                            <span><strong>960</strong> ${t('TB Raw Hot Storage')}</span>
                        </div>
                    </div>
                    <div id="vz-saas" class="tco-check">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('SaaS-Optimized')}</strong>
                                <span class="tooltip-icon">
                                    i
                                    <span class="tooltip-text">${t('Configuration tailored for SaaS workloads, prioritizing compute performance and efficient scaling for applications.')}</span>
                                </span>
                            </span>
                            <span>
                                <strong class="saas-nodes">0</strong> ${t('Host Nodes')}
                            </span>
                            <span>
                                <strong class="saas-cpu">0</strong> ${t('CPU Cores')}
                            </span>
                        </div>
                        <div class="check-row">
                            <span><strong>922</strong> ${t('TB Raw Hot Storage')}</span>
                        </div>
                    </div>
                    <div id="vz-storage" class="tco-check">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('Storage-Optimized')}</strong>
                                <span class="tooltip-icon">
                                    i
                                    <span class="tooltip-text">${t('Designed for data-heavy environments with balanced compute. Includes 5 compute nodes and 10 storage nodes for large-scale storage needs.')}</span>
                                </span>
                            </span>
                            <span>
                                <strong class="storage-nodes">0</strong> ${t('Host Nodes')}
                            </span>
                            <span>
                                <strong class="storage-cpu">0</strong> ${t('CPU Cores')}
                            </span>
                        </div>
                        <div class="check-row">
                            <span><strong>14,400</strong> ${t('TB Raw Cold Storage')}</span>
                            <span><strong>58</strong> ${t('TB Raw Hot Storage')}</span>
                        </div>
                    </div>
                    <div id="vz-custom" class="tco-check">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('Custom Setup')}</strong>
                            </span>
                        </div>
                        <div class="check-row">
                            <div class="custom-col">
                                <div class="custom-title">${t('Compute Cluster')}</div>
                                <label>
                                    <span>${t('Compute Nodes')}</span>
                                    <input id="custom-compute-nodes" type="number" name="custom-compute-nodes"
                                           value="5" min="0">
                                </label>
                                <label>
                                    <span>${t('Cores per Server')}</span>
                                    <input type="number" name="custom-compute-cpu" value="48" min="0">
                                </label>
                                <label>
                                    <span>${t('Hot Storage<br> per Node (TB)')}</span>
                                    <input type="number" name="custom-hot-storage" value="96" min="0">
                                </label>
                                <label>
                                    <span>${t('Hot EC<br>scheme')}
                                    <span class="tooltip-icon">
                                        i
                                        <span class="tooltip-text">${t('Erasure coding policy for hot storage. Determines the minimum number of nodes required to maintain availability.')}</span>
                                    </span>
                                    </span>
                                    <select id="custom-hot-scheme">
                                        <option class="placeholder" value="" disabled>${t('Select')}</option>
                                        <option data-min="3">3x Replication — 33% ${t('usable')}</option>
                                        <option data-min="3">EC 2+1 — 67% ${t('usable')}</option>
                                        <option data-min="4">EC 2+2 — 50% ${t('usable')}</option>
                                        <option data-min="4">EC 3+1 — 75% ${t('usable')}</option>
                                        <option data-min="5" selected>EC 3+2 — 60% ${t('usable')}</option>
                                        <option data-min="6">EC 4+2 — 67% ${t('usable')}</option>
                                        <option data-min="7">EC 4+3 — 57% ${t('usable')}</option>
                                        <option data-min="7">EC 5+2 — 71% ${t('usable')}</option>
                                        <option data-min="8">EC 6+2 — 75% ${t('usable')}</option>
                                        <option data-min="9">EC 6+3 — 67% ${t('usable')}</option>
                                        <option data-min="10">EC 8+2 — 80% ${t('usable')}</option>
                                        <option data-min="11">EC 8+3 — 73% ${t('usable')}</option>
                                        <option data-min="12">EC 10+2 — 83% ${t('usable')}</option>
                                        <option data-min="14">EC 10+4 — 71% ${t('usable')}</option>
                                        <option data-min="14">EC 12+2 — 86% ${t('usable')}</option>
                                        <option data-min="20">EC 16+4 — 80% ${t('usable')}</option>
                                    </select>
                                </label>
                            </div>
                            <div class="custom-col">
                                <div class="custom-title">${t('Cold Storage Cluster')}</div>
                                <label>
                                    <span>${t('Storage Nodes')}</span>
                                    <input id="custom-storage-nodes" type="number" name="custom-storage-nodes"
                                           placeholder="0" min="0">
                                </label>
                                <label>
                                    <span>${t('Cores per Server')}</span>
                                    <input type="number" name="custom-storage-cpu" placeholder="0" min="0">
                                </label>
                                <label>
                                    <span>${t('Cold Storage<br> per Node (TB)')}</span>
                                    <input type="number" name="custom-cold-storage" placeholder="0" min="0">
                                </label>
                                <label>
                                    <span>${t('Cold EC<br>scheme')}
                                        <span class="tooltip-icon">
                                            i
                                            <span class="tooltip-text">${t('Erasure coding policy for cold storage. Determines the minimum number of nodes required to maintain availability.')}</span>
                                        </span>
                                    </span>
                                    <select id="custom-cold-scheme">
                                        <option class="placeholder" value="" disabled selected>${t('Select')}</option>
                                        <option data-min="3">3x Replication — 33% ${t('usable')}</option>
                                        <option data-min="3">EC 2+1 — 67% ${t('usable')}</option>
                                        <option data-min="4">EC 2+2 — 50% ${t('usable')}</option>
                                        <option data-min="4">EC 3+1 — 75% ${t('usable')}</option>
                                        <option data-min="5">EC 3+2 — 60% ${t('usable')}</option>
                                        <option data-min="6">EC 4+2 — 67% ${t('usable')}</option>
                                        <option data-min="7">EC 4+3 — 57% ${t('usable')}</option>
                                        <option data-min="7">EC 5+2 — 71% ${t('usable')}</option>
                                        <option data-min="8">EC 6+2 — 75% ${t('usable')}</option>
                                        <option data-min="9">EC 6+3 — 67% ${t('usable')}</option>
                                        <option data-min="10">EC 8+2 — 80% ${t('usable')}</option>
                                        <option data-min="11">EC 8+3 — 73% ${t('usable')}</option>
                                        <option data-min="12">EC 10+2 — 83% ${t('usable')}</option>
                                        <option data-min="14">EC 10+4 — 71% ${t('usable')}</option>
                                        <option data-min="14">EC 12+2 — 86% ${t('usable')}</option>
                                        <option data-min="20">EC 16+4 — 80% ${t('usable')}</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tco-calc-block tco-calc-competitors vmware">
                <h2>${t('Compare to Your Current Infrastructure Costs')}</h2>
                <div class="radio-buttons">
                    <label>
                        VMware
                        <input type="radio" id="competitor-vmware" name="competitor" value="vmware" checked>
                    </label>
                    <label>
                        AWS
                        <input type="radio" id="competitor-aws" name="competitor" value="aws">
                    </label>
                    <div id="vz-vmware" class="tco-btn active">
                        VMware
                    </div>
                    <div id="vz-aws" class="tco-btn">
                        AWS
                    </div>
                </div>
                <div class="radio-group">
                    <label>
                        ${t('Estimated VMware')}
                        <input type="radio" name="competitor-price" id="estimated-vmware" value="vmware-price"
                               checked>
                    </label>
                    <label>
                        ${t('Estimated AWS')}
                        <input type="radio" name="competitor-price" id="estimated-aws" value="aws-price">
                    </label>
                    <label>
                        ${t('Custom price')}
                        <input type="radio" name="competitor-price" id="custom-price" value="custom-price">
                    </label>

                    <div id="vz-vmware-price" class="tco-check competitor-price competitor-vmware show active">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('Estimated cost includes VMware Cloud Foundation software licensing, hardware, colocation and staffing based on standard assumptions.')}</strong>
                                <strong class="additional-text">${t('Storage-optimized scenario uses VMware VCF + Ceph, as vSAN does not support cold/object storage.')}</strong>
                            </span>
                        </div>
                        <div class="check-row">
                            <div class="counting-wrapper">
                                <div class="counting-col">
                                    <strong class="counting-title">${t('VMware usable storage:')}</strong>
                                    <div class="counting">
                                        <span>${t('Hot Storage (TB)')}</span><span class="vmware-hot">0</span>
                                    </div>
                                    <div class="counting">
                                        <span>${t('Cold Storage (TB)')}</span><span class="vmware-cold">0</span>
                                    </div>
                                </div>
                                <div class="counting-col">
                                    <strong class="counting-title">${t('Virtuozzo usable storage:')}</strong>
                                    <div class="counting">
                                        <span>${t('Hot Storage (TB)')}</span><span class="virtuozzo-hot">0</span>
                                    </div>
                                    <div class="counting">
                                        <span>${t('Cold Storage (TB)')}</span><span class="virtuozzo-cold">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="vz-aws-price" class="tco-check competitor-price competitor-aws">
                        <div class="check-row">
                            <span class="checkbox">
                                <strong>
                                    ${t('Estimated cost includes software licensing, hardware, colocation and staffing based on standard assumptions.')}</strong>
                            </span>
                        </div>
                        <div class="check-row">
                            <div class="counting-wrapper">
                                <div class="counting-col">
                                    <strong class="counting-title">${t('AWS usable storage:')}</strong>
                                    <div class="counting">
                                        <span>${t('Hot Storage (TB)')}</span><span class="aws-hot">0</span>
                                    </div>
                                    <div class="counting">
                                        <span>${t('Cold Storage (TB)')}</span><span class="aws-cold">0</span>
                                    </div>
                                </div>
                                <div class="counting-col">
                                    <strong class="counting-title">${t('Virtuozzo usable storage:')}</strong>
                                    <div class="counting">
                                        <span>${t('Hot Storage (TB)')}</span><span class="virtuozzo-hot">0</span>
                                    </div>
                                    <div class="counting">
                                        <span>${t('Cold Storage (TB)')}</span><span class="virtuozzo-cold">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="vz-custom-price" class="tco-check competitor-price">
                        <div class="check-row">
                        <span class="checkbox">
                            <strong>
                                ${t('Custom price')}</strong>
                        </span>
                        </div>
                        <div class="check-row">
                            <div class="tco-field-wrapper">
                                <label>
                                    ${t('Compute Node Price ($/year)')}
                                    <input type="number" name="compute-node-price" placeholder="0">
                                </label>
                            </div>
                            <div id="custom-cold-storage" class="tco-field-wrapper">
                                <label>
                                    ${t('Cold Storage Node Price ($/year)')}
                                    <input type="number" name="storage-node-price" placeholder="0">
                                </label>
                            </div>
                            <div id="storage-cold-storage-price-per-tb" class="tco-field-wrapper">
                                <label>
                                    ${t('Cold Storage ($/TB/year)')}
                                    <input type="number" name="storage-cold-storage-price-per-tb" placeholder="0">
                                </label>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        <div class="tco-form-half">
            <div class="tco-results-wrapper">
                <div class="tco-calc-block tco-calc-results">
                    <h2>${t('Your Estimated Savings <strong>with Virtuozzo</strong>')}</h2>
                    <div class="calc-results">
                        <div class="tco">
                            <span id="tco-result">0%</span>
                            <p>${t('Lower TCO')}</p>
                        </div>
                        <div class="more-storage">
                            <span id="storage-result">0%</span>
                            <p>${t('More Storage')}</p>
                        </div>
                        <div class="annual">
                            <span id="annual-result">$0</span>
                            <p>${t('Annual Savings')}</p>
                        </div>
                    </div>
                    <div class="calc-results-comp">
                        <p><span class="competitor-name">VMware</span> <span id="competitor-result">0$</span></p>
                        <p><span>Virtuozzo</span> <span id="virtuozzo-result">0$</span></p>
                        <p class="tco-caption">${t('Estimated cost includes software licensing, hardware, colocation and staffing based on standard assumptions. CAPEX is calculated using 3-year depreciation. Support costs are based on comparable SLA levels.')}</p>
                    </div>
                    <div class="calc-result-description">
                        <p>${t('Your savings go beyond licensing costs:')}</p>
                        <ul>
                            <li>${t('Up to 90% utilization of your existing hardware')}</li>
                            <li>${t('Built-in HCI (compute + storage), no extra overhead')}</li>
                            <li>${t('No vendor lock-in, full control')}</li>
                            <li>${t('Lower transition costs with a proven migration blueprint')}</li>
                        </ul>
                    </div>
                </div>
                <div class="tco-calc-block tco-calc-cta">
                    <h2>${t('Need a More Detailed TCO Estimate?')}</h2>
                    <p>
                        ${t('This calculator provides an estimate based on standard assumptions, including software licensing, hardware, colocation, and staffing. For a more precise TCO analysis tailored to your specific infrastructure, requirements, and architecture, talk to our experts.')}
                    </p>
                    <div class="btn-wrapper">
                        ${(bShowForm === true || bShowForm === "true") ? `
                        <a id="open-form" href="#" class="btn">${t('TALK TO AN EXPERT')}</a>
                        ` : `
                                <a href="${sButtonLink}" class="btn" target="_blank" rel="noopener">${sButtonText}</a>
                        `}
                    </div>
                    ${(bShowForm === true || bShowForm === "true") ? `
                    <div class="tco-form-wrapper">
                        <span class="close-form">✕</span>
                        <h2>${t('TALK TO AN EXPERT')}</h2>
                        <div class="tco-form">
                            <div class="tco-field">
                                <label class="sr-only" for="user_name">${t('First Name')}</label>
                                <input type="text" id="user_name" name="firstName" placeholder="${ta('First Name *')}">
                            </div>
                            <div class="tco-field">
                                <label class="sr-only" for="user_lastname">${t('Last Name')}</label>
                                <input type="text" id="user_lastname" name="lastName" placeholder="${ta('Last Name *')}">
                            </div>
                            <div class="tco-field">
                                <label class="sr-only" for="user_email">${t('E-mail')}</label>
                                <input type="email" id="user_email" name="email" placeholder="${ta('Email *')}">
                            </div>
                            <div class="tco-field">
                                <label class="sr-only" for="user_job">${t('Job Title')}</label>
                                <input type="text" id="user_job" name="user_job" placeholder="${ta('Job Title *')}">
                            </div>
                            <div class="tco-field">
                                <label class="sr-only" for="user_company">${t('Company')}</label>
                                <input type="text" id="user_company" name="company" placeholder="${ta('Company *')}">
                            </div>
                            <div class="tco-field">
                                <label class="sr-only" for="user_country">${t('Country')}</label>
                                <select id="user_country" name="country">
                                    <option value="" selected="selected">${t('Country *')}</option>
                                    <option value="United States">${t('United States')}</option>
                                    <option value="Canada">${t('Canada')}</option>
                                    <option value="Afghanistan">${t('Afghanistan')}</option>
                                    <option value="Aland">${t('Aland')}</option>
                                    <option value="Albania">${t('Albania')}</option>
                                    <option value="Algeria">${t('Algeria')}</option>
                                    <option value="American">${t('American Samoa')}</option>
                                    <option value="Andorra">${t('Andorra')}</option>
                                    <option value="Angola">${t('Angola')}</option>
                                    <option value="Anguilla">${t('Anguilla')}</option>
                                    <option value="Antarctica">${t('Antarctica')}</option>
                                    <option value="Antigua and Barbuda">${t('Antigua and Barbuda')}</option>
                                    <option value="Argentina">${t('Argentina')}</option>
                                    <option value="Armenia">${t('Armenia')}</option>
                                    <option value="Aruba">${t('Aruba')}</option>
                                    <option value="Ascension">${t('Ascension')}</option>
                                    <option value="Australia">${t('Australia')}</option>
                                    <option value="Austria">${t('Austria')}</option>
                                    <option value="Azerbaijan">${t('Azerbaijan')}</option>
                                    <option value="Bahamas">${t('Bahamas')}</option>
                                    <option value="Bahrain">${t('Bahrain')}</option>
                                    <option value="Bangladesh">${t('Bangladesh')}</option>
                                    <option value="Barbados">${t('Barbados')}</option>
                                    <option value="Belarus">${t('Belarus')}</option>
                                    <option value="Belgium">${t('Belgium')}</option>
                                    <option value="Belize">${t('Belize')}</option>
                                    <option value="Benin">${t('Benin')}</option>
                                    <option value="Bermuda">${t('Bermuda')}</option>
                                    <option value="Bhutan">${t('Bhutan')}</option>
                                    <option value="Bolivia">${t('Bolivia')}</option>
                                    <option value="Bosnia and Herzegovina">${t('Bosnia and Herzegovina')}</option>
                                    <option value="Botswana">${t('Botswana')}</option>
                                    <option value="Bouvet Island">${t('Bouvet Island')}</option>
                                    <option value="Br. Indian Ocean Territory">${t('Br. Indian Ocean Territory')}</option>
                                    <option value="Brazil">${t('Brazil')}</option>
                                    <option value="British Virgin Islands">${t('British Virgin Islands')}</option>
                                    <option value="Brunei">${t('Brunei')}</option>
                                    <option value="Bulgaria">${t('Bulgaria')}</option>
                                    <option value="Burkina Faso">${t('Burkina Faso')}</option>
                                    <option value="Burundi">${t('Burundi')}</option>
                                    <option value="Cambodia">${t('Cambodia')}</option>
                                    <option value="Cameroon">${t('Cameroon')}</option>
                                    <option value="Cape Verde">${t('Cape Verde')}</option>
                                    <option value="Cayman Islands">${t('Cayman Islands')}</option>
                                    <option value="Central African Republic">${t('Central African Republic')}</option>
                                    <option value="Chad">${t('Chad')}</option>
                                    <option value="Chile">${t('Chile')}</option>
                                    <option value="China">${t('China')}</option>
                                    <option value="Christmas Island">${t('Christmas Island')}</option>
                                    <option value="Cocos (Keeling) Islands">${t('Cocos (Keeling) Islands')}</option>
                                    <option value="Colombia">${t('Colombia')}</option>
                                    <option value="Comoros">${t('Comoros')}</option>
                                    <option value="Cook Islands">${t('Cook Islands')}</option>
                                    <option value="Costa Rica">${t('Costa Rica')}</option>
                                    <option value="Croatia">${t('Croatia')}</option>
                                    <option value="Curacao">${t('Curacao')}</option>
                                    <option value="Cyprus">${t('Cyprus')}</option>
                                    <option value="Czech Republic">${t('Czech Republic')}</option>
                                    <option value="Democratic Republic of Congo">${t('Democratic Republic of Congo')}</option>
                                    <option value="Denmark">${t('Denmark')}</option>
                                    <option value="Djibouti">${t('Djibouti')}</option>
                                    <option value="Dominica">${t('Dominica')}</option>
                                    <option value="Dominican Republic">${t('Dominican Republic')}</option>
                                    <option value="Ecuador">${t('Ecuador')}</option>
                                    <option value="Egypt">${t('Egypt')}</option>
                                    <option value="El Salvador">${t('El Salvador')}</option>
                                    <option value="Equatorial Guinea">${t('Equatorial Guinea')}</option>
                                    <option value="Eritrea">${t('Eritrea')}</option>
                                    <option value="Estonia">${t('Estonia')}</option>
                                    <option value="Ethiopia">${t('Ethiopia')}</option>
                                    <option value="Falkland Islands">${t('Falkland Islands')}</option>
                                    <option value="Faroe Islands">${t('Faroe Islands')}</option>
                                    <option value="Fiji">${t('Fiji')}</option>
                                    <option value="Finland">${t('Finland')}</option>
                                    <option value="France">${t('France')}</option>
                                    <option value="French Guiana">${t('French Guiana')}</option>
                                    <option value="French Polynesia">${t('French Polynesia')}</option>
                                    <option value="French Southern Territories">${t('French Southern Territories')}</option>
                                    <option value="Gabon">${t('Gabon')}</option>
                                    <option value="Gambia">${t('Gambia')}</option>
                                    <option value="Georgia">${t('Georgia')}</option>
                                    <option value="Germany">${t('Germany')}</option>
                                    <option value="Ghana">${t('Ghana')}</option>
                                    <option value="Gibraltar">${t('Gibraltar')}</option>
                                    <option value="Greece">${t('Greece')}</option>
                                    <option value="Greenland">${t('Greenland')}</option>
                                    <option value="Grenada">${t('Grenada')}</option>
                                    <option value="Guadeloupe">${t('Guadeloupe')}</option>
                                    <option value="Guam">${t('Guam')}</option>
                                    <option value="Guatemala">${t('Guatemala')}</option>
                                    <option value="Guernsey">${t('Guernsey')}</option>
                                    <option value="Guinea">${t('Guinea')}</option>
                                    <option value="Guinea-Bissau">${t('Guinea-Bissau')}</option>
                                    <option value="Guyana">${t('Guyana')}</option>
                                    <option value="Haiti">${t('Haiti')}</option>
                                    <option value="Heard and McDonald Islands">${t('Heard and McDonald Islands')}</option>
                                    <option value="Honduras">${t('Honduras')}</option>
                                    <option value="Hong Kong S.A.R., China">${t('Hong Kong S.A.R., China')}</option>
                                    <option value="Hungary">${t('Hungary')}</option>
                                    <option value="Iceland">${t('Iceland')}</option>
                                    <option value="India">${t('India')}</option>
                                    <option value="Indonesia">${t('Indonesia')}</option>
                                    <option value="Ireland">${t('Ireland')}</option>
                                    <option value="Isle of Man">${t('Isle of Man')}</option>
                                    <option value="Israel">${t('Israel')}</option>
                                    <option value="Italy">${t('Italy')}</option>
                                    <option value="Jamaica">${t('Jamaica')}</option>
                                    <option value="Japan">${t('Japan')}</option>
                                    <option value="Jersey">${t('Jersey')}</option>
                                    <option value="Jordan">${t('Jordan')}</option>
                                    <option value="Kazakhstan">${t('Kazakhstan')}</option>
                                    <option value="Kenya">${t('Kenya')}</option>
                                    <option value="Kiribati">${t('Kiribati')}</option>
                                    <option value="Kuwait">${t('Kuwait')}</option>
                                    <option value="Kyrgyzstan">${t('Kyrgyzstan')}</option>
                                    <option value="Laos">${t('Laos')}</option>
                                    <option value="Latvia">${t('Latvia')}</option>
                                    <option value="Lebanon">${t('Lebanon')}</option>
                                    <option value="Lesotho">${t('Lesotho')}</option>
                                    <option value="Libya">${t('Libya')}</option>
                                    <option value="Liechtenstein">${t('Liechtenstein')}</option>
                                    <option value="Lithuania">${t('Lithuania')}</option>
                                    <option value="Luxembourg">${t('Luxembourg')}</option>
                                    <option value="Macau">${t('Macau')}</option>
                                    <option value="Macedonia">${t('Macedonia')}</option>
                                    <option value="Madagascar">${t('Madagascar')}</option>
                                    <option value="Malawi">${t('Malawi')}</option>
                                    <option value="Malaysia">${t('Malaysia')}</option>
                                    <option value="Maldives">${t('Maldives')}</option>
                                    <option value="Mali">${t('Mali')}</option>
                                    <option value="Malta">${t('Malta')}</option>
                                    <option value="Marshall Islands">${t('Marshall Islands')}</option>
                                    <option value="Martinique">${t('Martinique')}</option>
                                    <option value="Mauritania">${t('Mauritania')}</option>
                                    <option value="Mauritius">${t('Mauritius')}</option>
                                    <option value="Mayotte">${t('Mayotte')}</option>
                                    <option value="Mexico">${t('Mexico')}</option>
                                    <option value="Micronesia">${t('Micronesia')}</option>
                                    <option value="Moldova">${t('Moldova')}</option>
                                    <option value="Monaco">${t('Monaco')}</option>
                                    <option value="Mongolia">${t('Mongolia')}</option>
                                    <option value="Montenegro">${t('Montenegro')}</option>
                                    <option value="Montserrat">${t('Montserrat')}</option>
                                    <option value="Morocco">${t('Morocco')}</option>
                                    <option value="Mozambique">${t('Mozambique')}</option>
                                    <option value="Myanmar (Burma)">${t('Myanmar (Burma)')}</option>
                                    <option value="Namibia">${t('Namibia')}</option>
                                    <option value="Nauru">${t('Nauru')}</option>
                                    <option value="Nepal">${t('Nepal')}</option>
                                    <option value="Netherlands">${t('Netherlands')}</option>
                                    <option value="Netherlands Antilles">${t('Netherlands Antilles')}</option>
                                    <option value="New Caledonia">${t('New Caledonia')}</option>
                                    <option value="New Zealand">${t('New Zealand')}</option>
                                    <option value="Nicaragua">${t('Nicaragua')}</option>
                                    <option value="Niger">${t('Niger')}</option>
                                    <option value="Nigeria">${t('Nigeria')}</option>
                                    <option value="Niue">${t('Niue')}</option>
                                    <option value="Norfolk Island">${t('Norfolk Island')}</option>
                                    <option value="Northern Mariana Islands">${t('Northern Mariana Islands')}</option>
                                    <option value="Norway">${t('Norway')}</option>
                                    <option value="Oman">${t('Oman')}</option>
                                    <option value="Pakistan">${t('Pakistan')}</option>
                                    <option value="Palau">${t('Palau')}</option>
                                    <option value="Palestinian Territory">${t('Palestinian Territory')}</option>
                                    <option value="Panama">${t('Panama')}</option>
                                    <option value="Papua New Guinea">${t('Papua New Guinea')}</option>
                                    <option value="Paraguay">${t('Paraguay')}</option>
                                    <option value="Peru">${t('Peru')}</option>
                                    <option value="Philippines">${t('Philippines')}</option>
                                    <option value="Pitcairn Islands">${t('Pitcairn Islands')}</option>
                                    <option value="Poland">${t('Poland')}</option>
                                    <option value="Portugal">${t('Portugal')}</option>
                                    <option value="Puerto Rico">${t('Puerto Rico')}</option>
                                    <option value="Qatar">${t('Qatar')}</option>
                                    <option value="Reunion">${t('Reunion')}</option>
                                    <option value="Romania">${t('Romania')}</option>
                                    <option value="Russia">${t('Russia')}</option>
                                    <option value="Rwanda">${t('Rwanda')}</option>
                                    <option value="Saint Barthelemy">${t('Saint Barthelemy')}</option>
                                    <option value="Saint Helena">${t('Saint Helena')}</option>
                                    <option value="Saint Kitts and Nevis">${t('Saint Kitts and Nevis')}</option>
                                    <option value="Saint Lucia">${t('Saint Lucia')}</option>
                                    <option value="Saint Martin">${t('Saint Martin')}</option>
                                    <option value="Saint Pierre and Miquelon">${t('Saint Pierre and Miquelon')}</option>
                                    <option value="Saint Vincent and Grenadines">${t('Saint Vincent and Grenadines')}</option>
                                    <option value="Samoa">${t('Samoa')}</option>
                                    <option value="San Marino">${t('San Marino')}</option>
                                    <option value="Sao Tome and Principe">${t('Sao Tome and Principe')}</option>
                                    <option value="Saudi Arabia">${t('Saudi Arabia')}</option>
                                    <option value="Senegal">${t('Senegal')}</option>
                                    <option value="Serbia">${t('Serbia')}</option>
                                    <option value="Seychelles">${t('Seychelles')}</option>
                                    <option value="S Georgia S Sandwich Islands">${t('S Georgia S Sandwich Islands')}</option>
                                    <option value="Sierra Leone">${t('Sierra Leone')}</option>
                                    <option value="Singapore">${t('Singapore')}</option>
                                    <option value="Sint Maarten">${t('Sint Maarten')}</option>
                                    <option value="Slovakia">${t('Slovakia')}</option>
                                    <option value="Slovenia">${t('Slovenia')}</option>
                                    <option value="Solomon Islands">${t('Solomon Islands')}</option>
                                    <option value="Somalia">${t('Somalia')}</option>
                                    <option value="South Africa">${t('South Africa')}</option>
                                    <option value="South Korea">${t('South Korea')}</option>
                                    <option value="South Sudan">${t('South Sudan')}</option>
                                    <option value="Spain">${t('Spain')}</option>
                                    <option value="Sri Lanka">${t('Sri Lanka')}</option>
                                    <option value="Suriname">${t('Suriname')}</option>
                                    <option value="Svalbard">${t('Svalbard')}</option>
                                    <option value="Swaziland">${t('Swaziland')}</option>
                                    <option value="Sweden">${t('Sweden')}</option>
                                    <option value="Switzerland">${t('Switzerland')}</option>
                                    <option value="Taiwan">${t('Taiwan')}</option>
                                    <option value="Tajikistan">${t('Tajikistan')}</option>
                                    <option value="Tanzania">${t('Tanzania')}</option>
                                    <option value="Thailand">${t('Thailand')}</option>
                                    <option value="Timor-Leste (East Timor)">${t('Timor-Leste (East Timor)')}</option>
                                    <option value="Togo">${t('Togo')}</option>
                                    <option value="Tokelau">${t('Tokelau')}</option>
                                    <option value="Tonga">${t('Tonga')}</option>
                                    <option value="Trinidad and Tobago">${t('Trinidad and Tobago')}</option>
                                    <option value="Tristan da Cunha">${t('Tristan da Cunha')}</option>
                                    <option value="Tunisia">${t('Tunisia')}</option>
                                    <option value="Turkey">${t('Turkey')}</option>
                                    <option value="Turkmenistan">${t('Turkmenistan')}</option>
                                    <option value="Turks and Caicos Islands">${t('Turks and Caicos Islands')}</option>
                                    <option value="Tuvalu">${t('Tuvalu')}</option>
                                    <option value="U.S. Minor Outlying Islands">${t('U.S. Minor Outlying Islands')}</option>
                                    <option value="U.S. Virgin Islands">${t('U.S. Virgin Islands')}</option>
                                    <option value="Uganda">${t('Uganda')}</option>
                                    <option value="Ukraine">${t('Ukraine')}</option>
                                    <option value="United Arab Emirates">${t('United Arab Emirates')}</option>
                                    <option value="United Kingdom">${t('United Kingdom')}</option>
                                    <option value="Uruguay">${t('Uruguay')}</option>
                                    <option value="Uzbekistan">${t('Uzbekistan')}</option>
                                    <option value="Vanuatu">${t('Vanuatu')}</option>
                                    <option value="Vatican City">${t('Vatican City')}</option>
                                    <option value="Venezuela">${t('Venezuela')}</option>
                                    <option value="Viet Nam">${t('Viet Nam')}</option>
                                    <option value="Wallis and Futuna">${t('Wallis and Futuna')}</option>
                                    <option value="Western Sahara">${t('Western Sahara')}</option>
                                    <option value="Yemen">${t('Yemen')}</option>
                                    <option value="Zambia">${t('Zambia')}</option>
                                </select>
                            </div>
                        </div>
                        <label class="sr-only" for="comment">${t('Comments')}</label>
                        <textarea name="comment" id="comment"
                                  placeholder="${ta('Tell us about your current infrastructure setup (e.g., VMware, public cloud, or custom environment), including any relevant details.')}"></textarea>
                        <label for="newsletter" class="checkbox">
                            <input type="checkbox" id="newsletter" name="newsletter">
                            <span>${t('I would like to receive news about Virtuozzo products and upcoming events. I understand that I can opt-out at any time.')}</span>
                        </label>
                        <label for="terms" class="checkbox">
                            <input type="checkbox" id="terms" name="terms">
                            <span>${t('I agree to the <a href="https://www.virtuozzo.com/legal/privacy-notice/" target="_blank">Privacy Notice</a> and <a href="https://www.virtuozzo.com/legal/cookie-policy/" target="_blank">Cookie Policy</a>. *')}</span>
                        </label>
                        <div class="btn-wrapper">
                            <input type="submit" value="${ta('Send a Request')}" class="btn">
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>
    ${(bShowBanner === true || bShowBanner === "true") ? `
    <div class="tco-calc-banner">
        <p>${t('Access the full TCO source model with detailed assumptions and calculation logic.')}</p>
        <a href="https://www.virtuozzo.com/tco-calculator-source-model/" target="_blank" class="btn">${t('DOWNLOAD THE SOURCE')}</a>
    </div>
    ` : ''}
</form>
<div class="success-message">
    <h2>
        ${t('Thanks for Your Request')}
    </h2>
    <p>${t('Our team will review your details and get back to you shortly.')}</p>
</div>`;
};
