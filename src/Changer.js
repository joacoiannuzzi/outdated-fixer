"use strict";
const React = require("react");
const { Box, Text } = require("ink");
const Spinner = require("ink-spinner").default;
const { useChangeOutdated } = require("./hooks");

const Changer = ({ deps, setHasDepsChanged }) => {
	const { isLoading } = useChangeOutdated(deps, setHasDepsChanged);

	if (isLoading)
		return (
			<Text>
				<Text color="green">
					<Spinner type="dots" />
				</Text>
				{" Changing dependencies"}
			</Text>
		);

	return (
		<Box flexDirection="column">
			<Text>Deps changed</Text>
		</Box>
	);
};

module.exports = Changer;
