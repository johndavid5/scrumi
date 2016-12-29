/* Test inputs for both finder.js, server.js tests... */
module.exports = {

	hosts: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"],

	links: [ 
  { host_from: 'A', description: 'scp', host_to: 'B' }, 
  { host_from: 'A', description: 'scp', host_to: 'K' },
  { host_from: 'A', description: 'scp', host_to: 'L' },
  { host_from: 'B', description: 'ftp', host_to: 'C' },
  { host_from: 'B', description: 'ftp', host_to: 'D' },
  { host_from: 'C', description: 'rsync', host_to: 'D' },
  { host_from: 'D', description: 'samba', host_to: 'E' },
  { host_from: 'E', description: 'samba', host_to: 'F' },
  { host_from: 'F', description: 'scp', host_to: 'G' },
  { host_from: 'F', description: 'scp', host_to: 'H' }, 
  { host_from: 'G', description: 'rsync', host_to: 'H' },
  { host_from: 'I', description: 'rsync', host_to: 'J' },
  { host_from: 'J', description: 'rsync', host_to: 'H' },
  { host_from: 'J', description: 'rsync', host_to: 'I' },
  { host_from: 'K', description: 'scp', host_to: 'L' },
  { host_from: 'L', description: 'scp', host_to: 'A' },
  { host_from: 'L', description: 'scp', host_to: 'K' },
  { host_from: 'L', description: 'scp', host_to: 'M' },
  { host_from: 'L', description: 'scp', host_to: 'N' },
  { host_from: 'M', description: 'scp', host_to: 'L' },
  { host_from: 'N', description: 'scp', host_to: 'L' },
  { host_from: 'B', description: 'ftp', host_to: 'K' },
  { host_from: 'K', description: 'ftp', host_to: 'B' },
  { host_from: 'D', description: 'ftp', host_to: 'M' },
  { host_from: 'M', description: 'ftp', host_to: 'D' },
  { host_from: 'O', description: 'ftp', host_to: 'F' },
  { host_from: 'F', description: 'ftp', host_to: 'O' },
  { host_from: 'H', description: 'ftp', host_to: 'Q' },
  { host_from: 'Q', description: 'ftp', host_to: 'H' },
  { host_from: 'J', description: 'ftp', host_to: 'S' },
  { host_from: 'S', description: 'ftp', host_to: 'J' },
  { host_from: 'M', description: 'samba', host_to: 'N' },
  { host_from: 'N', description: 'samba', host_to: 'M' },
  { host_from: 'N', description: 'samba', host_to: 'O' },
  { host_from: 'O', description: 'samba', host_to: 'N' },
  { host_from: 'O', description: 'samba', host_to: 'P' },
  { host_from: 'P', description: 'samba', host_to: 'O' },
  { host_from: 'P', description: 'samba', host_to: 'Q' },
  { host_from: 'Q', description: 'samba', host_to: 'P' },
  { host_from: 'Q', description: 'samba', host_to: 'T' },
  { host_from: 'T', description: 'samba', host_to: 'Q' },
	], /* links */

	path_finders: [
				{
					"host_from": "A", "host_to": "E",
					"expected_path": [
					 	{ from_host: 'A', description: 'scp', to_host: 'B' },
						{ from_host: 'B', description: 'ftp', to_host: 'D' },
						{ from_host: 'D', description: 'samba', to_host: 'E' }
					 ]
				},
				{
					"host_from": "A", "host_to": "G",
					"expected_path": [ 
						{ from_host: 'A', description: 'scp', to_host: 'B' },
  						{ from_host: 'B', description: 'ftp', to_host: 'D' },
	  					{ from_host: 'D', description: 'samba', to_host: 'E' },
						{ from_host: 'E', description: 'samba', to_host: 'F' },
						{ from_host: 'F', description: 'scp', to_host: 'G' }
					]
				},
				{
					"host_from": "D", "host_to": "T",
					"expected_path": [ 
						{ from_host: 'D', description: 'samba', to_host: 'E' },
						{ from_host: 'E', description: 'samba', to_host: 'F' },
						{ from_host: 'F', description: 'scp', to_host: 'H' },
						{ from_host: 'H', description: 'ftp', to_host: 'Q' },
						{ from_host: 'Q', description: 'samba', to_host: 'T' }
					]
				},
				{
					"host_from": "A", "host_to": "R", // No path for this one...
					"expected_path": [ ]
				},
				// If you want finder to throw an "unkown host" exception
				//{
				//	"host_from": "T", "host_to": "U",
				//	"expected_path": [ 
				//	]
				//},
			], /* path_finders */
};
