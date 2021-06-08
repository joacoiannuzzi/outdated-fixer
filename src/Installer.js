"use strict";
const React = require("react");
const { Box, Text } = require("ink");
const Spinner = require("ink-spinner").default;
const { useInstall } = require("./hooks");

const Installer = () => {
	const { isLoading, error } = useInstall();

	if (isLoading)
		return (
			<Text>
				<Text color="green">
					<Spinner type="dots" />
				</Text>
				{" Installing"}
			</Text>
		);

	if (error) return <Text> error: {JSON.stringify(error)}</Text>;

	return (
		<Box flexDirection="column">
			<Text>Installed</Text>
		</Box>
	);
};

module.exports = Installer;
