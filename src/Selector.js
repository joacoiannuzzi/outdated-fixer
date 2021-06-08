"use strict";
const Spinner = require("ink-spinner").default;
const MultiSelect = require("ink-multi-select").default;
const React = require("react");
const { Box, Text } = require("ink");
const { useOutdated } = require("./hooks");

const Selector = ({ onSubmit }) => {
	const { outdated, isLoading, error } = useOutdated();

	if (isLoading)
		return (
			<Text>
				<Text color="green">
					<Spinner type="dots" />
				</Text>
				{" Looking for outdated dependencies"}
			</Text>
		);
	if (error || !outdated) return <Text>error: {JSON.stringify(error)}</Text>;

	if (outdated?.length === 0) return <Text>Nothing to change</Text>;

	return (
		<Box flexDirection="column">
			<Text color="yellow">
				[SPACE] -> select; [UP/DOWN] -> up/down; [ENTER] -> submit
			</Text>
			<MultiSelect items={outdated} onSubmit={onSubmit} />
		</Box>
	);
};

module.exports = Selector;
