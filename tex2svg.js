import MathJax from "@mathjax/src";

import assert from "node:assert";

const args = process.argv;
assert(args[0].toLowerCase().includes("node"));
assert(args[1].toLowerCase().includes("tex2svg"));

if ( args.length < 3 ) {
	console.error("No math string passed.\nExiting...");
	process.exit(1);
}

if ( args.length > 3 ) {
	console.error("Too many math strings passed. We only accept one at a time.\nExiting...");
	process.exit(1);
}

await MathJax.init({
	loader: {
		load: [
			'input/tex',
			'output/svg'
		]
	}
});

MathJax.startup.output.clearFontCache();

const svgCss = [
	'svg a{fill:blue;stroke:blue}', // Makes links blue
	'[data-mml-node="merror"]>g{fill:red;stroke:red}', // Make TeX errors' text red
	'[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}', // Makes TeX errors' background yellow
	'[data-frame],[data-line]{stroke-width:70px;fill:none}', // Used for framed boxes
	'.mjx-dashed{stroke-dasharray:140}', // Handles dashed underlines
	'.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}', // Handles dotted underlines
	'use[data-c]{stroke-width:3px}' // Apparently, used for character glyph references, whatever that means
].join('');

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

async function getSvgImage(math, textcolor = "black") {

	const adaptor = MathJax.startup.adaptor;
	const result = await MathJax.tex2svgPromise(math);

	let svg = adaptor.tags(result, 'svg')[0];
	svg = adaptor.outerHTML(svg);

	svg = svg.includes('<defs>')
		? svg.replace(/<defs>/, `<defs><style>${svgCss}</style>`)
		: svg.replace(/^(<svg.*?>)/, `$1<defs><style>${svgCss}</style></defs>`);

	svg = svg.replace(/ (?:role|focusable|aria-hidden)=".*?"/g, '')
		.replace(/"currentColor"/g, `"${textcolor}"`)
		.replace(/ex\b/g, "in"); // Added only so Inkscape can view the SVG, because ex isn't supported on most editors

	return xmlDeclaration + '\n' + svg;

}

console.log(await getSvgImage(args[2]));

// console.log(await getSvgImage(args[2], "white"));
//                                        dark-mode-friendly ;)
