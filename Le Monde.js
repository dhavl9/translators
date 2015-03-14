{
	"translatorID": "6bc635a4-6823-4f95-acaf-b43e8a158144",
	"label": "Le Monde",
	"creator": "Philipp Zumstein",
	"target": "^https?://(www\\.)?(campus\\.)?lemonde\\.fr/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2015-03-14 08:45:35"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2015 Philipp Zumstein

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	if (url.indexOf('/article/')>-1) {
		return "newspaperArticle";
	} else if (getSearchResults(doc, true)) {
		return "multiple";
	}
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	var rows = ZU.xpath(doc, '//a[contains(@href, "/article/")]');
	for (var i=0; i<rows.length; i++) {
		var href = rows[i].href;
		var title = ZU.trimInternal(rows[i].textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}


function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (!items) {
				return true;
			}
			var articles = new Array();
			for (var i in items) {
				articles.push(i);
			}
			ZU.processDocuments(articles, scrape);
		});
	} else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {

	var translator = Zotero.loadTranslator('web');
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');//https://github.com/zotero/translators/blob/master/Embedded%20Metadata.js
	translator.setDocument(doc);
	
	translator.setHandler('itemDone', function (obj, item) {
		delete item.libraryCatalog;
		//should we delete the issn as well, or can someone confirm that issn?
		
		item.date = ZU.xpathText(doc, '//time[@itemprop="datePublished"]/@datetime');
		if (!item.date) {
			// The url contain the publication date as well
			// e.g. http://campus.lemonde.fr/palmares/article/2015/03/13/...
			item.date = url.replace(/^.*\/article\/(\d\d\d\d)\/(\d\d)\/(\d\d)\/.*$/, '$1-$2-$3');
		}
		
		var author = ZU.xpathText(doc, '//span[@itemprop="author"]');
		if (author) {
			item.creators.push( ZU.cleanAuthor(author) );
		}
		
		item.section = ZU.xpathText(doc, '//nav[@id="nav"]/ul/li[contains(@class,"actif")]/a/@data-rubrique-title');
		
		item.complete();
	});

	translator.getTranslatorObject(function(trans) {
		trans.itemType = "newspaperArticle";
		trans.doWeb(doc, url);
	});
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://www.lemonde.fr/elections-departementales-2015/article/2015/03/13/apres-grenoble-les-ecologistes-visent-l-isere_4592922_4572524.html",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Après Grenoble, les écologistes visent l’Isère",
				"creators": [
					{
						"firstName": "Olivier",
						"lastName": "Faye"
					}
				],
				"date": "2015-03-13T10:37:46+01:00",
				"ISSN": "1950-6244",
				"abstractNote": "Victorieuse dans la préfecture aux municipales de 2014, l’alliance Verts-Parti de gauche menace la majorité socialiste dans les cantons.",
				"language": "fr",
				"libraryCatalog": "Le Monde",
				"publicationTitle": "Le Monde.fr",
				"section": "Politique",
				"url": "http://www.lemonde.fr/elections-departementales-2015/article/2015/03/13/apres-grenoble-les-ecologistes-visent-l-isere_4592922_4572524.html",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.lemonde.fr/politique/",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "http://www.lemonde.fr/idees/article/2015/03/13/syrie-un-desastre-sans-precedent_4593097_3232.html",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Syrie : un désastre sans précédent",
				"creators": [],
				"date": "2015-03-13T11:50:19+01:00",
				"ISSN": "1950-6244",
				"abstractNote": "Editorial. Après plus de 220 000 morts, le pays s’enfonce toujours plus dans une guerre aux fronts multiples à laquelle les puissances occidentales ne trouvent pas de réponse.",
				"language": "fr",
				"libraryCatalog": "Le Monde",
				"publicationTitle": "Le Monde.fr",
				"section": "Idées",
				"shortTitle": "Syrie",
				"url": "http://www.lemonde.fr/idees/article/2015/03/13/syrie-un-desastre-sans-precedent_4593097_3232.html",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://campus.lemonde.fr/palmares/article/2015/03/13/classement-international-les-universites-francaises-en-manque-de-prestige_4593287_4401467.html",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Les universités françaises peinent à soigner leur réputation internationale",
				"creators": [],
				"date": "2015-03-13",
				"abstractNote": "En matière de prestige académique, Harvard  ...",
				"libraryCatalog": "Le Monde",
				"publicationTitle": "Le Monde.fr",
				"url": "http://campus.lemonde.fr/palmares/article/2015/03/13/classement-international-les-universites-francaises-en-manque-de-prestige_4593287_4401467.html",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/