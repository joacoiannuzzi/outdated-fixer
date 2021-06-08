const { useState, useEffect } = require("react");
const path = require("path");
const { promisify } = require("util");
const { exec } = require("child_process");
const fs = require("fs/promises");
const execP = promisify(exec);

const dir = process.cwd();

const getExcluded = () => {
	try {
		const { excludes } = require(path.resolve(dir, ".outdated"));
		return excludes;
	} catch (e) {
		console.log("File .outdated.js not found\n");
		return [];
	}
};

const useOutdated = () => {
	const [outdated, setOutdated] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(null);

			const excluded = getExcluded();

			try {
				await fs.readFile(path.resolve(dir, "package.json"));
			} catch (e) {
				setError("package.json not found");
				setIsLoading(false);
				return;
			}

			try {
				const { stdout, stderr } = await execP("npm outdated --json");

				if (stderr) {
					setError(stderr);
					setIsLoading(false);
					return;
				}
				const json = JSON.parse(stdout);

				const excludeSet = new Set(excluded.map((it) => it.name));
				const violations = Object.entries(json);
				const outdatedDeps = violations
					.filter(([key]) => {
						return !excludeSet.has(key);
					})
					.map(([key, value]) => ({
						key,
						label: `${key}: ${value.current} -> ${value.latest}`,
						value,
					}));
				setOutdated(outdatedDeps);
				setIsLoading(false);
				setError(null);
			} catch (e) {
				setIsLoading(false);
				setError(e.toString());
			}
		})();
	}, []);

	return { outdated, isLoading, error };
};

const useChangeOutdated = (depsToChange, setHasDepsChanged) => {
	const [isLoading, setIsLoading] = useState(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			const packageJson = await fs.readFile(path.resolve(dir, "package.json"));

			const changedPackageJson = depsToChange.reduce(
				(toChange, { key, value }) => {
					const regex = new RegExp(`"${key}":.*".(${value.current})"`);

					return toChange.replace(regex, (match) => {
						return match.replace(value.current, value.latest);
					});
				},
				packageJson.toString()
			);

			await fs.writeFile(path.resolve(dir, "package.json"), changedPackageJson);

			setIsLoading(false);
			setHasDepsChanged(true);
		})();
	}, []);

	return { isLoading };
};

const useInstall = () => {
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(null);

			try {
				const { stdout, stderr } = await execP("npm install");
				if (stderr) {
					setError(stderr);
				}
			} catch (e) {
				setError(e);
			}

			setIsLoading(false);
		})();
	}, []);

	return { isLoading, error };
};

module.exports = {
	useOutdated,
	useChangeOutdated,
	useInstall,
};
