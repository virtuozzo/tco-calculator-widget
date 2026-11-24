# Virtuozzo TCO Calculator Widget

[Virtuozzo TCO Calculator](https://www.virtuozzo.com/tco-calculator/) widget is an interactive tool that estimates the total cost of ownership of a Virtuozzo-based infrastructure compared to VMware or AWS. It is built on standard HTML, JavaScript, and CSS technologies supported by all modern browsers, which ensures easy installation on any page without additional requirements. Initialization is performed in the background and does not affect page loading speed.

Widget addition to your site can be accomplished in a few simple steps:

1. All the required scripts, styles, and templates for the TCO calculator widget are stored in the `vz-tco-calculator` directory. You can get this folder from the appropriate repository. For example, with the following command:

    ```
    git clone https://github.com/virtuozzo/tco-calculator-widget.git
    ```

   `Tip: If you want to customize the widget appearance, refer to the linked section and adjust files within the directory to your needs.`

2. Add the `vz-tco-calculator` folder to your site's root folder and insert the following lines between the `<head>` and `</body>` tags of the required page:

    ```html
    <link rel="stylesheet" href="{siteUrl}/vz-tco-calculator/css/vz-tco-calculator.min.css">

    <script src="{siteUrl}/vz-tco-calculator/js/plugins/jquery-3.7.1.min.js"></script>
    <script src="{siteUrl}/vz-tco-calculator/js/vz-tco-calculator.min.js"></script>
    ```

   Don't forget to correctly substitute your ***{siteUrl}*** placeholder. If jQuery is already loaded on the page, omit the jQuery `<script>` tag.

3. Insert the following block at the position where the widget should be displayed:

    ```html
    <div class="vz-tco-calculator"/"></div>
    ```

The default ready-to-work TCO calculator widget looks as follows:

![Virtuozzo TCO Calculator screenshot](screenshot.png)

### Customizable Widget Parameters

The widget is provided with multiple out-of-box arguments that allow you to customize its behavior and default values up to your needs:

Parameter | Description | Default
--- | --- | ---
`data-button-link` | URL that the primary CTA button links to. | `https://www.virtuozzo.com/tco-calculator/`
`data-button-text` | Label text displayed on the primary CTA button. | `TALK TO AN EXPERT`

Example with all parameters:

```html
<div class="vz-tco-calculator"
    data-button-link="https://virtuozzo.com/contact/"
    data-button-text="Talk to Sales"
></div>
```

### Localization

All widget texts are in English by default. To show the widget in another language, define a global `window.VzTCOi18n` object **before the widget script**. Its keys are the original English strings and its values are the translations:

```html
<script>
window.VzTCOi18n = {
    "Select Your Infrastructure Setup": "Wählen Sie Ihr Infrastruktur-Setup",
    "Lower TCO": "Niedrigere TCO",
    "Hot Storage<br> per Node (TB)": "Hot Storage<br> pro Node (TB)",
    "This field is required": "Pflichtfeld",
    "Germany": "Deutschland"
};
</script>
<script src="{siteUrl}/vz-tco-calculator/js/vz-tco-calculator.min.js"></script>
```

How it works:

- Any string that is missing from the dictionary (or the dictionary itself) falls back to English, so a partial translation is safe.
- Keys must match the English text exactly, including inline markup such as `<br>`, `<strong>` or links. Translations may contain the same markup.
- The full list of keys is every `t('…')` call in `app/js/tco-widget-template.js` and every `Vz.Widgets.tcoT('…')` call in `app/js/vz-tco-calculator.js`.
- Country names are translated in the dropdown, but the submitted `value` stays in English. When a dictionary is present, countries are sorted by their translated name (using the page `lang` attribute), with United States and Canada kept on top.
- Erasure-coding options are translated only partially (`EC 4+2 — 67% usable` → only `usable`): the calculation reads the scheme from the option text, so `EC x+y` and `3x Replication` must stay unchanged.
- Prices are always shown in USD with US number formatting.

When adding a new text to the widget, wrap it in `t('…')` (template) or `Vz.Widgets.tcoT('…')` (JS) and add the same string to the translations on your site.

### Pricing Data

The widget uses a separate pricing file (`pricings.min.js`) hosted on the Virtuozzo website. This allows pricing data to be updated centrally without requiring any changes to the widget itself.

By default, the widget loads this file automatically by injecting a `<script>` tag into `<head>` at runtime. No additional setup is required.

However, for better performance it is recommended to include it explicitly before the widget script:

```html
<script src="https://www.virtuozzo.com/wp-content/themes/virtuozzo/widgets/vz-tco-calculator/pricings.min.js"></script>
<script src="{siteUrl}/vz-tco-calculator/js/vz-tco-calculator.min.js"></script>
```

When loaded this way, the widget detects the file is already available and skips the dynamic injection entirely.

#### Custom Pricing Override

You can supply your own pricing data instead of the Virtuozzo defaults. The widget checks whether a `TCOPricings` global object is already defined before loading the default file — so any script that defines `TCOPricings` before the widget script will take precedence.

1. Use the default `pricings.min.js` as a reference for the data structure.
2. Create your own file (e.g. `my-pricings.js`) with the same structure and your custom values.
3. Include it before the widget script:

```html
<script src="{siteUrl}/my-pricings.js"></script>
<script src="{siteUrl}/vz-tco-calculator/js/vz-tco-calculator.min.js"></script>
```

The widget will use your prices and skip loading the default file entirely.

### Customize Widget Layout

The widget source code is in the `app/` directory and is built with **Gulp** using [SCSS](https://sass-lang.com/). The build process produces minified CSS/JS files into the `vz-tco-calculator/` distribution folder.

In order to customize the project, you will need [Node.js](https://nodejs.org/) v6 or higher.

1. Install the [Gulp](https://gulpjs.com/) CLI globally:

    ```
    npm install gulp --global
    ```

2. Clone the widget repository:

    ```
    git clone https://github.com/virtuozzo/tco-calculator-widget.git
    ```

3. Move into the project folder and install dependencies:

    ```
    cd tco-calculator-widget
    npm install
    ```

4. Start the watcher to rebuild files on change:

    ```
    gulp default
    ```

   The watcher tracks the following source files:
   - `app/scss/vz-tco-calculator.scss` — styles
   - `app/js/vz-tco-calculator.js` — widget logic
   - `app/js/tco-widget-template.js` — HTML markup (plain JS template literal, no template engine)

5. You can change styles in `app/scss/vz-tco-calculator.scss`. To build a production distribution without the watcher, run:

    ```
    gulp sass && gulp js && gulp copy-resources
    ```

   This will produce the following files in the `vz-tco-calculator/` folder:

   - `css/vz-tco-calculator.min.css` — minified CSS
   - `js/vz-tco-calculator.min.js` — minified JavaScript (includes the widget markup, tooltip, and popover plugins)
   - `js/plugins/` — bundled third-party plugins
   - `img/` — static assets

Use these files when integrating the widget into your website.
