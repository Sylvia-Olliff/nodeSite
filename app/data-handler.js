// app/data-handler.js

var Feats = require('../app/models/feats');
var Skills = require('../app/models/skills');
var Races = require('../app/models/races');
var Classes = require('../app/models/classes');
var async = require('async');
var books = require('../app/models/DND_Books');

module.exports = {

	DND : {
		/** =============================================
		 *  ==== FEATS ==================================
		 *  =============================================
		 */
		featForm : function(req, res, next) {
			var data = req.body.data;
			var formString = "";
			formString = "<table id='featDetails>";
			switch(data) {
				case "META":
					formString += "<tr><td>" +
									"<label for='levelCost'> Spell Level Cost: </label>" +
									"<input id='levelCost' type='text' class='form-control num' name='levelCost' size='4'>" +
								  "</td></tr>";
					break;

				case "SPLABL":
					formString += "<tr><td>" +
									"<label for='spellName'> Spell Name: </label>" +
									"<input id='spellName' type='text' class='form-control' name='spellName' size='15'>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='times'> Number of times: </label> " +
								    "<select id='times' name='times'>" +
								    	"<option value='WILL' selected>At Will</option>" +
								    	"<option value='1' >Once</option>" +
								    	"<option value='2' >Twice</option>" +
								    	"<option value='3' >Three Times</option>" +
								    	"<option value='4' >Four Times</option>" +
								    	"<option value='5' >Five Times</option>" +
								    "</select>" +
								   "</td>" +
								   "<td>" +
								    "<label for='per'> Per: </label> " +
								    "<select id='per' name='per'>" +
								    	"<option value='WILL' selected>At Will</option>" +
								    	"<option value='HR' >Hour</option>" +
								    	"<option value='DY' >Day</option>" +
								    	"<option value='WK' >Week</option>" +
								    	"<option value='MT' >Month</option>" +
								    	"<option value='YR' >Year</option>" +
								    "</select>" +
								   "</td>" +
								  "</tr>";
					break;

				case "AOO":
					formString += "<tr><td>" +
									"<label for='amount'> Increased By: </label>" +
									"<input id='amount' type='text' class='form-control num' name='amount' size='4'>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "SKILL":
					formString += "<tr><td>" +
									"<label for='skillName'> Skill Name: </label>" +
									"<input id='skillName' type='text' class='form-control' name='skillName' size='15'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='skillBonus'> Bonus Amount: </label>" +
									"<input id='skillBonus' type='text' class='form-control num' name='skillBonus' size='4'>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "STAT":
					formString += "<tr><td>" +
									"<label for='statInc'> Stat Increased: </label>" +
									"<select id='statInc' name='statInc'>" +
								    	"<option value='STR' selected>Strength</option>" +
								    	"<option value='DEX' >Dexterity</option>" +
								    	"<option value='CON' >Constitution</option>" +
								    	"<option value='INT' >Intelligence</option>" +
								    	"<option value='WIS' >Wisdom</option>" +
								    	"<option value='CHA' >Charisma</option>" +
								    "</select>" +
								   "</td>" + 
								   "<td>" +
									"<label for='statBonus'> Bonus Amount: </label>" +
									"<input id='statBonus' type='text' class='form-control num' name='statBonus' size='4'>" +
								   "</td>" +
								  "</tr>";
					break;

				case "AC":
					formString += "<tr><td>" +
									"<label for='ACType'> Bonus Type: </label>" +
									"<select id='ACType' name='ACType'>" +
								    	"<option value='ALCH' selected>Alchemical</option>" +
								    	"<option value='ARMOR' >Armor</option>" +
								    	"<option value='DEF' >Deflection</option>" +
								    	"<option value='DODGE' >Dodge</option>" +
								    	"<option value='ENH' >Enhancment</option>" +
								    	"<option value='MOR' >Morale</option>" +
								    	"<option value='NAT' >Natural</option>" +
								    	"<option value='PRO' >Profane</option>" +
								    	"<option value='SAC' >Sacred</option>" +
								    	"<option value='SHI' >Shield</option>" +
								    	"<option value='SIZE' >Size</option>" +
								    "</select>" +
								   "</td>" + 
								   "<td>" +
									"<label for='armorBonus'> Bonus Amount: </label>" +
									"<input id='armorBonus' type='text' class='form-control num' name='armorBonus' size='4'>" +
								   "</td>" +
								  "</tr>";
					break;

				case "HP":
					formString += "<tr><td>" +
									"<label for='amount'> Increased By: </label>" +
									"<input id='amount' type='text' class='form-control num' name='amount' size='4'>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='retro'> Retrograde: </label> " +
								    "<select id='retro' name='retro'>" +
								    "<option value='YES'>Yes</option>" +
								    "<option value='NO' selected>No</option>" +
								   "</td>" +
								  "</tr>";
					break;

				case "BAB":
					formString += "<tr><td>" +
									"<label for='twoWpn'> Two-Weapon?: </label> " +
								    "<select id='twoWpn' name='twoWpn'>" +
								    "<option value='YES'>Yes</option>" +
								    "<option value='NO' selected>No</option>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='impTwoWpn'> Improved Two-Weapon?: </label> " +
								    "<select id='impTwoWpn' name='impTwoWpn'>" +
								    "<option value='YES'>Yes</option>" +
								    "<option value='NO' selected>No</option>" +
								   "</td>" +
								   "<td>" +
								    "<label for='fighter'> Fighter Only?: </label> " +
								    "<select id='fighter' name='fighter'>" +
								    "<option value='YES'>Yes</option>" +
								    "<option value='NO' selected>No</option>" +
								   "</td>" +
								   "</tr><tr>" +
								   "<td>" +
									"<label for='wpnType'> Weapon Type (if not associated put ANY): </label>" +
									"<input id='wpnType' type='text' class='form-control' name='wpnType' size='15'>" +
								   "</td>" +
								   "<td>" +
									"<label for='weaponBonus'> Bonus Amount: </label>" +
									"<input id='weaponBonus' type='text' class='form-control num' name='armorBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "NUMATTK":
					formString += "<tr><td>" +
									"<label for='amount'> Number of Additional Attacks: </label>" +
									"<input id='amount' type='text' class='form-control num' name='amount' size='4'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='attackBonus'> Bonus/Penalty Amount: </label>" +
									"<input id='attackBonus' type='text' class='form-control num' name='attackBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "INIT":
					formString += "<tr><td>" + 
									"<label for='initBonus'> Bonus Amount: </label>" +
									"<input id='initBonus' type='text' class='form-control num' name='initBonus' size='4'>" +
								   "</td>" + 
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "LVLCHK":
					formString += "<tr><td>" +
									"<label for='type'>Check Type: </label>" +
									"<select id='type' name='type'>" +
									"<option value='SAVE' selected>Saving Throw</option>" +
									"<option value='SAVDC'>Save DC</option>" +
									"<option value='SPLDC'>Spell DC</option>" +
									"<option value='SPLLVL'>Spell Level</option>" +
									"</select>" +
								   "</td>" + 
								   "<td>" +
									"<label for='amount'> Bonus Amount: </label>" +
									"<input id='amount' type='text' class='form-control num' name='amount' size='4'>" +
								   "</td>" +
								   "<td>" +
									"<label for='boostType'> Spell Type Boosted: </label>" +
									"<select id='boostType' name='boostType'>" +
									"<option value=''>N/A</option>" +
									"<option value='Abjuration'>Abjuration</option>" +
									"<option value='Conjuration'>Conjuration</option>" +
									"<option value='Evocation'>Evocation</option>" +
									"<option value='Divination'>Divination</option>" +
									"<option value='Transmutation'>Transmutation</option>" +
									"<option value='Necromancy'>Necromancy</option>" +
									"<option value='Universal'>Universal</option>" +
									"<option value='Enchantment'>Enchantment</option>" +
									"</select>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "PROF":
					formString += "<tr><td>" + 
									"<label for='type'> Weapon or Armor: </label> " +
								    "<select id='type' name='type'>" +
								    "<option value='WPN' selected>Weapon</option>" +
								    "<option value='ARMOR'>Armor</option>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "BONUSATTR":
					formString += "<tr><td>" + 
									"<label for='bonusName'> Bonus Name: </label>" +
									"<input id='bonusName' type='text' class='form-control' name='bonusName' size='10'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='newStat'> New Attribute: </label>" +
									"<select id='newStat' name='newStat'>" +
								    	"<option value='STR' selected>Strength</option>" +
								    	"<option value='DEX' >Dexterity</option>" +
								    	"<option value='CON' >Constitution</option>" +
								    	"<option value='INT' >Intelligence</option>" +
								    	"<option value='WIS' >Wisdom</option>" +
								    	"<option value='CHA' >Charisma</option>" +
								    "</select>" +
								   "</td>" +
								  "</tr>";
					break;

				case "CLASS":
					formString += "<tr><td>" +
									"<label for='name'> Feature Name: </label>" +
									"<input id='name' type='text' class='form-control' name='name' size='15'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='bonus'> Bonus Amount: </label>" +
									"<input id='bonus' type='text' class='form-control num' name='bonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "DR":
					formString += "<tr><td>" +
									"<label for='DRAmount'> Damage Reduction Amount: </label>" +
									"<input id='DRAmount' type='text' class='form-control num' name='DRAmount' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='versus'> Against: (seperate each qualifier by a single comma, i.e. +3 Magic,Silver)</label> " +
								    "<textarea id='versus' class='form-control' name='versus' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "WPNDMG":
					formString += "<tr><td>" +
									"<label for='wpnType'> Weapon Type: </label>" +
									"<input id='wpnType' type='text' class='form-control' name='wpnType' size='15'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='wpnBonus'> Bonus Amount: </label>" +
									"<input id='wpnBonus' type='text' class='form-control num' name='wpnBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "PSI":
					formString = "<h4> WORK IN PROGRESS DO NOT USE! </h4>";
					break;

				case "RESIST":
					formString += "<tr><td>" +
									"<label for='resType'>Resistance Type: </label>" +
									"<input id='resType' type='text' class='form-control' name='resType' size='15'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='resBonus'> Bonus Amount: </label>" +
									"<input id='resBonus' type='text' class='form-control num' name='resBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "XTRA":
					formString = "<h4> WORK IN PROGRESS DO NOT USE! </h4>";
					break;

				case "HD":
					formString += "<tr><td>" +
									"<label for='hdType'>Type of Increase: </label>" +
									"<select id='hdtype' name='hdType'>" +
								    "<option value='SIZE' selected>Hit Dice Size</option>" +
								    "<option value='NUM'>Hit Dice Number</option>" +
								   "</td>" + 
								   "<td>" +
									"<label for='hdBonus'> Bonus Amount: (number of additional dice or number of size increases) </label>" +
									"<input id='hdBonus' type='text' class='form-control num' name='hdBonus' size='4'>" +
								   "</td>" +
								  "</tr>";
					break;

				case "IMMUNE":
					formString += "<tr><td>" +
									"<label for='immType'>Immunity Type: </label>" +
									"<input id='immType' type='text' class='form-control' name='immType' size='15'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "CRITRANGE":
					formString += "<tr><td>" +
									"<label for='wpnType'>Weapon Type: </label>" +
									"<input id='wpnType' type='text' class='form-control' name='wpnType' size='15'>" +
								   "</td>" +
								   "<td>" +
									"<label for='wpnBonus'> Range Increase: </label>" +
									"<input id='wpnBonus' type='text' class='form-control num' name='wpnBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "CRITMOD":
					formString += "<tr><td>" +
									"<label for='wpnType'>Weapon Type: </label>" +
									"<input id='wpnType' type='text' class='form-control' name='wpnType' size='15'>" +
								   "</td>" +
								  "</tr>";
					break;

				case "MOVE":
					formString += "<tr><td>" +
									"<label for='moveType'>Movement Type: </label>" +
									"<select id='moveType' name='moveType'>" +
								    	"<option value='LAND' selected>Land Movement</option>" +
								    	"<option value='FLIGHT' >Flight Speed</option>" +
								    	"<option value='SWIM' >Swim Speed</option>" +
								    	"<option value='RUN' >Run Modifier</option>" +
								    "</select>" +
								   "</td>" + 
								   "<td>" +
									"<label for='movBonus'> Bonus Amount: </label>" +
									"<input id='movBonus' type='text' class='form-control num' name='movBonus' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "MOVESKILL":
					formString += "<tr><td>" +
									"<label for='moveType'>Movement Type: </label>" +
									"<input id='movType' type='text' class='form-control num' name='movType' value='Flight' size='4'>" +
								   "</td>" + 
								   "<td>" +
									"<label for='movBonus'> Bonus Amount: </label>" +
									"<input id='movBonus' type='text' class='form-control num' name='movBonus' value='1' size='4'>" +
								   "</td>" +
								   "<td>" +
								    "<label for='circum'> Circumstances (if different from normal use): </label> " +
								    "<textarea id='circum' class='form-control' name='circum' rows='4' cols='10'></textarea>" +
								   "</td>" +
								  "</tr>";
					break;

				case "OTHER":
					formString = "<h4>If this description includes a numerical value that would change some other " + 
		      					  "numerical value on the character sheet AT CHARACTER CREATION, STOP!! Report this to Joe </h4>";
					break;
			}

			formString += "</table>";

			var bookString = "<select id='book' class='form-control' name='book'>";

			for(var key in books) {
				var value = books[key];
				if (key == "PHB") {
					bookString += "<option value='" + key + "' selected>" + value + "</option>";
				} else {
					bookString += "<option value='" + key + "'>" + value + "</option>";
				}
			}
			bookString += "</select>";

			req.DND = {
				feats : {
					form : formString,
					books : bookString
				}
			}

			next();
		},

		featWrite : function(req, res, next) {
			var data = req.body.data;
			Feats.findOne({ 'name' : data[0].value}, function(err, feat) {
				if (err) {
					req.DND = {
						feats : {
							response : "",
							error : err
						}
					}
					next();
				}

				if (feat) {
					req.DND = {
						feats : {
							response : "That feat already exists",
							error : ""
						}
					}
					next();

				} else {
					var newFeat = new Feats();

					newFeat.name = data[0].value;
					newFeat.prereq = ((data[1].value != "") ? data[1].value : null) ;
					newFeat.type = data[2].value;
					newFeat.book = data[3].value;
					newFeat.page = data[4].value;
					newFeat.short = data[5].value;
					newFeat.desc = data[6].value;

					var temp = {}

					for (var i = 7; i < data.length; i++) {
						temp[data[i].name] = data[i].value;
					}

					newFeat.details = temp;

					newFeat.save(function(err) {
						if(err) {
							req.DND = {
								feats : {
									response : "",
									error : err
								}
							}
							next();
						}

						req.DND = {
							feats : {
								response : "Feat Added Successfully",
								error : ""
							}
						}
						next();
					});

					
				}
			});			
		},

		/** =============================================
		 *  ==== SKILLS =================================
		 *  =============================================
		 */
		skillForm : function(req, res, next) {
			var bookString = "<select id='book' class='form-control' name='book'>";

			for(var key in books) {
				var value = books[key];
				if (key == "PHB") {
					bookString += "<option value='" + key + "' selected>" + value + "</option>";
				} else {
					bookString += "<option value='" + key + "'>" + value + "</option>";
				}
			}
			bookString += "</select>";

			req.DND = {
				skills : {
					books : bookString
				}
			}

			next();
		},

		skillWrite : function(req, res, next) {
			var data = req.body.data;
			
			Skills.findOne({ 'name' : data[0].value}, function(err, skill) {
				if (err) {
					req.DND = {
						skills : {
							response : "",
							error : err
						}
					}
					next();
				}


				if (skill) {
					req.DND = {
						skills : {
							response : "That skill already exists",
							error : ""
						}
					}
					next();
				} else {
					var newSkill = new Skills();

					newSkill.name = data[0].value;
					newSkill.attribute = data[1].value;
					newSkill.classes = data[2].value;
					newSkill.synergies = data[3].value;
					newSkill.short = data[4].value;
					newSkill.desc = data[5].value;
					newSkill.book = data[6].value;
					newSkill.page = data[7].value;

					newSkill.save(function(err) {
						if(err) {
							req.DND = {
								skills : {
									response : "",
									error : err
								}
							}
							next();
						}

						req.DND = {
							skills : {
								response : "Skill Added Successfully",
								error : ""
							}
						}
						next();
					});

				}
			});
		},

		/** =============================================
		*   ==== RACES ==================================
		*   =============================================
		*/
		raceForm : function(req, res, next) {
			//TODO add form gen for races
		},

		raceWrite : function(req, res, next) {
			//TODO add write function for submitted races
		},

		/** =============================================
		*   ==== CLASSES ================================
		*   =============================================
		*/
		classForm : function(req, res, next) {
			//TODO add form gen for classes
		},

		classWrite : function(req, res, next) {
			//TODO add write function for submitted classes
		}

	}

}

		