//app/models/servers.js

module.exports = {
	directory : "D:\\Minecraft\\Servers\\",
	minMem       : "-Xms512M",
	maxMem       : "-Xmx4096M",
	fileType     : "-jar",
	gui          : "nogui",
	parm1        : "-XX:+CMSIncrementalPacing",
	parm2        : "-XX:+CMSClassUnloadingEnabled",
	parm3        : "-XX:ParallelGCThreads=2",
	parm4        : "-XX:MinHeapFreeRatio=5",
	parm5        : "-XX:MaxHeapFreeRatio=10",
	list : {
	
		enhanced : { name 		  : "Enhanced Vanilla",
					 selectName   : "enhanced",
					 filePathProp : "Enhanced\\server.properties",
					 filePathServ : "forge-1.8.9-11.15.1.1855-universal.jar",
					 filePathWork : "Enhanced\\"
		},
		ferret	 : { name 		  : "The Ferrit Business",
					 selectName   : "ferret",
					 filePathProp : "The_Ferret_Business\\server.properties",
					 filePathServ : "FerretBusinessServer.jar",
					 filePathWork : "The_Ferret_Business\\"
		},
		vanilla  : { name 		  : "Vanilla",
					 selectName   : "vanilla",
					 filePathProp : "Bukkit\\BuildTools\\server.properties",
					 filePathServ : "spigot-1.9.2.jar",
					 filePathWork : "Bukkit\\BuildTools\\"
		}

	}
};