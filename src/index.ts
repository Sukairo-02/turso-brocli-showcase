import { boolean, BuilderConfig, Command, command, number, positional, run, string } from '@drizzle-team/brocli';
import { getCommandNameWithParents } from '@drizzle-team/brocli';

const commands: Command[] = [];

const globalFlags = {
	config: string().alias('c').desc('Path to the directory with config file'),
};

const mockHandler = (opts: any) => {
	console.log('Command received options:');
	console.log(opts);
};

const getOptionTypeText = (option: BuilderConfig) => {
	let result = '';

	switch (option.type) {
		case 'boolean':
			result = '';
			break;
		case 'number': {
			if ((option.minVal ?? option.maxVal) !== undefined) {
				let text = '';

				if (option.isInt) text = text + `integer `;

				if (option.minVal !== undefined) text = text + `[${option.minVal};`;
				else text = text + `(∞;`;

				if (option.maxVal !== undefined) text = text + `${option.maxVal}]`;
				else text = text + `∞)`;

				result = text;
				break;
			}

			if (option.isInt) {
				result = 'integer';
				break;
			}

			result = 'number';
			break;
		}
		case 'string': {
			if (option.enumVals) {
				result = '[ ' + option.enumVals.join(' | ') + ' ]';
				break;
			}

			result = 'string';
			break;
		}
		case 'positional': {
			result = `${option.isRequired ? '<' : '['}${option.enumVals ? option.enumVals.join('|') : option.name}${
				option.isRequired ? '>' : ']'
			}`;
			break;
		}
	}

	if (option.isRequired && option.type !== 'positional') result = '!' + result.length ? ' ' : '' + result;
	return result;
};

commands.push(command({
	name: 'auth',
	desc: 'Authenticate with Turso',
	options: globalFlags,
	subcommands: [
		command({
			name: 'api-tokens',
			desc: `API tokens are revocable non-expiring tokens that authenticate holders as the user who created them.
They can be used to implement automations with the turso CLI or the platform API.`,
			shortDesc: 'Manage your API tokens',
			options: globalFlags,
			subcommands: [
				command({
					name: 'list',
					desc: `API tokens are revocable non-expiring tokens that authenticate holders as the user who minted them.
They can be used to implement automations with the turso CLI or the platform API.`,
					shortDesc: 'List API tokens.',
					options: globalFlags,
					handler: mockHandler,
				}),
				command({
					name: 'mint',
					desc: `API tokens are revocable non-expiring tokens that authenticate holders as the user who minted them.
They can be used to implement automations with the turso CLI or the platform API.`,
					shortDesc: 'Mint an API token.',
					options: { ...globalFlags, apiTokenName: positional('api-token-name').required() },
					handler: mockHandler,
				}),
				command({
					name: 'revoke',
					desc: `API tokens are revocable non-expiring tokens that authenticate holders as the user who minted them.
They can be used to implement automations with the turso CLI or the platform API.`,
					shortDesc: 'Revoke an API tokens.',
					options: { ...globalFlags, apiTokenName: positional('api-token-name').required() },
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'login',
			desc: 'Login to the platform.',
			options: {
				...globalFlags,
				headless: boolean().desc(
					`Give users a link to start the process by themselves. Useful when the CLI can't interact with a web browser.`,
				),
			},
			handler: mockHandler,
		}),
		command({
			name: 'logout',
			desc: 'Log out currently logged in user.',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'signup',
			desc: 'Login to the platform.',
			options: {
				...globalFlags,
				headless: boolean().desc(
					`Give users a link to start the process by themselves. Useful when the CLI can't interact with a web browser.`,
				),
			},
			handler: mockHandler,
		}),
		command({
			name: 'token',
			desc: `Shows the token used to authenticate you to Turso platform API.
To authenticate to your databases, use turso db tokens create`,
			shortDesc: 'Shows the token used to authenticate you to Turso platform API.',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'whoami',
			desc: `Show the currently logged in user.`,
			options: globalFlags,
			handler: mockHandler,
		}),
	],
}));

commands.push(command({
	name: 'config',
	desc: 'Manage your CLI configuration',
	options: globalFlags,
	subcommands: [
		command({
			name: 'cache',
			desc: 'Manage your CLI cache',
			options: globalFlags,
			subcommands: [
				command({
					name: 'clear',
					desc: 'Clear your CLI local cache',
					options: globalFlags,
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'path',
			desc: 'Get the path to the CLI configuration file',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'set',
			desc: 'Set a configuration value',
			options: globalFlags,
			subcommands: [
				command({
					name: 'autoupdate',
					desc: 'Configure autoupdate behavior',
					options: {
						...globalFlags,
						value: positional('value').enum('on', 'off').required(),
					},
					handler: mockHandler,
				}),
				command({
					name: 'token',
					desc: 'Configure the token used by turso',
					options: {
						...globalFlags,
						token: positional('jwt').required(),
					},
					handler: mockHandler,
				}),
			],
		}),
	],
}));

commands.push(command({
	name: 'contact',
	desc: 'Reach out to the makers of Turso for help or feedback',
	options: globalFlags,
	subcommands: [
		command({
			name: 'bookmeeting',
			desc: 'Book a meeting with the Turso team.',
			handler: mockHandler,
		}),
		command({
			name: 'feedback',
			desc: `Tell us how can we help you, how we can improve, or what you'd like to see next.`,
			handler: mockHandler,
		}),
	],
}));

commands.push(command({
	name: 'db',
	desc: 'Manage databases',
	options: globalFlags,
	subcommands: [
		command({
			name: 'config',
			desc: 'Manage db config',
			options: globalFlags,
			subcommands: [
				command({
					name: 'attach',
					desc: 'Manage attach config of a database',
					options: globalFlags,
					subcommands: [
						command({
							name: 'allow',
							desc: 'Allows this database to be attached by other databases',
							options: globalFlags,
							handler: mockHandler,
						}),
						command({
							name: 'disallow',
							desc: 'Disallows this database to be attached by other databases',
							options: globalFlags,
							handler: mockHandler,
						}),
						command({
							name: 'show',
							desc: 'Shows the attach status of a database',
							options: { ...globalFlags, dbName: positional('database-name').required() },
							handler: mockHandler,
						}),
					],
				}),
			],
		}),
		command({
			name: 'create',
			desc: 'Create a database',
			options: {
				...globalFlags,
				csvSeparator: string('csv-separator').desc('CSV separator character. Must be a single character.').default(','),
				csvTableName: string('csv-table-name').desc('name of the table in the csv file'),
				enableExt: boolean('enable-extensions').desc(
					`Enables experimental support for SQLite extensions.\nIf you would like to see some extension included, run turso account feedback.\nWarning: extensions support is experimental and subject to change`,
				),
				fromCSV: string('from-csv').desc('create the database from a csv file'),
				fromDB: string('from-db').desc('create the database from a local SQLite dump'),
				fromLink: string('from-db-url').desc('create the database from a remote SQLite dump'),
				fromFile: string('from-file').desc('create the database from a local SQLite3-compatible file'),
				group: string().desc('create the database in the specified group'),
				location: string().desc('Location ID. If no ID is specified, closest location to you is used by default.'),
				schema: string().desc('Schema to use for the database'),
				timestamp: string().desc(
					`Set a point in time in the past to copy data from the selected database. Must be used with the 'from-db' flag. Must be in RFC3339 format like '2023-09-29T10:16:13-03:00'`,
				),
				type: string().desc('Type of the database to create. Possible values: regular, schema.').default('regular'),
				wait: boolean().alias('w').desc('Wait for the database to be ready to receive requests.'),
				dbName: positional('database-name'),
			},
			handler: mockHandler,
		}),
		command({
			name: 'destroy',
			desc: 'Destroy a database.',
			options: {
				...globalFlags,
				dbName: positional('database-name').required(),
				yes: boolean().alias('y').desc('Confirms the destruction of all locations of the database.'),
			},
			handler: mockHandler,
		}),
		command({
			name: 'inspect',
			desc: 'Inspect database.',
			options: {
				...globalFlags,
				queries: boolean().desc('Display database queries statistics'),
				verbose: boolean().desc('Show detailed information'),
				dbName: positional('database-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'list',
			desc: 'List databases.',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'locations',
			desc: 'List available database locations.',
			options: {
				...globalFlags,
				latencies: boolean('show-latencies').alias('l').desc(
					`Display latencies from your current location to each of Turso's locations`,
				),
			},
			handler: mockHandler,
		}),
		command({
			name: 'replicate',
			desc: 'Replicate a database.',
			options: {
				...globalFlags,
				wait: string().alias('w').desc('Wait for the replica to be ready to receive requests.'),
				dbName: positional('database-name').required(),
				locCode: positional('location-code').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'shell',
			desc: `Start a SQL shell.\
			When database-name is provided, the shell will connect the closest replica of the specified database.\
			When the --instance flag is provided with a specific instance name, the shell will connect to that instance directly.`,
			shortDesc: 'Start a SQL shell.',
			options: {
				...globalFlags,
				attach: string().desc('list of database names with attach claim to be added to the token'),
				instance: string().desc('Connect to the database at the specified instance.'),
				location: string().desc('Connect to the database at the specified location.'),
				proxy: string().desc('Proxy to use for the connection.'),
				urlOrName: positional('database-name | replica-url').required(),
				sql: positional(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'show',
			desc: 'Show information from a database.',
			options: {
				...globalFlags,
				http: string('http-url').desc('Show HTTP URL for the database HTTP API.'),
				instance: string('instance-url').desc(
					'Show URL for the HTTP API of a selected instance of a database. Instance is selected by instance name.',
				),
				instances: string('instance-urls').desc('Show URL for the HTTP API of all existing instances'),
				url: string().desc('Show URL for the database HTTP API.'),
				dbName: positional('database-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'tokens',
			desc: 'Manage db tokens',
			subcommands: [
				command({
					name: 'create',
					desc: 'Creates a bearer token to authenticate requests to the database',
					options: {
						...globalFlags,
						attach: string().desc('list of database names with attach claim to be added to the token'),
						expiration: string().alias('e').desc(
							'Token expiration. Possible values are never (default) or expiration time in days (e.g. 7d).',
						).default('never'),
						group: boolean().desc('create a token that is valid for all databases in the group'),
						readonly: boolean('read-only').alias('r').desc('Token with read-only access'),
						dbName: positional('database-name').required(),
					},
					handler: mockHandler,
				}),
				command({
					name: 'invalidate',
					desc: 'Rotates the keys used to create and verify database tokens making existing tokens invalid',
					options: {
						...globalFlags,
						yes: boolean().alias('y').desc('Confirms the invalidation of all existing db tokens.'),
						dbName: positional('database-name').required(),
					},
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'update',
			desc: 'Updates the database to the latest turso version',
			options: {
				...globalFlags,
				group: string().desc(
					'Update database to use groups. Only effective if the database is not already using groups.',
				),
				yes: boolean().alias('y').desc('Confirms the update of the database.'),
				dbName: positional('database-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'wakeup',
			desc: 'Wake up a database',
			options: {
				...globalFlags,
				dbName: positional('database-name').required(),
			},
			handler: mockHandler,
		}),
	],
}));

commands.push(command({
	name: 'dev',
	desc: `starts a local development server for Turso.

If you're using a libSQL client SDK that supports SQLite database files on the local filesystem, then you might not need this server at all.
Instead, you can use a file: URL with the path to the file you want the SDK to read and write.`,
	shortDesc: 'starts a local development server for Turso',
	options: {
		...globalFlags,
		keyFile: string('auth-jwt-key-file').alias('a').desc(
			'Path to a file with a JWT decoding key used to authenticate clients in the Hrana and HTTP APIs. The key is either a PKCS#8-encoded Ed25519 public key in PEM, or just plain bytes of the Ed25519 public key in URL-safe base64.',
		),
		dbFile: string('db-file').alias('f').desc('A file name to persist the data of this dev session'),
		port: number().alias('p').int().default(8000).desc('the port to which bind the server'),
		version: boolean('sqld-ver').alias('s').desc('sqld version'), // can't use --version\-v in brocli - reserved option
	},
	handler: mockHandler,
}));

commands.push(command({
	name: 'group',
	desc: 'Manage your database groups',
	subcommands: [
		command({
			name: 'create',
			desc: 'Create a database group',
			options: {
				...globalFlags,
				location: string().desc('Create the group primary in the specified location'),
				version: string('ver').enum('latest', 'canary', 'vector').desc('Version of the group'),
				wait: boolean().alias('w').desc('Wait for group to be ready'),
				groupName: positional('group-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'destroy',
			desc: 'Destroy a database group',
			options: {
				...globalFlags,
				groupName: positional('group-name').required(),
				yes: boolean().alias('y').desc('Confirms the destruction of the group, with all its locations and databases.'),
			},
			handler: mockHandler,
		}),
		command({
			name: 'list',
			desc: 'List databases groups',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'locations',
			desc: 'Manage your database group locations',
			subcommands: [
				command({
					name: 'add',
					desc: 'Add locations to a database group',
					options: {
						...globalFlags,
						groupName: positional('group-name').required(),
						locationCode: positional('location-code'), // To be remade into <...location-code> - positional[] (?)
						wait: boolean().alias('w').desc('Wait for group location to be ready'),
					},
					handler: mockHandler,
				}),
				command({
					name: 'list',
					desc: 'List database group locations',
					options: {
						...globalFlags,
						groupName: positional('group-name').required(),
					},
					handler: mockHandler,
				}),
				command({
					name: 'remove',
					desc: 'Remove locations from a database group',
					options: {
						...globalFlags,
						groupName: positional('group-name').required(),
						locationCode: positional('location-code'), // To be remade into <...location-code> - positional[] (?)
					},
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'show',
			desc: 'Show information about a group.',
			options: {
				...globalFlags,
				groupName: positional('group-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'tokens',
			desc: 'Manage group tokens',
			subcommands: [
				command({
					name: 'create',
					desc: 'Creates a bearer token to authenticate to group databases',
					options: {
						...globalFlags,
						groupName: positional('group-name').required(),
						attach: string().desc('list of database names with attach claim to be added to the token'), // Is supposed to be string[] (strings), TBD
						expiration: string().alias('e').desc(
							'Token expiration. Possible values are never (default) or expiration time in days (e.g. 7d).',
						).default('never'),
						readonly: boolean('read-only').alias('r').desc('Token with read-only access'),
					},
					handler: mockHandler,
				}),
				command({
					name: 'invalidate',
					desc:
						'Rotates the keys used to create and verify database tokens, invalidating all existing tokens invalid for the group.',
					options: {
						...globalFlags,
						groupName: positional('group-name').required(),
						yes: boolean().alias('y').desc(
							'Confirms the update of the group',
						),
					},
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'transfer',
			desc: 'Transfers the group to the specified organization',
			options: {
				...globalFlags,
				groupName: positional('group-name').required(),
				orgName: positional('organization-name').required(),
				yes: boolean().alias('y').desc(
					'Confirms the update of the group',
				),
			},
			handler: mockHandler,
		}),
		command({
			name: 'update',
			desc: 'Updates the group',
			options: {
				...globalFlags,
				groupName: positional('group-name').required(),
				extensions: string().enum('all', 'none').desc('Extensions to enable'),
				ver: string().enum('latest', 'canary', 'vector').desc('Version to update to'),
				yes: boolean().alias('y').desc(
					'Confirms the update of the group',
				),
			},
			handler: mockHandler,
		}),
		command({
			name: 'wakeup',
			desc: 'Wake up a database group',
			options: {
				...globalFlags,
				groupName: positional('group-name').required(),
			},
			handler: mockHandler,
		}),
	],
}));

commands.push(command({
	name: 'org',
	desc: 'Manage your organizations',
	subcommands: [
		command({
			name: 'billing',
			desc: 'Manange payment methods for the current organization.',
			handler: mockHandler,
		}),
		command({
			name: 'create',
			desc: 'Create a new organization',
			options: {
				...globalFlags,
				orgName: positional('organization-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'db-transfer',
			desc: 'Transfers a database to another organization',
			options: {
				...globalFlags,
				dbName: positional('database-name').required(),
				orgName: positional('organization-name').required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'destroy',
			desc: 'Destroy an organization',
			options: {
				...globalFlags,
				slug: positional().required(),
			},
			handler: mockHandler,
		}),
		command({
			name: 'invites',
			desc: 'Manage your organization invites',
		}),
		command({
			name: 'invoice',
			desc: 'Manage Invoices',
			subcommands: [
				command({
					aliases: ['create', 'invite'],
					desc: 'Invite an email to join the current organization',
					options: {
						...globalFlags,
						admin: boolean().alias('a').desc('Invite the user as an admin'),
						email: positional().required(),
					},
					handler: mockHandler,
				}),
				command({
					name: 'list',
					desc: 'List invites in the current organization',
					options: globalFlags,
					handler: mockHandler,
				}),
				command({
					name: 'remove',
					desc: 'Remove a pending invite to an email to join the current organization',
					options: {
						...globalFlags,
						email: positional().required(),
					},
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'list',
			desc: 'List your organizations',
			options: globalFlags,
			handler: mockHandler,
		}),
		command({
			name: 'members',
			desc: 'Manage your organization members',
			subcommands: [
				command({
					name: 'add',
					desc: 'Add a member to current organization',
					options: {
						...globalFlags,
						admin: boolean().alias('a').desc('Add the user as an admin'),
						username: positional().required(),
					},
					handler: mockHandler,
				}),
				command({
					aliases: ['create', 'invite'],
					desc: 'Invite an email to join the current organization',
					options: {
						...globalFlags,
						admin: boolean().alias('a').desc('Add the user as an admin'),
						email: positional().required(),
					},
					handler: mockHandler,
				}),
				command({
					name: 'list',
					desc: 'List members of current organization',
					options: globalFlags,
					handler: mockHandler,
				}),
				command({
					name: 'rm',
					desc: 'Remove a member from the current organization',
					options: {
						...globalFlags,
						username: positional().required(),
					},
					handler: mockHandler,
				}),
			],
		}),
		command({
			name: 'switch',
			desc: 'Switch to an organization as the context for your commands.',
			options: {
				...globalFlags,
				slug: positional('organization-slug'),
			},
			handler: mockHandler,
		}),
	],
}));

run(commands, {
	name: 'turso',
	description: 'Turso CLI',
	omitKeysOfUndefinedOptions: true,
	theme: (event) => {
		if (event.type === 'commandHelp') {
			const command = event.command;
			const commandName = getCommandNameWithParents(command);
			const cliName = event.cliName;
			const desc = command.desc ?? command.shortDesc;

			if (desc !== undefined) {
				console.log(`\n${desc}`);
			}

			const opts = Object.values(command.options ?? {} as Exclude<typeof command.options, undefined>).filter((opt) =>
				!opt.config.isHidden
			);
			const positionals = opts.filter((opt) => opt.config.type === 'positional');
			const options = opts.filter((opt) => opt.config.type !== 'positional');

			console.log('\nUsage:');
			if (command.handler) {
				console.log(
					`  ${cliName ? cliName + ' ' : ''}${commandName}${
						positionals.length
							? ' '
								+ positionals.map(({ config: p }) => getOptionTypeText(p)).join(' ')
							: ''
					} [flags]`,
				);
			} else console.log(`  ${cliName ? cliName + ' ' : ''}${commandName} [command]`);

			if (command.aliases) {
				console.log(`\nAliases:`);
				console.log(`  ${command.aliases.join(', ')}`);
			}

			if (command.subcommands) {
				console.log('\nAvailable Commands:');
				const padding = 3;
				const maxLength = command.subcommands.reduce((p, e) => e.name.length > p ? e.name.length : p, 0);
				const paddedLength = maxLength + padding;
				const preDescPad = 2 + paddedLength;

				const data = command.subcommands.map((s) =>
					`  ${s.name.padEnd(paddedLength)}${
						(() => {
							const description = s.shortDesc ?? s.desc;
							if (!description?.length) return '';
							const split = description.split('\n');
							const first = split.shift()!;

							const final = [first, ...split.map((s) => ''.padEnd(preDescPad) + s)].join('\n');

							return final;
						})()
					}`
				)
					.join('\n');
				console.log(data);
			}

			if (options.length) {
				const aliasLength = options.reduce((p, e) => {
					const currentLength = e.config.aliases.reduce((pa, a) => pa + a.length, 0)
						+ ((e.config.aliases.length - 1) * 2) + 1; // Names + coupling symbols ", " + ending coma

					return currentLength > p ? currentLength : p;
				}, 0);
				const paddedAliasLength = aliasLength > 0 ? aliasLength + 1 : 0;
				const nameLength = options.reduce((p, e) => {
					const typeLen = getOptionTypeText(e.config).length;
					const length = typeLen > 0 ? e.config.name.length + 1 + typeLen : e.config.name.length;

					return length > p ? length : p;
				}, 0) + 3;

				const preDescPad = paddedAliasLength + nameLength + 2;

				const data = options.map(({ config: opt }) =>
					`  ${`${opt.aliases.length ? opt.aliases.join(', ') + ',' : ''}`.padEnd(paddedAliasLength)}${
						`${opt.name}${
							(() => {
								const typeText = getOptionTypeText(opt);
								return typeText.length ? ' ' + typeText : '';
							})()
						}`.padEnd(nameLength)
					}${
						(() => {
							if (!opt.description?.length) {
								return opt.default !== undefined
									? `default: ${JSON.stringify(opt.default)}`
									: '';
							}

							const split = opt.description.split('\n');
							const first = split.shift()!;
							const def = opt.default !== undefined ? ` (default: ${JSON.stringify(opt.default)})` : '';

							const final = [first, ...split.map((s) => ''.padEnd(preDescPad) + s)].join('\n') + def;

							return final;
						})()
					}`
				).join('\n');

				console.log('\nFlags:');
				console.log(data);
			}

			console.log('\nGlobal flags:');
			console.log(`  -h, --help      help for ${commandName}`);
			console.log(`  -v, --version   version${cliName ? ` for ${cliName}` : ''}`);

			if (command.subcommands?.length) {
				console.log(
					`\nUse "${
						cliName ? cliName + ' ' : ''
					}${commandName} [command] --help" for more information about a command.\n`,
				);
			}

			return true;
		}

		if (event.type === 'globalHelp') {
			const cliName = event.cliName;
			if (event.description) console.log(`${event.description}\n\n`);
			console.log('Usage:');
			console.log(`  ${cliName ? cliName + ' ' : ''}[command]`);

			if (event.commands) {
				console.log('\nAvailable Commands:');
				const padding = 3;
				const maxLength = event.commands.reduce((p, e) => e.name.length > p ? e.name.length : p, 0);
				const paddedLength = maxLength + padding;

				const data = event.commands.map((s) =>
					`  ${s.name.padEnd(paddedLength)}${(s.shortDesc ?? s.desc)?.split('\n').shift()!}`
				)
					.join('\n');
				console.log(data);
			}

			console.log('\nFlags:');
			console.log(`  -h, --help      help${cliName ? ` for ${cliName}` : ''}`);
			console.log(`  -v, --version   version${cliName ? ` for ${cliName}` : ''}`);
			console.log('\n');

			return true;
		}

		return false;
	},
	version: 'turso version v0.96.0-brocli-showcase',
	hook: (event, command) => {
		if (event === 'before') {
			console.log('Turso CLI\n');
			console.log(`Running command: turso ${getCommandNameWithParents(command)}\n`);
		}

		if (event === 'after') console.log('\nTask completed succesfully!\n');
	},
});
