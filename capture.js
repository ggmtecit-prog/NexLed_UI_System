const defaultCanvas = { width: 1200, height: 1200 };
const defaultContentClass = 'w-full h-full flex items-center justify-center';
const canvasSurfaceClasses = { white: ['bg-white'], grey: ['bg-grey-tertiary'], black: ['bg-black'] };
const bodySurfaceClasses = ['bg-white', 'bg-grey-tertiary', 'bg-black', 'text-black', 'text-white'];
const controlParamKeys = ['pattern', 'variant', 'size', 'state'];
const sizeLabel = { xs: 'Extra Small', sm: 'Small', md: 'Medium', lg: 'Large' };
const defaultZoom = 1;
const minZoom = 0.25;
const maxZoom = 3;
const zoomStep = 0.1;
const sourceCache = new Map();

const option = (value, label) => ({ value, label });
const sizeOptions = ['xs', 'sm', 'md', 'lg'].map(value => option(value, sizeLabel[value]));
const badgeToneOptions = ['primary', 'success', 'danger', 'neutral', 'warning', 'info'].map(value => option(value, titleCase(value)));

const families = {
    buttons: {
        label: 'Buttons',
        defaults: { pattern: 'text', variant: 'primary', size: 'md', state: 'default' },
        controls: [
            { key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('text', 'Text'), option('icon-text', 'Icon + Text'), option('icon', 'Icon'), option('toggle', 'Toggle')] },
            {
                key: 'variant',
                widthClass: 'md:w-btn-md',
                options: values => {
                    if (values.pattern === 'text') return [option('primary', 'Primary'), option('secondary', 'Secondary'), option('ghost', 'Ghost')];
                    if (values.pattern === 'icon') return [option('secondary', 'Secondary'), option('ghost', 'Ghost')];
                    if (values.pattern === 'icon-text') return [option('primary', 'Primary')];
                    return [option('secondary', 'Secondary')];
                }
            },
            { key: 'size', widthClass: 'md:w-btn-md', options: () => sizeOptions },
            {
                key: 'state',
                widthClass: 'md:w-btn-md',
                options: values => {
                    if (values.pattern === 'toggle') return [option('default', 'Default'), option('active', 'Active'), option('disabled', 'Disabled')];
                    if (values.pattern === 'icon' && values.variant === 'secondary') return [option('default', 'Default'), option('active', 'Active'), option('disabled', 'Disabled')];
                    return [option('default', 'Default'), option('disabled', 'Disabled')];
                }
            }
        ]
    },
    badges: {
        label: 'Badges',
        defaults: { pattern: 'label', variant: 'primary', size: 'md', state: 'default' },
        controls: [
            { key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('label', 'Label'), option('button', 'Button'), option('dot', 'Dot')] },
            { key: 'variant', widthClass: 'md:w-btn-md', options: () => badgeToneOptions },
            {
                key: 'size',
                widthClass: 'md:w-btn-md',
                options: values => {
                    if (values.pattern === 'label') return [option('lg', 'Large'), option('md', 'Medium'), option('sm', 'Small')];
                    if (values.pattern === 'button') return [option('md', 'Medium')];
                    return [option('dot', 'Dot')];
                }
            },
            {
                key: 'state',
                widthClass: 'md:w-btn-md',
                options: values => values.pattern === 'button'
                    ? [option('default', 'Default'), option('disabled', 'Disabled'), option('aria-disabled', 'ARIA Disabled')]
                    : [option('default', 'Default')]
            }
        ]
    },
    inputs: {
        label: 'Inputs',
        defaults: { pattern: 'standard', size: 'md', state: 'default' },
        controls: [
            { key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('standard', 'Standard'), option('success', 'Success'), option('error', 'Error')] },
            {
                key: 'size',
                widthClass: 'md:w-btn-md',
                options: values => { if (values.pattern !== 'standard') return [option('md', 'Medium')]; if (values.state === 'disabled') return [option('md', 'Medium')]; return [option('sm', 'Small'), option('md', 'Medium'), option('lg', 'Large')]; }
            },
            {
                key: 'state',
                widthClass: 'md:w-btn-md',
                options: values => values.pattern === 'standard' ? [option('default', 'Default'), option('disabled', 'Disabled')] : [option('default', 'Default')]
            }
        ]
    },
    checkboxes: {
        label: 'Checkboxes',
        defaults: { size: 'md', state: 'checked' },
        controls: [
            { key: 'size', widthClass: 'md:w-btn-md', options: () => [option('lg', 'Large'), option('md', 'Medium'), option('sm', 'Small')] },
            { key: 'state', widthClass: 'md:w-btn-md', options: () => [option('unchecked', 'Unchecked'), option('checked', 'Checked'), option('disabled', 'Disabled')] }
        ]
    },
    accordion: {
        label: 'Accordion',
        defaults: { size: 'md', state: 'closed' },
        controls: [
            { key: 'size', widthClass: 'md:w-btn-md', options: () => [option('sm', 'Small'), option('md', 'Medium'), option('lg', 'Large')] },
            { key: 'state', widthClass: 'md:w-btn-md', options: () => [option('closed', 'Closed'), option('open', 'Open'), option('disabled', 'Disabled')] }
        ]
    },
    dropdown: {
        label: 'Dropdown',
        defaults: { pattern: 'standard', size: 'md', state: 'empty' },
        controls: [
            { key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('standard', 'Standard'), option('minimal', 'Minimal'), option('top-panel', 'Top Panel')] },
            {
                key: 'size',
                widthClass: 'md:w-btn-md',
                options: values => {
                    if (values.pattern === 'standard' && values.state === 'selected') return [option('md', 'Medium')];
                    if (values.pattern === 'standard') return sizeOptions;
                    if (values.pattern === 'minimal') return [option('md', 'Medium'), option('lg', 'Large')];
                    return [option('md', 'Medium')];
                }
            },
            {
                key: 'state',
                widthClass: 'md:w-btn-md',
                options: values => {
                    if (values.pattern === 'standard') return [option('empty', 'Empty'), option('selected', 'Selected')];
                    if (values.pattern === 'minimal') return [option('selected', 'Selected')];
                    return [option('open', 'Open')];
                }
            }
        ]
    },
    cards: { label: 'Cards', defaults: { pattern: 'title-copy' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-lg', options: () => [option('text-only', 'Text Only'), option('title-copy', 'Title + Copy'), option('icon-link', 'Icon + Link'), option('actions', 'Actions'), option('metric', 'Metric'), option('image-only', 'Image Only')] }] },
    alerts: { label: 'Alerts', defaults: { pattern: 'default' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-lg', options: () => [option('default', 'Default'), option('success', 'Success'), option('warning', 'Warning'), option('info', 'Info'), option('danger', 'Danger'), option('large', 'Large'), option('disabled', 'Disabled')] }] },
    'empty-state': { label: 'Empty State', defaults: { pattern: 'folders' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-lg', options: () => [option('search', 'Search'), option('folders', 'Folders'), option('review', 'Review'), option('compact', 'Compact'), option('action', 'Action'), option('disabled', 'Disabled')] }] },
    pagination: { label: 'Pagination', defaults: { pattern: 'standard' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('standard', 'Standard'), option('compact', 'Compact')] }] },
    'data-table': { label: 'Data Table', defaults: { pattern: 'floating' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('floating', 'Floating Head')] }] },
    toast: { label: 'Toast', defaults: { pattern: 'success' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('success', 'Success'), option('info', 'Info'), option('warning', 'Warning'), option('danger', 'Danger'), option('action', 'Action')] }] },
    sidebar: { label: 'Sidebar', defaults: { pattern: 'rail' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('rail', 'Rail')] }] },
    footer: { label: 'Footer', defaults: { pattern: 'core' }, controls: [{ key: 'pattern', widthClass: 'md:w-btn-md', options: () => [option('core', 'Core'), option('bottom', 'Bottom Bar')] }] }
};

function clampDimension(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clampZoom(value, fallback = defaultZoom) {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.min(maxZoom, Math.max(minZoom, parsed));
}

function formatZoom(zoom) {
    return `${Math.round(clampZoom(zoom) * 100)}%`;
}

function parseZoomInput(value) {
    const normalized = String(value || '').replace('%', '').trim();
    if (!normalized) return defaultZoom;
    return clampZoom(Number.parseFloat(normalized) / 100, defaultZoom);
}

function titleCase(value) {
    return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function getFamily(key) {
    return families[key] || families.buttons;
}

function normalizeControlValues(familyKey, incomingValues = {}) {
    const family = getFamily(familyKey);
    let values = { ...family.defaults, ...incomingValues };
    for (let pass = 0; pass < 4; pass += 1) {
        family.controls.forEach(control => {
            const options = control.options(values);
            const optionValues = options.map(item => item.value);
            if (!optionValues.includes(values[control.key])) values[control.key] = options[0].value;
        });
    }
    return values;
}

function dropdownMenu(options, selectedValue) {
    return options.map(item => `<li class="dropdown-item" role="option" aria-selected="${String(item.value === selectedValue)}" data-value="${item.value}"><span>${item.label}</span><i class="ri-check-line dropdown-item-check" aria-hidden="true"></i></li>`).join('');
}
function getControlOptions(familyKey, controlKey, values) {
    const family = getFamily(familyKey);
    const control = family.controls.find(item => item.key === controlKey);
    if (!control) return [];
    return control.options(values).map(item => ({ ...item }));
}

function buildFrameUrl(file, version) {
    return `${file}?capture-preview=${version}`;
}

function waitForFrameLoad(frame, url) {
    return new Promise((resolve, reject) => {
        const handleLoad = () => {
            frame.removeEventListener('load', handleLoad);
            frame.removeEventListener('error', handleError);
            resolve(frame.contentDocument);
        };
        const handleError = () => {
            frame.removeEventListener('load', handleLoad);
            frame.removeEventListener('error', handleError);
            reject(new Error(`Failed to load ${url}`));
        };
        frame.addEventListener('load', handleLoad, { once: true });
        frame.addEventListener('error', handleError, { once: true });
        frame.src = buildFrameUrl(url, Date.now());
    });
}

function findByXPath(doc, xpath) {
    return doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function isolateLiveNode(doc, descriptor) {
    const target = findByXPath(doc, descriptor.xpath);
    if (!target) throw new Error(`Missing live specimen for ${descriptor.file}`);
    const wrapper = doc.createElement('main');
    wrapper.className = descriptor.contentClass || defaultContentClass;
    doc.documentElement.className = 'bg-transparent';
    doc.body.className = 'min-h-screen m-0 bg-transparent overflow-hidden';
    doc.body.replaceChildren(wrapper);
    wrapper.appendChild(target);
}

function createLiveFrame(version) {
    const frame = document.createElement('iframe');
    frame.className = 'w-full h-full border-0 bg-transparent hidden';
    frame.setAttribute('title', 'Live component preview');
    frame.setAttribute('loading', 'eager');
    frame.dataset.renderVersion = String(version);
    return frame;
}

async function loadLiveFrame(frame, descriptor) {
    const doc = await waitForFrameLoad(frame, descriptor.file);
    isolateLiveNode(doc, descriptor);
    frame.classList.remove('hidden');
    return frame;
}

function buildSourceDescriptor(familyKey, values) {
    switch (familyKey) {
        case 'buttons': {
            const size = values.size;
            if (values.pattern === 'text') {
                if (values.state === 'disabled') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@disabled and contains(@class,'btn-${values.variant}') and contains(@class,'btn-${size}') and not(contains(@class,'btn-icon')) and not(contains(@class,'btn-toggle'))]`, width: 1200, height: 1200 };
                return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[not(@disabled) and normalize-space()='${titleCase(values.variant)}' and contains(@class,'btn-${values.variant}') and contains(@class,'btn-${size}') and not(contains(@class,'btn-icon')) and not(contains(@class,'btn-toggle'))]`, width: 1200, height: 1200 };
            }
            if (values.pattern === 'icon-text') {
                if (values.state === 'disabled') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@disabled and contains(@class,'btn-primary') and contains(@class,'btn-${size}') and not(contains(@class,'btn-icon')) and not(contains(@class,'btn-toggle')) and .//i]`, width: 1200, height: 1200 };
                return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[not(@disabled) and contains(@class,'btn-primary') and contains(@class,'btn-${size}') and not(contains(@class,'btn-icon')) and not(contains(@class,'btn-toggle')) and .//i[contains(@class,'ri-delete-bin-2-line')]]`, width: 1200, height: 1200 };
            }
            if (values.pattern === 'icon') {
                if (values.state === 'disabled') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@disabled and contains(@class,'btn-${values.variant}') and contains(@class,'btn-icon') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
                if (values.state === 'active') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@data-toggle-pressed and @aria-pressed='true' and contains(@class,'btn-secondary') and contains(@class,'btn-icon') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
                return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[not(@disabled) and @aria-pressed='false' and contains(@class,'btn-${values.variant}') and contains(@class,'btn-icon') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
            }
            if (values.state === 'disabled') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@disabled and contains(@class,'btn-toggle') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
            if (values.state === 'active') return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@data-toggle-pressed and @aria-pressed='true' and contains(@class,'btn-toggle') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
            return { file: 'atoms.html', xpath: `//section[@id='buttons']//button[@data-toggle-pressed and @aria-pressed='false' and contains(@class,'btn-toggle') and contains(@class,'btn-${size}')]`, width: 1200, height: 1200 };
        }
        case 'badges': {
            if (values.pattern === 'label') return { file: 'atoms.html', xpath: `//section[@id='badges']//span[contains(@class,'badge-${values.variant}') and contains(@class,'badge-${values.size}') and not(contains(@class,'badge-dot'))][1]`, width: 1200, height: 1200 };
            if (values.pattern === 'button') {
                if (values.state === 'disabled') return { file: 'atoms.html', xpath: `//section[@id='badges']//button[@disabled and contains(@class,'badge-${values.variant}')][1]`, width: 1200, height: 1200 };
                if (values.state === 'aria-disabled') return { file: 'atoms.html', xpath: `//section[@id='badges']//button[@aria-disabled='true' and contains(@class,'badge-${values.variant}')][1]`, width: 1200, height: 1200 };
                return { file: 'atoms.html', xpath: `//section[@id='badges']//button[not(@disabled) and not(@aria-disabled='true') and contains(@class,'badge-${values.variant}')][1]`, width: 1200, height: 1200 };
            }
            return { file: 'atoms.html', xpath: `//section[@id='badges']//span[contains(@class,'badge-${values.variant}') and contains(@class,'badge-dot')][1]`, width: 1200, height: 1200 };
        }
        case 'inputs': {
            if (values.pattern === 'standard') {
                if (values.state === 'disabled') return { file: 'molecules.html', xpath: `//input[@id='disabledInput']/parent::div`, width: 1200, height: 1200 };
                return { file: 'molecules.html', xpath: `//input[@id='standardInput${values.size === 'sm' ? 'Sm' : values.size === 'lg' ? 'Lg' : 'Md'}']/parent::div`, width: 1200, height: 1200 };
            }
            if (values.pattern === 'success') return { file: 'molecules.html', xpath: `//input[@id='successInput']/ancestor::div[contains(@class,'p-24')][1]`, width: 1200, height: 1200 };
            return { file: 'molecules.html', xpath: `//input[@id='errorInput']/ancestor::div[contains(@class,'p-24')][1]`, width: 1200, height: 1200 };
        }
        case 'checkboxes': return { file: 'atoms.html', xpath: `//section[@id='checkboxes']//label[contains(@class,'checkbox-${values.size}')][.//span[normalize-space()='${titleCase(values.state)}']][1]`, width: 1200, height: 1200 };
        case 'accordion': {
            if (values.state === 'open') return { file: 'molecules.html', xpath: `//button[@id='accordion-open-trigger']/ancestor::div[contains(@class,'accordion')][1]`, width: 1200, height: 1200 };
            if (values.state === 'disabled') return { file: 'molecules.html', xpath: `//button[@id='accordion-disabled-trigger']/ancestor::div[contains(@class,'accordion')][1]`, width: 1200, height: 1200 };
            const triggerId = values.size === 'sm' ? 'accordion-sm-trigger' : values.size === 'lg' ? 'accordion-lg-trigger' : 'accordion-md-trigger';
            return { file: 'molecules.html', xpath: `//button[@id='${triggerId}']/ancestor::div[contains(@class,'accordion')][1]`, width: 1200, height: 1200 };
        }
        case 'dropdown': {
            if (values.pattern === 'standard') {
                const labels = { xs: 'Standard extra small options', sm: 'Standard small options', md: 'Standard medium options', lg: 'Standard large options' };
                const selectedLabel = values.state === 'selected' ? 'Selected medium options' : labels[values.size];
                return { file: 'molecules.html', xpath: `//ul[@aria-label='${selectedLabel}']/parent::div`, width: 1200, height: 1200 };
            }
            if (values.pattern === 'minimal') {
                const label = values.size === 'lg' ? 'Selected large options' : 'Selected medium options';
                return { file: 'molecules.html', xpath: `//section[@id='dropdown']//div[contains(@class,'dropdown-minimal')][.//ul[@aria-label='${label}']][1]`, width: 1200, height: 1200 };
            }
            return { file: 'molecules.html', xpath: `//ul[@aria-label='Top panel dropdown options']/parent::div`, width: 1200, height: 1200 };
        }
        case 'cards': {
            const labels = {
                'text-only': 'Text Only',
                'title-copy': 'Title + Copy',
                'icon-link': 'Icon + Link',
                'actions': 'Actions',
                'metric': 'Primary Metric',
                'image-only': 'Image Only'
            };
            const target = labels[values.pattern] || labels['title-copy'];
            return { file: 'molecules.html', xpath: `//section[@id='card']//div[contains(@class,'size-grid-row')][.//h4[normalize-space()='${target}']]//*[contains(@class,'card')][1]`, width: 1200, height: 1200 };
        }
        case 'alerts': {
            const ids = { default: 'alert-default-demo', success: 'alert-success-demo', warning: 'alert-warning-demo', info: 'alert-info-demo', danger: 'alert-danger-demo' };
            if (ids[values.pattern]) return { file: 'molecules.html', xpath: `//div[@id='${ids[values.pattern]}']//div[contains(@class,'alert')][1]`, width: 1600, height: 1000 };
            const label = values.pattern === 'large' ? 'Large' : 'Disabled';
            return { file: 'molecules.html', xpath: `//section[@id='alerts']//div[contains(@class,'size-grid-row')][.//h4[normalize-space()='${label}']]//div[contains(@class,'alert')][1]`, width: 1600, height: 1000 };
        }
        case 'empty-state': {
            const labelMap = { search: 'Small', folders: 'Medium', review: 'Large', compact: 'Compact', action: 'Action Ready', disabled: 'Disabled' };
            return { file: 'molecules.html', xpath: `//section[@id='empty-state']//div[contains(@class,'size-grid-row')][.//h4[normalize-space()='${labelMap[values.pattern] || 'Medium'}']]//div[contains(@class,'empty-state')][1]`, width: 1600, height: 1000 };
        }
        case 'pagination': return { file: 'molecules.html', xpath: `//section[@id='pagination']//div[contains(@class,'size-grid-row')][.//h4[normalize-space()='${values.pattern === 'compact' ? 'Compact' : 'Standard'}']]//nav[contains(@class,'pagination')][1]`, width: 1600, height: 1000 };
        case 'data-table': return { file: 'molecules.html', xpath: `//section[@id='data-table']//div[contains(@class,'data-table')][1]`, width: 1920, height: 1080, contentClass: 'w-full h-full flex items-start justify-center' };
        case 'toast': {
            const ids = { success: 'toastSuccessDemo', info: 'toastInfoDemo', warning: 'toastWarningDemo', danger: 'toastDangerDemo', action: 'toastActionDemo' };
            return { file: 'organisms.html', xpath: `//div[@id='${ids[values.pattern] || ids.success}']`, width: 1600, height: 1000, contentClass: 'w-full h-full flex items-start justify-end' };
        }
        case 'sidebar': return { file: 'organisms.html', xpath: `(//section[@id='Sidebar']//div[contains(@class,'sidebar') and contains(@class,'w-sidebar')])[1] | (//div[contains(@class,'sidebar') and contains(@class,'w-sidebar') and contains(@class,'h-sidebar')])[1]`, width: 1600, height: 1200 };
        case 'footer': return { file: 'organisms.html', xpath: `//section[@id='footer']//div[contains(@class,'size-grid-row')][.//h4[normalize-space()='${values.pattern === 'bottom' ? 'Footer + Bottom Bar' : 'Core Footer'}']]//footer[1]`, width: 1920, height: 1080, contentClass: 'w-full h-full flex items-end justify-center' };
        default: return buildSourceDescriptor('buttons', values);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const panelToggle = document.getElementById('panel-toggle');
    const panelToggleIcon = document.getElementById('panel-toggle-icon');
    const toolbar = document.getElementById('capture-toolbar');
    const familyDropdown = document.getElementById('family-dropdown');
    const familyTrigger = familyDropdown.querySelector('.dropdown-trigger');
    const familyValue = document.getElementById('family-dropdown-value');
    const familyMenu = document.getElementById('family-dropdown-menu');
    const controlsWrap = document.getElementById('component-controls');
    const canvas = document.getElementById('capture-canvas');
    const viewport = document.getElementById('capture-viewport');
    const stage = document.getElementById('capture-stage');
    const foreignObject = document.getElementById('capture-foreign-object');
    const captureContent = document.getElementById('capture-content');
    const cleanToggle = document.getElementById('clean-toggle');
    const cleanToggleIcon = document.getElementById('clean-toggle-icon');
    const widthInput = document.getElementById('canvas-width');
    const heightInput = document.getElementById('canvas-height');
    const zoomInput = document.getElementById('preview-zoom');
    const zoomOut = document.getElementById('zoom-out');
    const zoomIn = document.getElementById('zoom-in');
    const zoomReset = document.getElementById('zoom-reset');
    const surfaceButtons = Array.from(document.querySelectorAll('[data-canvas-surface]'));
    const url = new URL(window.location.href);
    let activeFamilyKey = 'buttons';
    let activeValues = normalizeControlValues('buttons');
    let renderVersion = 0;
    let zoomLevel = defaultZoom;

    const syncUrl = () => {
        const activeSurface = surfaceButtons.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.canvasSurface || 'grey';
        const clean = cleanToggle.getAttribute('aria-pressed') === 'true';
        url.searchParams.set('family', activeFamilyKey);
        url.searchParams.set('w', String(clampDimension(widthInput.value, defaultCanvas.width)));
        url.searchParams.set('h', String(clampDimension(heightInput.value, defaultCanvas.height)));
        url.searchParams.set('surface', activeSurface);
        url.searchParams.set('zoom', String(Math.round(clampZoom(zoomLevel) * 100)));
        url.searchParams.delete('component');
        controlParamKeys.forEach(key => {
            if (activeValues[key]) url.searchParams.set(key, activeValues[key]);
            else url.searchParams.delete(key);
        });
        if (clean) url.searchParams.set('clean', '1');
        else url.searchParams.delete('clean');
        window.history.replaceState({}, '', url);
    };

    const syncPreviewSize = () => {
        const actualWidth = clampDimension(widthInput.value, defaultCanvas.width);
        const actualHeight = clampDimension(heightInput.value, defaultCanvas.height);
        widthInput.value = String(actualWidth);
        heightInput.value = String(actualHeight);
        stage.setAttribute('viewBox', `0 0 ${actualWidth} ${actualHeight}`);
        foreignObject.setAttribute('width', String(actualWidth));
        foreignObject.setAttribute('height', String(actualHeight));
        const availableWidth = Math.max(viewport.clientWidth, 1);
        const availableHeight = Math.max(viewport.clientHeight, 1);
        const scale = Math.min(availableWidth / actualWidth, availableHeight / actualHeight, 1);
        const previewScale = scale * clampZoom(zoomLevel);
        zoomInput.value = formatZoom(zoomLevel);
        stage.setAttribute('width', String(Math.max(1, Math.floor(actualWidth * previewScale))));
        stage.setAttribute('height', String(Math.max(1, Math.floor(actualHeight * previewScale))));
        syncUrl();
    };

    const queuePreviewSize = () => window.requestAnimationFrame(syncPreviewSize);

    const setZoom = nextZoom => {
        zoomLevel = clampZoom(nextZoom, defaultZoom);
        zoomInput.value = formatZoom(zoomLevel);
        queuePreviewSize();
    };

    const applySurface = surfaceKey => {
        body.classList.remove(...bodySurfaceClasses);
        body.classList.add(...(canvasSurfaceClasses[surfaceKey] || canvasSurfaceClasses.grey));
        body.classList.add(surfaceKey === 'black' ? 'text-white' : 'text-black');
        surfaceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.canvasSurface === surfaceKey)));
        syncUrl();
    };

    const applyCleanMode = isClean => {
        const nextLabel = isClean ? 'Show toolbar' : 'Hide toolbar';
        const nextIconClass = isClean ? 'ri-eye-line text-icon-xl' : 'ri-eye-off-line text-icon-xl';
        cleanToggle.setAttribute('aria-pressed', String(isClean));
        cleanToggle.setAttribute('aria-label', nextLabel);
        cleanToggleIcon.className = nextIconClass;
        panelToggle.setAttribute('aria-pressed', String(isClean));
        panelToggle.setAttribute('aria-label', nextLabel);
        panelToggleIcon.className = nextIconClass;
        toolbar.classList.toggle('hidden', isClean);
        canvas.classList.toggle('py-20', !isClean);
        canvas.classList.toggle('md:py-24', !isClean);
        canvas.classList.toggle('lg:py-32', !isClean);
        canvas.classList.toggle('py-0', isClean);
        queuePreviewSize();
    };

    const renderFamilyMenu = () => {
        familyMenu.innerHTML = Object.entries(families).map(([key, family]) => `<li class="dropdown-item" role="option" aria-selected="${String(key === activeFamilyKey)}" data-value="${key}"><span>${family.label}</span><i class="ri-check-line dropdown-item-check" aria-hidden="true"></i></li>`).join('');
        familyDropdown.classList.add('has-value');
        familyValue.textContent = getFamily(activeFamilyKey).label;
    };

    const renderControls = () => {
        const family = getFamily(activeFamilyKey);
        controlsWrap.innerHTML = family.controls.map(control => {
            const options = getControlOptions(activeFamilyKey, control.key, activeValues);
            if (options.length <= 1) return '';
            const selected = options.find(item => item.value === activeValues[control.key]) || options[0];
            return `<div class="dropdown dropdown-md w-full ${control.widthClass || 'md:w-btn-md'} has-value" data-control-key="${control.key}"><button type="button" class="dropdown-trigger" aria-haspopup="listbox" aria-expanded="false"><span class="dropdown-value">${selected.label}</span><i class="ri-arrow-down-s-line dropdown-arrow" aria-hidden="true"></i></button><ul class="dropdown-menu custom-scrollbar" role="listbox" aria-label="${family.label} ${control.key} options">${dropdownMenu(options, selected.value)}</ul></div>`;
        }).join('');
    };

    const renderActiveComponent = async options => {
        const version = ++renderVersion;
        const descriptor = buildSourceDescriptor(activeFamilyKey, activeValues);
        if (!options.keepSize) {
            widthInput.value = String(descriptor.width || defaultCanvas.width);
            heightInput.value = String(descriptor.height || defaultCanvas.height);
        }
        if (!options.keepSurface) applySurface(descriptor.surface || 'grey');
        const frame = createLiveFrame(version);
        const loader = document.createElement('div');
        loader.className = defaultContentClass;
        loader.innerHTML = '<div class="icon-box icon-box-neutral icon-box-lg" aria-hidden="true"><i class="ri-loader-4-line icon icon-lg"></i></div>';
        captureContent.className = 'w-full h-full';
        captureContent.replaceChildren(frame, loader);
        try {
            await loadLiveFrame(frame, descriptor);
            if (version !== renderVersion) return;
            loader.remove();
        } catch (error) {
            if (version !== renderVersion) return;
            captureContent.className = defaultContentClass;
            captureContent.innerHTML = '<div class="icon-box icon-box-neutral icon-box-lg" aria-hidden="true"><i class="ri-close-line icon icon-lg"></i></div>';
        }
        queuePreviewSize();
    };

    const setFamily = (familyKey, nextValues = {}, options = {}) => {
        activeFamilyKey = families[familyKey] ? familyKey : 'buttons';
        activeValues = normalizeControlValues(activeFamilyKey, nextValues);
        renderFamilyMenu();
        renderControls();
        renderActiveComponent(options);
    };

    [widthInput, heightInput].forEach(input => {
        input.addEventListener('change', queuePreviewSize);
        input.addEventListener('blur', queuePreviewSize);
        input.addEventListener('keydown', event => { if (event.key === 'Enter') queuePreviewSize(); });
    });

    zoomInput.addEventListener('change', () => setZoom(parseZoomInput(zoomInput.value)));
    zoomInput.addEventListener('blur', () => setZoom(parseZoomInput(zoomInput.value)));
    zoomInput.addEventListener('keydown', event => { if (event.key === 'Enter') setZoom(parseZoomInput(zoomInput.value)); });
    zoomOut.addEventListener('click', () => setZoom(zoomLevel - zoomStep));
    zoomIn.addEventListener('click', () => setZoom(zoomLevel + zoomStep));
    zoomReset.addEventListener('click', () => setZoom(defaultZoom));

    surfaceButtons.forEach(button => button.addEventListener('click', () => applySurface(button.dataset.canvasSurface)));

    const getCaptureDropdowns = () => Array.from(toolbar.querySelectorAll('.dropdown'));
    const closeCaptureDropdowns = except => {
        getCaptureDropdowns().forEach(dropdown => {
            if (dropdown === except) return;
            dropdown.classList.remove('is-open');
            dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        });
    };

    toolbar.addEventListener('click', event => {
        const trigger = event.target.closest('.dropdown-trigger');
        if (!trigger || !toolbar.contains(trigger)) return;
        const dropdown = trigger.closest('.dropdown');
        if (!dropdown || trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
        event.preventDefault();
        event.stopPropagation();
        const nextOpen = !dropdown.classList.contains('is-open');
        closeCaptureDropdowns(nextOpen ? dropdown : null);
        dropdown.classList.toggle('is-open', nextOpen);
        trigger.setAttribute('aria-expanded', String(nextOpen));
    }, true);

    document.addEventListener('click', event => {
        if (toolbar.contains(event.target)) return;
        closeCaptureDropdowns();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeCaptureDropdowns();
    });
    familyMenu.addEventListener('click', event => {
        const optionNode = event.target.closest('.dropdown-item');
        if (!optionNode) return;
        familyDropdown.classList.remove('is-open');
        familyTrigger.setAttribute('aria-expanded', 'false');
        setFamily(optionNode.dataset.value, {}, { keepSize: false, keepSurface: true });
    });
    controlsWrap.addEventListener('click', event => {
        const optionNode = event.target.closest('.dropdown-item');
        if (!optionNode) return;
        const dropdown = optionNode.closest('[data-control-key]');
        if (!dropdown) return;
        const key = dropdown.dataset.controlKey;
        dropdown.classList.remove('is-open');
        dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        setFamily(activeFamilyKey, { ...activeValues, [key]: optionNode.dataset.value }, { keepSize: true, keepSurface: true });
    });
    panelToggle.addEventListener('click', () => applyCleanMode(cleanToggle.getAttribute('aria-pressed') !== 'true'));
    cleanToggle.addEventListener('click', () => applyCleanMode(cleanToggle.getAttribute('aria-pressed') !== 'true'));
    document.addEventListener('keydown', event => {
        if (event.key.toLowerCase() === 'c') {
            event.preventDefault();
            applyCleanMode(cleanToggle.getAttribute('aria-pressed') !== 'true');
        }
    });
    window.addEventListener('resize', queuePreviewSize);

    const keepSize = url.searchParams.has('w') && url.searchParams.has('h');
    const keepSurface = url.searchParams.has('surface');
    const initialFamily = url.searchParams.get('family') || url.searchParams.get('component') || 'buttons';
    const initialValues = Object.fromEntries(controlParamKeys.map(key => [key, url.searchParams.get(key)]).filter(([, value]) => Boolean(value)));
    widthInput.value = String(clampDimension(url.searchParams.get('w'), defaultCanvas.width));
    heightInput.value = String(clampDimension(url.searchParams.get('h'), defaultCanvas.height));
    zoomLevel = clampZoom((Number.parseFloat(url.searchParams.get('zoom')) || 100) / 100, defaultZoom);
    zoomInput.value = formatZoom(zoomLevel);
    if (keepSurface) applySurface(url.searchParams.get('surface') || 'grey');
    applyCleanMode(url.searchParams.get('clean') === '1');
    setFamily(initialFamily, initialValues, { keepSize, keepSurface });
});


