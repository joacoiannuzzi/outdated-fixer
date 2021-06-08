"use strict";
const { Text } = require("ink");

const React = require("react");
const { Box } = require("ink");
const importJsx = require("import-jsx");
const { useState } = React;
const Selector = importJsx("./src/Selector");
const Changer = importJsx("./src/Changer");
const Installer = importJsx("./src/Installer");

const App = () => {
	const [depsToChange, setDepsToChange] = useState(null);
	const [hasDepsChanged, setHasDepsChanged] = useState(false);

	if (hasDepsChanged) return <Installer />;

	if (depsToChange == null)
		return (
			<Box>
				<Selector onSubmit={setDepsToChange} />
			</Box>
		);

	if (depsToChange?.length === 0) return <Text>Nothing to change</Text>;

	return <Changer deps={depsToChange} setHasDepsChanged={setHasDepsChanged} />;
};

module.exports = App;
