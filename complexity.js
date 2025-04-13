const plato = require('es6-plato')

//be sure and set your src, output, and any options.
let src = "C:\\Users\\jbolo\\WebstormProjects\\bakalaurs-arc\\monolithServer.js";
let outputDir = "./artifacts/plato";

let platoArgs = {
	title: "example",
	eslint: {}
};

//you can use the reports in the callback.
function callback(reports) {
	let overview = plato.getOverviewReport(reports);

	let { total, average } = overview.summary;

	let output = `total
    ----------------------
    eslint: ${total.eslint}
    sloc: ${total.sloc}
    maintainability: ${total.maintainability}
    average
    ----------------------
    eslint: ${average.eslint}
    sloc: ${average.sloc}
    maintainability: ${average.maintainability}`;

	console.log(output);
	console.log(total);
}

//usage is plato.inspect
plato.inspect(src, outputDir, platoArgs, callback);
